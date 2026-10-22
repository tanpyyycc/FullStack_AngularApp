require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

app.listen(3000, () => { 
    console.log('Server is running on port 3000');
})

const gymLeaderSchema = new mongoose.Schema({
    name:      { type: String, required: true, trim: true },
  specialty: { type: String, required: true, trim: true },
  region:    { type: String, required: true, trim: true },
  town:      { type: String, required: true, trim: true },
  badge:     { type: String, required: true, trim: true },
  aceLevel:  { type: Number, required: true, min: 1, max: 100 },
  motto:     { type: String, required: true, trim: true },
});

const GymLeader = mongoose.model('GymLeader', gymLeaderSchema);

function checkId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid leader id' });
  }
  next();
}

// READING ALL
app.get('/api/leaders', async (req, res) => {
    try {
    const leaders = await GymLeader.find();
    res.status(201).json(leaders);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: err message });
    }
});

// READING ONE
app.get('/api/leaders/:id', checkId, async (req, res) => {
    try {
    const leaders = await GymLeader.findById(req.params.id);
    if (!leader) {
      return res.status(404).json({ message: 'Gym leader not found' });
    }
    res.status(201).json(leaders);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: err message });
    }
});

// CREATING
app.post('/api/leaders', async (req, res) => {
    try{
        const leaders = new GymLeader(req.body);
        const saved = await leader.save();
        res.status(201).json(saved)
    } catch (err) {
        console.error(err);
        res.status(400).json({message: err message });
    }
})


// UPDATE
app.put('/api/leaders/:id', checkId, async (req, res) => {
  try {
    const updated = await GymLeader.findByIdAndUpdate(req.params.id, req.body, {
      new: true, 
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Gym Leader not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});
 
// DELETE
app.delete('/api/pokemon/:id', checkId, async (req, res) => {
  try {
    const deleted = await GymLeader.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Gym Leader not found' });
    }
    res.status(200).json({message: 'Gym Leader successfully deleted'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});