const express = require("express");
const { ObjectId } = require("mongodb");

module.exports = function (db) {
    const router = express.Router();

const crypto = require("crypto");
const { sendWhatsAppMessage } = require("./whatsapp");
function generateSessionToken() {
    return crypto.randomBytes(32).toString("hex");
}

function generateAccessCode() {
    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 8; i++) {
        const randomIndex =
            crypto.randomInt(0, characters.length);

        code += characters[randomIndex];
    }

    return code;
}

    const assessmentEngine =
        require("./assessmentEngine")(db);





const answersCollection =
    db.collection("sessionAnswers");
    const followUpsCollection = db.collection("followUps");
    // ==========================================
    // Get First Question
    // ==========================================
// ==========================================
// Get Question
// ==========================================
// ========================================================
// Generate Secure Session Token
// ========================================================
const patientsCollection = db.collection("patients");
    const sessionsCollection = db.collection("sessions");
    const questionsCollection = db.collection("questions");
const {
    determineFollowUpTrend
} = require("./trendEngine");
const sessionService = require("./sessionService")(db);

const {
    createPatientSession,
    
    getDoctorSession,
    getDoctorFollowUpOverview
} = sessionService;


    // ==========================================
// Clinic Attendance Rate
// ==========================================
router.get(
    "/attendance-rate",
    async function (req, res) {
        try {

            const result =
                await sessionsCollection.aggregate([
                    {
                        $match: {
                            attendanceStatus: {
                                $in: [
                                    "present",
                                    "absent"
                                ]
                            }
                        }
                    },

                    {
                        $group: {
                            _id: "$attendanceStatus",
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ]).toArray();

            let presentCount = 0;
            let absentCount = 0;

            result.forEach(function (item) {

                if (
                    item._id === "present"
                ) {
                    presentCount =
                        item.count;
                }

                if (
                    item._id === "absent"
                ) {
                    absentCount =
                        item.count;
                }
            });

            const totalRecorded =
                presentCount +
                absentCount;

            let attendanceRate = null;

            if (totalRecorded > 0) {
                attendanceRate =
                    Math.round(
                        (
                            presentCount /
                            totalRecorded
                        ) * 100
                    );
            }

            return res.status(200).json({
                success: true,
                presentCount,
                absentCount,
                totalRecorded,
                attendanceRate
            });

        } catch (error) {

            console.error(
                "Attendance rate error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to calculate attendance rate"
            });
        }
    }
);
router.get(
    "/pending-approval",
    async function (req, res) {
        try {
            const pendingApprovals =
                await followUpsCollection
                    .find({
                        status: "pending_approval",
                        approvalStatus: "pending"
                    })
                    .sort({
                        requestedAt: 1
                    })
                    .toArray();

            const validApprovals = [];

            for (const approval of pendingApprovals) {
                if (!approval.sessionId) {
                    continue;
                }

                const session =
                    await sessionsCollection.findOne({
                        _id: approval.sessionId
                    });

                if (!session) {
                    console.warn(
                        "STALE PENDING APPROVAL SKIPPED:",
                        {
                            followUpId: approval._id,
                            sessionId: approval.sessionId
                        }
                    );

                    continue;
                }

                validApprovals.push({
                    ...approval,
                    session
                });
            }

            console.log(
                "PENDING APPROVALS FOUND:",
                validApprovals.map(function (item) {
                    return {
                        followUpId: item._id,
                        sessionId: item.sessionId,
                        status: item.status,
                        approvalStatus: item.approvalStatus,
                        attendanceStatus:
                            item.attendanceStatus,
                        sessionNumber:
                            item.session?.sessionNumber,
                        sessionStatus:
                            item.session?.status
                    };
                })
            );

            return res.status(200).json({
                success: true,
                count: validApprovals.length,
                followUps: validApprovals
            });

        } catch (error) {
            console.error(
                "GET PENDING APPROVALS ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load pending approvals"
            });
        }
    }
);
router.post(
    "/:id/test-whatsapp",
    async function (req, res) {

        try {

            const { id } = req.params;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid session id"
                });
            }

            const session =
                await sessionsCollection.findOne({
                    _id: new ObjectId(id)
                });

            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: "Session not found"
                });
            }

            const phone =
                await db.collection("patients").findOne({
                    patientCode: session.patientId
                });

            if (!phone?.phone) {
                return res.status(400).json({
                    success: false,
                    message: "Patient WhatsApp number not found"
                });
            }

            const message =
                `مرحبًا ${session.patientName || "بك"} 👋\n\n` +
                `هذه رسالة اختبار من منصة العيادة.\n\n` +
                `إذا وصلت لك هذه الرسالة، فإرسال WhatsApp يعمل بشكل صحيح.`;

            const result =
                await sendWhatsAppMessage(
                    phone.phone,
                    message
                );

            return res.status(200).json({
                success: true,
                patientId: session.patientId,
                phone: phone.phone,
                whatsapp: result
            });

        } catch (error) {

            console.error(
                "TEST WHATSAPP ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);
router.post(
    "/whatsapp/patient-confirmation",
    async function (req, res) {

        try {

            const {
                patientCode,
                response
            } = req.body;

            if (!patientCode) {
                return res.status(400).json({
                    success: false,
                    message: "patientCode is required"
                });
            }

            let confirmationStatus = null;

            if (
                response === "هحضر" ||
                response === "confirmed"
            ) {
                confirmationStatus =
                    "confirmed";
            }

            if (
                response === "مش هحضر" ||
                response === "not_confirmed"
            ) {
                confirmationStatus =
                    "not_confirmed";
            }

            if (!confirmationStatus) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid patient confirmation"
                });
            }

            const patient =
                await patientsCollection.findOne({
                    patientCode
                });

            if (!patient) {
                return res.status(404).json({
                    success: false,
                    message: "Patient not found"
                });
            }

            const session =
                await sessionsCollection.findOne({
                    patientId: patientCode,
                    sessionNumber: {
                        $gt: 1
                    },
                    status: {
                        $in: [
                            "scheduled",
                            "opened"
                        ]
                    }
                });

            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: "No active session found"
                });
            }

            const now = new Date();

            await sessionsCollection.updateOne(
                {
                    _id: session._id
                },
                {
                    $set: {
                        "patientConfirmation.status":
                            confirmationStatus,

                        "patientConfirmation.respondedAt":
                            now,

                        updatedAt:
                            now
                    }
                }
            );

            return res.status(200).json({
                success: true,
                patientId: patientCode,
                sessionId: session._id,
                sessionNumber:
                    session.sessionNumber,
                patientConfirmation:
                    confirmationStatus
            });

        } catch (error) {

            console.error(
                "PATIENT WHATSAPP CONFIRMATION ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to save patient confirmation"
            });
        }
    }
);
// ========================================================
// GENERATE / GET SESSION ACCESS LINK
// ========================================================

// ========================================================
// GENERATE / GET SESSION ACCESS LINK
// ========================================================

router.post(
    "/:sessionId/access-link",
    async function (req, res) {
        try {
            const sessionId =
                req.params.sessionId;

            // ==========================================
            // Validate Session ID
            // ==========================================

            if (!ObjectId.isValid(sessionId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid session id"
                });
            }

            // ==========================================
            // Find Session
            // ==========================================

            const session =
                await sessionsCollection.findOne({
                    _id: new ObjectId(sessionId)
                });

            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: "Session not found"
                });
            }

            // ==========================================
            // Generate Secure Access Token
            // ==========================================

            let accessToken =
                session.accessToken;

            if (!accessToken) {
                accessToken =
                    generateSessionToken();

                await sessionsCollection.updateOne(
                    {
                        _id: session._id
                    },
                    {
                        $set: {
                            accessToken,
                            accessTokenCreatedAt:
                                new Date()
                        }
                    }
                );
            }

            // ==========================================
            // Generate Patient Access Code
            // ==========================================

            let accessCode =
                session.accessCode;

            if (!accessCode) {
                accessCode =
                    generateAccessCode();

                await sessionsCollection.updateOne(
                    {
                        _id: session._id
                    },
                    {
                        $set: {
                            accessCode,
                            accessCodeCreatedAt:
                                new Date()
                        }
                    }
                );
            }

            // ==========================================
            // Build Patient Link
            // ==========================================

            const patientAppUrl =
                process.env.PATIENT_APP_URL ||
                "http://localhost:5501";

            const patientLink =
    `${patientAppUrl}/follow.html?token=${accessToken}`;

            // ==========================================
            // Response
            // ==========================================

            return res.status(200).json({
    success: true,
    sessionId: session._id,
    patientId: session.patientId,
    sessionNumber: session.sessionNumber,
    accessToken,
    accessCode,
    patientLink
});

        } catch (error) {

            console.error(
                "GENERATE ACCESS LINK ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to generate access link"
            });
        }
    }
);
router.get("/access/code/:code", async function (req, res) {
    try {
        const code =
            String(req.params.code || "")
                .trim()
                .toUpperCase();

        if (!code || code.length !== 8) {
            return res.status(400).json({
                success: false,
                message: "Invalid access code"
            });
        }

        const session =
            await sessionsCollection.findOne({
                accessCode: code
            });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Invalid or expired access code"
            });
        }

        if (session.status !== "opened") {
            return res.status(403).json({
                success: false,
                message: "Session is not available"
            });
        }

        return res.status(200).json({
            success: true,
            patientId: session.patientId,
            patientName: session.patientName,
            patientType: session.patientType,
            sessionNumber: session.sessionNumber,
            sessionId: session._id
        });

    } catch (error) {
        console.error(
            "ACCESS CODE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to access session"
        });
    }
});
// ========================================================
// GET SESSION BY ACCESS TOKEN
// ========================================================


router.get(
    "/access/:token",
    async function (req, res) {

        try {

            const token =
                String(
                    req.params.token || ""
                ).trim();


            if (!token) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Session token is required"

                });
            }


            const session =
                await sessionsCollection.findOne({

                    accessToken: token

                });


            if (!session) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Invalid or expired session link"

                });
            }


            if (
                session.status !==
                "opened"
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "This session is not available"

                });
            }


            return res.status(200).json({

                success: true,

                patientId:
                    session.patientId,

                patientName:
                    session.patientName,

                patientType:
                    session.patientType,

                sessionId:
                    session._id,

                sessionNumber:
                    session.sessionNumber,

                status:
                    session.status

            });

        } catch (error) {

            console.error(
                "GET SESSION BY TOKEN ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to open session"

            });
        }
    }
);



// ========================================================
// GET SESSION QUESTIONS BY TOKEN
// ========================================================
router.get(
    "/access/:token/questions",
    async function (req, res) {

        try {

            const token =
                String(
                    req.params.token || ""
                ).trim();


            if (!token) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Session token is required"

                });
            }


            const session =
                await sessionsCollection.findOne({

                    accessToken: token

                });


            if (!session) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Invalid session link"

                });
            }


            if (
                session.status !==
                "opened"
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "This session is not available"

                });
            }


            const questions =
                await questionsCollection
                    .find({

                        patientType:
                            session.patientType,

                        sessionNumber:
                            session.sessionNumber,

                        active: {
                            $ne: false
                        }

                    })
                    .sort({
                        order: 1
                    })
                    .toArray();


            return res.status(200).json({

                success: true,

                sessionId:
                    session._id,

                patientId:
                    session.patientId,

                sessionNumber:
                    session.sessionNumber,

                questions

            });

        } catch (error) {

            console.error(
                "GET SESSION QUESTIONS ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to load session questions"

            });
        }
    }
);



router.get(
    "/:sessionId/question/:questionId",
    async function (req, res) {

        try {

            const {
                questionId
            } = req.params;


            const {
                patientType
            } = req.query;


            const question =
                await assessmentEngine
                    .getQuestion(
                        questionId,
                        patientType
                    );


            res.status(200).json(
                question
            );

        }

        catch (error) {

            console.error(
                "GET QUESTION ERROR:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Failed to get question."

            });

        }

    }
);
// ==========================================
// Get Session Answers
// ==========================================

router.get("/:sessionId/answers", async function (req, res) {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "Session ID is required."
            });
        }

        const answers = await answersCollection
            .find({ sessionId })
            .sort({ createdAt: 1 })
            .toArray();

        return res.status(200).json({
            success: true,
            count: answers.length,
            answers
        });

    } catch (error) {

        console.error(
            "GET SESSION ANSWERS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to get session answers."
        });
    }
});

// ==========================================
// Submit Answer
// ==========================================
router.post("/:sessionId/answer", async function (req, res) {
    try {
        const { sessionId } = req.params;

        const {
            questionId,
            answerId,
            answerText,
            patientType
        } = req.body;

        // ==========================================
        // Validate Required Data
        // ==========================================

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "Session ID is required."
            });
        }

        if (!questionId) {
            return res.status(400).json({
                success: false,
                message: "Question ID is required."
            });
        }

        if (!answerId && !answerText) {
            return res.status(400).json({
                success: false,
                message: "Answer is required."
            });
        }

        // ==========================================
        // Process Answer
        // ==========================================

        const result = await assessmentEngine.processAnswer({
            sessionId,
            questionId,
            answerId: answerId || null,
            answerText: answerText || null,
            patientType
        });

        // ==========================================
        // Response
        // ==========================================

        return res.status(200).json({
            success: true,
            nextQuestion: result.nextQuestion || null,
            progress: result.progress || null
        });

    } catch (error) {

        console.error("SUBMIT ANSWER ERROR:", error);

        return res.status(400).json({
            success: false,
            message: error.message || "Failed to process answer."
        });
    }
});





    // =========================================
    // إنشاء جلسة جديدة للمريض
    // =========================================
router.post("/", async function (req, res) {

    try {

        const {
            patientId,
            scheduledAt
        } = req.body;

        if (!patientId) {
            return res.status(400).json({
                message: "patientId is required"
            });
        }

        if (!scheduledAt) {
            return res.status(400).json({
                message: "scheduledAt is required"
            });
        }

        const session = await createPatientSession(
            patientId,
            scheduledAt
        );

        return res.status(201).json({
            message: "Session created successfully",
            session
        });

    } catch (error) {

        console.error(
            "Create session error:",
            error
        );

        if (
            error.message === "Patient not found"
        ) {
            return res.status(404).json({
                message: error.message
            });
        }

        if (
            error.message === "Invalid scheduledAt"
        ) {
            return res.status(400).json({
                message: error.message
            });
        }

        if (
            error.message === "Invalid patient type"
        ) {
            return res.status(400).json({
                message: error.message
            });
        }
if (
    error.message ===
    "Previous session is not completed" ||

    error.message ===
    "Previous session attendance is not present"
) {
    return res.status(400).json({
        message:
            error.message
    });
}
        return res.status(500).json({
            message: "Server error"
        });
    }
});

