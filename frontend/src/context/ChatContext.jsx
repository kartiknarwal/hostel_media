import axios from "axios"
import { useContext, useState } from "react";
import { createContext } from "react";
import toast from "react-hot-toast";
const ChatContext =createContext()

export const ChatContextProvider =({children})=>{
    const [chats,setChats] =useState([])
    const [selectedChat,setSelectedChat] =useState(null);

    async function createChat (id){
        try {
            const {data} =await axios.post("/api/messages",{
                recieverId: id,
                message:"hii",
            });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
    return(
        <ChatContext.Provider 
        value={{
        createChat,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatData =()=>useContext(ChatContext);