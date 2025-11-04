import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
        }, 
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
        profilePicture:{
            type:String,
            default:"https://i.postimg.cc/KYKgcqFw/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile.jpg",
        },
        role:{
            type:String,
            enum:["user", "admin",],
            default:"user",
        }
    });

    export default mongoose.model("User", userSchema);