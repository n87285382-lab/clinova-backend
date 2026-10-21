const express = require("express");
const crypto = require("crypto");

module.exports = function (db) {
    const router = express.Router();

    const clinicsCollection = db.collection("clinics");

    // ==================================================
    // Generate readable clinic code
    // ==================================================
    function generateClinicCode() {
        const randomPart = crypto
            .randomBytes(3)
            .toString("hex")
            .toUpperCase();

        return `CL-${randomPart}`;
    }

    // ==================================================
    // Create Clinic
    // POST /api/admin/clinics
    // ==================================================
    router.post("/", async function (req, res) {
        try {
            const {
                name,
                doctorName,
                specialty,
                phone,
                email
            } = req.body;

            if (!name || !doctorName) {
                return res.status(400).json({
                    success: false,
                    message: "Clinic name and doctor name are required"
                });
            }

            const clinic = {
                clinicCode: generateClinicCode(),

                name: String(name).trim(),
                doctorName: String(doctorName).trim(),

                specialty: specialty
                    ? String(specialty).trim()
                    : "",

                phone: phone
                    ? String(phone).trim()
                    : "",

                email: email
                    ? String(email).trim().toLowerCase()
                    : "",

                // ==========================================
                // Website / Branding
                // ==========================================
                website: {
                    enabled: true,

                    logoUrl: "",

                    description: "",

                    colors: {
                        primary: "",
                        secondary: "",
                        accent: ""
                    },

                    services: [],

                    contact: {
                        address: "",
                        phone: "",
                        whatsapp: "",
                        email: ""
                    },

                    social: {
                        facebook: "",
                        instagram: "",
                        tiktok: ""
                    }
                },

                // ==========================================
                // Subscription
                // ==========================================
                subscription: {
                    plan: "trial",
                    status: "active",

                    trialStartedAt: new Date(),
                    trialEndsAt: null,

                    startedAt: null,
                    expiresAt: null
                },

                status: "active",

                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result =
                await clinicsCollection.insertOne(clinic);

            return res.status(201).json({
                success: true,
                message: "Clinic created successfully",

                clinic: {
                    _id: result.insertedId,
                    clinicCode: clinic.clinicCode,
                    name: clinic.name,
                    doctorName: clinic.doctorName,
                    specialty: clinic.specialty,
                    status: clinic.status
                }
            });

        } catch (error) {
            console.error(
                "CREATE CLINIC ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to create clinic"
            });
        }
    });

    // ==================================================
    // Get All Clinics
    // GET /api/admin/clinics
    // ==================================================
    router.get("/", async function (req, res) {
        try {
            const clinics =
                await clinicsCollection
                    .find({})
                    .sort({ createdAt: -1 })
                    .toArray();

            return res.status(200).json({
                success: true,
                count: clinics.length,
                clinics
            });

        } catch (error) {
            console.error(
                "GET CLINICS ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load clinics"
            });
        }
    });

    // ==================================================
    // Get Clinic By Code
    // GET /api/admin/clinics/:clinicCode
    // ==================================================
    router.get("/:clinicCode", async function (req, res) {
        try {
            const {
                clinicCode
            } = req.params;

            const clinic =
                await clinicsCollection.findOne({
                    clinicCode
                });

            if (!clinic) {
                return res.status(404).json({
                    success: false,
                    message: "Clinic not found"
                });
            }

            return res.status(200).json({
                success: true,
                clinic
            });

        } catch (error) {
            console.error(
                "GET CLINIC ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load clinic"
            });
        }
    });

    return router;
};