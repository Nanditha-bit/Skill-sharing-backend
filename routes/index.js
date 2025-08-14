// routes/index.js
import express from "express";

const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.json({ message: "API is working ✅" });
});

// Add more routes here
// router.post("/example", (req, res) => { ... });

export default router;
