import jwt from "jsonwebtoken"
import {db} from "../libs/db.libs.js"

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        if((!token)){
            res.status(401).json({
                message: "Unauthorized - No token provided"
            })
        }

        let decode;
        try {
            decode = jwt.verify(token,process.env.JWT_SECRET)

        } catch (error) {
            return res.status(401).json({
                message: "Unauthorized - Invalid token"
            })
        }

        const user = await db.user.findUnique({
            where: {
                id: decode.id
            },
            select:{
                id: true,
                image: true,
                name: true,
                email: true,
                role: true
            }
        })

        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        req.user = user
        console.log("User authenticated");
        
        next();
    } catch (error) {
        console.error("Error authenticating user ", error)
        res.status(500).json({message: "Error authenticating user"})
    }
}

export const checkAdmin = async (req, res , next) => {
    try {
        const userId = req.user.id
        const user = await db.user.findUnique({
            where:{
                id: userId
            },
            select:{
                role: true
            }
        })

        if(!user || user.role !== "ADMIN"){
            return res.status(403).json({
                message: "Access denied - Admins only "
            })
        }

        console.log("Admin role checked");
        
        next()
    } catch (error) {
        console.error("Error checking Admin role", error)
        return res.status(500).json({
            success: true,
            error,
            message: "Error Checking Admin role"
        })
    }
}