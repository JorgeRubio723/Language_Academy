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
