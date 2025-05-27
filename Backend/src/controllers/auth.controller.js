import {db} from '../libs/db.libs.js'
import bcrypt from 'bcryptjs'
import {UserRole} from '../generated/prisma/index.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {
        const {name , email, password} = req.body

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: ' All field required '
            })
        }

        try {
          const existingUser =  await db.user.findUnique({
                where:{
                    email
                }
            })

            if(existingUser){
                return res.status(409).json({
                    status: false,
                    message: 'User already exists'
                })
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = await db.user.create({
                data:{
                    email,
                    password: hashedPassword,
                    name,
                    role: UserRole.USER,
                    image: ''
                }
            })

            const token = jwt.sign({id:newUser.id} , process.env.JWT_SECRET , {
            expiresIn:"7d"
        })

        res.cookie("jwt" , token , {
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
            maxAge:1000 * 60 * 60 * 24 * 7 // 7 days
        })

       return res.status(201).json({
            success:true,
            message:"User created successfully",
            user:{
                id:newUser.id,
                email:newUser.email,
                name:newUser.name,
                role:newUser.role,
                image:newUser.image
            }})



        } catch (error) {
            console.error('Error while creating User', error)
            return res.status(500).json({
                success: false,
                error,
                error: 'Error while creating User'
            })
            
        }

        const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })

        res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_EMV !== "development",
            maxAge: 1000*60*60*24*7
        })

        res.data.user = user

        res.status(201).json({
            success: true,
            message: "User created successfully ",
            user:{
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                image: newUser.image
            }
        })

    
    } catch (error) {

        console.error('Error while registring user', error)
        return res.status(500).json({
            status: false,
            error,
            error: 'Error while registring user'
        })
        
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body

    if(!email){
        return res.status(400).json({
            success: false,
            message: 'All fields required'
        })
    }

    try {
      const user =  await db.user.findUnique({
            where:{
                email
            }
        })

        if(!user){
            return res.status(400).json({
                status: false,
                message: 'User not found'
            })
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch === true){
            return res.status(400).json({
                success: true,
                message: 'Invalid creadientials'
            })
        }

        const token = jwt.sign({id:user.id}, process.env.JWT_SECRET,{
            expiresIn: '7d'
        })

        res.cookie('jwt', token, {
            httpOnlt: true,
            samesite: 'Strict',
            secure: process.env.NODE_EMV !== 'developement',
            maxAge: 1000*60*60*24*7
        })

        return res.status(200).json({
            success:true,
            message:'User Logged in successfully',
            user:{
                id:user.id,
                role:user.role,
                name:user.name,
                email:user.email,
                image:user.image
            }
        })

    } catch (error) {
        console.error('Error Logging in user:', error)
        return res.status(500).json({
            success:false,
            error:'Error Logging in user',

        })
    }

}

// export const logout = async (req, res) => {
//     console.log('Logout route hit');

//     try {

//         res.clearCookie('jwt',{
//             httpOnly: true,
//             sameSite: 'strict',
//             secure: process.env.NODE_ENV !== 'developement',
//         })

//         return res.status(200).json({
//             success:true,
//             message:'User Logged out successfully'
//         })
//     } catch (error) {
//         console.error('Errort Logging out user', error)
//         return res.status(500).json({
//             success:false,
//             error,
//             error:'Error Logging out user'
//         })
//     }
// }


export const logout = async (req , res)=>{
    try {
        res.clearCookie("jwt" , {
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
        })

       return res.status(200).json({
            success:true,
            message:"User logged out successfully"
        })
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({
            error:"Error logging out user"
        })
    }
}

export const check = async (req, res) => {
    try {
      return  res.status(200).json({
            success:true,
            message:'User authenticated successfully',
            user: req.user
        })
    } catch (error) {
        console.error('Error checking user', error)
       return res.status(500).json({
            success:false,
            error,
            error: 'Error checking user'
        })
    }
}