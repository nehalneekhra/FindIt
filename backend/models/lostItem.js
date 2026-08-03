const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    category:{
        type:String,
        required:true
    },

    location:{
        type:String,
        required:true
    },

    dateLost:{
        type:Date,
        required:true
    },

    image:{
        type:String,
        default:""
    },

    status:{
        type:String,
        enum:["lost","found","claimed"],
        default:"lost"
    },

    reportedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("LostItem",lostItemSchema);