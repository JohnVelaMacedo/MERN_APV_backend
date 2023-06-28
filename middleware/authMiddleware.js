import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.veterinario = await Veterinario.findById(decoded.id).select(
        "-password -token -confirmado"
      );
      return next();
    } catch (error) {
      const errorTmp = new Error("Token no válido");
      return res.status(403).json({ msg: errorTmp.message });
    }
  }
  if (!token) {
    const error = new Error("Token no válido o inexistente");
    return res.status(403).json({ msg: error.message });
  }
  next();
};

export default checkAuth;
