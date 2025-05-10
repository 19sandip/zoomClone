import {User} from "../models/usersModel.js"
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Meeting } from "../models/meetingModel.js";


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
      return res.status(httpStatus.CREATED).json({ message: "Registered successfully", userId: newUser._id});
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

     if(!isMatch || (userName !== user.userName)){
       return res.status(httpStatus.UNAUTHORIZED).json({message : "incorrect password"});
     }
     
        let token = crypto.randomBytes(20).toString("hex");
        user.token = token;
        await user.save();
       return res.status(httpStatus.OK).json({token : token, message : "Logged In successfully", name : user.name, userName : user.userName });
     

    } catch(e){
     return  res.json({message : `something went wrong ${e}`});
    }
}



let logout = async (req, res) =>{
       let {userName} = req.body;
       if(!userName){
        return res.json({message : "userName is required"});
       }

       let user = await User.findOne({userName});
       if(!user){
        return res.json({message : "user not exists"});
       }
       
       user.token = undefined;
       await user.save();
       return res.json({message : "Logged out successfully"});
}

let getUserHistory = async (req, res) => {
    let {token} = req.headers;
    if (!token) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Token is required" });
    }
    try {
          let user = await User.findOne({ token: token });
         
 if (user) {
              let meetings = await Meeting.find({ user_id: user.userName });
res.status(httpStatus.OK).json(meetings);
} else {
            res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
 }
    } catch (e) {
        console.error("Error fetching user history:", e);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e.message}` });
    }
  }; 




let addUserHistory = async (req, res)=>{
    console.log("addUserHistory functions beeing call.......")

    const {token, meetingCode} = req.body;
    
    try{
        const user = await User.findOne({token: token});
        console.log(user);
        if(user){
            let newMeeting = new Meeting({
            user_id : user.userName,
            meetingCode: meetingCode

        }) 
         await newMeeting.save();
         console.log("history added ki ja chuki hai")
        res.status(httpStatus.CREATED).json({message : "History being added"}); 
        }else{
            res.json({message : "user not found while saving history"})
        }
       
    } catch(err){
        console.log("some err geting : ", err)
     res.json({message: "Something went wrong"});
    }
}

export {
    register,
    login,
    logout,
    addUserHistory,
    getUserHistory
}