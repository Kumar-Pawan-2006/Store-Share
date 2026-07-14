import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { db } from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", databaseOffline: !process.env.DATABASE_URL });
});

// Auth Login endpoint
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please enter both email and password." });
  }

  try {
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        societyId: user.societyId,
      },
    });
  } catch (error: any) {
    console.error("Login endpoint error:", error);
    return res.status(500).json({
      success: false,
      message: "Database could not be reached. Ensure migrations are applied."
    });
  }
});

// CRM Leads endpoints
app.get("/api/leads", async (req, res) => {
  try {
    const leads = await db.b2BLead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json(leads);
  } catch (error) {
    console.error("Fetch leads error:", error);
    return res.status(500).json({ error: "Failed to fetch leads from database." });
  }
});

app.post("/api/leads", async (req, res) => {
  const { companyName, contactEmail, interestType, notes } = req.body;

  if (!companyName || !contactEmail || !interestType) {
    return res.status(400).json({ success: false, message: "Missing required parameters: companyName, contactEmail, or interestType." });
  }

  try {
    const lead = await db.b2BLead.create({
      data: {
        companyName,
        contactEmail,
        interestType,
        notes: notes || "",
        status: "NEW",
      },
    });
    return res.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error("Create lead error:", error);
    return res.status(500).json({ success: false, message: "Failed to submit lead to database." });
  }
});

app.put("/api/leads/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: "Status is required." });
  }

  try {
    await db.b2BLead.update({
      where: { id },
      data: { status },
    });
    return res.json({ success: true });
  } catch (error) {
    console.error("Update lead status error:", error);
    return res.status(500).json({ success: false, message: "Failed to update lead status." });
  }
});

// Societies endpoints
app.get("/api/societies", async (req, res) => {
  try {
    const societies = await db.society.findMany({
      include: {
        revenueTransactions: true,
        energyReadings: true,
        amcContracts: true,
      },
      orderBy: { onboardedAt: "desc" },
    });
    return res.json(societies);
  } catch (error) {
    console.error("Fetch societies error:", error);
    return res.status(500).json({ error: "Failed to fetch societies from database." });
  }
});

app.get("/api/societies/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const society = await db.society.findUnique({
      where: { id },
      include: {
        batteryUnit: true,
        amcContracts: true,
        revenueTransactions: {
          orderBy: { date: "desc" },
        },
        energyReadings: {
          orderBy: { date: "asc" },
        }
      }
    });

    if (!society) {
      return res.status(404).json({ error: "Society profile not found." });
    }

    return res.json(society);
  } catch (error) {
    console.error("Fetch society details error:", error);
    return res.status(500).json({ error: "Failed to fetch society details." });
  }
});

app.post("/api/societies", async (req, res) => {
  const data = req.body;

  try {
    const society = await db.society.create({
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        flatCount: data.flatCount,
        rooftopSolarKw: data.rooftopSolarKw,
        dailySurplusUnits: data.dailySurplusUnits,
        netMeteringRate: data.netMeteringRate,
        discomImportRate: data.discomImportRate,
        revenueSplitCustomerPct: data.revenueSplitCustomerPct,
        revenueSplitCompanyPct: data.revenueSplitCompanyPct,
        contactPersonName: data.contactPersonName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        status: data.status,
      },
    });
    return res.json({ success: true, societyId: society.id });
  } catch (error) {
    console.error("Create society error:", error);
    return res.status(500).json({ success: false, message: "Failed to create society in database." });
  }
});

app.put("/api/societies/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await db.society.update({
      where: { id },
      data,
    });
    return res.json({ success: true });
  } catch (error) {
    console.error("Update society error:", error);
    return res.status(500).json({ success: false, message: "Failed to update society details." });
  }
});

app.delete("/api/societies/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.society.delete({
      where: { id },
    });
    return res.json({ success: true });
  } catch (error) {
    console.error("Delete society error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete society profile." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Store & Share Backend running on http://localhost:${PORT}`);
});