// ==========================================
// GET DOCTOR FOLLOW-UP OVERVIEW
// All Completed Sessions
// ==========================================
router.get(
    "/doctor/:patientId/follow-up-overview",
    async function (req, res) {
        try {
            const {
                patientId
            } = req.params;

            const overview =
                await getDoctorFollowUpOverview(
                    patientId
                );

            return res.status(200).json({
                success: true,
                ...overview
            });

        } catch (error) {
            console.error(
                "GET DOCTOR FOLLOW-UP OVERVIEW ERROR:",
                error
            );

            if (
                error.message ===
                "Patient ID is required"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        error.message
                });
            }

            if (
                error.message ===
                "Patient not found"
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        error.message
                });
            }

            return res.status(500).json({
                success: false,
                message:
                    "Failed to load doctor follow-up overview"
            });
        }
    }
);
// ==========================================
// GET ONE SESSION FOR DOCTOR
// Read Only
// ==========================================
router.get(
    "/doctor/:patientId/session/:sessionNumber",
    async function (req, res) {

        try {
            const {
                patientId,
                sessionNumber
            } = req.params;

            const session =
                await getDoctorSession(
                    patientId,
                    sessionNumber
                );

            // ==========================================
            // Doctor should only inspect completed sessions
            // ==========================================
            if (
                session.status !==
                "completed"
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Session is not completed yet"
                });
            }

            return res.status(200).json({
                success: true,
                session
            });

        } catch (error) {

            console.error(
                "GET DOCTOR SESSION ERROR:",
                error
            );

            if (
                error.message ===
                "Session not found"
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        error.message
                });
            }

            if (
                error.message ===
                "Invalid session number" ||
                error.message ===
                "Patient ID is required"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        error.message
                });
            }

            return res.status(500).json({
                success: false,
                message:
                    "Failed to load doctor session"
            });
        }
    }
);
    // =========================================
    // تاريخ جلسات المريض
    // =========================================

    router.get(
    "/patient/:patientId/history",
    async function (req, res) {
        try {
            const { patientId } = req.params;

            // =========================================
            // جلب بيانات المريض
            // =========================================

            const patient = await patientsCollection.findOne({
                patientCode: patientId
            });

            if (!patient) {
                return res.status(404).json({
                    message: "Patient not found"
                });
            }

            // =========================================
            // جلب جلسات المريض
            // =========================================

            const sessions = await sessionsCollection
                .find({
                    patientId: patientId
                })
                .sort({
                    sessionNumber: 1
                })
                .toArray();

            if (sessions.length === 0) {
                return res.status(404).json({
                    message: "No sessions found for this patient"
                });
            }

            // =========================================
            // تجهيز History
            // =========================================

            const history = sessions.map(function (session) {
    return {
    _id: String(session._id),
    sessionId: String(session._id),

    sessionNumber: session.sessionNumber,

    questionSetVersion:
        session.questionSetVersion || null,

    status: session.status,
    attendanceStatus: session.attendanceStatus,

    patientType: patient.patientType,

    scheduledAt: session.scheduledAt || null,
    openedAt: session.openedAt || null,
    completedAt: session.completedAt || null,

    comparisonStatus:
        session.comparisonStatus || "not_started",

    comparisonCompletedAt:
        session.comparisonCompletedAt || null,

    accessLink:
        session.accessLink || null,

    assessmentResult:
        session.assessmentResult || null
};
});

            // =========================================
            // Response
            // =========================================

            return res.status(200).json({
                patientId: patientId,

                patientName: patient.name,

                patientType: patient.patientType,

                sessionsCount: sessions.length,

                history: history
            });

        } catch (error) {
            console.error(
                "GET PATIENT HISTORY ERROR:",
                error
            );

            return res.status(500).json({
                message: "Failed to get patient history",

                error: error.message
            });
        }
    }
);
// router.get(
//     "/patient/:patientId/history",
//     async function (req, res) {
//         try {
//             const { patientId } = req.params;

//             // =========================================
//             // جلب بيانات المريض
//             // =========================================

//             const patient = await patientsCollection.findOne({
//                 patientCode: patientId
//             });

//             if (!patient) {
//                 return res.status(404).json({
//                     message: "Patient not found"
//                 });
//             }

//             // =========================================
//             // جلب جلسات المريض
//             // =========================================

//             const sessions = await sessionsCollection
//                 .find({
//                     patientId: patientId
//                 })
//                 .sort({
//                     sessionNumber: 1
//                 })
//                 .toArray();

//             if (sessions.length === 0) {
//                 return res.status(404).json({
//                     message: "No sessions found for this patient"
//                 });
//             }

//             // =========================================
//             // تجهيز History
//             // =========================================

//             const history = sessions.map(function (session) {
//                 return {
//                     _id: session._id,

//                     sessionNumber: session.sessionNumber,

//                     status: session.status,

//                     attendanceStatus: session.attendanceStatus,

//                     patientType: patient.patientType,

//                     scheduledAt: session.scheduledAt || null,

//                     openedAt: session.openedAt || null,

//                     completedAt: session.completedAt || null,

//                     accessLink: session.accessLink || null,

//                     assessmentResult:
//                         session.assessmentResult || null
//                 };
//             });

//             // =========================================
//             // Response
//             // =========================================

//             return res.status(200).json({
//                 patientId: patientId,

//                 patientName: patient.name,

//                 patientType: patient.patientType,

//                 sessionsCount: sessions.length,

//                 history: history
//             });

//         } catch (error) {
//             console.error(
//                 "GET PATIENT HISTORY ERROR:",
//                 error
//             );

//             return res.status(500).json({
//                 message: "Failed to get patient history",

//                 error: error.message
//             });
//         }
//     }
// );


    // =========================================
    // تقدم المريض
    // =========================================

    router.get(
    "/patient/:patientId/progress",
    async function (req, res) {

        try {

            const { patientId } = req.params;

            const overview =
                await getDoctorFollowUpOverview(patientId);

            if (
                !overview ||
                !Array.isArray(overview.sessions) ||
                overview.sessions.length === 0
            ) {

                return res.status(200).json({
                    patientId,
                    message: "No completed sessions yet",
                    progress: null
                });

            }

            const sessions = overview.sessions;

            const currentSession =
                sessions[sessions.length - 1];

            const previousSession =
                sessions.length > 1
                    ? sessions[sessions.length - 2]
                    : null;

            let trend = "first_session";

            if (currentSession.comparison) {

                trend =
                    currentSession.comparison.trend || "stable";

            }

            return res.status(200).json({

                patientId,

                patientName:
                    overview.patientName,

                patientType:
                    overview.patientType,

                progress: {

                    currentSession:
                        currentSession.sessionNumber,

                    currentRisk:
                        currentSession.risk?.level || "none",

                    currentScore:
                        currentSession.totalScore ?? null,

                    previousRisk:
                        previousSession
                            ? (
                                previousSession.risk?.level ||
                                "none"
                            )
                            : null,

                    previousScore:
                        previousSession
                            ? (
                                previousSession.totalScore ??
                                null
                            )
                            : null,

                    trend

                }

            });

        } catch (error) {

            console.error(
                "Get patient progress error:",
                error
            );

            return res.status(500).json({
                message: "Failed to get patient progress"
            });

        }

    }
);

    // =========================================
    // تغيير حالة الجلسة
    // =========================================

    router.patch(
        "/:id/status",
        async function (req, res) {
            try {
                const { id } = req.params;
                const { status } = req.body;

                if (!status) {
                    return res.status(400).json({
                        message: "status is required"
                    });
                }

                const allowedStatuses = [
                    "scheduled",
                    "opened",
                    "in_progress",
                    "completed"
                ];

                if (!allowedStatuses.includes(status)) {
                    return res.status(400).json({
                        message: "Invalid session status"
                    });
                }

                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({
                        message: "Invalid session id"
                    });
                }

                const session =
                    await sessionsCollection.findOne({
                        _id: new ObjectId(id)
                    });

                if (!session) {
                    return res.status(404).json({
                        message: "Session not found"
                    });
                }

                const currentStatus = session.status;

                const allowedTransitions = {
                    scheduled: ["opened"],
                    opened: ["in_progress"],
                    in_progress: ["completed"],
                    completed: []
                };

                if (
                    !allowedTransitions[currentStatus].includes(
                        status
                    )
                ) {
                    return res.status(400).json({
                        message: "Invalid status transition",
                        currentStatus: currentStatus,
                        requestedStatus: status
                    });
                }

                const updateData = {
                    status: status,
                    updatedAt: new Date()
                };

                if (status === "completed") {
                    updateData.completedAt = new Date();
                }
const now = new Date();
const scheduledAt = new Date(session.scheduledAt);

if (
    !session.scheduledAt ||
    Number.isNaN(scheduledAt.getTime())
) {
    return res.status(400).json({
        message: "Session scheduledAt is invalid"
    });
}

if (now < scheduledAt) {
    return res.status(400).json({
        message: "Session cannot be opened before its scheduled time",
        scheduledAt: session.scheduledAt,
        currentTime: now
    });
}

if (session.sessionNumber > 1) {
    const previousSession =
        await sessionsCollection.findOne({
            patientId: session.patientId,
            sessionNumber: session.sessionNumber - 1
        });

    if (
        !previousSession ||
        previousSession.status !== "completed" ||
        previousSession.attendanceStatus !== "present"
    ) {
        return res.status(400).json({
            message: "Previous session is not completed"
        });
    }
}
                await sessionsCollection.updateOne(
                    {
                        _id: new ObjectId(id)
                    },
                    {
                        $set: updateData
                    }
                );

                res.status(200).json({
                    message:
                        "Session status updated successfully",
                    sessionId: id,
                    previousStatus: currentStatus,
                    newStatus: status
                });

            } catch (error) {
                console.error(
                    "Update session status error:",
                    error
                );

                res.status(500).json({
                    message: "Server error"
                });
            }
        }
    );

    // =========================================
    // تسجيل حضور / غياب المريض
    // =========================================

    router.patch(
    "/:id/attendance",
    async function (req, res) {

        try {

            const { id } = req.params;
            const { attendanceStatus } = req.body;

            const allowedAttendance = [
                "pending",
                "present",
                "absent"
            ];

            // ==========================================
            // Validate Attendance Status
            // ==========================================

            if (
                !allowedAttendance.includes(
                    attendanceStatus
                )
            ) {

                return res.status(400).json({
                    message:
                        "Invalid attendance status"
                });
            }

            // ==========================================
            // Validate Session ID
            // ==========================================

            if (!ObjectId.isValid(id)) {

                return res.status(400).json({
                    message:
                        "Invalid session id"
                });
            }

            // ==========================================
            // Get Session
            // ==========================================

            const session =
                await sessionsCollection.findOne({
                    _id:
                        new ObjectId(id)
                });

            if (!session) {

                return res.status(404).json({
                    message:
                        "Session not found"
                });
            }

            // ==========================================
            // Prevent Changing Recorded Attendance
            // ==========================================

            if (
                session.attendanceStatus ===
                    "present" ||
                session.attendanceStatus ===
                    "absent"
            ) {

                return res.status(400).json({
                    message:
                        "Attendance has already been recorded",
                    currentAttendanceStatus:
                        session.attendanceStatus
                });
            }

            // ==========================================
            // Pending
            // ==========================================

            if (
                attendanceStatus ===
                "pending"
            ) {

                await sessionsCollection.updateOne(
                    {
                        _id:
                            new ObjectId(id)
                    },
                    {
                        $set: {
                            attendanceStatus:
                                "pending",

                            updatedAt:
                                new Date()
                        }
                    }
                );

                return res.status(200).json({
                    message:
                        "Attendance remains pending",

                    sessionId:
                        id,

                    patientId:
                        session.patientId,

                    sessionNumber:
                        session.sessionNumber,

                    attendanceStatus:
                        "pending",

                    status:
                        session.status
                });
            }

            // ==========================================
            // Check Session Time
            // ==========================================

            const now =
                new Date();

            const scheduledAt =
                new Date(
                    session.scheduledAt
                );

            if (
                !session.scheduledAt ||
                isNaN(
                    scheduledAt.getTime()
                )
            ) {

                return res.status(400).json({
                    message:
                        "Session scheduledAt is invalid"
                });
            }

            // ==========================================
            // PRESENT
            // ==========================================

            if (
                attendanceStatus ===
                "present"
            ) {

                // --------------------------------------
                // Cannot mark present before appointment
                // --------------------------------------

                if (
                    now < scheduledAt
                ) {

                    return res.status(400).json({
                        message:
                            "Attendance cannot be recorded before session time",

                        scheduledAt:
                            session.scheduledAt,

                        currentTime:
                            now
                    });
                }

                // --------------------------------------
                // Session must still be scheduled
                // --------------------------------------


                // --------------------------------------
// Previous Session Check
// --------------------------------------

// --------------------------------------
// Mark Present Only
// --------------------------------------

await sessionsCollection.updateOne(
    {
        _id:
            new ObjectId(id)
    },
    {
        $set: {
            attendanceStatus:
                "present",
            updatedAt:
                now
        }
    }
);

return res.status(200).json({
    message:
        "Patient marked present successfully",
    sessionId:
        id,
    patientId:
        session.patientId,
    sessionNumber:
        session.sessionNumber,
    attendanceStatus:
        "present",
    status:
        session.status
});
            }
            // ==========================================
            // ABSENT
            // ==========================================

            if (
                attendanceStatus ===
                "absent"
            ) {

                await sessionsCollection.updateOne(
                    {
                        _id:
                            new ObjectId(id)
                    },
                    {
                        $set: {

                            attendanceStatus:
                                "absent",

                            updatedAt:
                                now
                        }
                    }
                );

                return res.status(200).json({

                    message:
                        "Patient marked absent",

                    sessionId:
                        id,

                    patientId:
                        session.patientId,

                    sessionNumber:
                        session.sessionNumber,

                    attendanceStatus:
                        "absent",

                    status:
                        session.status
                });
            }

        } catch (error) {

            console.error(
                "Update attendance error:",
                error
            );

            return res.status(500).json({
                message:
                    "Server error"
            });
        }
    }
);


    // ==========================================
// Absent Attendance Decision
// ==========================================

