const jwt = require("jsonwebtoken");

const verifyTokenSocket = (socket, next) => {
  console.log("Incoming socket auth:", socket.handshake.auth);

  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: Token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
};

module.exports = { verifyTokenSocket };
