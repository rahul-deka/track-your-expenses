import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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
      res.status(201).send('User saved successfully');
    } else {
      res.status(200).send('User already exists');
    }
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});