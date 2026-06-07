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
  password: String,
  xp: { type: Number, default: 0 },
  nivel: { type: Number, default: 1 }
});

const Leccion = mongoose.model('Leccion', {
  idioma: String,
  categoria: String,
  leccion_num: Number,
  titulo: String,
  ejercicios: Array
}, 'Lecciones');

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Usuario.findOne({ email, password });
    if (!user) {
      return res.json({ success: false, message: 'Credenciales incorrectas' });
    }
    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        xp: user.xp || 0,
        nivel: user.nivel || 1
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
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

app.get('/lecciones', async (req, res) => {
  try {
    const lecciones = await Leccion.find({});
    res.json(lecciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/progreso', async (req, res) => {
  const { userId, leccionId, xpGanado } = req.body;
  try {
    const user = await Usuario.findById(userId);
    if (!user) return res.json({ success: false, message: 'Usuario no encontrado' });

    user.xp = (user.xp || 0) + (xpGanado || 10);
    if (user.xp >= 100) {
      user.nivel = (user.nivel || 1) + 1;
      user.xp = 0;
    }
    await user.save();
    res.json({ success: true, xp: user.xp, nivel: user.nivel });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor corriendo en puerto ' + PORT));
