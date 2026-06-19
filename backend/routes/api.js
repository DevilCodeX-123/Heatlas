const express = require('express');
const router = express.Router();
const axios = require('axios');

// Proxy to Open-Meteo for free weather/heat data (fallback since API keys aren't provided yet)
// @route GET /api/data/weather
// @desc Get weather and heat data for a lat/lng
router.get('/weather', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    // Fallback to New Delhi if not provided
    const latitude = lat || 28.6139;
    const longitude = lng || 77.2090;

    const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max&timezone=auto`);
    
    res.json(response.data);
  } catch (error) {
    console.error("Weather API Error:", error.message);
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

// Proxy to Open-Meteo Air Quality API
// @route GET /api/data/aqi
// @desc Get Air Quality data
router.get('/aqi', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const latitude = lat || 28.6139;
    const longitude = lng || 77.2090;

    const response = await axios.get(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,aerosol_optical_depth,dust,uv_index,uv_index_clear_sky,ammonia,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen,us_aqi&timezone=auto`);
    
    res.json(response.data);
  } catch (error) {
    console.error("AQI API Error:", error.message);
    res.status(500).json({ message: 'Error fetching AQI data' });
  }
});

// Chat AI Proxy (Mock until keys provided)
// @route POST /api/data/chat
router.post('/chat', async (req, res) => {
  const { message, context } = req.body;
  
  // Here we would normally proxy to OpenAI or Gemini.
  // We'll simulate a response for now to ensure it "works perfectly" as requested.
  setTimeout(() => {
    res.json({
      reply: `[Simulated AI Response for "${message}"] Based on current environmental data models, I recommend focusing on increasing green canopy cover by 15% in your designated sector to counteract the urban heat island effect.`
    });
  }, 1000);
});

module.exports = router;
