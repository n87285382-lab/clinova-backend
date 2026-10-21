const express = require("express");
const crypto = require("crypto");
const createAuthMiddleware =
    require("./authMiddleware");
module.exports = function (db) {
    const router = express.Router();

    const usersCollection =
        db.collection("users");

    const authSessionsCollection =
        db.collection("authSessions");
const authMiddleware =
        createAuthMiddleware(db);
    // ==================================================
    // Hash Session Token
    // ==================================================
    function hashToken(token) {
        return crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
    }

    // ==================================================
    // Login
    // POST /api/auth/login
    // ==================================================
    router.post(
        "/login",
        async function (req, res) {
            try {
                const {
                    email,
                    password
                } = req.body;

                if (!email || !password) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Email and password are required"
                    });
                }

                const normalizedEmail =
                    String(email)
                        .trim()
                        .toLowerCase();

                const user =
                    await usersCollection.findOne(
                        {
                            email:
                                normalizedEmail
                        }
                    );

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message:
                            "Invalid email or password"
                    });
                }

                if (
                    user.status !==
                    "active"
                ) {
                    return res.status(403).json({
                        success: false,
                        message:
                            "User account is inactive"
                    });
                }

                if (
                    !user.password?.hash ||
                    !user.password?.salt
                ) {
                    return res.status(401).json({
                        success: false,
                        message:
                            "User password is not configured"
                    });
                }

                const storedHash = user.password.hash;
const salt = user.password.salt;

if (
    typeof storedHash !== "string" ||
    !/^[0-9a-fA-F]{128}$/.test(storedHash) ||
    typeof salt !== "string" ||
    salt.length === 0
) {
    console.error("Invalid password data for user:", user._id);

    return res.status(500).json({
        success: false,
        message: "Unable to verify password"
    });
}

const storedHashBuffer = Buffer.from(storedHash, "hex");

const calculatedHashBuffer = crypto.scryptSync(
    String(password),
    salt,
    64
);

const validPassword =
    storedHashBuffer.length === calculatedHashBuffer.length &&
    crypto.timingSafeEqual(
        storedHashBuffer,
        calculatedHashBuffer
    );

if (!validPassword) {
    return res.status(401).json({
        success: false,
        message: "Invalid email or password"
    });
}

                if (!validPassword) {
                    return res.status(401).json({
                        success: false,
                        message:
                            "Invalid email or password"
                    });
                }

                // ======================================
                // Create Session Token
                // ======================================
                const token =
                    crypto
                        .randomBytes(32)
                        .toString("hex");

                const tokenHash =
                    hashToken(token);

                const now =
                    new Date();

                const expiresAt =
                    new Date(
                        now.getTime() +
                        90 * 24 * 60 * 60 * 1000
                    );

                await authSessionsCollection
                    .insertOne({
                        userId:
                            user._id,

                        clinicId:
                            user.clinicId,

                        tokenHash,

                        createdAt:
                            now,

                        expiresAt,

                        lastUsedAt:
                            now
                    });

                return res.status(200).json({
                    success: true,

                    token,

                    user: {
                        _id:
                            user._id,

                        clinicId:
                            user.clinicId,

                        clinicCode:
                            user.clinicCode,

                        name:
                            user.name,

                        email:
                            user.email,

                        role:
                            user.role
                    }
                });

            } catch (error) {
                console.error(
                    "LOGIN ERROR:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Login failed"
                });
            }
        }
    );
// ==================================================
// Test Protected Route
// GET /api/auth/me
// ==================================================
router.get(
    "/me",
    authMiddleware,
    async function (req, res) {
        return res.status(200).json({
            success: true,
            user: req.user
        });
    }
);
    return router;
};


// 76686900ac7a24eed42cffebaad4368a19fe1eaf39ce0105a0538cde8489b0ea