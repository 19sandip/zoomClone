import {User} from "../models/usersModel.js"
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import crypto from "crypto";


const register = async (req, res) => {
  const { name, userName, password } = req.body;

  // Validate input
  if (!userName || !password || !name || userName.trim() === "") {
      return res.status(400).json({ message: "All fields are required and username cannot be empty" });
  }

  try {
      // Check if the user already exists
      const existingUser = await User.findOne({ userName });
      if (existingUser) {
          return res.status(httpStatus.CONFLICT).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      

      // Create a new user
      const newUser = new User({
          name: name,
          userName: userName,
          password: hashedPassword,
      });
      
      await newUser.save();

      // Return success response
      return res.status(httpStatus.CREATED).json({ message: "Registered successfully", userId: newUser._id });
  } catch (e) {
      console.error(e); // Log the error for debugging
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e.message}` });
  }
};

const login = async(req, res)=>{

    const {userName, password} = req.body;
    if(!userName || !password){
       return  res.json({message : "All fields are mandatory"});
    }
    try{
     const user = await User.findOne({userName});
     if(!user){
       return res.status(httpStatus.NOT_FOUND).json({message : "user not exists"});
     }
     const isMatch = await bcrypt.compare(password, user.password);

     if(!isMatch || (userName!== user.userName)){
       return res.status(httpStatus.UNAUTHORIZED).json({message : "incorrect password"});
     }
     
        let token = crypto.randomBytes(20).toString("hex");
        user.token = token;
        await user.save();
       return res.status(httpStatus.OK).json({token : token, message : "Logged In successfully"});
     

    } catch(e){
     return  res.json({message : `something went wrong ${e}`});
    }
}

export {
    register,
    login
}