// // =====================================================
// // Follow-up Scheduler
// // =====================================================

// const { sendWhatsAppMessage } = require("./whatsapp");
// const crypto = require("crypto");

// // =====================================================
// // HELPERS
// // =====================================================

// function generateSessionToken() {
//     return crypto.randomBytes(32).toString("hex");
// }

// function generateAccessCode() {
//     const characters =
//         "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

//     let code = "";

//     for (let i = 0; i < 8; i++) {
//         const randomIndex =
//             crypto.randomInt(0, characters.length);

//         code += characters[randomIndex];
//     }

//     return code;
// }

// // =====================================================
// // START SCHEDULER
// // =====================================================

// function startFollowUpScheduler(db) {

//     // =================================================
//     // COLLECTIONS
//     // =================================================

//     const sessionsCollection =
//         db.collection("sessions");

//     const followUpsCollection =
//         db.collection("followUps");

//     const patientsCollection =
//         db.collection("patients");

//     // =================================================
//     // SETTINGS
//     // =================================================

//     const TWENTY_FOUR_HOURS_MS =
//         24 * 60 * 60 * 1000;

//     const SCHEDULER_INTERVAL_MS =
//         5 * 1000;

//     // =================================================
//     // PREVENT DUPLICATE WHATSAPP ATTEMPTS
//     // DURING CURRENT SERVER RUNTIME
//     // =================================================

//     const attemptedWhatsAppMessages =
//         new Set();

//     // =================================================
//     // GET PATIENT PHONE
//     // =================================================

//     async function getPatientPhone(session) {

//         const patient =
//             await patientsCollection.findOne({
//                 patientCode: session.patientId
//             });

//         return patient?.phone || null;
//     }

//     // =================================================
//     // ENSURE ACCESS TOKEN
//     // =================================================

//     async function ensureAccessToken(session) {

//         if (session.accessToken) {
//             return session.accessToken;
//         }

//         const accessToken =
//             generateSessionToken();

//         const now = new Date();

//         await sessionsCollection.updateOne(
//             {
//                 _id: session._id
//             },
//             {
//                 $set: {
//                     accessToken,
//                     accessTokenCreatedAt: now,
//                     updatedAt: now
//                 }
//             }
//         );

//         return accessToken;
//     }

//     // =================================================
//     // ENSURE ACCESS CODE
//     // =================================================

//     async function ensureAccessCode(session) {

//         if (session.accessCode) {
//             return session.accessCode;
//         }

//         const accessCode =
//             generateAccessCode();

//         const now = new Date();

//         await sessionsCollection.updateOne(
//             {
//                 _id: session._id
//             },
//             {
//                 $set: {
//                     accessCode,
//                     accessCodeCreatedAt: now,
//                     updatedAt: now
//                 }
//             }
//         );

//         return accessCode;
//     }

//     // =================================================
//     // BUILD PATIENT SESSION LINK
//     // =================================================

//     function buildPatientSessionLink(accessCode) {

//         const patientAppUrl =
//             process.env.PATIENT_APP_URL ||
//             "http://localhost:5500";

//         return (
//             `${patientAppUrl}/patient-session.html` +
//             `?code=${accessCode}`
//         );
//     }

//     // =================================================
//     // OPEN SESSION
//     // =================================================

//     async function openSession(session) {

//         const now = new Date();

//         const accessToken =
//             await ensureAccessToken(session);

//         await sessionsCollection.updateOne(
//             {
//                 _id: session._id
//             },
//             {
//                 $set: {
//                     status: "opened",
//                     openedAt: now,
//                     updatedAt: now
//                 }
//             }
//         );

//         return accessToken;
//     }

//     // =================================================
//     // CREATE DOCTOR APPROVAL REQUEST
//     // =================================================

//     async function createDoctorApprovalRequest(session) {

//         const now = new Date();

//         // -------------------------------------------------
//         // Doctor already made a decision
//         // -------------------------------------------------

//         if (
//             session.absentDecision &&
//             session.absentDecision !== "pending"
//         ) {

//             console.log(
//                 `Doctor decision already exists for session ${session.sessionNumber} - skipping approval request`
//             );

//             return null;
//         }

//         // -------------------------------------------------
//         // Check existing active pending approval
//         // -------------------------------------------------

//         const existingPendingApproval =
//             await followUpsCollection.findOne({
//                 sessionId: session._id,
//                 status: "pending_approval",
//                 approvalStatus: "pending"
//             });

//         if (existingPendingApproval) {

//             console.log(
//                 `Pending approval already exists for session ${session.sessionNumber} - skipping duplicate`
//             );

//             return existingPendingApproval;
//         }

//         // -------------------------------------------------
//         // Create approval request
//         // -------------------------------------------------

//         const approvalRequest = {

//             sessionId:
//                 session._id,

//             patientId:
//                 session.patientId,

//             patientName:
//                 session.patientName,

//             sessionNumber:
//                 session.sessionNumber,

//             // Keep the real attendance state.
//             attendanceStatus:
//                 session.attendanceStatus,

//             status:
//                 "pending_approval",

//             approvalStatus:
//                 "pending",

//             requestedAt:
//                 now,

//             approvedAt:
//                 null,

//             rejectedAt:
//                 null,

//             approvedBy:
//                 null,

//             rejectedBy:
//                 null,

//             createdAt:
//                 now,

//             updatedAt:
//                 now
//         };

//         const result =
//             await followUpsCollection.insertOne(
//                 approvalRequest
//             );

//         console.log(
//             "================================="
//         );

