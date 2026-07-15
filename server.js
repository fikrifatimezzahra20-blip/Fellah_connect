const express = require('express');
const db = require('./models');
const app = express();

app.use(express.json());

app.use('/api/recoltes', require('./routes/recolte.routes'));

db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database connected & synced!');
  })
  .catch(err => {
    console.error('Database error:', err);
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});