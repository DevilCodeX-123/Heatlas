/**
 * geoServices.js
 * Centralized service to fetch environmental data from free APIs without API keys.
 */

// 1. Get User Location from Browser
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
};

// 2. Fetch Live Weather Data (Open-Meteo) including past 5 days
export const getWeatherData = async (lat, lon) => {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max&past_days=5&forecast_days=1&timezone=auto`);
    if (!response.ok) throw new Error('Weather fetch failed');
    return await response.json();
  } catch (error) {
    console.error("Weather API Error:", error);
    return null;
  }
};

// 3. Fetch Live Air Quality Data (Open-Meteo)
export const getAqiData = async (lat, lon) => {
  try {
    const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi&timezone=auto`);
    if (!response.ok) throw new Error('AQI fetch failed');
    return await response.json();
  } catch (error) {
    console.error("AQI API Error:", error);
    return null;
  }
};

// 4. Reverse Geocoding (Google Maps API / Fallback to Nominatim)
export const getReverseGeocoding = async (lat, lon) => {
  try {
    const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    // If we have the incredibly powerful Google Maps API Key, use it!
    if (googleApiKey && googleApiKey.startsWith('AIza')) {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleApiKey}`);
      if (!response.ok) throw new Error('Google Geocoding failed');
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        
        let city = "Local Area";
        let state = "";
        
        // Extract City and State perfectly from Google's strict taxonomy
        for (const comp of addressComponents) {
          if (comp.types.includes('locality')) {
            city = comp.long_name;
          } else if (comp.types.includes('administrative_area_level_2') && city === "Local Area") {
            city = comp.long_name; // Fallback to district if locality not found
          } else if (comp.types.includes('administrative_area_level_1')) {
            state = comp.long_name;
          }
        }
        
        return { address: { city, state } };
      }
    }

    // Fallback: OpenStreetMap Nominatim
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    if (!response.ok) throw new Error('Nominatim Geocoding failed');
    return await response.json();
  } catch (error) {
    console.error("Geocoding API Error:", error);
    return null;
  }
};

// 5. Fetch Multi-City Weather for Live Rankings
export const getMultiCityLiveWeather = async (cities) => {
  try {
    const promises = cities.map(async (city) => {
      const weather = await getWeatherData(city.lat, city.lon);
      const aqi = await getAqiData(city.lat, city.lon);
      return {
        ...city,
        temp: weather?.current?.temperature_2m || 0,
        aqi: aqi?.current?.us_aqi || 0,
      };
    });
    return await Promise.all(promises);
  } catch (error) {
    console.error("Multi-city fetch error:", error);
    return [];
  }
};