router.patch(
    "/:id/absent-decision",
    async function (req, res) {

        try {

            const { id } = req.params;
            const { action } = req.body;

            // ==========================================
            // Validate Session ID
            // ==========================================

            if (!ObjectId.isValid(id)) {

                return res.status(400).json({
                    message:
                        "Invalid session id"
                });

            }

            // ==========================================
            // Validate Action
            // ==========================================

            const allowedActions = [
                "open_and_notify",
                "keep_closed"
            ];

            if (
                !allowedActions.includes(action)
            ) {

                return res.status(400).json({
                    message:
                        "Invalid absent decision"
                });

            }

            // ==========================================
            // Find Session
            // ==========================================

            const session =
                await sessionsCollection.findOne({
                    _id:
                        new ObjectId(id)
                });
const followUp =
    await followUpsCollection.findOne({
        sessionId: session._id
    });
            if (!session) {

                return res.status(404).json({
                    message:
                        "Session not found"
                });

            }

            // ==========================================
            // Make Sure Attendance Is Absent
            // ==========================================

            if (
    session.attendanceStatus !== "absent" &&
    session.attendanceStatus !== "pending"
) {
    return res.status(400).json({
        message:
            "Doctor decision is only available for absent or pending attendance",
        currentAttendanceStatus:
            session.attendanceStatus
    });
}

            // ==========================================
            // Prevent Duplicate Decision
            // ==========================================

            if (
                session.absentDecision &&
                session.absentDecision !==
                    "pending"
            ) {

                return res.status(400).json({
                    message:
                        "Absent decision has already been recorded",
                    currentDecision:
                        session.absentDecision
                });

            }

            const now =
                new Date();

            // ==========================================
            // Keep Session Closed
            // ==========================================

            if (action === "keep_closed") {

    await sessionsCollection.updateOne(
        {
            _id: new ObjectId(id)
        },
        {
            $set: {
                absentDecision:
                    "keep_closed",

                absentDecisionAt:
                    now,

                updatedAt:
                    now
            }
        }
    );

    if (followUp) {
    await followUpsCollection.updateOne(
        {
            _id: followUp._id
        },
        {
            $set: {
                status: "approved",

                approvalStatus:
                    "approved",

                approvedAt:
                    now,

                updatedAt:
                    now
            }
        }
    );
}

    return res.status(200).json({
        success: true,
        message:
            "Session will remain closed",

        sessionId: id,

        patientId:
            session.patientId,

        sessionNumber:
            session.sessionNumber,

        attendanceStatus:
            session.attendanceStatus,

        absentDecision:
            "keep_closed",

        status:
            session.status
    });
}

            // ==========================================
            // Open Session + Notify Patient
            // ==========================================

            // ==========================================
// Open Session + Notify Patient
// ==========================================

if (action === "open_and_notify") {
// ==========================================
// Enforce Sequential Session Opening
// ==========================================
const previousSession =
    await sessionsCollection.findOne({
        patientId:
            session.patientId,

        sessionNumber:
            session.sessionNumber - 1
    });

// ==========================================
// Previous Session Must Exist
// ==========================================
if (
    session.sessionNumber > 1 &&
    !previousSession
) {
    return res.status(400).json({
        success: false,

        message:
            "Previous session not found",

        sessionNumber:
            session.sessionNumber
    });
}

// ==========================================
// Previous Session Must Be Completed
// ==========================================
if (
    session.sessionNumber > 1 &&
    (
        previousSession.status !==
            "completed" ||

        previousSession.attendanceStatus !==
            "present"
    )
) {
    return res.status(400).json({
        success: false,

        message:
            "Previous session is not completed",

        previousSessionNumber:
            previousSession.sessionNumber,

        previousStatus:
            previousSession.status,

        previousAttendanceStatus:
            previousSession.attendanceStatus
    });
}
    // ------------------------------------------
    // Generate / Get Secure Access Token
    // ------------------------------------------

    let accessToken =
        session.accessToken;

    if (!accessToken) {

        accessToken =
            generateSessionToken();

        await sessionsCollection.updateOne(
            {
                _id: session._id
            },
            {
                $set: {
                    accessToken,
                    accessTokenCreatedAt: now
                }
            }
        );
    }

    // ------------------------------------------
    // Generate / Get Patient Access Code
    // ------------------------------------------

    let accessCode =
        session.accessCode;

    if (!accessCode) {

        accessCode =
            generateAccessCode();

        await sessionsCollection.updateOne(
            {
                _id: session._id
            },
            {
                $set: {
                    accessCode,
                    accessCodeCreatedAt: now
                }
            }
        );
    }

    // ------------------------------------------
    // Build Patient Link
    // ------------------------------------------

    const patientAppUrl =
        process.env.PATIENT_APP_URL ||
        "http://localhost:5501";

    const patientLink =
        `${patientAppUrl}/follow.html?token=${accessToken}`;

    // ------------------------------------------
    // Open Session
    // ------------------------------------------

    await sessionsCollection.updateOne(
        {
            _id: session._id
        },
        {
            $set: {
                status: "opened",
                openedAt: now,
                absentDecision:
                    "open_and_notify",
                absentDecisionAt: now,
                updatedAt: now
            }
        }
    );

    // ------------------------------------------
    // Build WhatsApp Message
    // ------------------------------------------

    const message =
        `مرحبًا ${session.patientName || "بك"} 👋\n\n` +
        `تم فتح جلسة المتابعة رقم ` +
        `${session.sessionNumber}.\n\n` +
        `يمكنك الآن الدخول إلى الجلسة من خلال الرابط التالي:\n\n` +
        `${patientLink}\n\n` +
        `شكرًا لتعاونك ❤️`;

    // ------------------------------------------
    // Send WhatsApp
    // ------------------------------------------

    let whatsappResult = null;

    try {

        const phone =
            session.patientPhone ||
            session.phone ||
            session.patient?.phone ||
            null;

        if (phone) {

            whatsappResult =
                await sendWhatsAppMessage(
                    phone,
                    message
                );

        } else {

            console.warn(
                "WhatsApp skipped: patient phone not found",
                {
                    patientId:
                        session.patientId,
                    sessionNumber:
                        session.sessionNumber
                }
            );
        }

    } catch (whatsappError) {

        console.error(
            "WhatsApp notification error:",
            whatsappError
        );

        whatsappResult = {
            success: false,
            error:
                whatsappError.message
        };
    }

    // ------------------------------------------
    // Resolve Pending Approval
    // ------------------------------------------

    await followUpsCollection.updateOne(
        {
            sessionId: session._id,
            status: "pending_approval",
            approvalStatus: "pending"
        },
        {
            $set: {
                approvalStatus: "approved",
                approvedAt: now,
                updatedAt: now
            }
        }
    );

    // ------------------------------------------
    // Final Response
    // ------------------------------------------

    return res.status(200).json({

        success: true,

        message:
            "Session opened and patient notification requested",

        sessionId: id,

        patientId:
            session.patientId,

        sessionNumber:
            session.sessionNumber,

        attendanceStatus:
            session.attendanceStatus,

        absentDecision:
            "open_and_notify",

        status:
            "opened",

        accessCode,

        patientLink,

        whatsapp:
            whatsappResult
    });
}

        } catch (error) {

            console.error(
                "Absent decision error:",
                error
            );

            return res.status(500).json({
                message:
                    "Server error"
            });

        }

    }
);
    // =========================================
    // تحديد جلسة المتابعة الحالية
    // =========================================

    router.get(
        "/patient/:patientId/current",
        async function (req, res) {
            try {
                const { patientId } = req.params;

                const patient =
                    await patientsCollection.findOne({
                        patientCode: patientId
                    });

                if (!patient) {
                    return res.status(404).json({
                        message: "Patient not found"
                    });
                }

                const sessions = await sessionsCollection
                    .find({
                        patientId: patientId
                    })
                    .sort({
                        sessionNumber: 1
                    })
                    .toArray();

                if (sessions.length === 0) {
                    return res.status(404).json({
                        message: "No sessions found for this patient"
                    });
                }

                let currentSession = sessions[0];

                for (const session of sessions) {
                    if (
                        session.attendanceStatus === "present" &&
                        session.status === "completed"
                    ) {
                        currentSession = session;
                    } else {
                        break;
                    }
                }

                const nextSession = sessions.find(
                    function (session) {
                        return (
                            session.sessionNumber ===
                            currentSession.sessionNumber + 1
                        );
                    }
                );

                res.status(200).json({
                    message:
                        "Current session retrieved successfully",

                    patientId: patientId,

                    currentSession: {
                        sessionNumber:
                            currentSession.sessionNumber,

                        status:
                            currentSession.status,

                        attendanceStatus:
                            currentSession.attendanceStatus
                    },

                    nextSession: nextSession
                        ? {
                              sessionNumber:
                                  nextSession.sessionNumber,

                              status:
                                  nextSession.status,

                              attendanceStatus:
                                  nextSession.attendanceStatus
                          }
                        : null
                });

            } catch (error) {
                console.error(
                    "Get current session error:",
                    error
                );

                res.status(500).json({
                    message: "Server error"
                });
            }
        }
    );

    // =========================================
    // فتح جلسة المتابعة
    // =========================================

    router.patch(
        "/:id/open",
        async function (req, res) {
            try {
                const { id } = req.params;

                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({
                        message: "Invalid session id"
                    });
                }

                const session =
                    await sessionsCollection.findOne({
                        _id: new ObjectId(id)
                    });

                if (!session) {
                    return res.status(404).json({
                        message: "Session not found"
                    });
                }

                if (session.status !== "scheduled") {
                    return res.status(400).json({
                        message:
                            "Session cannot be opened",
                        currentStatus:
                            session.status
                    });
                }
                const now = new Date();

const scheduledAt = new Date(session.scheduledAt);

if (
    !session.scheduledAt ||
    Number.isNaN(scheduledAt.getTime())
) {
    return res.status(400).json({
        message: "Session scheduledAt is invalid"
    });
}

if (now < scheduledAt) {
    return res.status(400).json({
        message: "Session cannot be opened before its scheduled time",
        scheduledAt: session.scheduledAt,
        currentTime: now
    });
}
                const previousSession =
                    await sessionsCollection.findOne({
                        patientId: session.patientId,
                        sessionNumber:
                            session.sessionNumber - 1
                    });

                if (
                    session.sessionNumber > 1 &&
                    !previousSession
                ) {
                    return res.status(400).json({
                        message:
                            "Previous session not found"
                    });
                }

                if (session.sessionNumber > 1) {
                    if (
                        previousSession.status !==
                            "completed" ||
                        previousSession.attendanceStatus !==
                            "present"
                    ) {
                        return res.status(400).json({
                            message:
                                "Previous session is not completed",

                            previousSessionNumber:
                                previousSession.sessionNumber,

                            previousStatus:
                                previousSession.status,

                            previousAttendanceStatus:
                                previousSession.attendanceStatus
                        });
                    }
                }

                await sessionsCollection.updateOne(
                    {
                        _id: new ObjectId(id)
                    },
                    {
                        $set: {
                            status: "opened",
                            openedAt: new Date(),
                            updatedAt: new Date()
                        }
                    }
                );

                res.status(200).json({
                    message:
                        "Session opened successfully",

                    sessionId: id,

                    patientId:
                        session.patientId,

                    sessionNumber:
                        session.sessionNumber,

                    status: "opened"
                });

            } catch (error) {
                console.error(
                    "Open session error:",
                    error
                );

                res.status(500).json({
                    message: "Server error"
                });
            }
        }
    );

    // =========================================
    // تحديد الجلسة المستحقة للمريض
    // =========================================

    router.get(
        "/patient/:patientId/next",
        async function (req, res) {
            try {
                const { patientId } = req.params;

                const patient =
                    await patientsCollection.findOne({
                        patientCode: patientId
                    });

                if (!patient) {
                    return res.status(404).json({
                        message: "Patient not found"
                    });
                }

                const sessions = await sessionsCollection
                    .find({
                        patientId: patientId
                    })
                    .sort({
                        sessionNumber: 1
                    })
                    .toArray();

                if (sessions.length === 0) {
                    return res.status(404).json({
                        message: "No sessions found"
                    });
                }

                const lastPresentSession = sessions
                    .filter(function (session) {
                        return (
                            session.attendanceStatus ===
                                "present" &&
                            session.status ===
                                "completed"
                        );
                    })
                    .sort(function (a, b) {
                        return (
                            b.sessionNumber -
                            a.sessionNumber
                        );
                    })[0];

                const nextSessionNumber =
                    lastPresentSession
                        ? lastPresentSession.sessionNumber + 1
                        : 1;

                const nextSession = sessions.find(
                    function (session) {
                        return (
                            session.sessionNumber ===
                            nextSessionNumber
                        );
                    }
                );

                if (!nextSession) {
                    return res.status(404).json({
                        message:
                            "Next session has not been created yet",

                        patientId: patientId,

                        nextSessionNumber:
                            nextSessionNumber
                    });
                }

                res.status(200).json({
                    message:
                        "Next session retrieved successfully",

                    patientId: patientId,

                    lastPresentSession:
                        lastPresentSession
                            ? {
                                  sessionNumber:
                                      lastPresentSession.sessionNumber,

                                  status:
                                      lastPresentSession.status,

                                  attendanceStatus:
                                      lastPresentSession.attendanceStatus
                              }
                            : null,

                    nextSession: {
                        sessionNumber:
                            nextSession.sessionNumber,

                        status:
                            nextSession.status,

                        attendanceStatus:
                            nextSession.attendanceStatus
                    }
                });

            } catch (error) {
                console.error(
                    "Get next session error:",
                    error
                );

                res.status(500).json({
                    message: "Server error"
                });
            }
        }
    );


// =========================================
// فتح الجلسة المستحقة للمريض
// =========================================

router.patch(
    "/patient/:patientId/open-next",
    async function (req, res) {
        try {
            const { patientId } = req.params;

            const patient = await patientsCollection.findOne({
                patientCode: patientId
            });

            if (!patient) {
                return res.status(404).json({
                    message: "Patient not found"
                });
            }

            const sessions = await sessionsCollection
                .find({
                    patientId: patientId
                })
                .sort({
                    sessionNumber: 1
                })
                .toArray();

            if (sessions.length === 0) {
                return res.status(404).json({
                    message: "No sessions found"
                });
            }

            const lastPresentSession = sessions
                .filter(function (session) {
                    return (
                        session.attendanceStatus === "present" &&
                        session.status === "completed"
                    );
                })
                .sort(function (a, b) {
                    return b.sessionNumber - a.sessionNumber;
                })[0];

            const nextSessionNumber =
                lastPresentSession
                    ? lastPresentSession.sessionNumber + 1
                    : 1;

            const nextSession = sessions.find(function (session) {
                return session.sessionNumber === nextSessionNumber;
            });

            if (!nextSession) {
                return res.status(404).json({
                    message: "Next session has not been created yet",
                    patientId: patientId,
                    nextSessionNumber: nextSessionNumber
                });
            }
const now = new Date();
const scheduledAt = new Date(nextSession.scheduledAt);

if (
    !nextSession.scheduledAt ||
    Number.isNaN(scheduledAt.getTime())
) {
    return res.status(400).json({
        message: "Next session scheduledAt is invalid"
    });
}

if (now < scheduledAt) {
    return res.status(400).json({
        message: "Next session cannot be opened before its scheduled time",
        scheduledAt: nextSession.scheduledAt,
        currentTime: now
    });
}
            await sessionsCollection.updateOne(
                {
                    _id: nextSession._id
                },
                {
                    $set: {
                        status: "opened",
                        attendanceStatus: "pending",
                        openedAt: new Date(),
                        updatedAt: new Date()
                    }
                }
            );

            return res.status(200).json({
                message: "Next session opened successfully",
                patientId: patientId,
                session: {
                    sessionId: nextSession._id,
                    sessionNumber: nextSession.sessionNumber,
                    status: "opened",
                    attendanceStatus: "pending"
                }
            });

        } catch (error) {
            console.error(
                "Open next session error:",
                error
            );

            return res.status(500).json({
                message: "Server error"
            });
        }
    }
);


