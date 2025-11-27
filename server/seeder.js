require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');

const MONGO_URI = process.env.MONGO_URI || "mongodb + srv://prashanth_db_user:vd0mVMCAgZfLkx1u@eventhub.0tovgocmongodb.net/?appName=EventHub";

async function seed(){
  await mongoose.connect(MONGO_URI);
  console.log('Connected for seeding');
  await User.deleteMany({});
  await Event.deleteMany({});
  const password = await bcrypt.hash('password123', 10);
  const organizer = await User.create({ name: 'Organizer One', email: 'org1@example.com', password, role: 'organizer' });
  const attendee = await User.create({ name: 'Attendee One', email: 'user1@example.com', password, role: 'attendee' });

  const events = [
    { title: 'React Summit', description: 'Conference on React', location: 'Hyderabad', category: 'Tech', date: new Date(Date.now()+7*24*3600*1000), capacity: 200, price: 10, organizer: organizer._id },
    { title: 'Node.js Workshop', description: 'Hands-on Node', location: 'Bengaluru', category: 'Workshop', date: new Date(Date.now()+14*24*3600*1000), capacity: 50, price: 0, organizer: organizer._id }
  ];
  await Event.insertMany(events);
  console.log('Seeded Users and Events');
  process.exit(0);
}
seed().catch(err=>{console.error(err); process.exit(1);});
