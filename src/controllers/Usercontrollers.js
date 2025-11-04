import bcrypt from "bcryptjs";
import User from "../models/User.js"; 
import jwt from "jsonwebtoken";

// ========================== Register User =============================
export const createUser = async (req, res) => {
  try {
    const { username, email, password, role, profilePicture } = req.body;

  
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

  
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      profilePicture,
    });

 
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(" Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 // ========================== Login User ===============================

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    //  Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Please provide both username and password" });
    }

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token (recommended for login sessions)
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Successful login
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      token,
    });
  } catch (error) {
    console.error(" Error logging in user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
