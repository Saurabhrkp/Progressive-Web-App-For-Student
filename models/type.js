var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TypeSchema = new Schema({
  name: { type: String, required: true, min: 3, max: 100 },
  pdfs: [
    {
      type: Schema.ObjectId,
      ref: 'Pdf'
    }
  ],
  photos: [
    {
      type: Schema.ObjectId,
      ref: 'Photo'
    }
  ],
  texts: [
    {
      type: Schema.ObjectId,
      ref: 'Text'
    }
  ]
});

// Virtual for this type instance URL.
TypeSchema.virtual('url').get(function() {
  return '/type/' + this._id;
});

// Export model.
module.exports = mongoose.model('Type', TypeSchema);
