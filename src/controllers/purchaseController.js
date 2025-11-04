import Purchase from "../models/Purchase.js";

// ==================== Create Purchase (any logged-in user) ====================
export const createPurchase = async (req, res) => {
  try {
    const { month, year, buyingDate, itemName, quantity, rate, supplierName } = req.body;

    if (!month || !year || !buyingDate || !itemName || !quantity || !rate || !supplierName) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const totalAmount = quantity * rate;

    const newPurchase = new Purchase({
      user: req.user._id, // link purchase to logged-in user
      month,
      year,
      buyingDate,
      itemName,
      quantity,
      rate,
      totalAmount,
      supplierName,
    });

    await newPurchase.save();

    res.status(201).json({ message: "Purchase created successfully", purchase: newPurchase });
  } catch (error) {
    console.error("Error creating purchase:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== Get Purchases ====================
export const getPurchases = async (req, res) => {
  try {
    let purchases;
    if (req.user.role === "admin") {
      purchases = await Purchase.find(); // admin can see all
    } else {
      purchases = await Purchase.find({ user: req.user._id }); // user sees only own purchases
    }
    res.status(200).json(purchases);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== Update Purchase (admin only) ====================
export const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPurchase = await Purchase.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPurchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    res.status(200).json({ message: "Purchase updated", purchase: updatedPurchase });
  } catch (error) {
    console.error("Error updating purchase:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== Delete Purchase (admin only) ====================
export const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPurchase = await Purchase.findByIdAndDelete(id);
    if (!deletedPurchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== Get Total Purchases in Last 30 Days ====================
export const getTotalPurchasesLast30Days = async (req, res) => {
  try {
    // Calculate date 30 days ago
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 35);

    let filter = {
      buyingDate: { $gte: pastDate.toISOString() } // filter by last 35 days
    };

    // If user is not admin, only show their own purchases
    if (req.user.role !== "admin") {
      filter.user = req.user._id;
    }

    // Aggregate totalAmount
    const result = await Purchase.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$user",
          totalAmount: { $sum: "$totalAmount" },
          purchases: { $push: "$$ROOT" } // optional, include purchase details
        }
      }
    ]);

    res.status(200).json({ total: result });
  } catch (error) {
    console.error("Error calculating total purchases:", error);
    res.status(500).json({ message: "Server error" });
  }
};