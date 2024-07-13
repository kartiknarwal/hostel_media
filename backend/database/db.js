import mongoose  from "mongoose";

export const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL,{
            dbName:"MernSocial",
        });

        console.log("Your Database is successfully connected to the mongoDb");
    } catch (error) {
        console.log(error);
    }
}