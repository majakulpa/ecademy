const mongoose = require('mongoose')

// schema
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A course must have a name'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'A course must have a duration'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  level: {
    type: String,
    required: [true, 'Please select level'],
  },
  price: {
    type: Number,
    required: [true, 'A course must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A course must have a summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A course must have a cover image'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  courseContent: [String],
})

// model
const Course = mongoose.model('Course', courseSchema)

module.exports = Course
