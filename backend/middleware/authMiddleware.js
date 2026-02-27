// import User from "../models/userModel.js";
// import jwt from "jsonwebtoken";

// export const protect = async (req, res, next) => {
//     try {
//         let token = req.headers.authorization;

//         if(!token || !token.startsWith("Bearer")) {
//             token = token.split(" ")[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await User.findById(decoded.id).select("-password");
//             next();
//         }else{
//             res.status(401).json({ message: "Not authorized, no Token Found" });
//         }
//     }catch (error) {
//         res.status(401).json({
//             message: "token failed",
//             error: error.message
//         });
//     }
// }

import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        // Check that token exists and starts with "Bearer "
        if (token && token.startsWith("Bearer ")) {
            //  Extract the actual token string
            token = token.split(" ")[1];

            //  Verify the token and attach user to request
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");

            next(); //  Proceed to the next middleware/route
        } else {
            res.status(401).json({ message: "Not authorized, no Token Found" });
        }
    } catch (error) {
        res.status(401).json({
            message: "Token failed",
            error: error.message,
        });
    }
};