// =========================================
// إنشاء بيانات المتابعة للجلسة
// =========================================

router.post(
    "/:id/follow-up",
    async function (req, res) {
        try {
            const { id } = req.params;
            const { ObjectId } = require("mongodb");

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: "Invalid session id"
                });
            }

            const session = await sessionsCollection.findOne({
                _id: new ObjectId(id)
            });

            if (!session) {
                return res.status(404).json({
                    message: "Session not found"
                });
            }

            if (session.status !== "opened") {
                return res.status(400).json({
                    message:
                        "Follow-up can only be created for an opened session",
                    currentStatus: session.status
                });
            }

            const existingFollowUp =
                await db.collection("followUps").findOne({
                    sessionId: session._id
                });

            if (existingFollowUp) {
                return res.status(409).json({
                    message: "Follow-up already exists",
                    followUpId: existingFollowUp._id
                });
            }

            const followUp = {
                sessionId: session._id,
                patientId: session.patientId,
                patientName: session.patientName,
                sessionNumber: session.sessionNumber,
                status: "not_started",
                currentQuestion: 1,
                answers: [],
                result: null,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await db
                .collection("followUps")
                .insertOne(followUp);

            return res.status(201).json({
                message: "Follow-up created successfully",
                followUp: {
                    _id: result.insertedId,
                    ...followUp
                }
            });

        } catch (error) {
            console.error(
                "Create follow-up error:",
                error
            );

            return res.status(500).json({
                message: "Server error"
            });
        }
    }
);


// =========================================
// التحقق من إمكانية فتح المتابعة
// =========================================

router.post(
    "/:id/follow-up/check",
    async function (req, res) {
        try {
            const { id } = req.params;
            const { ObjectId } = require("mongodb");

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: "Invalid session id"
                });
            }
       const followUp =
                await db.collection("followUps").findOne({
                    sessionId: sessionObjectId
                });

            if (!followUp) {
                return res.status(404).json({
                    message: "Follow-up not found"
                });
            }

            if (followUp.status !== "not_started") {
                return res.status(200).json({
                    message: "Follow-up already opened",
                    followUpId: followUp._id,
                    status: followUp.status
                });
            }

            await db
                .collection("followUps")
                .updateOne(
                    {
                        _id: followUp._id
                    },
                    {
                        $set: {
                            status: "opened",
                            openedAt: new Date(),
                            updatedAt: new Date()
                        }
                    }
                );

            return res.status(200).json({
                message: "Follow-up opened successfully",
                patientId: session.patientId,
                sessionNumber: session.sessionNumber,
                followUpId: followUp._id,
                status: "opened",
                sessionStartedAt: sessionStartTime,
                availableAt: availableAt
            });

        } catch (error) {
            console.error(
                "Check follow-up error:",
                error
            );

            return res.status(500).json({
                message: "Server error"
            });
        }
    }
);


// =========================================
// GET - جلب جلسة معينة
// =========================================


router.get(
    "/:id",
    async function (req, res) {
        try {
            const sessionId = req.params.id;

            const sessionObjectId = new ObjectId(sessionId);

            const session = await sessionsCollection.findOne({
                _id: sessionObjectId
            });

            if (!session) {
                return res.status(404).json({
                    message: "Session not found"
                });
            }

            if (session.status !== "completed") {
                return res.status(400).json({
                    message: "Session is not completed",
                    currentStatus: session.status
                });
            }

            if (!session.openedAt) {
                return res.status(400).json({
                    message: "Session start time not found"
                });
            }

            const sessionStartTime = new Date(session.openedAt);

            const now = new Date();

            const twentyFourHours =
                24 * 60 * 60 * 1000;

            const availableAt = new Date(
                sessionStartTime.getTime() + twentyFourHours
            );

            if (now < availableAt) {
                return res.status(200).json({
                    message: "Follow-up is not available yet",
                    patientId: session.patientId,
                    sessionNumber: session.sessionNumber,
                    sessionStartedAt: sessionStartTime,
                    availableAt: availableAt,
                    remainingMilliseconds:
                        availableAt.getTime() - now.getTime()
                });
            }

            return res.status(200).json({
                session
            });

        } catch (error) {
            console.error(
                "Get session error:",
                error
            );

            return res.status(500).json({
                message: "Server error"
            });
        }
    }
);




// =========================================
// فتح الجلسة
// =========================================

router.post(
    "/:sessionId/open",
    async function (req, res) {
        try {
            const { sessionId } = req.params;
            const { ObjectId } = require("mongodb");

            if (!ObjectId.isValid(sessionId)) {
                return res.status(400).json({
                    message: "Invalid session ID"
                });
            }

            const session = await sessionsCollection.findOne({
                _id: new ObjectId(sessionId)
            });

            if (!session) {
                return res.status(404).json({
                    message: "Session not found"
                });
            }

            if (session.status === "completed") {
                return res.status(400).json({
                    message: "Session is already completed"
                });
            }

            if (session.status === "opened") {
                return res.status(200).json({
                    message: "Session already opened",
                    sessionId,
                    status: "opened",
                    openedAt: session.openedAt
                });
            }

            const openedAt = new Date();

            await sessionsCollection.updateOne(
                {
                    _id: new ObjectId(sessionId)
                },
                {
                    $set: {
                        status: "opened",
                        openedAt: openedAt,
                        updatedAt: new Date()
                    }
                }
            );

            return res.status(200).json({
                message: "Session opened successfully",
                sessionId,
                patientId: session.patientId,
                sessionNumber: session.sessionNumber,
                status: "opened",
                openedAt
            });

        } catch (error) {
            console.error(
                "OPEN SESSION ERROR:",
                error
            );

            return res.status(500).json({
                message: "Failed to open session"
            });
        }
    }
);


// =========================================
// PATCH - فتح الجلسة
// =========================================

router.patch(
    "/:id/open",
    async function (req, res) {
        try {
            const { id } = req.params;

            const session = await sessionsCollection.findOne({
                _id: new ObjectId(id)
            });

            if (!session) {
                return res.status(404).json({
                    message: "Session not found"
                });
            }

            if (session.status === "completed") {
                return res.status(400).json({
                    message: "Session is already completed"
                });
            }

            if (session.status === "in_progress") {
                return res.status(400).json({
                    message: "Session is already open"
                });
            }

            const openedAt = new Date();

            await sessionsCollection.updateOne(
                {
                    _id: new ObjectId(id)
                },
                {
                    $set: {
                        status: "in_progress",
                        openedAt: openedAt
                    }
                }
            );

            const updatedSession =
                await sessionsCollection.findOne({
                    _id: new ObjectId(id)
                });

            return res.status(200).json({
                message: "Session opened successfully",
                session: updatedSession
            });

        } catch (error) {
            console.error(
                "Open session error:",
                error
            );

            return res.status(500).json({
                message: "Server error"
            });
        }
    }
);


// =========================================
// POST - حفظ إجابات الـSession
// =========================================

// router.post(
//     "/:sessionId/answers",
//     async function (req, res) {
//         try {
//             const { sessionId } = req.params;
//             const { answers } = req.body;

//             if (!ObjectId.isValid(sessionId)) {
//                 return res.status(400).json({
//                     message: "Invalid session ID"
//                 });
//             }

//             if (
//                 !Array.isArray(answers) ||
//                 answers.length === 0
//             ) {
//                 return res.status(400).json({
//                     message: "Answers are required"
//                 });
//             }

//             const session = await sessionsCollection.findOne({
//                 _id: new ObjectId(sessionId)
//             });

//             if (!session) {
//                 return res.status(404).json({
//                     message: "Session not found"
//                 });
//             }

//             if (session.status !== "opened") {
//                 return res.status(400).json({
//                     message: "Session is not opened",
//                     currentStatus: session.status
//                 });
//             }

//             const submittedAnswers = [];

//             for (const item of answers) {
//                 const question = session.questions.find(
//                     q => q.questionId === item.questionId
//                 );

//                 if (!question) {
//                     return res.status(400).json({
//                         message:
//                             "Question does not belong to this session",
//                         questionId: item.questionId
//                     });
//                 }

//                 const answer = question.answers.find(
//                     a => a.id === item.answerId
//                 );

//                 if (!answer) {
//                     return res.status(400).json({
//                         message:
//                             "Invalid answer for question",
//                         questionId: item.questionId,
//                         answerId: item.answerId
//                     });
//                 }

//                 submittedAnswers.push({
//                     questionId: question.questionId,
//                     answerId: answer.id,
//                     answerValue: answer.value,
//                     score: answer.score ?? null,
//                     riskLevel: answer.riskLevel ?? null
//                 });
//             }

//             await sessionsCollection.updateOne(
//                 {
//                     _id: new ObjectId(sessionId)
//                 },
//                 {
//                     $set: {
//                         answers: submittedAnswers,
//                         answersSubmittedAt: new Date()
//                     }
//                 }
//             );

//             return res.status(200).json({
//                 message: "Answers saved successfully",
//                 sessionId,
//                 answersCount: submittedAnswers.length,
//                 answers: submittedAnswers
//             });

//         } catch (error) {
//             console.error(
//                 "SAVE ANSWERS ERROR:",
//                 error
//             );

//             return res.status(500).json({
//                 message: "Failed to save answers"
//             });
//         }
//     }
// );


// =========================================
// POST - إنهاء الجلسة وتحليل الإجابات
// =========================================
// =========================================
// POST - إنهاء الجلسة وتحليل الإجابات
// =========================================

router.post(
    "/:sessionId/complete",
    async function (req, res) {

        try {

            const { sessionId } = req.params;

            if (!ObjectId.isValid(sessionId)) {
                return res.status(400).json({
                    message: "Invalid session ID"
                });
            }

            const session =
                await sessionsCollection.findOne({
                    _id: new ObjectId(sessionId)
                });

            if (!session) {
                return res.status(404).json({
                    message: "Session not found"
                });
            }

            if (session.status !== "opened") {
                return res.status(400).json({
                    message: "Session is not opened",
                    currentStatus: session.status
                });
            }

            // =========================================
            // Get Real Saved Answers
            // =========================================

            const savedAnswers =
                await answersCollection
                    .find({
                        sessionId: sessionId
                    })
                    .sort({
                        createdAt: 1
                    })
                    .toArray();

            if (savedAnswers.length === 0) {
                return res.status(400).json({
                    message: "No answers submitted"
                });
            }

            // =========================================
            // Build Session Answers With Metadata
            // =========================================

            const submittedAnswers = [];

            for (const savedAnswer of savedAnswers) {

                const question =
                    session.questions.find(function (q) {
                        return (
                            q.questionId ===
                            savedAnswer.questionId
                        );
                    });

                if (!question) {
                    continue;
                }

                let selectedAnswer = null;

                if (
                    savedAnswer.answerId &&
                    Array.isArray(question.answers)
                ) {

                    selectedAnswer =
                        question.answers.find(
                            function (answer) {
                                return (
                                    answer.id ===
                                    savedAnswer.answerId
                                );
                            }
                        );

                }

                submittedAnswers.push({

    questionId:
        savedAnswer.questionId,

    trackKey:
        question.trackKey || null,

    type:
        question.type || null,

    answerId:
        savedAnswer.answerId || null,

    answerText:
        savedAnswer.answerText ||
        selectedAnswer?.text ||
        null,

    answerValue:
        selectedAnswer?.value ||
        null,

    score:
        selectedAnswer?.score ??
        null,

    riskLevel:
        selectedAnswer?.riskLevel ??
        null

});
            }

            // =========================================
            // Calculate Session Score
            // =========================================

            const totalScore =
                submittedAnswers.reduce(
                    function (total, answer) {

                        return (
                            total +
                            (
                                Number(
                                    answer.score
                                ) || 0
                            )
                        );

                    },
                    0
                );

            // =========================================
            // Calculate Session Risk
            // =========================================

            const riskLevels =
                submittedAnswers
                    .map(function (answer) {
                        return answer.riskLevel;
                    })
                    .filter(Boolean);
// ==========================================
// Build Risk Details
// الأسئلة والإجابات التي تسببت في الخطورة
// ==========================================

// ==========================================
// Build Risk Details
// ==========================================

const riskDetails = submittedAnswers
    .filter(function (answer) {
        return Boolean(answer.riskLevel);
    })
    .map(function (answer) {

        const question =
            session.questions.find(function (q) {

                return (
                    q.questionId ===
                    answer.questionId
                );

            });


        const selectedAnswer =
            question?.answers?.find(function (item) {

                return (
                    item.id ===
                    answer.answerId
                );

            });


        return {

            questionId:
                answer.questionId,

            trackKey:
                answer.trackKey || null,

            questionText:
                question?.text || null,

            answerId:
                answer.answerId || null,

            answerText:
                answer.answerText ||
                selectedAnswer?.text ||
                null,

            answerValue:
                answer.answerValue ||
                selectedAnswer?.value ||
                null,

            riskLevel:
                answer.riskLevel

        };

    });
            let riskLevel = "none";

            if (riskLevels.includes("high")) {

                riskLevel = "high";

            } else if (
                riskLevels.includes("medium")
            ) {

                riskLevel = "medium";

            } else if (
                riskLevels.includes("low")
            ) {
console.log(
    "================================="
);

console.log(
    "COMPLETING SESSION"
);

console.log(
    "Session ID:",
    sessionId
);

console.log(
    "Patient ID:",
    session.patientId
);

console.log(
    "Session Number:",
    session.sessionNumber
);

console.log(
    "Current Status:",
    session.status
);

console.log(
    "================================="
);
                riskLevel = "low";
            }

            // =========================================
            // Complete Session
            // =========================================

            const completedAt = new Date();

            await sessionsCollection.updateOne(

                {
                    _id: new ObjectId(sessionId)
                },

                {
                    $set: {
    status: "completed",
    attendanceStatus: "present",
    completedAt,
    answers: submittedAnswers,
    assessmentResult: {

    totalScore,

    riskLevel,

    answersCount:
        submittedAnswers.length,

    riskDetails

},
    updatedAt: new Date()
}
                }
            );
console.log(
    "SESSION COMPLETED SUCCESSFULLY:"
);

console.log({
    sessionId: sessionId,
    patientId: session.patientId,
    sessionNumber: session.sessionNumber
});
            // =========================================
            // Response
            // =========================================

            return res.status(200).json({

                message:
                    "Session completed successfully",

                sessionId,

                status: "completed",

                completedAt,

                assessmentResult: {

    totalScore,

    riskLevel,

    answersCount:
        submittedAnswers.length,

    riskDetails

}
            });

        } catch (error) {

            console.error(
                "COMPLETE SESSION ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to complete session"
            });
        }
    }
);

