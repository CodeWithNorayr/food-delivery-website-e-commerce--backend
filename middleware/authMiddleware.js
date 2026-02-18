import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.token;

    // ✅ Check token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not provided",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    // ✅ Attach user properly (BEST way)
    req.user = {
      id: decoded.id,
    };

    // ✅ Also attach userId for compatibility with your old code
    req.body.userId = decoded.id;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
