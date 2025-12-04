const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Store user's location
let userLocation = { lat: -0.4235, lng: 36.9485 }; // default

let horses = [
  {
    horseId: "horse002",
    name: "ht",
    heartRate: 75,
    temperature: 37.8,
    oxygenSaturation: 97,
    speed: 2,
    coordinates: { lat: -0.4231, lng: 36.9489 },
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
    coordinates: { lat: -0.4250, lng: 36.9495 },
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
    res.json({ success: true, userLocation });
  } else {
    res.status(400).json({ success: false, message: "Invalid location" });
  }
});

setInterval(() => {
  horses = horses.map(horse => {
    horse.heartRate = 60 + Math.floor(Math.random() * 25); // number
    horse.temperature = Number((37 + Math.random() * 2).toFixed(1)); // number
    horse.speed = Number((Math.random() * 6).toFixed(1)); // number

    horse.coordinates.lat += (Math.random() - 0.5) * 0.001;
    horse.coordinates.lng += (Math.random() - 0.5) * 0.001;

    horse.lastUpdated = new Date().toISOString();
    horse.status = horse.heartRate > 80 ? "elevated" : "normal";

    return horse;
  });
}, 3000);


// Endpoint to fetch horses
app.get('/api/horses', (req, res) => {
  res.json({ success: true, horses });
});

// Endpoint for unassigned devices
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

