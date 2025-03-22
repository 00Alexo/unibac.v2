const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    statut:{
        type: String,
        required: true,
    },
    judet:{
        type: String,
        required: true,
    },
    avatar:{
        type: String,
        required: false
    },
    badges:{
        type: Array,
        required: true
    },
    adminPerms:{
        type: String,
        required: true,
    },
    prompts:{
        type: Array,
        required: true,
    },
    activitate:{
        type: Array,
        required: true
    },
    clase:{
        type: Array,
        required: true
    },
    subiecte:{
        type: Array,
        required: true
    }
  }, {timestamps: true});
  
  const UserCollection = mongoose.model("UserCollection", UserSchema);
  
  module.exports = UserCollection; 