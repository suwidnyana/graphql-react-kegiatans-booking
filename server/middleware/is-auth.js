const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

module.exports = (context) => {
  // const authHeader = req.get("Authorization");
  // if (!authHeader) {
  //   req.isAuth = false;
  //   return next();
  // }
  // const token = authHeader.split(" ")[1];
  // if (!token || token === "") {
  //   req.isAuth = false;
  //   return next();
  // }
  // let decodedtoken;
  // try {
  //   decodedtoken = jwt.verify(token, "somesupersecretkey");
  // } catch (err) {
  //   req.isAuth = false;
  //   return next();
  // }
  // if (!decodedtoken) {
  //   req.isAuth = false;
  //   return next();
  // }
  // req.isAuth = true;
  // req.userId = decodedtoken.userId;
  // next();

  // context = { ... headers }
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    // Bearer ....
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, "somesupersecretkey");
        return user;
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  throw new Error("Authorization header must be provided");
};
