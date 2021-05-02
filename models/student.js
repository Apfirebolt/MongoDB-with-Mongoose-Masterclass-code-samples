const mongoose = require('mongoose');

// Student Schema
const StudentSchema = mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  subjects: [
    {
      name: {
        type: String
      },
      marks: {
        type: Number,
        default: 0
      }
    }
  ]
});

StudentSchema.index({ firstName: 1, lastName: 1}, { unique: true });

const Student = module.exports = mongoose.model('Student', StudentSchema);



