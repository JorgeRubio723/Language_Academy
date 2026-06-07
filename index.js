const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

const Usuario = mongoose.model('Usuario', {
  username: String,
  email: String,
  contraseña: String
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, contraseña } = req.body;
    const user = new Usuario({ username, email, contraseña });
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor corriendo en puerto ' + PORT));
