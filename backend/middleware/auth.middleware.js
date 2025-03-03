import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
    try {
        console.log("Cookies:", req.cookies);
        console.log("Authorization Header:", req.headers.authorization);

        // Check both cookie and header
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized User - Token Missing' });
        }

        const isBlackListed = await redisClient.get(token);
        if (isBlackListed) {
            res.cookie('token', '', { httpOnly: true });
            return res.status(401).json({ error: 'Unauthorized User - Token Blacklisted' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        console.error("Auth Error:", error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Unauthorized User - Token Expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Unauthorized User - Invalid Token' });
        } else {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
