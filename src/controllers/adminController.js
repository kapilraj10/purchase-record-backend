import mongoose from "mongoose";
import User from "../models/User.js";
import Purchase from "../models/Purchase.js";

// ==================== Get All Users (admin only) ====================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==================== Get Single User (admin only) ====================
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(id).select("-password").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==================== Delete User (admin only) ====================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "Admin cannot delete themselves" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==================== Update User Role (promote/demote) ====================
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // role should be "user" or "admin"

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    // Prevent admin from demoting themselves
    if (req.user._id.toString() === id && role !== "admin") {
      return res.status(400).json({ message: "Admin cannot demote themselves" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password").lean();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: `User role updated to ${role}`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==================== Get total purchases for all users in last 35 days (admin only) ====================
export const getUsersTotalPurchasesLast35Days = async (req, res) => {
  try {
    // Calculate date 35 days ago (start of that day)
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 35);
    pastDate.setHours(0, 0, 0, 0);

    // Fetch purchases (lean for performance)
    const purchases = await Purchase.find({}).lean();

    // Filter by buyingDate after pastDate robustly (handles Date or string formats)
    const filtered = purchases.filter((p) => {
      if (!p.buyingDate) return false;
      const d = new Date(p.buyingDate);
      return !isNaN(d) && d >= pastDate;
    });

    // Aggregate totals per user id
    const map = new Map(); // key: userId string, value: { totalAmount, purchases: [...] }
    filtered.forEach((p) => {
      const uid = (p.user && String(p.user)) || (p.userId && String(p.userId)) || null;
      if (!uid) return;
      const cur = map.get(uid) || { totalAmount: 0, purchases: [] };
      const amount = Number(p.totalAmount ?? 0);
      cur.totalAmount += Number.isFinite(amount) ? amount : 0;
      cur.purchases.push(p);
      map.set(uid, cur);
    });

    // If no users/purchases found, return empty list
    if (map.size === 0) {
      return res.status(200).json({ totals: [] });
    }

    // Fetch user info for involved user ids
    const userIds = Array.from(map.keys()).filter((id) => mongoose.Types.ObjectId.isValid(id));
    const usersInfo = await User.find({ _id: { $in: userIds } }).select("username email role").lean();

    // Build totals array with user info
    const totals = userIds.map((uid) => {
      const info = usersInfo.find((ui) => String(ui._id) === String(uid));
      const entry = map.get(uid);
      return {
        userId: uid,
        username: info?.username ?? "Unknown",
        email: info?.email ?? "",
        role: info?.role ?? "user",
        totalAmount: entry.totalAmount,
        purchases: entry.purchases, // optional: remove if you don't want to send details
      };
    });

    return res.status(200).json({ totals });
  } catch (error) {
    console.error("Error fetching total purchases for all users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};