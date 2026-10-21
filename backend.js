// ============================}============================
// Environment
// ========================================================

require("dotenv").config();


// ========================================================
// DNS
// ========================================================

const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);


// ========================================================
// Dependencies
// ========================================================

const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require("mongodb");

const express = require("express");
const cors = require("cors");


// ========================================================
// WhatsApp
// ========================================================
const {
    sendWhatsAppMessage
} = require(
    "./whatsapp"
);


// ========================================================
// Application
// ========================================================

const app = express();

const port = 3000;


// ========================================================
// MongoDB Connection State
// ========================================================

let db = null;

let isMongoConnected = false;

let databaseInitialized = false;


// ========================================================
// MongoDB Client
// ========================================================

const client = new MongoClient(
    process.env.MONGODB_URI,
    {
        family: 4,
        serverSelectionTimeoutMS: 15000
    }
);


// ========================================================
// Initialize Database System
// ========================================================

async function initializeDatabase(db) {

    console.log(
        "Initializing MongoDB routes and services..."
    );


    // ==================================================
    // Collections
    // ==================================================

    const followUpsCollection =
        db.collection("followUps");

    const sessionsCollection =
        db.collection("sessions");
const patientsCollection =
    db.collection("patients");

await patientsCollection.createIndex(
    {
        createdAt: -1
    },
    {
        name: "patients_createdAt_desc"
    }
);
const pingStart = Date.now();
await db.command({ ping: 1 });
console.log(`MongoDB ping: ${Date.now() - pingStart} ms`);

const findStart = Date.now();
await patientsCollection.find({}).toArray();
console.log(`Patients find without sort: ${Date.now() - findStart} ms`);

const sortStart = Date.now();
await patientsCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

console.log(`Patients find with sort: ${Date.now() - sortStart} ms`);
    // ==================================================
    // Questions Router
    // ==================================================
// ==================================================
// Authentication Routes
// ==================================================

app.use(
    "/api/auth",
    require("./auth")(db)
);
    // ==================================================
// Clinics Router
// ==================================================

// ==========================================
// RESET DATABASE
// ==========================================
const doctorNotesRoutes =
    require("./doctorNotes")(db);

app.use(
    "/api/doctor-notes",
    doctorNotesRoutes
);
// ==========================================
// RESET ALL CLINOVA DATA
// ==========================================

app.delete("/api/admin/reset-database", async function (req, res) {
    try {

        const collections = [
            "patients",
            "sessions",
            "questions",
            "followUps",
            "doctorNotes",
            "users",
            "authSessions",
            "sessionAnswers",
        ];

        for (const collectionName of collections) {

            await db
                .collection(collectionName)
                .deleteMany({});
        }

        console.log(
            "ALL CLINOVA DATA RESET SUCCESSFULLY"
        );

        return res.status(200).json({
            message: "All Clinova data deleted successfully",
            deletedCollections: collections
        });

    } catch (error) {

        console.error(
            "DATABASE RESET ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to reset database",
            error: error.message
        });
    }
});
    app.use(
        "/api/questions",
        require("./questions")(db)
    );


    // ==================================================
    // Patients Router
    // ==================================================

    app.use(
        "/api/patients",
        require("./patient")(db)
    );



// 
app.use(
    "/api/clinic-protection",
    require("./clinicProtection")(db)
);
// ==================================================
// Users Router
// ==================================================

    // ==================================================
    // Sessions Router
    // ==================================================

    app.use(
        "/api/sessions",
        require("./session")(db)
    );


    // ==================================================
    // Follow-Up Scheduler
    // ==================================================

    const startFollowUpScheduler =
    require("./followUpScheduler");

startFollowUpScheduler(db);
// ==================================================
// Patient Next Session Scheduler
// ==================================================

// ========================================================
// Patient Next Appointment Scheduler
// ========================================================

const {
    createNextSessionIfNeeded
} = require("./reminder");

setInterval(
    async function () {

        try {

            const now = new Date();

            // ==================================================
            // هات آخر Session لكل مريض فقط
            // ==================================================

            const latestSessions =
                await sessionsCollection
                    .aggregate([
                        {
                            $sort: {
                                patientId: 1,
                                scheduledAt: -1
                            }
                        },
                        {
                            $group: {
                                _id: "$patientId",
                                latestSession: {
                                    $first: "$$ROOT"
                                }
                            }
                        },
                        {
                            $replaceRoot: {
                                newRoot: "$latestSession"
                            }
                        },
                        {
                            $match: {
                                scheduledAt: {
                                    $lte: now
                                }
                            }
                        }
                    ])
                    .toArray();

            // ==================================================
            // التعامل مع آخر موعد فقط لكل مريض
            // ==================================================

            for (
                const session
                of latestSessions
            ) {

                const patient =
                    await patientsCollection.findOne({
                        patientCode:
                            session.patientId
                    });

                if (!patient) {
                    continue;
                }

                await createNextSessionIfNeeded(
                    db,
                    patient,
                    session
                );
            }

        } catch (error) {

            console.error(
                " error:",
                error
            );
        }

    },
    6 * 10000
);

