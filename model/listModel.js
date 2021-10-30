const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({ //first parameter is for schema defination and second is for options
  // with child referencing it is possible to reference the child with the ref property and specifying the model name
  //the result of that will look as if the data has always been embedded//    This can be accomlished by populating
  name: {
    type: String,
    required: [true, 'List must have a name'],
    maxlength: [40, 'max 40 characters'],
    minlength: [4, 'min 4 characters'],
    unique: true
  },
  artistId:String,
  genre: String,
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'item'
  }],
  // likes:{
  //     type:Number,
  //     validate:{
  //         validator:function(val){  //this functions only works on creation and not on update
  //          return this.topic !== this.genre;
  //     },
  //     message:'test message- ({VALUE})'
  // }
  // },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdDate: Date
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// listSchema.virtual('year').get(function(){
//     return this.createdDate.getFullYear(); //virtaul properties are not saved persistently
// })


// DOCUMENT MIDDLEWARE: runs before .save() and .create()  ..wont work for insertMany(),findoneandupdate(),findmanyandupdate()
listSchema.pre('save', function (next) {
  // this.slug = slugify(this.name, { lower: true });
  next();
});

// listSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// listSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
listSchema.pre(/^find/, function (next) { //this is using regex
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

listSchema.post(/^find/, function (docs, next) {
  // console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
listSchema.pre('aggregate', function (next) {
  // this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); //unshift adds at the begining of the array

  // console.log(this.pipeline());
  next();
});

const List = mongoose.model('List', listSchema)

module.exports = List;

// mongo benefits 
// 1.no need for migrations



// //there are 4 types of middleware in mongoose
// 1.document 2.query 3.aggregate 4.model