import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bitte geben Sie einen Namen für diese Kategorie an.'],
    maxlength: [60, 'Der Name darf nicht mehr als 60 Zeichen haben'],
    unique: true,
  },
  slug: {
    type: String,
    required: [true, 'Ein Slug ist erforderlich'],
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    maxlength: [500, 'Die Beschreibung darf nicht mehr als 500 Zeichen haben'],
  },
  image: {
    type: String, // Optional: Bild-URL für die Kategorie
  },
  order: {
    type: Number,
    default: 0, // Für die Sortierung der Kategorien
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null, // Erlaubt hierarchische Kategorien
  },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuelle Eigenschaft für Produkte in dieser Kategorie
CategorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  justOne: false // Gibt ein Array von Produkten zurück
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
