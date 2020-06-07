const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')

// schema
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A course must have a name'],
    unique: true,
    maxlength: [40, 'Name must have less or equal than 40 characters'],
    minlength: [6, 'Name must have more or equal than 2 characters'],
  },
  instructor: {
    type: String,
    required: [true, 'A course must have instructor'],
    maxlength: [40, 'Instructor must have less or equal than 40 characters'],
    minlength: [2, 'Instructor must have more or equal than 2 characters'],
    validate: [validator.isAlpha, 'Instructor name can only constain letters'],
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A course must have a duration'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Minimun rating is 1'],
    max: [5, 'Maximum rating is 5'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  level: {
    type: String,
    required: [true, 'Please select level'],
    enum: {
      values: ['beginner', 'intermediate', 'advanced'],
      message: 'Level is either: beginner, intermediate or advanced',
    },
  },
  price: {
    type: Number,
    required: [true, 'A course must have a price'],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price
      },
      message: "Discount can't be greater than price",
    },
  },
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
  next()
})

// aggregation middleware
courseSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretCourse: { $ne: true } } })
  next()
})

const Course = mongoose.model('Course', courseSchema)

module.exports = Course
