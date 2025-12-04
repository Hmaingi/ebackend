// server.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // for reverse geocoding

const app = express();

// --------------------
// Middleware
// --------------------
app.use(express.json());

// Allow requests from your Vercel frontend
app.use(
  cors({
    origin: "https://equikai.vercel.app", // <-- your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// --------------------
// Data Storage
// --------------------
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
    location: "Unknown",
    lastUpdated: new Date().toISOString(),
    status: "normal",
    behavioralInsights: "Active and calm",
    deviceId: "HT_DEVICE_001",
  },
  {
    horseId: "horse003",
    name: "Thunder",
    heartRate: 60,
    temperature: 37.2,
    oxygenSaturation: 96,
    speed: 0,
    coordinates: { lat: -0.425, lng: 36.9495 },
    location: "Unknown",
    lastUpdated: new Date().toISOString(),
    status: "normal",
    behavioralInsights: "Calm",
    deviceId: "DEVICE-003",
  },
];

// --------------------
// Helper: Reverse Geocoding
// --------------------
const getHumanReadableLocation = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    return data.display_name || "Unknown";
  } catch (err) {
    return "Unknown";
  }
};

// --------------------
// Endpoints
// --------------------

// Update user location
app.post("/api/location", (req, res) => {
  const { lat, lng } = req.body;
  if (lat && lng) {
    userLocation = { lat, lng };
    console.log("Updated user location:", userLocation);
    res.json({ success: true, userLocation });
  } else {
    res.status(400).json({ success: false, message: "Invalid location" });
  }
});

// Get horses
app.get("/api/horses", async (req, res) => {
  // Update horse metrics and human-readable locations
  const updatedHorses = await Promise.all(
    horses.map(async (horse) => {
      // Randomized health metrics
      horse.heartRate = 60 + Math.floor(Math.random() * 25);
      horse.temperature = Number((37 + Math.random() * 2).toFixed(1));
      horse.speed = Number((Math.random() * 6).toFixed(1));

      // Simulate movement around previous location
      horse.coordinates.lat += (Math.random() - 0.5) * 0.001;
      horse.coordinates.lng += (Math.random() - 0.5) * 0.001;

      horse.status = horse.heartRate > 80 ? "elevated" : "normal";
      horse.lastUpdated = new Date().toISOString();

      // Update human-readable location
      horse.location = await getHumanReadableLocation(
        horse.coordinates.lat,
        horse.coordinates.lng
      );

      return horse;
    })
  );

  res.json({ success: true, horses: updatedHorses });
});

// Get unassigned devices
app.get("/api/unassigned", (req, res) => {
  res.json({
    success: true,
    unassignedDevices: [
      { deviceId: "DEVICE-003", assignedHorseId: null },
      { deviceId: "DEVICE-004", assignedHorseId: null },
    ],
  });
});

// --------------------
// Start server
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`eBackend running on port ${PORT} with CORS enabled`)
);
