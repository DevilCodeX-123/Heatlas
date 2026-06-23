export const heatHotspots = [
  // Rajasthan/Gujarat Region (High Heat)
  { id: 'h1', lat: 26.9124, lon: 75.7873, radius: 150000, intensity: 0.8, color: '#ef4444' }, // Jaipur
  { id: 'h2', lat: 28.0229, lon: 73.3119, radius: 200000, intensity: 0.9, color: '#dc2626' }, // Bikaner
  { id: 'h3', lat: 23.0225, lon: 72.5714, radius: 120000, intensity: 0.7, color: '#f97316' }, // Ahmedabad
  // Northern Plains
  { id: 'h4', lat: 28.6139, lon: 77.2090, radius: 100000, intensity: 0.85, color: '#ef4444' }, // Delhi
  { id: 'h5', lat: 26.8467, lon: 80.9462, radius: 130000, intensity: 0.75, color: '#f97316' }, // Lucknow
  // Central/South
  { id: 'h6', lat: 21.1458, lon: 79.0882, radius: 140000, intensity: 0.8, color: '#ef4444' }, // Nagpur
  { id: 'h7', lat: 17.3850, lon: 78.4867, radius: 110000, intensity: 0.6, color: '#eab308' }, // Hyderabad
];

export const aqiHotspots = [
  // Delhi NCR / Punjab (Severe Pollution)
  { id: 'a1', lat: 28.6139, lon: 77.2090, radius: 160000, color: '#7e22ce' }, // Delhi (Purple/Hazardous)
  { id: 'a2', lat: 30.9010, lon: 75.8573, radius: 120000, color: '#a21caf' }, // Ludhiana
  { id: 'a3', lat: 26.4499, lon: 80.3319, radius: 100000, color: '#b91c1c' }, // Kanpur (Red/Unhealthy)
  // Eastern Coal Belt
  { id: 'a4', lat: 23.7957, lon: 86.4304, radius: 140000, color: '#7e22ce' }, // Dhanbad
  // Mumbai
  { id: 'a5', lat: 19.0760, lon: 72.8777, radius: 90000, color: '#b91c1c' }, // Mumbai
];

export const greenZones = [
  // Western Ghats
  { id: 'g1', lat: 14.5000, lon: 74.5000, radius: 250000, color: '#22c55e' }, // Karnataka Ghats
  { id: 'g2', lat: 10.0000, lon: 77.0000, radius: 180000, color: '#16a34a' }, // Kerala Ghats
  // Northeast
  { id: 'g3', lat: 26.2006, lon: 92.9376, radius: 300000, color: '#15803d' }, // Assam/Meghalaya
  // Himalayan Foothills
  { id: 'g4', lat: 30.3165, lon: 78.0322, radius: 150000, color: '#22c55e' }, // Uttarakhand
  // Central India
  { id: 'g5', lat: 22.3039, lon: 82.1633, radius: 200000, color: '#16a34a' }, // Chhattisgarh Forests
];

export const waterBodies = [
  // Major Lakes & Wetlands
  { id: 'w1', lat: 19.6000, lon: 85.3333, radius: 60000, color: '#3b82f6' }, // Chilika Lake
  { id: 'w2', lat: 34.1667, lon: 74.6667, radius: 40000, color: '#2563eb' }, // Wular Lake
  { id: 'w3', lat: 26.9667, lon: 75.1667, radius: 50000, color: '#60a5fa' }, // Sambhar Salt Lake
  // Major River Basins (Represented as dots for now)
  { id: 'w4', lat: 25.3176, lon: 83.0039, radius: 70000, color: '#3b82f6' }, // Ganga (Varanasi)
  { id: 'w5', lat: 17.0000, lon: 81.8000, radius: 80000, color: '#2563eb' }, // Godavari Delta
  { id: 'w6', lat: 26.1400, lon: 91.7362, radius: 90000, color: '#3b82f6' }, // Brahmaputra
];
