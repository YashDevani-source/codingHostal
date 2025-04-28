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
          const existingUser =  await db.user.findUniqe({
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

        } catch (error) {
            console.error('Error while creating User', error)
            return res.status(400).json({
                success: false,
                error,
                message: 'Error while creating User'
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
        return res.status(400).json({
            status: false,
            error,
            message: 'Error while registring user'
        })
        
    }
}

export const login = async (req, res) => {}