//         console.log(
//             "DOCTOR APPROVAL REQUEST CREATED"
//         );

//         console.log({
//             patientId:
//                 session.patientId,

//             sessionNumber:
//                 session.sessionNumber,

//             attendanceStatus:
//                 session.attendanceStatus,

//             scheduledAt:
//                 session.scheduledAt,

//             requestedAt:
//                 now
//         });

//         console.log(
//             "================================="
//         );

//         return {
//             _id:
//                 result.insertedId,

//             ...approvalRequest
//         };
//     }

//     // =================================================
//     // BUILD PRE-SESSION MESSAGE
//     // =================================================

//     function buildPreSessionReminderMessage(session) {

//     const scheduledAt =
//         new Date(session.scheduledAt);

//     const dateText =
//         scheduledAt.toLocaleDateString(
//             "ar-EG",
//             {
//                 weekday: "long",
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric"
//             }
//         );

//     const timeText =
//         scheduledAt.toLocaleTimeString(
//             "ar-EG",
//             {
//                 hour: "2-digit",
//                 minute: "2-digit"
//             }
//         );

//     return (
//         `مرحبًا ${session.patientName || "بك"} 👋\n\n` +

//         `نذكّرك بموعد جلستك القادمة مع الطبيب.\n\n` +

//         `📅 ${dateText}\n` +
//         `🕐 ${timeText}\n\n` +

//         `هل ستتمكن من الحضور؟\n\n` +

//         `اكتب "هحضر" إذا كنت ستتمكن من الحضور.\n` +
//         `اكتب "مش هحضر" إذا كنت لن تتمكن من الحضور.\n\n` +

//         `شكرًا لتعاونك ❤️`
//     );
// }

//     // =================================================
//     // BUILD ATTENDANCE FOLLOW-UP MESSAGE
//     // =================================================

//     function buildAttendanceFollowUpMessage(
//         session,
//         patientLink
//     ) {

//         return (
//             `مرحبًا ${session.patientName || "بك"} 👋\n\n` +

//             `الدكتور يرغب في متابعة حالتك بعد ` +
//             `جلسة المتابعة رقم ${session.sessionNumber}.\n\n` +

//             `من فضلك افتح الرابط التالي وأجب عن ` +
//             `أسئلة المتابعة الدورية الخاصة بك:\n\n` +

//             `${patientLink}\n\n` +

//             `شكرًا لتعاونك ❤️`
//         );
//     }

//     // =================================================
//     // CENTRAL WHATSAPP FUNCTION
//     // =================================================

//     async function sendPatientWhatsApp(
//         session,
//         messageType,
//         options = {}
//     ) {

//         // -------------------------------------------------
//         // Prevent repeated attempts during same runtime
//         // -------------------------------------------------

//         const sessionId =
//             String(session._id);

//         const attemptKey =
//             `${sessionId}:${messageType}`;

//         if (
//             attemptedWhatsAppMessages.has(
//                 attemptKey
//             )
//         ) {
//             console.log(
//                 `WhatsApp already attempted for session ${session.sessionNumber} - ${messageType}`
//             );

//             return null;
//         }

//         // -------------------------------------------------
//         // Get patient phone from patients collection
//         // -------------------------------------------------

//         const phone =
//             await getPatientPhone(session);

//         if (!phone) {

//             console.warn(
//                 "WhatsApp skipped: patient phone not found",
//                 {
//                     patientId:
//                         session.patientId,

//                     sessionNumber:
//                         session.sessionNumber
//                 }
//             );

//             return null;
//         }

//         // -------------------------------------------------
//         // Build message
//         // -------------------------------------------------

//         let message = "";

//         // -------------------------------------------------
//         // PRE SESSION
//         // -------------------------------------------------

//         if (
//             messageType ===
//             "pre_session_reminder"
//         ) {

//             message =
//                 buildPreSessionReminderMessage(
//                     session
//                 );
//         }

//         // -------------------------------------------------
//         // POST SESSION
//         // -------------------------------------------------

//         else if (
//             messageType ===
//             "attendance_follow_up"
//         ) {

//             const accessCode =
//                 options.accessCode ||
//                 session.accessCode;

//             if (!accessCode) {

//                 throw new Error(
//                     "Access code is required for attendance follow-up"
//                 );
//             }

//             const patientLink =
//                 buildPatientSessionLink(
//                     accessCode
//                 );

//             message =
//                 buildAttendanceFollowUpMessage(
//                     session,
//                     patientLink
//                 );
//         }

//         // -------------------------------------------------
//         // INVALID MESSAGE TYPE
//         // -------------------------------------------------

//         else {

//             throw new Error(
//                 `Unsupported WhatsApp message type: ${messageType}`
//             );
//         }

//         // -------------------------------------------------
//         // LOG
//         // -------------------------------------------------

//         console.log(
//             "================================="
//         );

//         console.log(
//             "PATIENT WHATSAPP SEND"
//         );

//         console.log({
//             patientId:
//                 session.patientId,

//             patientName:
//                 session.patientName,

//             sessionNumber:
//                 session.sessionNumber,

//             phone,

//             messageType
//         });

//         console.log(
//             "================================="
//         );

//         // -------------------------------------------------
//         // SEND
//         // -------------------------------------------------

//         try {

//             const result =
//                 await sendWhatsAppMessage(
//                     phone,
//                     message
//                 );

//             console.log(
//                 "WHATSAPP MESSAGE RESULT:",
//                 result
//             );

//             // -------------------------------------------------
//             // If sending was skipped because WhatsApp is
//             // disabled, do NOT lock the message attempt.
//             // -------------------------------------------------

