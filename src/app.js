const express = require("express");
const app = express();
app.use(express.json()); 
const recolteRoutes = require('./routes/recolte.routes');
app.use('/api/recoltes', recolteRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to FellahConnect API 🚜",
  });
});
module.exports = app;