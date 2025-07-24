const express = require('express');
const sweph = require('sweph');
const path = require('path');

const app = express();
const port = 3000;

const ephePath = path.join(__dirname, 'ephe');
sweph.set_ephe_path(ephePath);

// Planet constants
const PLANETS = {
  SUN: sweph.constants.SE_SUN,
  MOON: sweph.constants.SE_MOON,
  ASC: sweph.constants.SE_ASC
};

// Rashi names in Gujarati
const rashis = [
  'મેષ', 'વૃષભ', 'મિથુન', 'કર્ક', 'સિંહ', 'કન્યા',
  'તુલા', 'વૃશ્ચિક', 'ધન', 'મકર', 'કુંભ', 'મીન'
];

// Rashi Swami mapping
const rashiSwami = [
  'મંગળ', 'શુક્ર', 'બુધ', 'ચંદ્ર', 'સૂર્ય', 'બુધ',
  'શુક્ર', 'મંગળ', 'ગુરૂ', 'શનિ', 'શનિ', 'ગુરૂ'
];

// Nakshatra names in Gujarati
const nakshatras = [
  'અશ્વિની', 'ભરણી', 'કૃતિકા', 'રોહિતક', 'મૃગશિરા', 'આર્દ્રા',
  'પુનર્વસુ', 'પુષ્ય', 'આશ્લેષા', 'મઘા', 'પૂર્વા ફાળ્ગુની', 'ઉત્તરા ફાળ્ગુની',
  'હસ્ત', 'ચિત્રા', 'સ્વાતી', 'વિશાખા', 'અનુરાધા', 'જ્યેષ્ઠા',
  'મૂળ', 'પૂર્વા ષાઢા', 'ઉત્તરા ષાઢા', 'શ્રવણ', 'ધનિષ્ટા',
  'શતભિષા', 'પૂર્વા ભાદ્રપદ', 'ઉત્તરા ભાદ્રપદ', 'રેવતી'
];

// Nakshatra Swami mapping (in order)
const nakSwami = [
  'કેતુ', 'શુક્ર', 'સૂર્ય', 'ચંદ્ર', 'મંગળ', 'રાહુ',
  'ગુરૂ', 'શનિ', 'બુધ', 'કેતુ', 'શુક્ર', 'સૂર્ય',
  'ચંદ્ર', 'મંગળ', 'રાહુ', 'ગુરૂ', 'શનિ', 'બુધ',
  'કેતુ', 'શુક્ર', 'સૂર્ય', 'ચંદ્ર', 'મંગળ',
  'રાહુ', 'ગુરૂ', 'શનિ', 'બુધ'
];

// Weekdays in Gujarati
const weekdays = ['રવિવાર', 'સોમવાર', 'મંગળવાર', 'બુધવાર', 'ગુરુવાર', 'શુક્રવાર', 'શનિવાર'];

app.get('/api/panchang', (req, res) => {
  const { date, time, lat, lon } = req.query;
  if (!date || !time || !lat || !lon) {
    return res.status(400).json({ error: 'Please provide date, time, lat, lon' });
  }

  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const decimalTime = hour + minute / 60;
  const jd = sweph.julday(year, month, day, decimalTime, sweph.constants.SE_GREG_CAL);

  // Vikram Samvat = AD + 57
  const vikramSamvat = year + 57;

  // Day of week
  const weekday = weekdays[new Date(`${date}T${time}`).getDay()];

  // Moon position
  const moonResult = sweph.calc_ut(jd, PLANETS.MOON, sweph.constants.SEFLG_SWIEPH);
  const moonDeg = (moonResult.data[0] + 360) % 360;
  const moonRashiIndex = Math.floor(moonDeg / 30);
  const moonNakshatraIndex = Math.floor(moonDeg / (360 / 27));

  const response = {
    તિથિ: 'હજુ કેલ્ક્યુલેટ નથી',
    દિન: weekday,
    વિક્રમ_સંવત: vikramSamvat.toString(),
    ચંદ્ર_રાશિ: rashis[moonRashiIndex],
    નક્ષત્ર: nakshatras[moonNakshatraIndex],
    નાડી: 'હજુ કેલ્ક્યુલેટ નથી',
    સૂર્યોદય: 'હજુ કેલ્ક્યુલેટ નથી',
    સૂર્યાસ્ત: 'હજુ કેલ્ક્યુલેટ નથી',
    રાશિ_સ્વામી: rashiSwami[moonRashiIndex],
    નક્ષત્ર_સ્વામી: nakSwami[moonNakshatraIndex],
    લઘ્ન_રાશિ: 'હજુ કેલ્ક્યુલેટ નથી',
    યોગ: 'હજુ કેલ્ક્યુલેટ નથી'
  };

  res.json(response);
});

app.listen(port, () => {
  console.log(`✅ Panchang API running at http://localhost:${port}`);
});
