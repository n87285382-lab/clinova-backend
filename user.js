const express = require("express");
const { ObjectId } = require("mongodb");
const crypto = require("crypto");
module.exports = function (db) {
    const router = express.Router();

    const usersCollection =
        db.collection("users");

    const clinicsCollection =
        db.collection("clinics");
// ==================================================
// Password Hashing
// ==================================================
function hashPassword(password) {
    const salt =
        crypto.randomBytes(16).toString("hex");

    const hash =
        crypto.scryptSync(
            String(password),
            salt,
            64
        ).toString("hex");

    return {
        salt,
        hash
    };
}
    // ==================================================
    // Create Doctor User
    // POST /api/admin/users
    // ==================================================
    router.post("/", async function (req, res) {
        try {
            const {
    clinicId,
    name,
    email,
    role,
    password
} = req.body;

            // ==========================================
            // Validation
            // ==========================================
            if (
    !clinicId ||
    !name ||
    !email ||
    !password
) {
    return res.status(400).json({
        success: false,
        message:
            "clinicId, name, email and password are required"
    });
}

            if (!ObjectId.isValid(clinicId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid clinicId"
                });
            }

            const normalizedEmail =
                String(email)
                    .trim()
                    .toLowerCase();

            // ==========================================
            // Check Clinic
            // ==========================================
            // ==========================================
// Check Clinic + Existing Email In Parallel
// ==========================================
const [clinic, existingUser] =
    await Promise.all([
        clinicsCollection.findOne(
            {
                _id: new ObjectId(clinicId)
            },
            {
                projection: {
                    _id: 1,
                    clinicCode: 1
                }
            }
        ),

        usersCollection.findOne(
            {
                email: normalizedEmail
            },
            {
                projection: {
                    _id: 1
                }
            }
        )
    ]);

if (!clinic) {
    return res.status(404).json({
        success: false,
        message: "Clinic not found"
    });
}

if (existingUser) {
    return res.status(409).json({
        success: false,
        message:
            "A user with this email already exists"
    });
}
const passwordData =
    hashPassword(password);
            // ==========================================
            // Create User
            // ==========================================
            const user = {
    clinicId: clinic._id,

    clinicCode:
        clinic.clinicCode,

    name:
        String(name).trim(),

    email:
        normalizedEmail,

    password: {
        salt: passwordData.salt,
        hash: passwordData.hash
    },

    role:
        role || "doctor",

    status:
        "active",

    createdAt:
        new Date(),

    updatedAt:
        new Date()
};

            const result =
                await usersCollection.insertOne(
                    user
                );

            return res.status(201).json({
                success: true,
                message:
                    "User created successfully",

                user: {
                    _id:
                        result.insertedId,

                    clinicId:
                        clinic._id,

                    clinicCode:
                        clinic.clinicCode,

                    name:
                        user.name,

                    email:
                        user.email,

                    role:
                        user.role,

                    status:
                        user.status
                }
            });

        } catch (error) {
            console.error(
                "CREATE USER ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to create user"
            });
        }
    });

    // ==================================================
    // Get Users Of A Clinic
    // GET /api/admin/users/clinic/:clinicId
    // ==================================================
    router.get(
        "/clinic/:clinicId",
        async function (req, res) {
            try {
                const {
                    clinicId
                } = req.params;

                if (!ObjectId.isValid(clinicId)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid clinicId"
                    });
                }

                const users =
                    await usersCollection
                        .find({
                            clinicId:
                                new ObjectId(clinicId)
                        })
                        .sort({
                            createdAt: -1
                        })
                        .toArray();

                return res.status(200).json({
                    success: true,
                    count: users.length,
                    users
                });

            } catch (error) {
                console.error(
                    "GET CLINIC USERS ERROR:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to load clinic users"
                });
            }
        }
    );
// ==================================================
// Set User Password
// POST /api/admin/users/:userId/password
// ==================================================
router.post(
    "/:userId/password",
    async function (req, res) {
        try {
            const {
                userId
            } = req.params;

            const {
                password
            } = req.body;

            if (!ObjectId.isValid(userId)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid userId"
                });
            }

            if (
                !password ||
                String(password).length < 8
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Password must be at least 8 characters"
                });
            }

            const passwordData =
                hashPassword(password);

            const result =
                await usersCollection.updateOne(
                    {
                        _id:
                            new ObjectId(userId)
                    },
                    {
                        $set: {
                            password: {
                                salt:
                                    passwordData.salt,

                                hash:
                                    passwordData.hash
                            },

                            updatedAt:
                                new Date()
                        }
                    }
                );

            if (
                result.matchedCount === 0
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        "User not found"
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    "Password updated successfully"
            });

        } catch (error) {
            console.error(
                "SET PASSWORD ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update password"
            });
        }
    }
);
    return router;
};