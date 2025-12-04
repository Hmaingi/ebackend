const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Store user's location (default: Nairobi CBD)
let userLocation = { lat: -1.286389, lng: 36.817223 };

// Initial horse data (coordinates will be adjusted dynamically)
let horses = [
  {
    horseId: "horse002",
    name: "ht",
    heartRate: 75,
    temperature: 37.8,
    oxygenSaturation: 97,
    speed: 2,
    coordinates: { lat: userLocation.lat + 0.001, lng: userLocation.lng + 0.001 },
    location: "jk",
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
    location: "Kitengela",
    lastUpdated: new Date().toISOString(),
    status: "normal",
    behavioralInsights: "Calm",
    deviceId: "DEVICE-003"
  }
];

// Endpoint to update user location
app.post('/api/location', (req, res) => {
  const { lat, lng } = req.body;
  if (lat && lng) {
    userLocation = { lat, lng };
    console.log("Updated user location:", userLocation);

    // Adjust horse coordinates around new user location
    horses = horses.map((h) => ({
      ...h,
      coordinates: {
        lat: userLocation.lat + (Math.random() - 0.5) * 0.01,
        lng: userLocation.lng + (Math.random() - 0.5) * 0.01
      }
    }));

    res.json({ success: true, userLocation });
  } else {
    res.status(400).json({ success: false, message: "Invalid location" });
  }
});

// Auto-update health metrics every 3 seconds
setInterval(() => {
  horses = horses.map(horse => {
    horse.heartRate = 60 + Math.floor(Math.random() * 25); // realistic BPM
    horse.temperature = Number((37 + Math.random() * 2).toFixed(1)); // °C
    horse.speed = Number((Math.random() * 6).toFixed(1)); // km/h

    // Small random walk around current position
    horse.coordinates.lat += (Math.random() - 0.5) * 0.001;
    horse.coordinates.lng += (Math.random() - 0.5) * 0.001;

    horse.lastUpdated = new Date().toISOString();
    horse.status = horse.heartRate > 80 ? "elevated" : "normal";

    return horse;
  });
}, 3000);

// Fetch horses
app.get('/api/horses', (req, res) => {
  res.json({ success: true, horses });
});

// Fetch unassigned devices
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