//             if (
//                 result?.skipped
//             ) {
//                 return result;
//             }

//             // -------------------------------------------------
//             // Real send succeeded
//             // -------------------------------------------------

//             attemptedWhatsAppMessages.add(
//                 attemptKey
//             );

//             const update = {};

//             if (
//                 messageType ===
//                 "pre_session_reminder"
//             ) {

//                 update[
//                     "whatsapp.preSessionReminderSent"
//                 ] = true;

//                 update[
//                     "whatsapp.preSessionReminderSentAt"
//                 ] = new Date();
//             }

//             if (
//                 messageType ===
//                 "attendance_follow_up"
//             ) {

//                 update[
//                     "whatsapp.attendanceFollowUpSent"
//                 ] = true;

//                 update[
//                     "whatsapp.attendanceFollowUpSentAt"
//                 ] = new Date();
//             }

//             if (
//                 Object.keys(update).length
//             ) {

//                 await sessionsCollection.updateOne(
//                     {
//                         _id:
//                             session._id
//                     },
//                     {
//                         $set:
//                             update
//                     }
//                 );
//             }

//             return result;

//         } catch (error) {

//             console.error(
//                 "WHATSAPP SEND ERROR:",
//                 error
//             );

//             // Don't add attemptKey on failure.
//             // Scheduler can retry on next cycle.

//             return null;
//         }
//     }

//     // =================================================
//     // PRE-SESSION REMINDER HANDLER
//     // =================================================

//     async function handlePreSessionReminder(
//         session,
//         now
//     ) {

//         // First session excluded.
//         if (
//             Number(session.sessionNumber) <= 1
//         ) {
//             return;
//         }

//         if (
//             !session.scheduledAt
//         ) {
//             return;
//         }

//         const scheduledAt =
//             new Date(
//                 session.scheduledAt
//             );

//         if (
//             Number.isNaN(
//                 scheduledAt.getTime()
//             )
//         ) {
//             return;
//         }

//         // Don't send after appointment time.
//         if (
//             now >= scheduledAt
//         ) {
//             return;
//         }

//         // Exact 24-hour-before point.
//         const reminderTime =
//             new Date(
//                 scheduledAt.getTime() -
//                 TWENTY_FOUR_HOURS_MS
//             );

//         // Not time yet.
//         if (
//             now < reminderTime
//         ) {
//             return;
//         }

//         // Already sent successfully.
//         if (
//             session.whatsapp?.preSessionReminderSent
//         ) {
//             return;
//         }

//         await sendPatientWhatsApp(
//             session,
//             "pre_session_reminder"
//         );
//     }

//     // =================================================
//     // POST-SESSION FLOW
//     // =================================================

//     async function handlePostSessionFlow(
//         session,
//         now
//     ) {

//         if (
//             !session.scheduledAt
//         ) {
//             return;
//         }

//         const scheduledAt =
//             new Date(
//                 session.scheduledAt
//             );

//         if (
//             Number.isNaN(
//                 scheduledAt.getTime()
//             )
//         ) {
//             return;
//         }

//         // -------------------------------------------------
//         // 24 HOURS AFTER scheduledAt
//         // -------------------------------------------------

//         const followUpTime =
//             new Date(
//                 scheduledAt.getTime() +
//                 TWENTY_FOUR_HOURS_MS
//             );

//         if (
//             now < followUpTime
//         ) {
//             return;
//         }

//         // =================================================
//         // PRESENT
//         // =================================================

//         if (
//             session.attendanceStatus ===
//             "present"
//         ) {

//             // Already sent successfully.
//             if (
//                 session.whatsapp
//                     ?.attendanceFollowUpSent
//             ) {
//                 return;
//             }

//             // Open session.
//             await openSession(
//                 session
//             );

//             // Generate access code for patient.
//             const accessCode =
//                 await ensureAccessCode(
//                     session
//                 );

//             await sendPatientWhatsApp(
//                 session,
//                 "attendance_follow_up",
//                 {
//                     accessCode
//                 }
//             );

//             return;
//         }

//         // =================================================
//         // ABSENT
//         // =================================================

//         if (
//             session.attendanceStatus ===
//             "absent"
//         ) {

//             await createDoctorApprovalRequest(
//                 session
//             );

//             return;
//         }

//         // =================================================
//         // PENDING
//         // =================================================

//         if (
//             session.attendanceStatus ===
//             "pending"
//         ) {

//             // IMPORTANT:
//             // pending stays pending.
//             // We never convert it to absent here.

//             await createDoctorApprovalRequest(
//                 session
//             );

//             return;
//         }
//     }

//     // =================================================
//     // CHECK ALL SESSIONS
//     // =================================================

//     async function checkSessions() {

//         try {

//             const now =
//                 new Date();

//             const sessions =
//                 await sessionsCollection
//                     .find({})
//                     .toArray();

//             console.log(
//                 `Scheduler checked ${sessions.length} sessions`
//             );

//             for (
//                 const session of sessions
//             ) {

//                 try {

//                     // ---------------------------------
//                     // PRE SESSION
//                     // ---------------------------------

//                     await handlePreSessionReminder(
//                         session,
//                         now
//                     );

//                     // ---------------------------------
//                     // POST SESSION
//                     // ---------------------------------

//                     await handlePostSessionFlow(
//                         session,
//                         now
//                     );

//                 } catch (sessionError) {

//                     console.error(
//                         `Scheduler error for session ${session._id}:`,
//                         sessionError
//                     );
//                 }
//             }

//         } catch (error) {

