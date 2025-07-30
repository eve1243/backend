import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this product.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price for this product.'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this product.'],
  },
  imageUrl: {
    type: String,
  },
  cloudinaryUrl: {
    type: String,
  },
  cloudinaryId: {
    type: String,
  },
}, {
  timestamps: true
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);