// ==========================================
// Complete Session Comparison
// تسجيل أن المريض أنهى/غادر المقارنة
// ==========================================
router.post(
    "/:sessionId/comparison/complete",
    async function (req, res) {
        try {
            const { sessionId } = req.params;

            if (!ObjectId.isValid(sessionId)) {
                return res.status(400).json({
                    message: "Invalid session ID"
                });
            }

            const session =
                await sessionsCollection.findOne({
                    _id: new ObjectId(sessionId)
                });

            if (!session) {
                return res.status(404).json({
                    message: "Session not found"
                });
            }

            // المقارنة متاحة فقط بعد إكمال الجلسة
            if (session.status !== "completed") {
                return res.status(400).json({
                    message: "Session is not completed",
                    currentStatus: session.status
                });
            }

            const comparisonCompletedAt = new Date();

            await sessionsCollection.updateOne(
                {
                    _id: new ObjectId(sessionId)
                },
                {
                    $set: {
                        comparisonStatus: "completed",
                        comparisonCompletedAt,
                        updatedAt: new Date()
                    }
                }
            );

            console.log(
                "COMPARISON COMPLETED:",
                {
                    sessionId,
                    patientId: session.patientId,
                    sessionNumber: session.sessionNumber
                }
            );

            return res.status(200).json({
                message: "Comparison completed successfully",
                sessionId,
                comparisonStatus: "completed",
                comparisonCompletedAt
            });

        } catch (error) {
            console.error(
                "COMPLETE COMPARISON ERROR:",
                error
            );

            return res.status(500).json({
                message: "Failed to complete comparison"
            });
        }
    }
);
// =========================================
// Compare Previous Session With Current Session
// =========================================

// =====================================================
// Normalize Session Answers
// نجيب آخر إجابة لكل سؤال + trackKey من session.questions
// =====================================================


// =====================================================
// Compare Questions
// المقارنة الأساسية المعتمدة على trackKey
// =====================================================
// =====================================================
// Normalize Session Answers
// نجيب آخر إجابة لكل سؤال + trackKey من session.questions
// =====================================================
// =====================================================
// Normalize Session Answers
// تجهيز إجابات الجلسة للمقارنة
// =====================================================

function normalizeSessionAnswers(session) {

    const answers = Array.isArray(session?.answers)
        ? session.answers
        : [];

    const questions = Array.isArray(session?.questions)
        ? session.questions
        : [];

    // -----------------------------------------
    // Question Map
    // -----------------------------------------

    const questionMap = new Map();

    for (const question of questions) {

        if (question?.questionId) {

            questionMap.set(
                question.questionId,
                question
            );
        }
    }

    // -----------------------------------------
    // آخر إجابة لكل سؤال
    // -----------------------------------------

    const answerMap = new Map();

    for (const answer of answers) {

        if (!answer?.questionId) {
            continue;
        }

        answerMap.set(
            answer.questionId,
            answer
        );
    }

    // -----------------------------------------
    // Normalize
    // -----------------------------------------

    return Array.from(answerMap.values()).map(function (answer) {

        const question =
            questionMap.get(answer.questionId);

        return {

            questionId:
                answer.questionId,

            trackKey:
                answer.trackKey ??
                question?.trackKey ??
                null,

            type:
                answer.type ??
                question?.type ??
                null,

            answerId:
                answer.answerId ??
                null,

            // -----------------------------------------
            // الاختيار البرمجي
            // -----------------------------------------

            answerValue:
                answer.answerValue ??
                answer.value ??
                null,

            // -----------------------------------------
            // النص الذي يمكن عرضه للمستخدم
            // -----------------------------------------

            answerText:
                answer.answerText ??
                answer.valueText ??
                null,

            // -----------------------------------------
            // الدرجة
            // -----------------------------------------

            score:
                answer.score ??
                null,

            // -----------------------------------------
            // مستوى الخطورة
            // -----------------------------------------

            riskLevel:
                answer.riskLevel ??
                null
        };
    });
}


// =====================================================
// Determine Trend From Follow-Up Answer
// تفسير إجابة المتابعة نفسها
// =====================================================




// =====================================================
// Compare All Sessions
// المقارنة تعتمد على نقاط التحسن وليس فقط الجلسة السابقة
//
// مثال:
//
// Session 1
//    ↓ improvement
// Session 2
//    ↓ improvement
// Session 5
//    ↓ improvement
// Session 7
//
// وبالتالي:
// 1 → 2
// 2 → 5
// 5 → 7
// =====================================================

function compareAllSessions(sessions) {

    // =====================================================
    // 1. الجلسات المكتملة فقط
    // =====================================================

    const completedSessions = sessions
        .filter(function (session) {
            return (
                session.status === "completed" &&
                Array.isArray(session.answers)
            );
        })
        .sort(function (a, b) {
            return a.sessionNumber - b.sessionNumber;
        });


    // =====================================================
    // 2. لا توجد جلسات كافية
    // =====================================================

    if (completedSessions.length < 2) {
        return {
            status: "not_enough_data",
            message: "لا توجد جلسات مكتملة كافية للمقارنة."
        };
    }


    // =====================================================
    // 3. جلسات المقارنة / Checkpoints
    //
    // هذه ليست جلسات المقارنة السابقة بالضرورة.
    // هي فقط الجلسات التي نريد عندها فحص:
    // هل حدث تحسن جديد منذ آخر نقطة تحسن؟
    // =====================================================

    const comparisonSessions = new Set([
        3,
        5,
        8,
        10
    ]);


    // =====================================================
    // 4. Risk Order
    // =====================================================

    const riskOrder = {
        none: 0,
        low: 1,
        medium: 2,
        high: 3
    };


    // =====================================================
    // 5. المقارنات المباشرة
    //
    // نحتفظ بها كما هي لأننا ما زلنا نحتاجها
    // لاكتشاف التحسن الحقيقي بين كل جلستين متتاليتين.
    // =====================================================

    const directComparisons = [];


    // =====================================================
    // 6. مقارنة كل جلسة بالجلسة السابقة مباشرة
    //
    // مثال:
    //
    // S1 → S2
    // S2 → S3
    // S3 → S4
    // S4 → S5
    //
    // هذه المقارنات داخلية لاستخراج Events التحسن.
    // =====================================================

    for (
        let i = 1;
        i < completedSessions.length;
        i++
    ) {

        const previousSession =
            completedSessions[i - 1];

        const currentSession =
            completedSessions[i];


        const previousAnswers =
            normalizeSessionAnswers(
                previousSession
            );

        const currentAnswers =
            normalizeSessionAnswers(
                currentSession
            );


        // =================================================
        // Map للجلسة السابقة
        // =================================================

        const previousMap = new Map();

        for (const answer of previousAnswers) {

            if (!answer.trackKey) {
                continue;
            }

            previousMap.set(
                answer.trackKey,
                answer
            );
        }


        // =================================================
        // مقارنة إجابات الجلسة الحالية
        // =================================================

        for (const currentAnswer of currentAnswers) {

            const trackKey =
                currentAnswer.trackKey;


            // =============================================
            // لا يوجد Track Key
            // =============================================

            if (!trackKey) {

                directComparisons.push({

                    trackKey: null,

                    fromSession:
                        previousSession.sessionNumber,

                    toSession:
                        currentSession.sessionNumber,

                    previous: null,

                    current: {
                        questionId:
                            currentAnswer.questionId,

                        answerId:
                            currentAnswer.answerId,

                        answerValue:
                            currentAnswer.answerValue,

                        answerText:
                            currentAnswer.answerText,

                        score:
                            currentAnswer.score,

                        riskLevel:
                            currentAnswer.riskLevel
                    },

                    scoreDifference: null,

                    trend: "not_comparable"
                });

                continue;
            }


            const previousAnswer =
                previousMap.get(trackKey);


            // =============================================
            // Track جديد
            // =============================================

            if (!previousAnswer) {

                directComparisons.push({

                    trackKey,

                    fromSession:
                        previousSession.sessionNumber,

                    toSession:
                        currentSession.sessionNumber,

                    previous: null,

                    current: {
                        questionId:
                            currentAnswer.questionId,

                        answerId:
                            currentAnswer.answerId,

                        answerValue:
                            currentAnswer.answerValue,

                        answerText:
                            currentAnswer.answerText,

                        score:
                            currentAnswer.score,

                        riskLevel:
                            currentAnswer.riskLevel
                    },

                    scoreDifference: null,

                    trend: "new_question"
                });

                continue;
            }


            // =============================================
            // تحديد الاتجاه
            // =============================================

            let trend =
                determineFollowUpTrend(
                    trackKey,
                    currentAnswer.answerValue
                );


            // =============================================
            // Risk fallback
            // =============================================

            if (
                trend === "not_comparable" &&
                previousAnswer.riskLevel &&
                currentAnswer.riskLevel
            ) {

                const previousRisk =
                    riskOrder[
                        previousAnswer.riskLevel
                    ];

                const currentRisk =
                    riskOrder[
                        currentAnswer.riskLevel
                    ];


                if (
                    previousRisk !== undefined &&
                    currentRisk !== undefined
                ) {

                    if (
                        currentRisk <
                        previousRisk
                    ) {

                        trend = "improving";

                    }
                    else if (
                        currentRisk >
                        previousRisk
                    ) {

                        trend = "worsening";

                    }
                    else {

                        trend = "stable";
                    }
                }
            }


            // =============================================
            // فرق الدرجة
            // =============================================

            let scoreDifference = null;

            if (
                typeof previousAnswer.score === "number" &&
                typeof currentAnswer.score === "number"
            ) {

                scoreDifference =
                    currentAnswer.score -
                    previousAnswer.score;
            }


            // =============================================
            // حفظ المقارنة المباشرة
            // =============================================

            directComparisons.push({

                trackKey,

                fromSession:
                    previousSession.sessionNumber,

                toSession:
                    currentSession.sessionNumber,

                previous: {
    sessionNumber:
        previousSession.sessionNumber,
    questionId:
        previousAnswer.questionId,
    answerId:
        previousAnswer.answerId,
    answerValue:
        previousAnswer.answerValue,
    answerText:
        previousAnswer.answerText,
    score:
        previousAnswer.score,
    riskLevel:
        previousAnswer.riskLevel
},

current: {
    sessionNumber:
        currentSession.sessionNumber,
    questionId:
        currentAnswer.questionId,
    answerId:
        currentAnswer.answerId,
    answerValue:
        currentAnswer.answerValue,
    answerText:
        currentAnswer.answerText,
    score:
        currentAnswer.score,
    riskLevel:
        currentAnswer.riskLevel
},

                scoreDifference,

                trend
            });
        }
    }


// =====================================================
// 7. اكتشاف كل Events للحالة
//
// كل Track يتم تتبعه بشكل مستقل.
//
// مثال:
//
// S1 High
// S2 Medium  → improving
// S3 High    → worsening
// S4 Medium  → improving
//
// النتيجة:
//
// S1 → S2 = improving
// S2 → S3 = worsening
// S3 → S4 = improving
//
// لا نحذف التدهور عندما يحدث تحسن بعده.
// =====================================================

// =====================================================
// 7. استخراج كل Events للحالة
//
// directComparisons تحتوي بالفعل على المقارنة الصحيحة
// بين كل جلستين متتاليتين.
//
// S1 → S2
// S2 → S3
// S3 → S4
// S4 → S5
//
// لذلك لا نعيد المقارنة مرة ثانية.
// =====================================================

const trendEvents = [];

const improvementEvents = [];

for (const comparison of directComparisons) {

    // =============================================
    // لا نريد المقارنات غير القابلة للمقارنة
    // ولا الأسئلة الجديدة داخل Trend Events
    // =============================================

    if (
        comparison.trend !== "improving" &&
        comparison.trend !== "worsening" &&
        comparison.trend !== "stable"
    ) {
        continue;
    }

    const event = {

        trackKey:
            comparison.trackKey,

        fromSession:
            comparison.fromSession,

        toSession:
            comparison.toSession,

        fromAnswer: {
            questionId:
                comparison.previous?.questionId ??
                null,

            answerId:
                comparison.previous?.answerId ??
                null,

            answerValue:
                comparison.previous?.answerValue ??
                null,

            answerText:
                comparison.previous?.answerText ??
                null,

            score:
                comparison.previous?.score ??
                null,

            riskLevel:
                comparison.previous?.riskLevel ??
                null
        },

        toAnswer: {
            questionId:
                comparison.current?.questionId ??
                null,

            answerId:
                comparison.current?.answerId ??
                null,

            answerValue:
                comparison.current?.answerValue ??
                null,

            answerText:
                comparison.current?.answerText ??
                null,

            score:
                comparison.current?.score ??
                null,

            riskLevel:
                comparison.current?.riskLevel ??
                null
        },

        scoreDifference:
            comparison.scoreDifference,

        trend:
            comparison.trend
    };

    trendEvents.push(event);

    if (event.trend === "improving") {
        improvementEvents.push(event);
    }
}

// =====================================================
// 8. تقسيم الأحداث حسب النوع
// =====================================================

const worseningEvents =
    trendEvents.filter(
        function (event) {

            return (
                event.trend ===
                "worsening"
            );
        }
    );

// =====================================================
// 8.1 أحداث التحسن التي يراها المريض
//
// المريض لا يرى أي تحسن تم إلغاؤه بتدهور لاحق.
//
// مثال:
//
// S1 High
// S2 Medium  → improvement
// S3 High    → worsening
// S4 Medium  → improvement
//
// الدكتور:
// S1 → S2 improvement
// S2 → S3 worsening
// S3 → S4 improvement
//
// المريض:
// S3 → S4 فقط
// =====================================================

const patientImprovementEvents = [];

// آخر جلسة حدث فيها تدهور لكل Track
const lastWorseningByTrack = new Map();

for (const event of worseningEvents) {
    if (!event.trackKey) {
        continue;
    }

    lastWorseningByTrack.set(
        event.trackKey,
        event.toSession
    );
}

// نسمح للمريض فقط بالتحسينات التي حدثت
// بعد آخر تدهور لنفس الـTrack
for (const improvement of improvementEvents) {

    if (!improvement.trackKey) {
        continue;
    }

    const lastWorseningSession =
        lastWorseningByTrack.get(
            improvement.trackKey
        );

    // لم يحدث تدهور لهذا Track
    // إذن التحسن ما زال صالحًا للعرض للمريض
    if (lastWorseningSession === undefined) {
        patientImprovementEvents.push(
            improvement
        );

        continue;
    }

    // حدث تدهور سابق،
    // لذلك لا نعرض إلا التحسن الذي جاء بعده
    if (
        improvement.toSession >
        lastWorseningSession
    ) {
        patientImprovementEvents.push(
            improvement
        );
    }
}
const stableEvents =
    trendEvents.filter(
        function (event) {

            return (
                event.trend ===
                "stable"
            );
        }
    );


    const improvementStages = [];


    for (const improvement of improvementEvents) {

        let stage =
            improvementStages.find(
                function (item) {

                    return (
                        item.fromSession ===
                            improvement.fromSession &&
                        item.toSession ===
                            improvement.toSession
                    );
                }
            );


        // =================================================
        // إنشاء Stage جديدة
        // =================================================

        if (!stage) {

            const fromSession =
                completedSessions.find(
                    function (session) {

                        return (
                            session.sessionNumber ===
                            improvement.fromSession
                        );
                    }
                );


            const toSession =
                completedSessions.find(
                    function (session) {

                        return (
                            session.sessionNumber ===
                            improvement.toSession
                        );
                    }
                );


            stage = {

                fromSession:
                    improvement.fromSession,

                toSession:
                    improvement.toSession,

                fromSessionName:
                    fromSession?.name ||
                    fromSession?.title ||
                    `الجلسة ${improvement.fromSession}`,

                toSessionName:
                    toSession?.name ||
                    toSession?.title ||
                    `الجلسة ${improvement.toSession}`,

                improvements: []
            };


            improvementStages.push(
                stage
            );
        }


        // =================================================
        // إضافة التحسن داخل الـ Stage
        // =================================================

        stage.improvements.push({

            trackKey:
                improvement.trackKey,

            fromAnswer:
                improvement.fromAnswer?.answerText ??
                improvement.fromAnswer?.answerValue ??
                null,

            fromAnswerValue:
                improvement.fromAnswer?.answerValue ??
                null,

            fromAnswerId:
                improvement.fromAnswer?.answerId ??
                null,

            fromRiskLevel:
                improvement.fromAnswer?.riskLevel ??
                null,

            toAnswer:
                improvement.toAnswer?.answerText ??
                improvement.toAnswer?.answerValue ??
                null,

            toAnswerValue:
                improvement.toAnswer?.answerValue ??
                null,

            toAnswerId:
                improvement.toAnswer?.answerId ??
                null,

            toRiskLevel:
                improvement.toAnswer?.riskLevel ??
                null,

            scoreDifference:
                improvement.scoreDifference,

            trend:
                improvement.trend
        });
    }


    // =====================================================
    // 9. ترتيب الـ Stages
    // =====================================================

    improvementStages.sort(
        function (a, b) {

            return (
                a.fromSession -
                b.fromSession
            );
        }
    );

// =====================================================
// 9.1 تقسيم أحداث التدهور إلى Stages
//
// هذه البيانات للدكتور فقط.
// =====================================================

const worseningStages = [];

for (const worsening of worseningEvents) {

    let stage =
        worseningStages.find(function (item) {
            return (
                item.fromSession ===
                    worsening.fromSession &&
                item.toSession ===
                    worsening.toSession
            );
        });

    // =================================================
    // إنشاء Stage جديدة
    // =================================================

    if (!stage) {

        const fromSession =
            completedSessions.find(
                function (session) {
                    return (
                        session.sessionNumber ===
                        worsening.fromSession
                    );
                }
            );

        const toSession =
            completedSessions.find(
                function (session) {
                    return (
                        session.sessionNumber ===
                        worsening.toSession
                    );
                }
            );

        stage = {
            fromSession:
                worsening.fromSession,

            toSession:
                worsening.toSession,

            fromSessionName:
                fromSession?.name ||
                fromSession?.title ||
                `الجلسة ${worsening.fromSession}`,

            toSessionName:
                toSession?.name ||
                toSession?.title ||
                `الجلسة ${worsening.toSession}`,

            worsenings: []
        };

        worseningStages.push(stage);
    }

    // =================================================
    // إضافة التدهور داخل الـStage
    // =================================================

    stage.worsenings.push({

        trackKey:
            worsening.trackKey,

        fromAnswer:
            worsening.fromAnswer?.answerText ??
            worsening.fromAnswer?.answerValue ??
            null,

        fromAnswerValue:
            worsening.fromAnswer?.answerValue ??
            null,

        fromAnswerId:
            worsening.fromAnswer?.answerId ??
            null,

        fromRiskLevel:
            worsening.fromAnswer?.riskLevel ??
            null,

        toAnswer:
            worsening.toAnswer?.answerText ??
            worsening.toAnswer?.answerValue ??
            null,

        toAnswerValue:
            worsening.toAnswer?.answerValue ??
            null,

        toAnswerId:
            worsening.toAnswer?.answerId ??
            null,

        toRiskLevel:
            worsening.toAnswer?.riskLevel ??
            null,

        scoreDifference:
            worsening.scoreDifference,

        trend:
            worsening.trend
    });
}

worseningStages.sort(
    function (a, b) {
        return (
            a.fromSession -
            b.fromSession
        );
    }
);
    // =====================================================
    // 10. تحديد الـ Checkpoints التي حدث عندها
    //     Improvement Event
    //
    // مهم:
    //
    // الـ comparisonSessions هي نقاط فحص فقط.
    //
    // لو حصل Improvement في S2:
    //
    // S2 ليست Checkpoint
    //
    // لكن عند S3 نستطيع معرفة أن آخر Improvement
    // حدث في S2.
    //
    // وعند S5، لو حدث Improvement جديد:
    //
    // S2 → S5
    //
    // =====================================================

    const checkpointResults = [];


    for (const sessionNumber of comparisonSessions) {

        const eventsAtCheckpoint =
            improvementEvents.filter(
                function (event) {

                    return (
                        event.toSession ===
                        sessionNumber
                    );
                }
            );


        const eventsBeforeOrAtCheckpoint =
            improvementEvents.filter(
                function (event) {

                    return (
                        event.toSession <=
                        sessionNumber
                    );
                }
            );


        checkpointResults.push({

            sessionNumber,

            isCheckpoint: true,

            hasNewImprovement:
                eventsAtCheckpoint.length > 0,

            newImprovements:
                eventsAtCheckpoint,

            improvementsSoFar:
                eventsBeforeOrAtCheckpoint
        });
    }


    // =====================================================
    // 11. Summary
    //
    // الـ Summary هنا أصبح مبنيًا على
    // Improvement Events الحقيقية.
    // =====================================================



    // =====================================================
    // 12. النتيجة النهائية
    // =====================================================

    return {

    status: "compared",

    firstSession:
        completedSessions[0].sessionNumber,

    currentSession:
        completedSessions[
            completedSessions.length - 1
        ].sessionNumber,

    sessionsCompared:
        completedSessions.length,


    // =====================================================
    // 👨‍⚕️ DOCTOR VIEW
    //
    // الدكتور يشوف الرحلة كاملة
    // =====================================================

    doctor: {

        // كل المقارنات الخام
        directComparisons,

        // كل الأحداث الزمنية
        trendEvents,

        // كل التحسينات
        improvementEvents,

        improvementStages,

        // كل التدهورات
        worseningEvents,

        worseningStages,

        // الثبات
        stableEvents,

        // Checkpoints
        comparisonSessions:
            Array.from(
                comparisonSessions
            ),

        checkpointResults,

        summary: {

            improved:
                improvementEvents.length,

            worsened:
                worseningEvents.length,

            stable:
                stableEvents.length,

            notComparable:
                directComparisons.filter(
                    function (item) {
                        return (
                            item.trend ===
                            "not_comparable"
                        );
                    }
                ).length,

            newQuestions:
                directComparisons.filter(
                    function (item) {
                        return (
                            item.trend ===
                            "new_question"
                        );
                    }
                ).length
        }
    },


    // =====================================================
    // 👤 PATIENT VIEW
    //
    // المريض لا يرى التدهور.
    //
    // ولا يرى تحسنًا قديمًا تم إلغاؤه بتدهور لاحق.
    // =====================================================

    patient: {

        improvementEvents:
            patientImprovementEvents,

        summary: {

            improvements:
                patientImprovementEvents.length
        }
    }
};
}


