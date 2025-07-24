const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/calculate', (req, res) => {
  const { date, time } = req.body;

  // Simulated Calculation (replace with SwissEph later)
  const result = {
    julianDay: 2460274.5,
    sunLongitude: 120.45,
    moonLongitude: 150.88,
    moonRashi: "કર્ક"
  };

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
