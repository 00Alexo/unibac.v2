const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    creator: {
        type: String,
        required: true,
    },
    className:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true
    },
    classId:{
        type: Number,
        required: true,
        unique: true,
    },
    password:{
        type: String,
    },
    subject:{
        type: String,
        required: true
    },
    description:{
        type: String, 
        required: true
    },
    teachers:{
        type: Array,
        required: true
    },
    avatar:{
        type: String,
        required: true
    },
    students:{
        type: Array,
        required: true
    },
    assignments:{
        type: Array,
        required: true
    },
    tests:{
        type: Array,
        required: true
    },
    lessons:{
        type: Array,
        required: true
    },
    chat:{
        type: Array,
        required: true
    },
    logs:{
        type:Array,
        required: true
    }

  }, {timestamps: true});

// ClassSchema.pre('save', async function(next) {
//     if (this.isNew) {
//         try {
//             const highestClass = await this.constructor.findOne().sort('-classId').exec();
//             if (highestClass) {
//                 this.classId = highestClass.classId + 1;
//             } else {
//                 this.classId = 1;
//             }
//         } catch (error) {
//             return next(error);
//         }
//     }
//     next();
// });
  
module.exports = mongoose.model('Class', ClassSchema)