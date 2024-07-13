import TryCatch from "../utils/TryCatch.js";
import {Chat} from "../models/ChatModels.js"
import{Messages} from "../models/Messages.js";
import { getRecieverSocketId,io } from "../socket/socket.js";
export const sendMessage =TryCatch(async(req,res)=>{
    const {recieverId,message} =req.body

    const senderId =req.user._id;

    if(!recieverId)
         return res.status(400).json({
           message:"please give reciever id",
        });

    let chat= await Chat.findOne({
        users:{$all:[senderId,recieverId]},
    });

    
    //this is the case when there will be no chat before so we will create a new chat
    if(!chat){
        chat =new Chat({
            users:[senderId,recieverId],
            latestMessage:{
                text:message,
                sender:senderId,
            },
        });

        await chat.save();
    }
    const newMessage =new Messages({
        chatId :chat._id,
        sender:senderId,
        text:message,
    });

    await newMessage.save();

    //updated the latest message
    await chat.updateOne({
        latestMessage:{
            text:message,
            sender:senderId,
        },
    });

    const  recieverSocketId=getRecieverSocketId(recieverId)
    if(recieverSocketId){
        io.to(recieverSocketId).emit("newMessage",newMessage);
    }

    res.status(201).json(newMessage);
});


export const getAllMessages =TryCatch(async(req,res)=>{
     const {id} =req.params;
     const userId =req.user._id;

     const chat = await Chat.findOne({
        users:{$all:[userId,id]},
     });

     if(!chat) 
        return res.status(404).json({
        message:"No Chat with these users",
   });

   const messages =await Messages.find({
      chatId:chat._id,
   });

   res.json(messages);
});




