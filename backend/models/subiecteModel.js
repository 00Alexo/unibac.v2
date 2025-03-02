const mongoose = require('mongoose');

const SubiecteSchema = new mongoose.Schema({
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