function compareScores(sessions) {

    const completedSessions = sessions
        .filter(function (session) {
            return (
                session.status === "completed" &&
                Array.isArray(session.answers)
            );
        })
        .sort(function (a, b) {
            return a.sessionNumber - b.sessionNumber;
        });

    if (completedSessions.length < 2) {
        return {
            status: "not_enough_data",
            message:
                "لا توجد جلستان مكتملتان كافيتان للمقارنة."
        };
    }

    const previousSession =
        completedSessions[completedSessions.length - 2];

    const currentSession =
        completedSessions[completedSessions.length - 1];


    /*
     * تحويل إجابات الجلسة إلى Map
     * المفتاح = trackKey
     */
    function buildTrackMap(session) {

        const map = new Map();

        session.answers.forEach(function (answer) {

            if (
                !answer.trackKey ||
                typeof answer.score !== "number"
            ) {
                return;
            }

            map.set(answer.trackKey, {
                trackKey: answer.trackKey,
                questionId: answer.questionId,
                score: answer.score,
                answerValue: answer.answerValue,
                answerText: answer.answerText,
                riskLevel: answer.riskLevel
            });

        });

        return map;
    }


    const previousTracks =
        buildTrackMap(previousSession);

    const currentTracks =
        buildTrackMap(currentSession);


    /*
     * المقارنة تتم فقط بين الـtracks
     * الموجودة في الجلستين.
     */
    const trackComparisons = [];


    currentTracks.forEach(function (current) {

        const previous =
            previousTracks.get(current.trackKey);

        if (!previous) {
            return;
        }


        const scoreDifference =
            current.score - previous.score;


        let trend = "stable";


        if (scoreDifference < 0) {
            trend = "improving";
        }
        else if (scoreDifference > 0) {
            trend = "worsening";
        }


        trackComparisons.push({

            trackKey: current.trackKey,

            previous: {
                sessionNumber:
                    previousSession.sessionNumber,

                questionId:
                    previous.questionId,

                score:
                    previous.score,

                answerValue:
                    previous.answerValue,

                answerText:
                    previous.answerText,

                riskLevel:
                    previous.riskLevel
            },

            current: {
                sessionNumber:
                    currentSession.sessionNumber,

                questionId:
                    current.questionId,

                score:
                    current.score,

                answerValue:
                    current.answerValue,

                answerText:
                    current.answerText,

                riskLevel:
                    current.riskLevel
            },

            scoreDifference,

            trend

        });

    });


    /*
     * لا توجد Tracks مشتركة قابلة للمقارنة
     */
    if (trackComparisons.length === 0) {

        return {

            status: "not_comparable",

            previousSession:
                previousSession.sessionNumber,

            currentSession:
                currentSession.sessionNumber,

            comparableTracks: 0,

            message:
                "لا توجد أسئلة مشتركة قابلة للمقارنة بين الجلستين."

        };

    }


    /*
     * تحويل score من:
     *
     * 1 = أفضل
     * 4 = أسوأ
     *
     * إلى Severity:
     *
     * 0 = أفضل
     * 100 = أسوأ
     */
    function normalizeScore(score) {

        const minScore = 1;
        const maxScore = 4;

        return (
            ((score - minScore) /
                (maxScore - minScore)) *
            100
        );

    }


    const previousSeverityValues =
        trackComparisons.map(function (item) {

            return normalizeScore(
                item.previous.score
            );

        });


    const currentSeverityValues =
        trackComparisons.map(function (item) {

            return normalizeScore(
                item.current.score
            );

        });


    const previousSeverity =
        previousSeverityValues.reduce(
            function (sum, value) {
                return sum + value;
            },
            0
        ) /
        previousSeverityValues.length;


    const currentSeverity =
        currentSeverityValues.reduce(
            function (sum, value) {
                return sum + value;
            },
            0
        ) /
        currentSeverityValues.length;


    const severityDifference =
        currentSeverity - previousSeverity;


    let trend = "stable";


    if (currentSeverity < previousSeverity) {
        trend = "improving";
    }
    else if (currentSeverity > previousSeverity) {
        trend = "worsening";
    }


    /*
     * نسبة التحسن:
     *
     * (السابق - الحالي) / السابق × 100
     *
     * وتظهر فقط عندما يكون هناك تحسن فعلي.
     */
let totalImprovement = 0;
let totalWorsening = 0;

trackComparisons.forEach(function (item) {
    const difference = item.scoreDifference;

    if (difference < 0) {
        totalImprovement += Math.abs(difference);
    }
    else if (difference > 0) {
        totalWorsening += difference;
    }
});

let improvementPercentage = 0;

const totalMovement =
    totalImprovement + totalWorsening;

if (totalMovement > 0) {
    improvementPercentage =
        (totalImprovement / totalMovement) * 100;
}

improvementPercentage =
    Math.round(improvementPercentage * 100) / 100;


    /*
     * فصل النتائج للدكتور
     */
    const improving =
        trackComparisons.filter(function (item) {
            return item.trend === "improving";
        });


    const stable =
        trackComparisons.filter(function (item) {
            return item.trend === "stable";
        });


    const worsening =
        trackComparisons.filter(function (item) {
            return item.trend === "worsening";
        });


    /*
     * Patient:
     * نرسل له التحسن فقط.
     */
    const patientImprovement =
        trackComparisons.filter(function (item) {
            return item.trend === "improving";
        });


    return {

        status: "compared",

        previousSession:
            previousSession.sessionNumber,

        currentSession:
            currentSession.sessionNumber,


        comparableTracks:
            trackComparisons.length,


        doctor: {

            trend,

            previousSeverity:
                Math.round(
                    previousSeverity * 100
                ) / 100,

            currentSeverity:
                Math.round(
                    currentSeverity * 100
                ) / 100,

            severityDifference:
                Math.round(
                    severityDifference * 100
                ) / 100,

            improvementPercentage,

            improving,

            stable,

            worsening,

            trackComparisons

        },


        patient: {

            hasImprovement:
                patientImprovement.length > 0,

            improvementPercentage,

            improving:
                patientImprovement

        }

    };

}



