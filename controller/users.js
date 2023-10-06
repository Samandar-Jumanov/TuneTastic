const { Users } = require("../models/relations")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const SignUp = async (request , response , next ) =>{

    const {username , email , password , role } = request.body 
    try {
        const exisitingUser = await Users.findOne({
            where : {
                email 
            }
        })

        if(exisitingUser){
            return response.status(403).json({
                message :'User has already an account'
            })
        }

        const hashedPassword =await  bcrypt.hash(password , 10 )

        const newUser= await Users.create({
            username : username , 
            password : hashedPassword,
            email : email ,
            token : process.env.SECRETKEY,
            role : role 
        })

        const token = await jwt.sign({userId : newUser.Id }, process.env.SECRETKEY)
        newUser.token = token
        await newUser.save()

        const userInfo = {
            username :username ,
            email : email ,
            role : role ,
            token : token 

        }

        return response.status(201).json({
            message :'Created succefully',
            user : userInfo 
        })
        
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const Login = async (request , response , next ) =>{
    const { email , password } = request.body 

    try {
        
        const exisitingUser = await Users.findOne({
            where : {
                email 
            }
        })

        if(!exisitingUser){
            return response.status(403).json({
                message :'User not found '
            })
        }

        const isCorrectPassword =  await bcrypt.compare(password , exisitingUser.password)

        if(!isCorrectPassword){
            return response.status(403).json({
                message :'Invalid password '
            })
        }

        const newToken = await jwt.sign({userId : exisitingUser.Id}, process.env.SECRETKEY)
        exisitingUser.token = newToken 
        await exisitingUser.save()

        const userInfo = {
            username :exisitingUser.username ,
            email : email ,
            role : exisitingUser.role ,
            token : newToken 
        } 

        return response.status(200).json({
            message :'Logged in succesfully',
            user : userInfo
        })

    } catch (error) {
        console.log(error)
        next(error)
        
    }
}




module.exports = {
    SignUp,
    Login 
}
