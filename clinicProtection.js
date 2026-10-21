const express = require("express");

module.exports = function (db) {

    const router = express.Router();

    const PROTECTION_PASSWORD =
        process.env.CLINIC_SYSTEM_PASSWORD;

    router.post("/verify", async function (req, res) {

        try {

            const password =
                String(req.body?.password || "");

            if (!PROTECTION_PASSWORD) {

                console.error(
                    "CLINIC_SYSTEM_PASSWORD is not configured."
                );

                return res.status(500).json({
                    message:
                        "Clinic protection is not configured."
                });
            }

            if (
                !password ||
                password !== PROTECTION_PASSWORD
            ) {

                return res.status(401).json({
                    message:
                        "Invalid password."
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    "Access granted."
            });

        } catch (error) {

            console.error(
                "Clinic protection error:",
                error
            );

            return res.status(500).json({
                message:
                    "Server error."
            });
        }

    });

    return router;
};