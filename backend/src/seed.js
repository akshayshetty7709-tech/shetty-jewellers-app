require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const photos = {
  gold: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85',
  silver: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=85',
  platinum: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85',
  diamond: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85',
  bracelet: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85',
  chain: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85'
};

const products = [
  ['Temple Gold Necklace Set', 'Gold', '22K Gold', 89500, 'Traditional temple-inspired necklace set.', photos.gold, 'Women', true],
  ['Classic Gold Ring', 'Rings', '22K Gold', 18500, 'Everyday polished gold ring.', photos.gold, 'Unisex', true],
  ['Diamond Solitaire Ring', 'Diamond', '18K Gold + Diamond', 68500, 'Elegant solitaire-inspired diamond ring.', photos.diamond, 'Women', true],
  ['Platinum Band', 'Platinum', '950 Platinum', 42500, 'Minimal premium platinum band.', photos.platinum, 'Men', false],
  ['Silver Charm Bracelet', 'Silver', '925 Silver', 4200, 'Lightweight sterling silver bracelet.', photos.silver, 'Women', true],
  ['Gold Kada Bracelet', 'Bracelets', '22K Gold', 54500, 'Classic gold kada bracelet.', photos.bracelet, 'Men', false],
  ['Gents Classic Chain', 'Gents Chains', '22K Gold', 73500, 'Bold everyday gold chain for men.', photos.chain, 'Men', true],
  ['Ladies Delicate Chain', 'Ladies Chains', '18K Gold', 26500, 'Fine delicate chain for women.', photos.chain, 'Women', false],
  ['Silver Stack Ring', 'Rings', '925 Silver', 2800, 'Contemporary silver stack ring.', photos.silver, 'Unisex', false],
  ['Diamond Tennis Bracelet', 'Bracelets', '18K Gold + Diamond', 112000, 'Statement tennis bracelet design.', photos.diamond, 'Women', true],
  ['Platinum Diamond Pendant', 'Diamond', 'Platinum + Diamond', 79500, 'Premium pendant for special occasions.', photos.platinum, 'Women', false],
  ['Silver Gents Chain', 'Gents Chains', '925 Silver', 3500, 'Modern silver chain for men.', photos.silver, 'Men', false]
].map(([name, category, metal, price, description, image, gender, featured]) =>
  ({ name, category, metal, price, description, image, gender, featured, stock: 12 })
);

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bssons');
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Inserted ${products.length} demo products`);
  await mongoose.disconnect();
}
seed().catch(err => { console.error(err); process.exit(1); });
