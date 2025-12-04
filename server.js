const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

let userLocation = { lat: -1.286389, lng: 36.817223 }; // fallback Nairobi CBD

let horses = [
  {
    horseId: "horse002",
    name: "ht",
    heartRate: 75,
    temperature: 37.8,
    oxygenSaturation: 97,
    speed: 2,
    coordinates: { lat: userLocation.lat + 0.001, lng: userLocation.lng + 0.001 },
    location: "Unknown",
    lastUpdated: new Date().toISOString(),
    status: "normal",
    behavioralInsights: "Active and calm",
    deviceId: "HT_DEVICE_001"
  },
  {
    horseId: "horse003",
    name: "Thunder",
    heartRate: 60,
    temperature: 37.2,
    oxygenSaturation: 96,
    speed: 0,
    coordinates: { lat: userLocation.lat - 0.001, lng: userLocation.lng - 0.001 },
    location: "Unknown",
    lastUpdated: new Date().toISOString(),
    status: "normal",
    behavioralInsights: "Calm",
    deviceId: "DEVICE-003"
  }
];

// Reverse geocoding function
const getLocationName = async (lat, lng) => {
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon: lng,
        format: 'json'
      },
      headers: {
        'User-Agent': 'Equikai-App'
      }
    });
    return res.data.address?.suburb || res.data.address?.town || res.data.address?.city || res.data.display_name || "Unknown";
  } catch (err) {
    console.error("Reverse geocode error:", err.message);
    return "Unknown";
  }
};

// Update horses every 3s
setInterval(async () => {
  for (let horse of horses) {
    horse.heartRate = 60 + Math.floor(Math.random() * 25);
    horse.temperature = Number((37 + Math.random() * 2).toFixed(1));
    horse.speed = Number((Math.random() * 6).toFixed(1));

    // Move around user location
    const offset = 0.001;
    horse.coordinates.lat = userLocation.lat + (Math.random() - 0.5) * offset;
    horse.coordinates.lng = userLocation.lng + (Math.random() - 0.5) * offset;

    horse.lastUpdated = new Date().toISOString();
    horse.status = horse.heartRate > 80 ? "elevated" : "normal";

    // Update human-readable location
    horse.location = await getLocationName(horse.coordinates.lat, horse.coordinates.lng);
  }
}, 5000);

// Update user location
app.post('/api/location', (req, res) => {
  const { lat, lng } = req.body;
  if (lat && lng) {
    userLocation = { lat, lng };
    console.log("Updated user location:", userLocation);
    res.json({ success: true, userLocation });
  } else {
    res.status(400).json({ success: false, message: "Invalid location" });
  }
});

// Fetch horses
app.get('/api/horses', (req, res) => {
  res.json({ success: true, horses });
});

// Unassigned devices
app.get("/api/unassigned", (req, res) => {
  res.json({
    success: true,
    unassignedDevices: [
      { deviceId: "DEVICE-003", assignedHorseId: null },
      { deviceId: "DEVICE-004", assignedHorseId: null }
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`eBackend running on port ${PORT}`));