//             console.error(
//                 "FOLLOW-UP SCHEDULER ERROR:",
//                 error
//             );
//         }
//     }

//     // =================================================
//     // START
//     // =================================================

//     console.log(
//         "Follow-up Scheduler started"
//     );

//     console.log(
//         `Scheduler interval: ${SCHEDULER_INTERVAL_MS / 1000} seconds`
//     );

//     console.log(
//         "WhatsApp pre-session reminders enabled for session 2+"
//     );

//     console.log(
//         "WhatsApp post-session follow-ups enabled"
//     );

//     console.log(
//         "WhatsApp sending remains controlled by WHATSAPP_ENABLED"
//     );

//     // Run once immediately.
//     checkSessions();

//     // Repeat.
//     setInterval(
//         checkSessions,
//         SCHEDULER_INTERVAL_MS
//     );
// }

// module.exports =
//     startFollowUpScheduler;


// =====================================================
// Follow-up Scheduler
// =====================================================

const { sendWhatsAppMessage } = require("./whatsapp");
const crypto = require("crypto");

// =====================================================
// HELPERS
// =====================================================

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

// =====================================================
// START SCHEDULER
// =====================================================
function startFollowUpScheduler(db) {

    // =================================================
    // COLLECTIONS
    // =================================================

    const sessionsCollection =
        db.collection("sessions");

    const followUpsCollection =
        db.collection("followUps");

    const patientsCollection =
        db.collection("patients");


    // =================================================
    // SETTINGS
    // =================================================

    const TWENTY_FOUR_HOURS_MS =
        24 * 60 * 60 * 1000;

    const SCHEDULER_INTERVAL_MS =
        6 * 10000;


    // =================================================
    // WHATSAPP QUEUE SETTINGS
    // =================================================

    // Delay between successful WhatsApp messages.
    // 10s -> 15s -> 20s -> 10s -> 15s -> repeat

    const WHATSAPP_DELAY_SEQUENCE_MS = [
        10 * 1000,
        15 * 1000,
        20 * 1000,
        10 * 1000,
        15 * 1000
    ];

    let whatsappDelayIndex = 0;


    // Pause after an API failure.

    const WHATSAPP_FAILURE_PAUSE_MS =
        60 * 1000;


    // =================================================
    // ================= TEST MODE =====================
    // =================================================
    //
    // TEST MODE FOR THE FOUR TEST SESSIONS ONLY
    //
    // الهدف:
    // أثناء اختبار WhatsApp، الـScheduler يفضل شغال
    // على كل الجلسات بشكل طبيعي،
    // لكن WhatsApp نفسه لا يُرسل إلا للجلسات الأربع
    // الموجودة هنا.
    //
    // بعد انتهاء الاختبار:
    //
    // 1) اجعل WHATSAPP_TEST_MODE=false
    //
    // أو احذف هذا البلوك بالكامل مع الشرط الموجود
    // داخل enqueueWhatsApp().
    //
    // =================================================

    const WHATSAPP_TEST_MODE =
        process.env.WHATSAPP_TEST_MODE === "true";

    const WHATSAPP_TEST_SESSION_IDS = new Set([
        "6a9c0aa5f46bcd3f6839e125",
        "6a9c0aa7f46bcd3f6839e126",
        "6a9d4bf385c1dea1a1284ed2",
        "6a9d4bf485c1dea1a1284ed3"
    ]);

    function isWhatsAppSessionAllowed(session) {

        // خارج وضع الاختبار:
        // كل الجلسات مسموح لها باستخدام WhatsApp.

        if (!WHATSAPP_TEST_MODE) {
            return true;
        }

        // داخل وضع الاختبار:
        // اسمح فقط للأربع جلسات المحددة.

        return WHATSAPP_TEST_SESSION_IDS.has(
            String(session._id)
        );
    }


    // =================================================
    // WHATSAPP QUEUE
    // =================================================

    const whatsappQueue = [];

    // Prevent the same job from being added
    // more than once during the current server runtime.

    const whatsappQueuedKeys = new Set();

    // Worker state.

    let whatsappQueueRunning = false;


    // =================================================
    // SLEEP
    // =================================================

    function sleep(ms) {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms);
        });
    }


    // =================================================
    // GET PATIENT PHONE
    // =================================================

    async function getPatientPhone(session) {

        const patient =
            await patientsCollection.findOne({
                patientCode: session.patientId
            });

        return patient?.phone || null;
    }


    // =================================================
    // ENSURE ACCESS TOKEN
    // =================================================

    async function ensureAccessToken(session) {

        if (session.accessToken) {
            return session.accessToken;
        }

        const accessToken =
            generateSessionToken();

        const now =
            new Date();

        await sessionsCollection.updateOne(
            {
                _id: session._id
            },
            {
                $set: {
                    accessToken,
                    accessTokenCreatedAt: now,
                    updatedAt: now
                }
            }
        );

        // Keep in-memory session synchronized.

        session.accessToken =
            accessToken;

        return accessToken;
    }


    // =================================================
    // ENSURE ACCESS CODE
    // =================================================

    async function ensureAccessCode(session) {

        if (session.accessCode) {
            return session.accessCode;
        }

        const accessCode =
            generateAccessCode();

        const now =
            new Date();

        await sessionsCollection.updateOne(
            {
                _id: session._id
            },
            {
                $set: {
                    accessCode,
                    accessCodeCreatedAt: now,
                    updatedAt: now
                }
            }
        );

        // Keep in-memory session synchronized.

        session.accessCode =
            accessCode;

        return accessCode;
    }


    // =================================================
    // BUILD PATIENT SESSION LINK
    // =================================================

    function buildPatientSessionLink(accessToken) {
    const patientAppUrl =
        process.env.PATIENT_APP_URL ||
        "http://localhost:5501";

    return (
        `${patientAppUrl}/follow.html` +
        `?token=${accessToken}`
    );
}


    // =================================================
    // OPEN SESSION
    // =================================================

    // =================================================
