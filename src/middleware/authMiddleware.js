import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    // 1. Check if token exists in request headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token. Access denied." });
    }

    // 2. Extract token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    // 3. Verify token — throws error if invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find user from token's ID, exclude password field
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User no longer exists." });
    }

    // 5. Attach user to request — available in all next functions
    req.user = user;

    // 6. Move to the actual route handler
    next();

  } catch (error) {
    res.status(401).json({ error: "Invalid token. Access denied." });
  }
};

export default protect;