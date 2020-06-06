const mongoose = require('mongoose')
const slugify = require('slugify')

// schema
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A course must have a name'],
    unique: true,
  },
  slug: String,
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
  lastUpdated: {
    type: Date,
    default: Date.now(),
  },
  courseContent: [String],
  secretCourse: {
    type: Boolean,
    default: false,
  },
})

// document middleware: runs before save() and create()
courseSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// query middleware
courseSchema.pre(/^find/, function (next) {
  this.find({ secretCourse: { $ne: true } })
  this.start = Date.now()
  next()
})

courseSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms `)
  //console.log(docs)
  next()
})

const Course = mongoose.model('Course', courseSchema)

module.exports = Course
