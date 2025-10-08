import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Please login again!",
      });
    }

    const token = authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken);

    req.user = { id: decodedToken.id };

    next();
  } catch (error) {
    console.log(error.message);
    return res.status(403).json({
      message: "Session expired!",
    });
  }
};

export default authMiddleware;
