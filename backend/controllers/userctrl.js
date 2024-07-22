import userModel from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validatior from "validator";

//login usr
const loginusr = async(req,res) =>{
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email})
        if (!user) {
            res.json({success:false,message:"User does not exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if (!isMatch) {
            return res.json({success:false,message:"Invalid password/email"})
        }

        const token = createToken(user._id);
        res.json({success:true,token})

    } catch (error) {
       console.log(error)
       res.json({success:false,message:"Error"}) 
    }
}

const createToken = (id)=>{
    return jwt.sign({id},`${process.env.JWT_SECRET_KEY}`)
}

//register usr
const regusr = async(req,res) =>{
    const {name,password,email}=req.body;
    try {
        //check if email is already registered
        const exist = await userModel.findOne({email})
        if(exist){
            return res.json({success:false,message:"user exists"})
        }
        //validate email and pass
        if(!validatior.isEmail(email)){
            return res.json({success:false,message:"Enter a valid email address"})
        }
        if(password.length<8){
            return res.json({success:false,message:"Password length should be greater than 8 charaters"})
        }

        //pasword encription(hashing user password)
        const salt = await bcrypt.genSalt(10)
        const hashedpass = await bcrypt.hash(password,salt);

        const newuser = new userModel({
            name:name,
            email:email,
            password:hashedpass
        })

        const user = await newuser.save()
        const token = createToken(user._id)
        res.json({success:true,token})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

export {loginusr,regusr}