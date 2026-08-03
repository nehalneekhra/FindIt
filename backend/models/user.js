const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },

    password:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        default:""
    },

    profileImage:{
        type:String,
        default:""
    },

    role:{
        type:String,
        enum:["student","admin"],
        default:"student"
    }
},
{
    timestamps:true
}
);

module.exports = mongoose.model("User",userSchema);