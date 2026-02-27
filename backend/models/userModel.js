import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required: true
    },
    email:{
        type : String,
        required: true,
        unique: true
    },
    password:{
        type : String,
        required: true
    }
}, 
{
    timestamps: true
})

export default mongoose.model("User", userSchema);
// This code defines a Mongoose schema for a User model with fields for name, email, and password, and includes timestamps for creation and updates. The email field is unique to prevent duplicate entries. The model is then exported for use in other parts of the application.
