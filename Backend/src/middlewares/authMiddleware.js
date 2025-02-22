import jwt from "jsonwebtoken";

const authMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const token = req.cookies.jwt; // Read the token from cookies
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
      req.user = decoded; // Attach user data to the request

      // Role-based access control
      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden: Insufficient privileges" });
      }

      next(); // Proceed if authorized
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
};

export default authMiddleware;
