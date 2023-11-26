const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

const { HttpError } = require("../helpers/HttpError");
const { User } = require("../models/user-models");

const auth = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") next(HttpError(401));

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(403));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401));
  }
};
module.exports = { auth };
