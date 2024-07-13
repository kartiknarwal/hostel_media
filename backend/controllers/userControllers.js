import TryCatch from "../utils/TryCatch.js";
import {User} from '../models/userModel.js';
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from 'cloudinary';
import bcrypt from "bcrypt";

export const myProfile =TryCatch(async(req,res)=>{
    const user =await User.findById(req.user._id).select("-password");

    res.json(user);
});

export const userProfile =TryCatch(async(req,res)=>{
    const user =await User.findById(req.params.id).select("-password")

    if(!user) 
        return res.status(404).json({
       message:"No User Exists with this id",
    });
    res.json(user);
});

export const followandUnfollowUser  =TryCatch(async(req,res)=>{
    const user = await User.findById(req.params.id)
    const loggedInUser = await User.findById(req.user._id);

    if(!user)
        return res.status(404).json({
      message:"No User With this id",
    });
    //so that a user can follow theirself
    if(user._id.toString()=== loggedInUser._id.toString()) return  res.status(400).json({
        message:"You can't follow yourself ",
    });
    //if a user had  already followed  || code to unfollow a user
    if(user.followers.includes(loggedInUser._id)){
        const indexFollowing =loggedInUser.followings.indexOf(user._id);
        const indexFollower = user.followers.indexOf(loggedInUser._id);

        loggedInUser.followings.splice(indexFollowing,1);
        user.followers.splice(indexFollower,1);
        await loggedInUser.save();
        await user.save();

        res.json({
            message:"User Unfollowed",
        });
    }else{
        //code to follow a user
        loggedInUser.followings.push(user._id);
        //users k array apni id ko push karege isse
        user.followers.push(loggedInUser._id);

        await loggedInUser.save();
        await user.save();

        res.json({
            message:"User followed",
        });
    }
});

export const userFollowerandFollowingData =TryCatch(async(req,res)=>{
    const user =await User.findById(req.params.id)
    .select("-password")
    .populate("followers","-password")
    .populate("followings","-password");

    const followers = user.followers
    const followings =user.followings
    res.json({
        followers,
        followings,
    });
});

//code to update a user
export const updateProfile =TryCatch(async(req,res)=>{
    const user =await User.findById(req.user._id)
    const {name} =req.body

    if(name){
        user.name =name
    }
    const file =req.file
    if(file){
        const fileUrl =getDataUrl(file)

        //code to delete previous photo from cloudinary

        await cloudinary.v2.uploader.destroy(user.profilePic.id)

        const myCloud =await cloudinary.v2.uploader.upload(fileUrl.content)

        user.profilePic.id =myCloud.public_id;
        user.profilePic.url = myCloud.secure_url;
    }

    await user.save()

    res.json({
        message:"profile updated Successfully"
    })
});

//code to update password
export const updatePassword =TryCatch(async(req,res)=>{
    const user =await User.findById(req.user._id)

    const {oldPassword,newPassword} =req.body;

    //we will update password only when user knows their old passoword
    const comparePassword =await bcrypt.compare(oldPassword,user.password)

    if(!comparePassword)
        return res.status(400).json({
        message:"Your Previous password is wrong"
    });

    //code to save new password and hash it
    user.password =await bcrypt.hash(newPassword,10)

    await user.save();

    res.json({
        message:"Password Updated Successfully",
    });
});

