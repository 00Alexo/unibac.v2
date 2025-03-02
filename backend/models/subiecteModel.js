const mongoose = require('mongoose');

const SubiecteSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  profil:{
    type: String,
    required: true
  },
  materie:{
    type: String,
    required: true
  },
  descriere:{
    type: String,
    required: true
  },
  titlu:{
    type: String,
    required: true
  },
  subiect: {
    data: Buffer,
    contentType: String
  },
  barem: {
    data: Buffer,
    contentType: String
  }
}, { timestamps: true });

const SubiecteCollection = mongoose.model("SubiecteCollection", SubiecteSchema);

module.exports = SubiecteCollection;
