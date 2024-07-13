import mongoose from "mongoose";

const  userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
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
    gender:{
        type:String,
        required:true,
        enum:["male","female"],
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    followings: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    profilePic:{
        id:String,
        url:String,
    },
},{
    timestamps:true,
}
);

export const User =mongoose.model("User",userSchema);