const crypto = require("crypto");

function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = function createAuthMiddleware(db) {
    const authSessionsCollection = db.collection("authSessions");
    const usersCollection = db.collection("users");
    const clinicsCollection = db.collection("clinics");

    const IDLE_TIMEOUT = 30 * 24 * 60 * 60 * 1000;
    const ABSOLUTE_TIMEOUT = 90 * 24 * 60 * 60 * 1000;
    const ACTIVITY_UPDATE_INTERVAL = 15 * 60 * 1000;

    return async function authMiddleware(req, res, next) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const token = authHeader.slice(7).trim();

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const now = new Date();
            const tokenHash = hashToken(token);

            // 1. Find a valid authentication session
            const authSession = await authSessionsCollection.findOne(
                {
                    tokenHash,
                    expiresAt: { $gt: now }
                },
                {
                    projection: {
                        _id: 1,
                        userId: 1,
                        clinicId: 1,
                        createdAt: 1,
                        lastUsedAt: 1,
                        expiresAt: 1
                    }
                }
            );

            if (!authSession) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid or expired session. Please log in again."
                });
            }

            // 2. Check inactivity timeout
            const lastActivity =
                authSession.lastUsedAt || authSession.createdAt;

            if (
                !lastActivity ||
                !Number.isFinite(new Date(lastActivity).getTime()) ||
                now.getTime() - new Date(lastActivity).getTime() >= IDLE_TIMEOUT
            ) {
                return res.status(401).json({
                    success: false,
                    message: "Session expired due to inactivity. Please log in again."
                });
            }

            // 3. Find an active user
            const user = await usersCollection.findOne(
                {
                    _id: authSession.userId,
                    status: "active"
                },
                {
                    projection: {
                        _id: 1,
                        clinicId: 1,
                        clinicCode: 1,
                        name: 1,
                        email: 1,
                        role: 1
                    }
                }
            );

            if (!user) {
                return res.status(403).json({
                    success: false,
                    message: "User account is inactive or unavailable"
                });
            }

            // 4. Verify clinic association
            if (
                !user.clinicId ||
                !authSession.clinicId ||
                user.clinicId.toString() !== authSession.clinicId.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid clinic association"
                });
            }

            // 5. Verify the clinic is active
            const clinic = await clinicsCollection.findOne(
                {
                    _id: user.clinicId
                },
                {
                    projection: {
                        _id: 1,
                        status: 1
                    }
                }
            );

            if (!clinic || clinic.status !== "active") {
                return res.status(403).json({
                    success: false,
                    message: "Clinic is inactive or unavailable"
                });
            }

            // 6. Refresh activity occasionally, not on every request
            const lastActivityTime = new Date(lastActivity).getTime();

            if (
                now.getTime() - lastActivityTime >= ACTIVITY_UPDATE_INTERVAL
            ) {
                await authSessionsCollection.updateOne(
                    {
                        _id: authSession._id,
                        expiresAt: { $gt: now }
                    },
                    {
                        $set: {
                            lastUsedAt: now
                        }
                    }
                );
            }

            // 7. Make authenticated user information available to routes
            req.user = {
                userId: user._id,
                clinicId: user.clinicId,
                clinicCode: user.clinicCode,
                name: user.name,
                email: user.email,
                role: user.role
            };

            return next();

        } catch (error) {
            console.error("AUTH MIDDLEWARE ERROR:", error);

            return res.status(500).json({
                success: false,
                message: "Authentication error"
            });
        }
    };
};