function analyzeRiskPattern(sessions) {
    const completedSessions = sessions
        .filter(function (session) {
            return (
                session.status === "completed" &&
                session.assessmentResult
            );
        })
        .sort(function (a, b) {
            return a.sessionNumber - b.sessionNumber;
        });

    if (completedSessions.length === 0) {
        return {
            currentRisk: null,
            riskPattern: "no_data",
            trend: "no_data",
            alertLevel: "none",
            message: "لا توجد جلسات مكتملة حتى الآن."
        };
    }

    const currentSession =
        completedSessions[completedSessions.length - 1];

    const currentRisk =
        currentSession.assessmentResult?.riskLevel ?? null;

    const riskHistory = completedSessions.map(function (session) {
        return {
            sessionNumber: session.sessionNumber,
            riskLevel:
                session.assessmentResult?.riskLevel ?? null
        };
    });

    let trend = "first_session";

    if (completedSessions.length >= 2) {
        const previousSession =
            completedSessions[completedSessions.length - 2];

        const previousRisk =
            previousSession.assessmentResult?.riskLevel ?? null;

        const riskOrder = {
            low: 1,
            medium: 2,
            high: 3,
            none: 0
        };

        if (
            riskOrder[currentRisk] !== undefined &&
            riskOrder[previousRisk] !== undefined
        ) {
            if (
                riskOrder[currentRisk] <
                riskOrder[previousRisk]
            ) {
                trend = "improving";
            } else if (
                riskOrder[currentRisk] >
                riskOrder[previousRisk]
            ) {
                trend = "worsening";
            } else {
                trend = "stable";
            }
        }
    }

    let alertLevel = "none";
    let message = "لا توجد مؤشرات خطر واضحة.";

    if (currentRisk === "high") {
        alertLevel = "high";
        message = "يوجد مستوى خطر مرتفع يحتاج إلى متابعة.";
    } else if (currentRisk === "medium") {
        alertLevel = "medium";
        message = "يوجد مستوى خطر متوسط يحتاج إلى متابعة.";
    } else if (currentRisk === "low") {
        alertLevel = "low";
        message = "مستوى الخطر منخفض حاليًا.";
    }

    let trendMessage = "";

    if (trend === "improving") {
        trendMessage = "يوجد تحسن مقارنة بالجلسة السابقة.";
    } else if (trend === "worsening") {
        trendMessage = "يوجد تدهور مقارنة بالجلسة السابقة.";
    } else if (trend === "stable") {
        trendMessage = "مستوى الحالة مستقر مقارنة بالجلسة السابقة.";
    } else {
        trendMessage = "هذه أول جلسة مكتملة.";
    }

    return {
        currentRisk,
        riskPattern: riskHistory,
        trend,
        trendMessage,
        alertLevel,
        message
    };
}


// ==========================================
// Get Question By ID
// جلب تعريف سؤال واحد من Question Engine
// ==========================================

async function getQuestionById(
    questionId,
    patientType
) {

    try {

        if (!questionId) {

            return null;

        }


        if (!patientType) {

            return null;

        }


        const question =

            await assessmentEngine.getQuestion(
                questionId,
                patientType
            );


        return question || null;

    }

    catch (error) {

        console.error(

            "GET QUESTION BY ID ERROR:",

            {

                questionId,

                patientType,

                message: error.message

            }

        );


        return null;

    }

}

// ==========================================
// Build Patient Risk Insights
// تحليل الـ Risk عبر تاريخ المريض بالكامل
// + ربط السؤال الأساسي بالسؤال الفرعي وإجابته
// ==========================================
async function buildPatientRiskInsights(sessions) {
const questionCache = new Map();

async function getCachedQuestion(questionId, patientType) {
    const cacheKey =
        `${patientType}:${questionId}`;

    if (questionCache.has(cacheKey)) {
        return questionCache.get(cacheKey);
    }

    const question =
        await getQuestionById(
            questionId,
            patientType
        );

    questionCache.set(
        cacheKey,
        question
    );

    return question;
}
    // -----------------------------------------
    // الجلسات المكتملة فقط
    // -----------------------------------------

    const completedSessions = sessions
        .filter(function (session) {

            return (

                session.status === "completed" &&

                session.assessmentResult &&

                Array.isArray(
                    session.assessmentResult.riskDetails
                )

            );

        })
        .sort(function (a, b) {

            return (

                a.sessionNumber -
                b.sessionNumber

            );

        });


    // -----------------------------------------
    // لا توجد بيانات Risk
    // -----------------------------------------

    if (completedSessions.length === 0) {

        return {

            status: "no_data",

            count: 0,

            insights: []

        };

    }


    // -----------------------------------------
    // ترتيب مستويات الـ Risk
    // -----------------------------------------

    const riskOrder = {

        none: 0,

        low: 1,

        medium: 2,

        high: 3

    };


    // -----------------------------------------
    // تجميع الـ Risk Details
    // -----------------------------------------

    const groupedRisks = {};


    // =========================================
    // المرور على جميع الجلسات المكتملة
    // =========================================
// =========================================
// جلب إجابات جميع الـSessions مرة واحدة
// =========================================

const sessionIds =
    completedSessions.map(function (session) {
        return session._id.toString();
    });

const allAnswers =
    await answersCollection
        .find({
            sessionId: {
                $in: sessionIds
            }
        })
        .toArray();

// =========================================
// تقسيم الإجابات حسب الـSession
// =========================================

const answersBySession = new Map();

allAnswers.forEach(function (answer) {
    if (!answersBySession.has(answer.sessionId)) {
        answersBySession.set(
            answer.sessionId,
            []
        );
    }

    answersBySession
        .get(answer.sessionId)
        .push(answer);
});
    for (const session of completedSessions) {
const sessionAnswers =
    answersBySession.get(
        session._id.toString()
    ) || [];
        const riskDetails =
            session.assessmentResult.riskDetails;


        // =========================================
        // جلب إجابات هذه الـ Session
        // =========================================

        


        // =========================================
        // تحويل الإجابات إلى Map
        // =========================================

        const answersMap = {};

        sessionAnswers.forEach(function (answer) {

            answersMap[
                answer.questionId
            ] = answer;

        });


        // =========================================
        // المرور على الـ Risk Details
        // =========================================

        for (const risk of riskDetails) {


            // -----------------------------------------
            // يجب وجود Track Key
            // -----------------------------------------

            if (!risk.trackKey) {

                continue;

            }


            // -----------------------------------------
            // إنشاء Group للـ Track
            // -----------------------------------------

            if (!groupedRisks[risk.trackKey]) {

                groupedRisks[
                    risk.trackKey
                ] = {

                    trackKey:
                        risk.trackKey,

                    history: []

                };

            }


            // =========================================
            // بيانات السؤال الأساسي
            // =========================================

            const mainAnswer =
                answersMap[
                    risk.questionId
                ] || null;

// =========================================
// جلب تعريف السؤال الأساسي
// =========================================
const mainQuestion =
    await getCachedQuestion(
        risk.questionId,
        session.patientType
    );


// =========================================
// استخراج نص إجابة السؤال الأساسي
// =========================================

let mainAnswerText =

    mainAnswer?.answerText ||

    risk.answerText ||

    null;


// =========================================
// لو السؤال من نوع Text
// =========================================

if (

    mainQuestion?.type === "text"

) {

    mainAnswerText =

        mainAnswer?.answerText ||

        risk.answerText ||

        null;

}


// =========================================
// لو السؤال اختيارات
// =========================================

else if (

    Array.isArray(
        mainQuestion?.answers
    )

) {

    const selectedMainAnswer =

        mainQuestion.answers.find(
            function (answer) {

                return (

                    answer.id ===

                    (

                        mainAnswer?.answerId ||

                        risk.answerId

                    )

                );

            }
        );


    if (selectedMainAnswer) {

        mainAnswerText =

            selectedMainAnswer.text ||

            mainAnswerText;

    }

}
            // =========================================
            // تجهيز السؤال الفرعي
            // =========================================

            const followUpChain = [];


            /*
             *
             * IMPORTANT
             *
             * هنا هنبدأ من السؤال الأساسي.
             *
             * لو إجابة السؤال الأساسي
             * تفتح سؤال فرعي:
             *
             * nextQuestionId
             *
             * هنبحث عن إجابة المريض
             * لهذا السؤال داخل Session Answers.
             *
             */


            let currentQuestionId =
                risk.questionId;


            let currentAnswerId =
                mainAnswer?.answerId ||
                risk.answerId ||
                null;


            // =========================================
            // حماية من الـ Infinite Loop
            // =========================================

            const visitedQuestions =
                new Set();


            // =========================================
            // متابعة سلسلة الأسئلة الفرعية
            // =========================================

            while (

                currentQuestionId &&

                currentAnswerId &&

                !visitedQuestions.has(
                    currentQuestionId
                )

            ) {


                visitedQuestions.add(
                    currentQuestionId
                );


                /*
                 *
                 * --------------------------------------
                 *
                 * هنا نحتاج تعريف السؤال من مصدر الأسئلة
                 *
                 * --------------------------------------
                 *
                 */


                /*
                 *
                 * السؤال الحالي
                 *
                 * IMPORTANT:
                 *
                 * سيتم استبدال هذا الجزء
                 * بدالة جلب السؤال الموجودة عندك
                 * في الـ Backend.
                 *
                 */


                const currentQuestion =
    await getCachedQuestion(
        currentQuestionId,
        session.patientType
    );


                // --------------------------------------
                // لو السؤال غير موجود
                // --------------------------------------

                if (!currentQuestion) {

                    break;

                }


                // --------------------------------------
                // إيجاد الإجابة داخل تعريف السؤال
                // --------------------------------------

                const selectedAnswer =

                    Array.isArray(
                        currentQuestion.answers
                    )

                        ? currentQuestion.answers.find(
                            function (answer) {

                                return (

                                    answer.id ===
                                    currentAnswerId

                                );

                            }
                        )

                        : null;


                // --------------------------------------
                // لو الإجابة غير موجودة
                // --------------------------------------

                if (!selectedAnswer) {

                    break;

                }


                // =========================================
                // هل الإجابة تفتح سؤال فرعي؟
                // =========================================

                if (

                    selectedAnswer.opensFollowUp === true &&

                    selectedAnswer.nextQuestionId

                ) {


                    const followUpQuestionId =

                        selectedAnswer
                            .nextQuestionId;


                    // --------------------------------------
                    // إجابة المريض على السؤال الفرعي
                    // --------------------------------------

                    const followUpAnswer =

                        answersMap[
                            followUpQuestionId
                        ] || null;


                    // --------------------------------------
                    // لو المريض لم يجب
                    // --------------------------------------

                    if (!followUpAnswer) {

                        break;

                    }


                    // --------------------------------------
                    // جلب تعريف السؤال الفرعي
                    // --------------------------------------

                    const followUpQuestion =
    await getCachedQuestion(
        followUpQuestionId,
        session.patientType
    );


                    // --------------------------------------
                    // لو السؤال غير موجود
                    // --------------------------------------

                    if (!followUpQuestion) {

                        break;

                    }


                    // =========================================
                    // استخراج نص الإجابة الفرعية
                    // =========================================

                    let followUpAnswerText = null;


                    // --------------------------------------
                    // سؤال Text
                    // --------------------------------------

                    if (

                        followUpQuestion.type === "text"

                    ) {

                        followUpAnswerText =

                            followUpAnswer.answerText ||
                            null;

                    }


                    // --------------------------------------
                    // سؤال اختيارات
                    // --------------------------------------

                    else {

                        const selectedFollowUpAnswer =

                            Array.isArray(
                                followUpQuestion.answers
                            )

                                ? followUpQuestion.answers.find(
                                    function (answer) {

                                        return (

                                            answer.id ===
                                            followUpAnswer.answerId

                                        );

                                    }
                                )

                                : null;


                        followUpAnswerText =

                            selectedFollowUpAnswer?.text ||
                            followUpAnswer.answerText ||
                            null;

                    }


                    // =========================================
                    // إضافة السؤال الفرعي
                    // =========================================

                    followUpChain.push({

                        questionId:
                            followUpQuestion.questionId,

                        questionText:
                            followUpQuestion.text ||
                            null,

                        answerId:
                            followUpAnswer.answerId ||
                            null,

                        answerText:
                            followUpAnswerText

                    });


                    // =========================================
                    // الانتقال للسؤال الفرعي
                    // =========================================

                    currentQuestionId =
                        followUpQuestionId;


                    currentAnswerId =
                        followUpAnswer.answerId ||
                        null;


                }


                // =========================================
                // لا يوجد Follow-up
                // =========================================

                else {

                    break;

                }

            }


            // =========================================
            // إضافة الـ Risk إلى History
            // =========================================

            groupedRisks[
                risk.trackKey
            ].history.push({

                sessionNumber:
                    session.sessionNumber,


                // --------------------------------------
                // السؤال الأساسي
                // --------------------------------------

                questionId:
                    risk.questionId,


                questionText:
                    risk.questionText ||
                    null,


                answerId:

                    mainAnswer?.answerId ||

                    risk.answerId ||

                    null,


                answerText:

    mainAnswerText,


                answerValue:

                    risk.answerValue ||

                    null,


                // --------------------------------------
                // مستوى الخطورة
                // --------------------------------------

                riskLevel:
                    risk.riskLevel,


                // --------------------------------------
                // سلسلة الأسئلة الفرعية
                // --------------------------------------

                followUpChain

            });

        }

    }


    // =========================================
    // استخراج Insights
    // =========================================

    const insights =

        Object.values(
            groupedRisks
        )
        .map(function (group) {


            // -----------------------------------------
            // أعلى Risk
            // -----------------------------------------

            


            // -----------------------------------------
            // آخر ظهور للـ Track
            // -----------------------------------------

            const latest =

                group.history[
                    group.history.length - 1
                ];


            // -----------------------------------------
            // النتيجة
            // -----------------------------------------

            return {

                trackKey:
                    group.trackKey,


                riskLevel:
    latest.riskLevel,


                latestSession:
                    latest.sessionNumber,


                // ----------------------------------
                // السؤال الأساسي
                // ----------------------------------

                questionId:
                    latest.questionId,


                questionText:
                    latest.questionText,


                answerId:
                    latest.answerId,


                answerText:
                    latest.answerText,


                answerValue:
                    latest.answerValue,


                // ----------------------------------
                // الأسئلة الفرعية
                // ----------------------------------

                followUpChain:
                    latest.followUpChain,


                // ----------------------------------
                // التاريخ
                // ----------------------------------

                history:
                    group.history

            };

        });


    // =========================================
    // ترتيب المشاكل
    // High → Medium → Low
    // =========================================

    insights.sort(
        function (a, b) {

            return (

                riskOrder[
                    b.riskLevel
                ] -

                riskOrder[
                    a.riskLevel
                ]

            );

        }
    );


    // =========================================
    // النتيجة النهائية
    // =========================================

    return {

        status: "analyzed",

        count:
            insights.length,

        insights

    };

}


