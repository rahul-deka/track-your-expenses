import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB (Only connect once)
if (!mongoose.connection.readyState) {
  mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  email: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema, 'expense-user');

app.post('/api/users', async (req, res) => {
  const { uid, email } = req.body;
  try {
    const existingUser = await User.findOne({ uid });
    if (!existingUser) {
      const newUser = new User({ uid, email });
      await newUser.save();
      res.status(201).json({ message: 'User saved successfully' });
    } else {
      res.status(200).json({ message: 'User already exists' });
    }
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users', (req, res) => {
  res.send('User API is working!');
});

export default app;