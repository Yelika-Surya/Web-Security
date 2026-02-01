const express = require("express");
const app = express();

app.use(express.json());

// Endpoint to receive tamper reports
app.post("/report-tamper", (req, res) => {
  const report = req.body;

  console.log("⚠️ TAMPER REPORT RECEIVED");
  console.log("Time:", new Date().toISOString());
  console.log("Payload:", report);
  console.log("---------------------------");

  res.json({ status: "received" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
console.log("Integrity check server is running...");