console.log(
    "NEXT APPOINTMENT SCHEDULER STARTED"
);

    // ==================================================
    // Reminder Checker
    // ==================================================

    const {
        checkReminders
    } = require("./reminder");


    setInterval(
        function () {

            if (!isMongoConnected) {

                console.log(
                    "Reminder skipped: MongoDB disconnected."
                );

                return;
            }

            checkReminders(db);

        },
        6 * 10000
    );


    // ==================================================
    // Doctor Approval - Follow-up
    // ==================================================

    app.post(
        "/api/followups/:followUpId/approval",

        async function (req, res) {

            // ======================================
            // MongoDB Check
            // ======================================

            if (!isMongoConnected) {

                return res.status(503).json({

                    message:
                        "Database is temporarily unavailable. Please try again."

                });
            }


            try {

                const {
                    followUpId
                } = req.params;


                const {
                    status
                } = req.body;


                // باقي كود الـ approval الحالي
                // يفضل كما هو عندك هنا


            }
            catch (error) {

                console.error(
                    "Approval error:",
                    error
                );


                return res.status(500).json({

                    message:
                        "Server error",

                    error:
                        error.message

                });
            }
        }
    );



    async function runScheduler() {
        try{
            await checkNextAppointments()
        }
        catch (error) {
            console.error("Scheduler error:", error);
        }
        finally {
        setTimeout(runScheduler, 60 *1000);
    }
    }
runScheduler();

async function checkNextAppointments() {
    try {
        const latestSessions = await sessionsCollection.aggregate([
            {
                $sort: {
                    patientId: 1,
                    scheduledAt: -1
                }
            },
            {
                $group: {
                    _id: "$patientId",
                    latest: {
                        $first: "$$ROOT"
                    }
                }
            }
        ]).toArray();

        for (const session of latestSessions) {

            const patient = await patientsCollection.findOne({
                patientCode: session.patientId
            });

            if (!patient) {
                continue;
            }

            const nextAppointment = await createNextSessionIfNeeded(
                db,
                patient,
                session
            );

            if (!nextAppointment) {
                continue;
            }

            console.log(
                `Next appointment calculated for patient ${patient.patientCode} at ${nextAppointment.appointmentAt}`
            );
        }

    } catch (error) {
        console.error("Error checking next appointments:", error);
    }
}


    console.log(
        "MongoDB routes initialized successfully"
    );
}


// ========================================================
// Middleware
// ========================================================

app.use(cors());

app.use(express.json());

// ========================================================
// MongoDB Connection
// ========================================================

async function connectDB() {

    // ------------------------------------------
    // Already Connected
    // ------------------------------------------

    if (isMongoConnected) {

        return true;
    }


    try {

        console.log(
            "Connecting to MongoDB..."
        );


        // ======================================
        // Connect
        // ======================================

        await client.connect();


        // ======================================
        // Database
        // ======================================

        db =
            client.db("clinova");


        // ======================================
        // Connection State
        // ======================================

        isMongoConnected = true;


        console.log(
            "MongoDB connected successfully"
        );


        // ======================================
        // Initialize Database System مرة واحدة فقط
        // ======================================

        if (!databaseInitialized) {

            await initializeDatabase(db);

            databaseInitialized = true;
        }


        return true;

    }
    catch (error) {

        isMongoConnected = false;


        console.error(
            "MongoDB connection failed:",
            error.message
        );


        return false;
    }
}


// ========================================================
// Test Routes
// ========================================================

app.get(
    "/hello",

    function (req, res) {

        res.send(
            "Hello World!"
        );
    }
);


app.get(
    "/test",

    function (req, res) {

        res.send(
            "Hello test!"
        );
    }
);


async function testWhatsApp() {

    try {

        const result =
            await sendWhatsAppMessage(

                '201113385257',

                "رسالة اختبار من Clinova 🚀"

            );


        console.log(
            "TEST SUCCESS:",
            result
        );

    }

    catch (error) {

        console.error(
            "TEST FAILED:",
            error.message
        );

    }

}


// testWhatsApp();
// ========================================================
// WhatsApp Status
// ========================================================

app.get(
    "/api/whatsapp/status",

    function (req, res) {

        const hasToken =
            Boolean(
                process.env.WHATS360_TOKEN
            );

        const hasInstance =
            Boolean(
                process.env.WHATS360_INSTANCE_ID
            );

        return res.status(200).json({

            configured:
                hasToken && hasInstance,

            tokenConfigured:
                hasToken,

            instanceConfigured:
                hasInstance,

            message:
                hasToken && hasInstance
                    ? "Whats360 API is configured"
                    : "Whats360 API configuration is missing"

        });

    }

);


// ========================================================
// Start Server
// ========================================================

app.listen(
    port,

    function () {

        console.log(
            `Server is running on port ${port}`
        );


        // ======================================
        // Start MongoDB Connection
        // ======================================

        connectDB();
    }
);


// f1f9f5d5810709ea2af838b1d9138bfed6bc9b4f5e51be67547034e7f6c23d9c