// OPEN SESSION
// =================================================

async function openSession(session) {

    // ---------------------------------------------
    // Completed sessions must NEVER be reopened
    // ---------------------------------------------
    if (session?.status === "completed") {

        console.log(
            "OPEN SESSION SKIPPED: session already completed",
            {
                sessionId:
                    session?. _id,
                patientId:
                    session?.patientId,
                sessionNumber:
                    session?.sessionNumber
            }
        );

        return false;
    }

    // ---------------------------------------------
    // Already opened
    // ---------------------------------------------
    if (session?.status === "opened") {
        return true;
    }

    // ---------------------------------------------
    // Session must be scheduled before opening
    // ---------------------------------------------
    if (session?.status !== "scheduled") {

        console.log(
            "OPEN SESSION SKIPPED: invalid current status",
            {
                sessionId:
                    session?._id,
                patientId:
                    session?.patientId,
                sessionNumber:
                    session?.sessionNumber,
                status:
                    session?.status
            }
        );

        return false;
    }

    // ---------------------------------------------
    // Validate scheduledAt
    // ---------------------------------------------
    if (!session?.scheduledAt) {
        console.log(
            "OPEN SESSION SKIPPED: scheduledAt missing",
            {
                sessionId:
                    session?._id
            }
        );

        return false;
    }

    const now = new Date();

    const scheduledAt =
        new Date(session.scheduledAt);

    if (
        Number.isNaN(
            scheduledAt.getTime()
        )
    ) {
        console.log(
            "OPEN SESSION SKIPPED: invalid scheduledAt",
            {
                sessionId:
                    session?._id,
                scheduledAt:
                    session?.scheduledAt
            }
        );

        return false;
    }

    // ---------------------------------------------
    // Cannot open before appointment time
    // ---------------------------------------------
    if (now < scheduledAt) {

        console.log(
            "OPEN SESSION SKIPPED: scheduled time not reached",
            {
                sessionId:
                    session?._id,
                patientId:
                    session?.patientId,
                sessionNumber:
                    session?.sessionNumber,
                scheduledAt,
                now
            }
        );

        return false;
    }

    // ---------------------------------------------
    // Ensure access token
    // ---------------------------------------------
    await ensureAccessToken(session);

    // ---------------------------------------------
    // DB-level protection
    // ---------------------------------------------
    const result =
        await sessionsCollection.updateOne(
            {
                _id: session._id,
                status: {
                    $ne: "completed"
                }
            },
            {
                $set: {
                    status: "opened",
                    openedAt: now,
                    updatedAt: now
                }
            }
        );

    if (result.modifiedCount === 0) {
        return false;
    }

    session.status = "opened";
    session.openedAt = now;

    return true;
}


    // =================================================
    // CREATE DOCTOR APPROVAL REQUEST
    // =================================================

    async function createDoctorApprovalRequest(session) {

        const now =
            new Date();


        // -------------------------------------------------
        // Doctor already made a decision.
        // -------------------------------------------------

        if (
            session.absentDecision &&
            session.absentDecision !== "pending"
        ) {

            console.log(
                `Doctor decision already exists for session ${session.sessionNumber} - skipping approval request`
            );

            return null;
        }


        // -------------------------------------------------
        // Check existing active pending approval.
        // -------------------------------------------------

        const existingPendingApproval =
            await followUpsCollection.findOne({
                sessionId: session._id,
                status: "pending_approval",
                approvalStatus: "pending"
            });

        if (existingPendingApproval) {

            console.log(
                `Pending approval already exists for session ${session.sessionNumber} - skipping duplicate`
            );

            return existingPendingApproval;
        }


        // -------------------------------------------------
        // Create approval request.
        // -------------------------------------------------

        const approvalRequest = {

            sessionId:
                session._id,

            patientId:
                session.patientId,

            patientName:
                session.patientName,

            sessionNumber:
                session.sessionNumber,

            // Preserve the real attendance state.

            attendanceStatus:
                session.attendanceStatus,

            status:
                "pending_approval",

            approvalStatus:
                "pending",

            requestedAt:
                now,

            approvedAt:
                null,

            rejectedAt:
                null,

            approvedBy:
                null,

            rejectedBy:
                null,

            createdAt:
                now,

            updatedAt:
                now
        };


        const result =
            await followUpsCollection.insertOne(
                approvalRequest
            );


        console.log(
            "================================="
        );

        console.log(
            "DOCTOR APPROVAL REQUEST CREATED"
        );

        console.log({

            patientId:
                session.patientId,

            sessionNumber:
                session.sessionNumber,

            attendanceStatus:
                session.attendanceStatus,

            scheduledAt:
                session.scheduledAt,

            requestedAt:
                now
        });

        console.log(
            "================================="
        );


        return {

            _id:
                result.insertedId,

            ...approvalRequest
        };
    }


    // =================================================
    // BUILD PRE-SESSION MESSAGE
    // =================================================

    function buildPreSessionReminderMessage(session) {

        const scheduledAt =
            new Date(
                session.scheduledAt
            );

        if (
            Number.isNaN(
                scheduledAt.getTime()
            )
        ) {

            return "";
        }


        const dateText =
            scheduledAt.toLocaleDateString(
                "ar-EG",
                {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );


        const timeText =
            scheduledAt.toLocaleTimeString(
                "ar-EG",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        return (

            `مرحبًا ${session.patientName || "بك"} 👋\n\n` +

            `نذكّرك بموعد جلستك القادمة مع الطبيب.\n\n` +

            `📅 ${dateText}\n` +

            `🕐 ${timeText}\n\n` +

            `هل ستتمكن من الحضور؟\n\n` +

            `اكتب "هحضر" إذا كنت ستتمكن من الحضور.\n` +

            `اكتب "مش هحضر" إذا كنت لن تتمكن من الحضور.\n\n` +

            `شكرًا لتعاونك ❤️`
        );
    }


    // =================================================
    // BUILD POST-SESSION FOLLOW-UP MESSAGE
    // =================================================

    function buildAttendanceFollowUpMessage(
        session,
        patientLink
    ) {

        return (

            `مرحبًا ${session.patientName || "بك"} 👋\n\n` +

            `الدكتور يرغب في متابعة حالتك بعد ` +

            `جلسة المتابعة رقم ${session.sessionNumber}.\n\n` +

            `من فضلك افتح الرابط التالي وأجب عن ` +

            `أسئلة المتابعة الدورية الخاصة بك:\n\n` +

            `${patientLink}\n\n` +

            `شكرًا لتعاونك ❤️`
        );
    }


    // =================================================
    // SEND MESSAGE NOW
    // =================================================
    //
    // This function does the actual WhatsApp request.
    //
    // The queue is responsible for deciding WHEN
    // this function is called.
    //
    // =================================================

    async function sendPatientWhatsAppNow(
        session,
        messageType,
        options = {}
    ) {

        const phone =
            await getPatientPhone(session);


        if (!phone) {

            console.warn(
                "WhatsApp skipped: patient phone not found",
                {
                    patientId:
                        session.patientId,

                    sessionNumber:
                        session.sessionNumber
                }
            );

            return {
                success: false,
                skipped: true,
                reason: "patient_phone_not_found"
            };
        }


        // -------------------------------------------------
        // Build message
        // -------------------------------------------------

        let message = "";


        // -------------------------------------------------
        // PRE SESSION
        // -------------------------------------------------

        if (
            messageType ===
            "pre_session_reminder"
        ) {

            message =
                buildPreSessionReminderMessage(
                    session
                );
        }


        // -------------------------------------------------
        // POST SESSION
        // -------------------------------------------------

        else if (
            messageType ===
            "attendance_follow_up"
        ) {

            const accessToken =
    options.accessToken || session.accessToken;

if (!accessToken) {
    throw new Error(
        "Access token is required for attendance follow-up"
    );
}

const patientLink =
    buildPatientSessionLink(accessToken);


            


            message =
                buildAttendanceFollowUpMessage(
                    session,
                    patientLink
                );
        }


        // -------------------------------------------------
        // INVALID TYPE
        // -------------------------------------------------

        else {

            throw new Error(
                `Unsupported WhatsApp message type: ${messageType}`
            );
        }


        if (!message) {

            throw new Error(
                "WhatsApp message is empty"
            );
        }


        console.log(
            "================================="
        );

        console.log(
            "WHATSAPP QUEUE SENDING NOW"
        );

        console.log({

            patientId:
                session.patientId,

            patientName:
                session.patientName,

            sessionNumber:
                session.sessionNumber,

            phone,

            messageType
        });

        console.log(
            "================================="
        );


        const result =
            await sendWhatsAppMessage(
                phone,
                message
            );


        console.log(
            "WHATSAPP MESSAGE RESULT:",
            result
        );


        return result;
    }


    // =================================================
    // PROCESS WHATSAPP QUEUE
    // =================================================

    async function processWhatsAppQueue() {

        // Another worker is already running.

        if (whatsappQueueRunning) {
            return;
        }


        // Nothing to process.

        if (
            whatsappQueue.length === 0
        ) {
            return;
        }


        // WhatsApp disabled:
        // don't send anything.

        if (
            process.env.WHATSAPP_ENABLED !==
            "true"
        ) {
            return;
        }


        whatsappQueueRunning =
            true;


        try {

            while (
                whatsappQueue.length > 0
            ) {


                // If disabled while worker is running,
                // stop immediately.

                if (
                    process.env.WHATSAPP_ENABLED !==
                    "true"
                ) {

                    break;
                }


                const job =
                    whatsappQueue.shift();


                try {

                    console.log(
                        "================================="
                    );

                    console.log(
                        "WHATSAPP QUEUE JOB"
                    );

                    console.log({

                        patientId:
                            job.session.patientId,

                        sessionNumber:
                            job.session.sessionNumber,

                        messageType:
                            job.messageType
                    });

                    console.log(
                        "================================="
                    );


                    const result =
                        await sendPatientWhatsAppNow(
                            job.session,
                            job.messageType,
                            job.options
                        );


                    // -----------------------------------------
                    // WhatsApp explicitly skipped.
                    // -----------------------------------------

                    if (
                        result?.skipped
                    ) {

                        whatsappQueuedKeys.delete(
                            job.jobKey
                        );

                        continue;
                    }


                    // -----------------------------------------
                    // SUCCESS
                    // -----------------------------------------

                    const update = {};


                    if (
                        job.messageType ===
                        "pre_session_reminder"
                    ) {

                        update[
                            "whatsapp.preSessionReminderSent"
                        ] = true;

                        update[
                            "whatsapp.preSessionReminderSentAt"
                        ] = new Date();
                    }


                    if (
                        job.messageType ===
                        "attendance_follow_up"
                    ) {

                        update[
                            "whatsapp.attendanceFollowUpSent"
                        ] = true;

                        update[
                            "whatsapp.attendanceFollowUpSentAt"
                        ] = new Date();
                    }


                    if (
                        Object.keys(update).length
                    ) {

                        await sessionsCollection.updateOne(
                            {
                                _id:
                                    job.session._id
                            },
                            {
                                $set:
                                    update
                            }
                        );
                    }


                    console.log(
                        "WhatsApp job completed successfully:",
                        {

                            patientId:
                                job.session.patientId,

                            sessionNumber:
                                job.session.sessionNumber,

                            messageType:
                                job.messageType
                        }
                    );


                } catch (error) {

                    console.error(
                        "WHATSAPP QUEUE JOB ERROR:",
                        error
                    );


                    // -------------------------------------------------
                    // Keep the job key so the scheduler cannot enqueue
                    // another copy while this job is waiting.
                    // -------------------------------------------------

                    whatsappQueue.unshift(
                        job
                    );


                    console.warn(
                        `WhatsApp queue paused for ${WHATSAPP_FAILURE_PAUSE_MS / 1000} seconds after send failure.`
                    );


                    await sleep(
                        WHATSAPP_FAILURE_PAUSE_MS
                    );


                    continue;
                }


                // =================================================
                // DELAY BEFORE NEXT MESSAGE
                // =================================================

                const delay =
                    WHATSAPP_DELAY_SEQUENCE_MS[
                        whatsappDelayIndex
                    ];


                whatsappDelayIndex =
                    (
                        whatsappDelayIndex + 1
                    ) %
                    WHATSAPP_DELAY_SEQUENCE_MS.length;


                console.log(
                    `Waiting ${delay / 1000} seconds before next WhatsApp message...`
                );


                await sleep(delay);
            }


        } finally {

            whatsappQueueRunning =
                false;


            // -------------------------------------------------
            // If jobs arrived while worker was finishing,
            // start the worker again.
            // -------------------------------------------------

            if (
                whatsappQueue.length > 0 &&
                process.env.WHATSAPP_ENABLED ===
                    "true"
            ) {

                processWhatsAppQueue();
            }
        }
    }


    // =================================================
    // ENQUEUE WHATSAPP MESSAGE
    // =================================================

    function enqueueWhatsApp(
        session,
        messageType,
        options = {}
    ) {

        // -------------------------------------------------
        // WhatsApp disabled.
        // -------------------------------------------------

        if (
            process.env.WHATSAPP_ENABLED !==
            "true"
        ) {

            return;
        }


        // =================================================
        // ================= TEST MODE ====================
        // =================================================
        //
        // أثناء الاختبار:
        // لا تسمح بإضافة أي جلسة إلى WhatsApp Queue
        // إلا لو كانت واحدة من الأربع Sessions المحددة.
        //
        // بعد الاختبار، عند تعطيل WHATSAPP_TEST_MODE:
        // هذا الشرط يسمح لكل الجلسات بالعمل طبيعي.
        //
        // =================================================

        if (
            !isWhatsAppSessionAllowed(session)
        ) {

            return;
        }


        const sessionId =
            String(session._id);


        const jobKey =
            `${sessionId}:${messageType}`;


        // -------------------------------------------------
        // Already queued / processing during runtime.
        // -------------------------------------------------

        if (
            whatsappQueuedKeys.has(jobKey)
        ) {

            return;
        }


        // -------------------------------------------------
        // Persistent sent flags.
        // Prevents enqueue after restart too.
        // -------------------------------------------------
        // -------------------------------------------------
        // Persistent sent flags.
        // Prevents enqueue after restart too.
        // -------------------------------------------------

        if (
            messageType ===
                "pre_session_reminder" &&
            session?.whatsapp
                ?.preSessionReminderSent
        ) {
            return;
        }

        if (
            messageType ===
                "attendance_follow_up" &&
            session?.whatsapp
                ?.attendanceFollowUpSent
        ) {
            return;
        }

        // -------------------------------------------------
        // Mark as queued.
        // -------------------------------------------------

        whatsappQueuedKeys.add(
            jobKey
        );

        whatsappQueue.push({
            session,
            messageType,
            options,
            jobKey
        });

        console.log(
            "WhatsApp job added to queue:",
            {
                patientId:
                    session?.patientId,
                sessionNumber:
                    session?.sessionNumber,
                messageType,
                queueLength:
                    whatsappQueue.length
            }
        );

        // Start worker.
        processWhatsAppQueue();
    }
        // -------------------------------------------------
        // Mark as queued.
        // -------------------------------------------------



    // =================================================
    // PRE-SESSION REMINDER HANDLER
    // =================================================

    async function handlePreSessionReminder(
        session,
        now
    ) {


        // -------------------------------------------------
        // Session 1 does not receive this reminder.
        // -------------------------------------------------

        if (
            Number(session.sessionNumber) <= 1
        ) {

            return;
        }


        if (
            !session.scheduledAt
        ) {

            return;
        }


        const scheduledAt =
            new Date(
                session.scheduledAt
            );


        if (
            Number.isNaN(
                scheduledAt.getTime()
            )
        ) {

            return;
        }


        // -------------------------------------------------
        // Appointment already started/passed.
        // -------------------------------------------------

        if (
            now >= scheduledAt
        ) {

            return;
        }


        // -------------------------------------------------
        // Exactly 24 hours before appointment.
        // -------------------------------------------------

        const reminderTime =
            new Date(
                scheduledAt.getTime() -
                TWENTY_FOUR_HOURS_MS
            );


        // Not inside 24-hour window yet.

        if (
            now < reminderTime
        ) {

            return;
        }


        // -------------------------------------------------
        // Already sent.
        // -------------------------------------------------

        if (
            session.whatsapp
                ?.preSessionReminderSent
        ) {

            return;
        }


        // -------------------------------------------------
        // Add to queue.
        // -------------------------------------------------

        enqueueWhatsApp(
            session,
            "pre_session_reminder"
        );
    }


    // =================================================
    // POST-SESSION FLOW
    // =================================================

    async function handlePostSessionFlow(
        session,
        now
    ) {
// -------------------------------------------------
// Completed session needs no post-session action.
// Never reopen it.
// -------------------------------------------------
if (
    session?.status === "completed"
) {
    return;
}
        if (
            !session.scheduledAt
        ) {

            return;
        }


        const scheduledAt =
            new Date(
                session.scheduledAt
            );


        if (
            Number.isNaN(
                scheduledAt.getTime()
            )
        ) {

            return;
        }


        // -------------------------------------------------
        // 24 HOURS AFTER scheduledAt.
        // -------------------------------------------------

        const followUpTime =
            new Date(
                scheduledAt.getTime() +
                TWENTY_FOUR_HOURS_MS
            );


        if (
            now < followUpTime
        ) {

            return;
        }


        // =================================================
        // PRESENT
        // =================================================

        if (
    session.attendanceStatus ===
    "present"
) {

    if (
        session.whatsapp
            ?.attendanceFollowUpSent
    ) {
        return;
    }

    const opened =
        await openSession(session);

    if (!opened) {
        return;
    }

    const accessCode =
        await ensureAccessCode(session);

    enqueueWhatsApp(
        session,
        "attendance_follow_up",
        {
            accessCode
        }
    );

    return;
}


        // =================================================
        // ABSENT
        // =================================================

        if (
            session.attendanceStatus ===
            "absent"
        ) {

            await createDoctorApprovalRequest(
                session
            );

            return;
        }


        // =================================================
        // PENDING
        // =================================================

        if (
            session.attendanceStatus ===
            "pending"
        ) {

            // Important:
            // pending remains pending.
            // Never convert it to absent here.

            await createDoctorApprovalRequest(
                session
            );

            return;
        }
    }


    // =================================================
    // CHECK ALL SESSIONS
    // =================================================

    async function checkSessions() {
    const schedulerStartTime = Date.now();

    try {
        const now = new Date();

        const twentyFourHoursAgo = new Date(
            now.getTime() - TWENTY_FOUR_HOURS_MS
        );

        const twentyFourHoursFromNow = new Date(
            now.getTime() + TWENTY_FOUR_HOURS_MS
        );

        const sessions = await sessionsCollection
            .find({
                status: { $ne: "completed" },
                scheduledAt: {
                    $gte: twentyFourHoursAgo,
                    $lte: twentyFourHoursFromNow
                }
            })
            .toArray();

        console.log(
            `Scheduler checked ${sessions.length} relevant sessions`
        );

        for (const session of sessions) {
            try {
                await handlePreSessionReminder(session, now);
                await handlePostSessionFlow(session, now);
            } catch (sessionError) {
                console.error(
                    `Scheduler error for session ${session._id}:`,
                    sessionError
                );
            }
        }

        console.log(
            `Scheduler cycle completed in ${Date.now() - schedulerStartTime} ms`
        );

    } catch (error) {
        console.error("FOLLOW-UP SCHEDULER ERROR:", error);
    }
}


    // =================================================
    // START
    // =================================================

    console.log(
        "Follow-up Scheduler started"
    );


    console.log(
        `Scheduler interval: ${SCHEDULER_INTERVAL_MS / 1000} seconds`
    );


    console.log(
        "WhatsApp pre-session reminders enabled for session 2+"
    );


    console.log(
        "WhatsApp post-session follow-ups enabled"
    );


    console.log(
        "WhatsApp queue enabled"
    );


    console.log(
        "WhatsApp message delays:",
        WHATSAPP_DELAY_SEQUENCE_MS.map(
            function(ms) {
                return `${ms / 1000}s`;
            }
        )
    );


    console.log(
        "WhatsApp sending remains controlled by WHATSAPP_ENABLED"
    );


    // =================================================
    // ================= TEST MODE LOG =================
    // =================================================

    if (WHATSAPP_TEST_MODE) {

        console.log(
            "================================="
        );

        console.log(
            "WHATSAPP TEST MODE ENABLED"
        );

        console.log(
            "Only these 4 sessions are allowed to send WhatsApp:"
        );

        console.log(
            Array.from(
                WHATSAPP_TEST_SESSION_IDS
            )
        );

        console.log(
            "================================="
        );

    } else {

        console.log(
            "WhatsApp test mode is disabled"
        );
    }

// -------------------------------------------------
// RUN SCHEDULER LOOP
// -------------------------------------------------

async function runSchedulerLoop() {

    try {

        await checkSessions();

    } catch (error) {

        console.error(
            "SCHEDULER LOOP ERROR:",
            error
        );

    } finally {

        setTimeout(
            runSchedulerLoop,
            SCHEDULER_INTERVAL_MS
        );
    }
}

// -------------------------------------------------
// First run.
// -------------------------------------------------

runSchedulerLoop();
// =====================================================
// EXPORT
// =====================================================
}
module.exports =
    startFollowUpScheduler;