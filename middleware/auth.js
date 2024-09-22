    import jwt from "jsonwebtoken";
    const { verify } = jwt;
    // import User from '../models/User';
    const auth = async (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).send("Access denied.");

    try {
        const verified = verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send("Invalid token.");
    }
    };

    export default auth;
