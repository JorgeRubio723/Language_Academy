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
  password: String
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new Usuario({ username, email, password });
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
const Leccion = mongoose.model('Leccion', {
  idioma: String,
  categoria: String,
  leccion_num: Number,
  titulo: String,
  ejercicios: Array
});

app.get('/lecciones', async (req, res) => {
  try {
    const lecciones = await Leccion.find({});
    res.json(lecciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, () => console.log('Servidor corriendo en puerto ' + PORT));
