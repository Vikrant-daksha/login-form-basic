import jwt from "jsonwebtoken";
import * as authService from "../services/authServices.js"

export const loginRequire = async(req, res, next) => {
    try {
        let token = req.cookies.token;

        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(200).json(null);
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await authService.getUserById(decoded.sub)

        if(!user) {
            return res.status(401).json({ message: 'Not Authorized, User Not Found' });
        }

        req.user = user;
        req.id = decoded.sub;
        next();

    } catch (err) {
        res.status(401).json({ message: 'Not Authorized, Token Failed'})
    }
}