router.get(
    "/patient/:patientId/question-comparison",
    async (req, res) => {
        try {
            const { patientId } = req.params;

            const fromSessionParam =
                req.query.fromSession;

            const toSessionParam =
                req.query.toSession;

            // =========================================
            // جلب كل الجلسات المكتملة
            // =========================================

            const allSessions =
                await sessionsCollection
                    .find({
                        patientId,
                        status: "completed"
                    })
                    .sort({
                        sessionNumber: 1
                    })
                    .toArray();

            if (allSessions.length === 0) {
                return res.status(404).json({
                    message:
                        "No completed sessions found"
                });
            }

            // =========================================
            // تحديد الجلسات التي ستدخل المقارنة
            // =========================================

            let sessions = allSessions;

            if (
                fromSessionParam !== undefined &&
                toSessionParam !== undefined
            ) {
                const fromSession =
                    Number(fromSessionParam);

                const toSession =
                    Number(toSessionParam);

                if (
                    !Number.isInteger(fromSession) ||
                    !Number.isInteger(toSession)
                ) {
                    return res.status(400).json({
                        message:
                            "Invalid comparison session numbers"
                    });
                }

                if (fromSession >= toSession) {
                    return res.status(400).json({
                        message:
                            "fromSession must be less than toSession"
                    });
                }

                const previousSession =
                    allSessions.find(function (session) {
                        return (
                            session.sessionNumber ===
                            fromSession
                        );
                    });

                const currentSession =
                    allSessions.find(function (session) {
                        return (
                            session.sessionNumber ===
                            toSession
                        );
                    });

                if (
                    !previousSession ||
                    !currentSession
                ) {
                    return res.status(404).json({
                        message:
                            "Comparison sessions not found"
                    });
                }

                sessions = [
                    previousSession,
                    currentSession
                ];
            }

            // =========================================
            // تنفيذ المقارنة
            // =========================================

            const result =
                compareAllSessions(sessions);

            console.log(
                "========== COMPARISON RESULT =========="
            );

            console.log({
                patientId,
                fromSession:
                    fromSessionParam !== undefined
                        ? Number(fromSessionParam)
                        : null,
                toSession:
                    toSessionParam !== undefined
                        ? Number(toSessionParam)
                        : null,
                comparedSessions:
                    sessions.map(function (session) {
                        return session.sessionNumber;
                    })
            });

            console.log(result);

            if (result?.improvementStages) {
                console.table(
                    result.improvementStages.flatMap(
                        stage =>
                            stage.improvements.map(
                                item => ({
                                    trackKey:
                                        item.trackKey,

                                    fromSession:
                                        stage.fromSession,

                                    toSession:
                                        stage.toSession,

                                    fromAnswer:
                                        item.fromAnswer,

                                    toAnswer:
                                        item.toAnswer,

                                    trend:
                                        item.trend,

                                    scoreDifference:
                                        item.scoreDifference
                                })
                            )
                    )
                );
            }

            console.log(
                "========== END COMPARISON RESULT =========="
            );

            // =========================================
            // Response
            // =========================================

            return res.status(200).json({
                patientId,

                patientName:
                    allSessions[0]?.patientName ||
                    null,

                sessionsCount:
                    allSessions.length,

                comparedSessions:
                    sessions.map(function (session) {
                        return {
                            sessionId:
                                String(session._id),

                            sessionNumber:
                                session.sessionNumber
                        };
                    }),

                comparisonRange:
                    fromSessionParam !== undefined &&
                    toSessionParam !== undefined
                        ? {
                              fromSession:
                                  Number(
                                      fromSessionParam
                                  ),

                              toSession:
                                  Number(
                                      toSessionParam
                                  )
                          }
                        : null,

                ...result
            });
        } catch (error) {
            console.error(
                "Question comparison error:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to compare questions"
            });
        }
    }
);
router.get(
    "/patient/:patientId/question-comparison/patient",
    async (req, res) => {

        try {

            const { patientId } =
                req.params;

            const sessions =
                await sessionsCollection
                    .find({
                        patientId,
                        status: "completed"
                    })
                    .sort({
                        sessionNumber: 1
                    })
                    .toArray();


            if (sessions.length === 0) {

                return res.status(404).json({
                    message:
                        "No completed sessions found"
                });
            }


            const result =
                compareAllSessions(
                    sessions
                );


            return res.status(200).json({

                patientId,

                patientName:
                    sessions[0]?.patientName ||
                    null,

                sessionsCount:
                    sessions.length,

                status:
                    result.status,

                currentSession:
                    result.currentSession,

                // =====================================
                // المريض يحصل على التحسن فقط
                // =====================================

                improvementEvents:
                    result.patient
                        ?.improvementEvents || [],

                summary: {

                    improvements:
                        result.patient
                            ?.summary
                            ?.improvements || 0
                }
            });

        } catch (error) {

            console.error(
                "Patient question comparison error:",
                error
            );

            return res.status(500).json({

                message:
                    "Failed to load patient comparison"
            });
        }
    }
);

router.get(
    "/patient/:patientId/score-comparison",
    async function (req, res) {
        try {
            const { patientId } = req.params;

            const sessions = await sessionsCollection
                .find({
                    patientId,
                    status: "completed"
                })
                .sort({
                    sessionNumber: 1
                })
                .toArray();

            if (sessions.length === 0) {
                return res.status(404).json({
                    message:
                        "No completed sessions found"
                });
            }

            const result =
                compareScores(sessions);

            res.status(200).json({
                patientId,

                patientName:
                    sessions[0].patientName,

                sessionsCount:
                    sessions.length,

                ...result
            });

        } catch (error) {
            console.error(
                "Score comparison error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to compare scores"
            });
        }
    }
);


// router.get(
//     "/patient/:patientId/risk-pattern",
//     async (req, res) => {
//         try {
//             const { patientId } = req.params;

//             const sessions = await sessionsCollection
//                 .find({
//                     patientId,
//                     status: "completed"
//                 })
//                 .sort({
//                     sessionNumber: 1
//                 })
//                 .toArray();

//             if (sessions.length === 0) {
//                 return res.status(404).json({
//                     message:
//                         "No completed sessions found"
//                 });
//             }

//             const riskPattern =
//     analyzeRiskPattern(sessions);

// const riskInsights =
//     await buildPatientRiskInsights(sessions);

//             return res.status(200).json({

//     patientId,

//     patientName:
//         sessions[0]?.patientName || null,

//     sessionsCount:
//         sessions.length,

//     ...riskPattern,

//     riskInsights

// });

//         } catch (error) {
//             console.error(error);

//             res.status(500).json({
//                 message:
//                     "Failed to analyze risk pattern"
//             });
//         }
//     }
// );
router.get(
    "/patient/:patientId/risk-pattern",
    async (req, res) => {
        try {
            const { patientId } = req.params;

            console.time("RISK ROUTE TOTAL");

            console.time("RISK FETCH SESSIONS");

            const sessions =
                await sessionsCollection
                    .find({
                        patientId,
                        status: "completed"
                    })
                    .sort({
                        sessionNumber: 1
                    })
                    .toArray();

            console.timeEnd(
                "RISK FETCH SESSIONS"
            );

            console.time(
                "ANALYZE RISK PATTERN"
            );

            const riskPattern =
                analyzeRiskPattern(
                    sessions
                );

            console.timeEnd(
                "ANALYZE RISK PATTERN"
            );

            console.time(
                "BUILD RISK INSIGHTS"
            );

            const riskInsights =
                await buildPatientRiskInsights(
                    sessions
                );

            console.timeEnd(
                "BUILD RISK INSIGHTS"
            );

            console.timeEnd(
                "RISK ROUTE TOTAL"
            );

            return res.status(200).json({
                patientId,
                patientName:
                    sessions[0]?.patientName ||
                    null,
                sessionsCount:
                    sessions.length,
                ...riskPattern,
                riskInsights
            });

        } catch (error) {
            console.error(error);

            console.timeEnd(
                "RISK ROUTE TOTAL"
            );

            res.status(500).json({
                message:
                    "Failed to analyze risk pattern"
            });
        }
    }
);

// =========================================
// جلب كل جلسات المريض
// =========================================

router.get(
    "/patient/:patientId",
    async function (req, res) {

        try {

            const { patientId } = req.params;

            console.log(
                "GET PATIENT SESSIONS:",
                patientId
            );

            const sessions =
                await sessionsCollection
                    .find({
                        patientId: patientId
                    })
                    .sort({
                        sessionNumber: 1
                    })
                    .toArray();

            console.log(
                "SESSIONS FOUND:",
                sessions.length
            );

            return res.status(200).json(
                sessions
            );

        } catch (error) {

            console.error(
                "Get patient sessions error:",
                error
            );

            return res.status(500).json({
                message: "Failed to get patient sessions"
            });
        }
    }
);












router.post("/:sessionId/approve", async function (req, res) {
    try {

        const { sessionId } = req.params;

        const session = await sessionsCollection.findOne({
            _id: new ObjectId(sessionId)
        });

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        if (session.status === "completed") {
            return res.status(400).json({
                message: "Session is already completed"
            });
        }

        if (session.doctorApproval === "approved") {
            return res.status(400).json({
                message: "Session is already approved"
            });
        }

        const result = await sessionsCollection.updateOne(
            {
                _id: new ObjectId(sessionId)
            },
            {
                $set: {
                    doctorApproval: "approved",
                    status: "opened",
                    openedAt: new Date()
                }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({
                message: "Session was not updated"
            });
        }

        const updatedSession =
            await sessionsCollection.findOne({
                _id: new ObjectId(sessionId)
            });

        return res.json({
            message: "Session approved and opened successfully",
            session: updatedSession
        });

    } catch (error) {

        console.error(
            "APPROVE SESSION ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to approve session"
        });
    }
});



// ==========================================
// Doctor Rejects Session
// ==========================================

router.post("/:sessionId/reject", async function (req, res) {
    try {

        const { sessionId } = req.params;

        const session = await sessionsCollection.findOne({
            _id: new ObjectId(sessionId)
        });

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        if (session.status === "completed") {
            return res.status(400).json({
                message: "Session is already completed"
            });
        }

        const result = await sessionsCollection.updateOne(
            {
                _id: new ObjectId(sessionId)
            },
            {
                $set: {
                    doctorApproval: "rejected",
                    status: "scheduled"
                }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({
                message: "Session was not updated"
            });
        }

        const updatedSession =
            await sessionsCollection.findOne({
                _id: new ObjectId(sessionId)
            });

        return res.json({
            message: "Session rejected successfully",
            session: updatedSession
        });

    } catch (error) {

        console.error(
            "REJECT SESSION ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to reject session"
        });
    }
});






// =====================================================
// Attendance Availability
// =====================================================

// router.get("/:id/attendance-status", async function (
//     req,
//     res
// ) {

//     try {

//         const { id } = req.params;

//         // ==========================================
//         // Validate ID
//         // ==========================================

//         if (!ObjectId.isValid(id)) {

//             return res.status(400).json({
//                 message:
//                     "Invalid session id"
//             });

//         }

//         // ==========================================
//         // Get Session
//         // ==========================================

//         const session =
//             await sessionsCollection.findOne({
//                 _id:
//                     new ObjectId(id)
//             });

//         if (!session) {

//             return res.status(404).json({
//                 message:
//                     "Session not found"
//             });

//         }

//         // ==========================================
//         // Attendance Already Recorded
//         // ==========================================

//         if (
//             session.attendanceStatus === "present" ||
//             session.attendanceStatus === "absent"
//         ) {

//             return res.status(200).json({

//                 success: true,

//                 sessionId:
//                     session._id,

//                 patientId:
//                     session.patientId,

//                 sessionNumber:
//                     session.sessionNumber,

//                 attendanceStatus:
//                     session.attendanceStatus,

//                 canMarkAttendance:
//                     false,

//                 reason:
//                     "already_recorded"

//             });

//         }

//         // ==========================================
//         // Calculate Attendance Window
//         // ==========================================

        

//         // ==========================================
//         // Response
//         // ==========================================

//         return res.status(200).json({

//             success: true,

//             sessionId:
//                 session._id,

//             patientId:
//                 session.patientId,

//             sessionNumber:
//                 session.sessionNumber,

//             attendanceStatus:
//                 session.attendanceStatus,

            

//         });

//     } catch (error) {

//         console.error(
//             "Attendance status error:",
//             error
//         );

//         return res.status(500).json({
//             message:
//                 "Server error"
//         });

//     }

// });
router.get("/:id/attendance-status", async function (
    req,
    res
) {
    try {
        const { id } = req.params;

        // ==========================================
        // Validate ID
        // ==========================================
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid session id"
            });
        }

        // ==========================================
        // Get Session
        // ==========================================
        const session =
            await sessionsCollection.findOne({
                _id: new ObjectId(id)
            });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        // ==========================================
        // Attendance Already Recorded
        // ==========================================
        if (
            session.attendanceStatus === "present" ||
            session.attendanceStatus === "absent"
        ) {
            return res.status(200).json({
                success: true,
                sessionId: session._id,
                patientId: session.patientId,
                sessionNumber:
                    session.sessionNumber,
                attendanceStatus:
                    session.attendanceStatus,
                canMarkAttendance: false,
                reason: "already_recorded"
            });
        }

        // ==========================================
        // Attendance Still Pending
        // ==========================================
        return res.status(200).json({
            success: true,
            sessionId: session._id,
            patientId: session.patientId,
            sessionNumber:
                session.sessionNumber,
            attendanceStatus:
                session.attendanceStatus,
            canMarkAttendance: true
        });

    } catch (error) {
        console.error(
            "Attendance status error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

    // =====================================================
    // TEST: Doctor Approval
    // =====================================================

    router.post("/:id/approve-follow-up", async function (req, res) {
        try {

            const sessionId = req.params.id;

            if (!ObjectId.isValid(sessionId)) {
                return res.status(400).json({
                    message: "Invalid session ID"
                });
            }

            // =============================================
            // جلب الـ Session
            // =============================================

            const session = await sessionsCollection.findOne({
                _id: new ObjectId(sessionId)
            });

            if (!session) {
                return res.status(404).json({
                    message: "Session not found"
                });
            }

            // =============================================
            // جلب الـ Follow-up
            // =============================================

            const followUp =
                await followUpsCollection.findOne({
                    sessionId: session._id
                });

            if (!followUp) {
                return res.status(404).json({
                    message: "Follow-up not found"
                });
            }

            // =============================================
            // التأكد أن الطلب Pending
            // =============================================

            if (
                followUp.status !== "pending_approval"
            ) {
                return res.status(400).json({
                    message:
                        "Follow-up is not waiting for approval",
                    currentStatus: followUp.status
                });
            }

            // =============================================
            // موافقة الدكتور
            // =============================================

            await followUpsCollection.updateOne(
    {
        _id: followUp._id,
        status: "not_started"
    },
    {
        $set: {
            status: "pending_approval",
            approvalRequestedAt: new Date(),
            updatedAt: new Date()
        }
    }
);

            // =============================================
            // فتح Session للمريض
            // =============================================

            await sessionsCollection.updateOne(
                {
                    _id: session._id
                },
                {
                    $set: {
                        status: "opened",
                        attendanceStatus: "pending",
                        openedAt: new Date()
                    }
                }
            );

            return res.json({
                message:
                    "Doctor approved follow-up and session opened",

                sessionId: session._id,

                sessionNumber:
                    session.sessionNumber,

                followUpStatus:
                    "approved",

                sessionStatus:
                    "opened"
            });

        } catch (error) {

            console.error(
                "Approve follow-up error:",
                error
            );

            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    });








console.log("SESSION ROUTER READY"); 
return router; 
};








// ==========================================
// Doctor Approves Session
// ==========================================
