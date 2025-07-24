// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { SwissEph, SweDate, SweConst } = require('swisseph');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Set Swiss Ephemeris data path (files must be inside 'ephe' folder at root)
const ephPath = path.join(__dirname, 'ephe');
SwissEph.swe_set_ephe_path(ephPath);

app.post('/calculate', (req, res) => {
  const { date, time } = req.body;

  try {
    // Date parsing
    const [yyyy, mm, dd] = date.split('-').map(Number); // e.g. 2024-07-24
    const [hh, min] = time.split(':').map(Number);
    const decimalHour = hh + (min / 60);

    // Julian Day calculation
    const jd = SweDate.getJulDay(yyyy, mm, dd, decimalHour, true);

    // Sun & Moon positions
    const sunPos = SwissEph.swe_calc_ut(jd, SweConst.SE_SUN, SweConst.SEFLG_SWIEPH);
    const moonPos = SwissEph.swe_calc_ut(jd, SweConst.SE_MOON, SweConst.SEFLG_SWIEPH);

    const sunLongitude = sunPos[0];
    const moonLongitude = moonPos[0];

    // Moon Rashi Calculation
    const rashiNames = ['મેષ', 'વૃષભ', 'મિથુન', 'કર્ક', 'સિંહ', 'કન્યા', 'તુલા', 'વૃશ્ચિક', 'ધન', 'મકર', 'કુંભ', 'મીન'];
    const moonRashiIndex = Math.floor(moonLongitude / 30) % 12;
    const moonRashi = rashiNames[moonRashiIndex];

    res.json({
      julianDay: jd,
      sunLongitude,
      moonLongitude,
      moonRashi
    });
  } catch (error) {
    console.error("Calculation error:", error);
    res.status(500).json({ error: 'Calculation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
