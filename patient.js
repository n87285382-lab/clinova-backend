const express = require("express");
const { ObjectId } = require("mongodb");
const sessionService =
    require("./sessionService");
const router = express.Router();
const createAuthMiddleware =
    require("./authMiddleware");

module.exports = (db) => {
console.log("PATIENT ROUTER LOADED");
    const patientsCollection =
        db.collection("patients");
const authMiddleware =
    createAuthMiddleware(db);
const sessionsCollection =
    db.collection("sessions");

const followUpsCollection =
    db.collection("followUps");

const sessionAnswersCollection =
    db.collection("sessionAnswers");
    // ========================================================
    // GET - جلب كل المرضى
    // ========================================================

const {
    createPatientSession
} = sessionService(db);
// ========================================================
// GET - جلب كل المرضى
// ========================================================
router.get("/", async (req, res) => {
    try {
console.log("🔥 PATIENT GET ROUTE HIT");
        console.log("FILTER:", req.query.filter);
        const requestStartTime = Date.now();

        let sessionsQueriesCount = 0;
        let followUpsQueriesCount = 0;

        let sessionsQueriesTime = 0;
        let followUpsQueriesTime = 0;

        const filter = String(req.query.filter || "all")
            .trim()
            .toLowerCase();


        // ==========================================
        // جلب كل المرضى
        // ==========================================

        const patientsStartTime = Date.now();

        const patients = await patientsCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

if (filter === "all") {

            console.log(
                `GET /api/patients - total all response: ${Date.now() - patientsStartTime} ms`
            );

            return res.json(patients);
        }
        // ==========================================
        // استخراج patientCode لكل المرضى
        // ==========================================

        const patientIds =
            patients.map(patient => patient.patientCode);


        // ==========================================
        // جلب آخر Session لكل مريض
        // ==========================================

        const latestSessions =
            await sessionsCollection.aggregate([

                {
                    $match: {
                        patientId: {
                            $in: patientIds
                        }
                    }
                },

                {
                    $sort: {
                        patientId: 1,
                        sessionNumber: -1
                    }
                },

                {
                    $group: {
                        _id: "$patientId",

                        latestSession: {
                            $first: "$$ROOT"
                        }
                    }
                }

            ]).toArray();


        // ==========================================
        // تحويل آخر Sessions إلى Map
        // ==========================================

        const latestSessionsMap = new Map();


        for (const item of latestSessions) {

            latestSessionsMap.set(
                item._id,
                item.latestSession
            );

        }


        const patientsQueryTime =
            Date.now() - patientsStartTime;


        console.log(
            `GET /api/patients - patients query: ${patientsQueryTime} ms`
        );

        console.log(
            `GET /api/patients - patients count: ${patients.length}`
        );


        // ==========================================
        // لو مفيش فلترة
        // ==========================================

        


        // ==========================================
        // Helpers
        // ==========================================

        function normalizeRisk(value) {

            if (!value) {
                return "none";
            }


            const risk = String(value)
                .trim()
                .toLowerCase();


            if (
                risk === "high" ||
                risk === "critical" ||
                risk === "عالي" ||
                risk === "مرتفع"
            ) {
                return "high";
            }


            if (
                risk === "medium" ||
                risk === "moderate" ||
                risk === "متوسط" ||
                risk === "متوسطه"
            ) {
                return "medium";
            }


            if (
                risk === "low" ||
                risk === "mild" ||
                risk === "بسيط" ||
                risk === "منخفض"
            ) {
                return "low";
            }


            return "none";
        }


        function getRiskFromSession(session) {

            const assessment =
                session?.assessmentResult || {};


            const possibleRiskValues = [

                assessment?.risk,

                assessment?.riskLevel,

                assessment?.overallRisk,

                assessment?.risk?.level,

                assessment?.risk?.riskLevel,

                session?.risk,

                session?.riskLevel

            ];


            for (const value of possibleRiskValues) {

                if (
                    value !== undefined &&
                    value !== null &&
                    value !== ""
                ) {

                    return normalizeRisk(value);
                }

            }


            return "none";
        }


        function getRiskOrder(risk) {

            const order = {
                high: 1,
                medium: 2,
                low: 3,
                none: 4
            };


            return order[risk] || 4;
        }


        function isConfirmationConfirmed(value) {

            if (value === true) {
                return true;
            }


            const normalized =
                String(value || "")
                    .trim()
                    .toLowerCase();


            return (
                normalized === "confirmed" ||
                normalized === "confirm" ||
                normalized === "yes" ||
                normalized === "true" ||
                normalized === "مؤكد" ||
                normalized === "تم التأكيد"
            );
        }


        function getConfirmationStatus(session) {

            const value =
                session?.confirmationStatus ??
                session?.appointmentConfirmationStatus ??
                session?.whatsappConfirmationStatus ??
                null;


            if (value === null) {
                return "unknown";
            }


            return isConfirmationConfirmed(value)
                ? "confirmed"
                : "unconfirmed";
        }


        function needsFollowUpFromRecords(records) {

            if (
                !Array.isArray(records) ||
                records.length === 0
            ) {
                return false;
            }


            const activeStatuses = [
                "pending",
                "pending_approval",
                "ready",
                "open",
                "opened",
                "waiting"
            ];


            return records.some(followUp => {

                const status =
                    String(followUp?.status || "")
                        .trim()
                        .toLowerCase();


                return activeStatuses.includes(status);

            });
        }


        // ==========================================
        // تاريخ اليوم
        // ==========================================

        const today = new Date();

        const todayYear =
            today.getFullYear();

        const todayMonth =
            today.getMonth();

        const todayDate =
            today.getDate();


        // ==========================================
        // تجهيز بيانات كل مريض
        // ==========================================

        const enrichedPatients = [];


        for (const patient of patients) {

    const patientId =
        patient.patientCode;

    const latestSession =
        latestSessionsMap.get(patientId) || null;

    const riskLevel =
        getRiskFromSession(latestSession);

    enrichedPatients.push({
        ...patient,

        _filterData: {
            riskLevel,

            riskOrder:
                getRiskOrder(riskLevel)
        }
    });
}


        // ==========================================
        // تطبيق الفلترة
        // ==========================================

        let filteredPatients =
            enrichedPatients;


        // ==========================================
        // Risk
        // ==========================================

if (filter === "risk") {

    filteredPatients =
        enrichedPatients
            .filter(patient => {

                const risk =
                    patient._filterData.riskLevel;

                return (
                    risk === "high" ||
                    risk === "medium" ||
                    risk === "low"
                );
            })
            .sort((a, b) => {

                return (
                    a._filterData.riskOrder -
                    b._filterData.riskOrder
                );
            });
}

        // ==========================================
        // Follow Up
        // ==========================================

        else if (filter === "follow-up") {

            filteredPatients =
                enrichedPatients.filter(patient => {

                    const hasFollowUp =
                        patient._filterData
                            .needsFollowUp === true;


                    const hasOpenSession =
                        patient._filterData
                            .hasOpenSession === true;


                    return (
                        hasFollowUp &&
                        hasOpenSession
                    );

                });
        }


        // ==========================================
        // Unconfirmed
        // ==========================================

        else if (filter === "unconfirmed") {

            filteredPatients =
                enrichedPatients.filter(patient => {

                    return (
                        patient._filterData
                            .hasTodaySession === true &&

                        patient._filterData
                            .confirmationStatus ===
                            "unconfirmed"
                    );

                });
        }


        // ==========================================
        // Confirmed
        // ==========================================

        else if (filter === "confirmed") {

            filteredPatients =
                enrichedPatients.filter(patient => {

                    return (
                        patient._filterData
                            .hasTodaySession === true &&

                        patient._filterData
                            .confirmationStatus ===
                            "confirmed"
                    );

                });
        }


        // ==========================================
        // Attendance Today
        // ==========================================

        else if (filter === "attendance-today") {

            filteredPatients =
                enrichedPatients.filter(patient => {

                    return (
                        patient._filterData
                            .hasTodaySession === true &&

                        patient._filterData
                            .attendanceStatus ===
                            "pending"
                    );

                });
        }


        // ==========================================
        // إزالة البيانات الداخلية
        // ==========================================

        filteredPatients =
            filteredPatients.map(patient => {

                const cleanPatient = {
                    ...patient
                };


                delete cleanPatient._filterData;


                return cleanPatient;

            });


        // ==========================================
        // Performance Test
        // ==========================================

        const totalRequestTime =
            Date.now() - requestStartTime;


        console.log(
            "========================================"
        );

        console.log(
            "PATIENTS PERFORMANCE TEST"
        );

        console.log(
            "========================================"
        );


        console.log(
            `Patients count: ${patients.length}`
        );


        console.log(
            `Patients query: ${patientsQueryTime} ms`
        );


        console.log(
            `Sessions queries count: ${sessionsQueriesCount}`
        );


        console.log(
            `Sessions queries total: ${sessionsQueriesTime} ms`
        );


        console.log(
            `FollowUps queries count: ${followUpsQueriesCount}`
        );


        console.log(
            `FollowUps queries total: ${followUpsQueriesTime} ms`
        );


        console.log(
            `Total request: ${totalRequestTime} ms`
        );


        console.log(
            "========================================"
        );


        return res.json(filteredPatients);


    } catch (error) {

        console.error(
            "PATIENT FILTER ERROR:",
            error
        );


        return res.status(500).json({
            message: "Failed to load patients"
        });

    }
});

// ========================================================
// GET - جلب بيانات مريض واحد بواسطة patientCode
// ========================================================
router.get(
    "/by-code/:patientCode",
    async function (req, res) {
    try {
        const patientCode =
            String(req.params.patientCode || "")
                .trim();

        if (!patientCode) {
            return res.status(400).json({
                message: "Patient code is required"
            });
        }

        const patient =
    await patientsCollection.findOne({
        
        patientCode
    });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        return res.status(200).json({
            success: true,
            patient
        });

    } catch (error) {
        console.error(
            "GET PATIENT BY CODE ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to load patient"
        });
    }
});

    // ========================================================
    // SEARCH - البحث عن المرضى
    // مهم جدًا: قبل /:id
    // ========================================================

    // ========================================================
// SEARCH - البحث عن المرضى
// البحث بالاسم / الهاتف / كود المريض
// ========================================================

router.get(
    "/search",
    
    async (req, res) => {

    try {

        const type =
            String(
                req.query.type || "name"
            )
                .trim()
                .toLowerCase();


        const query =
            String(
                req.query.q || ""
            )
                .trim();


        // ====================================================
        // Validate Search Query
        // ====================================================

        if (!query) {

            return res.status(400).json({

                message:
                    "Search query is required"

            });
        }


        // ====================================================
        // Escape Regex
        // منع الأحرف الخاصة من تغيير معنى البحث
        // ====================================================

        const escapedQuery =
            query.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );


        let filter = {
    
};


        // ====================================================
        // Search By Name
        // ====================================================

        if (type === "name") {

            filter = {
    name: {
        $regex: escapedQuery,
        $options: "i"
    }
};

        }


        // ====================================================
        // Search By Patient Code
        // مثال: PT-0001
        // ====================================================

        else if (type === "code") {

            filter = {
    patientCode: {
        $regex: escapedQuery,
        $options: "i"
    }
};

        }


        // ====================================================
        // Search By Phone
        // ====================================================

        else if (type === "phone") {

            filter = {
    phone: {
        $regex: escapedQuery,
        $options: "i"
    }
};

        }


        // ====================================================
        // Invalid Search Type
        // ====================================================

        else {

            return res.status(400).json({

                message:
                    "Invalid search type. Use name, code, or phone."

            });
        }


        // ====================================================
        // Execute Search
        // ====================================================

        const patients =
            await patientsCollection
                .find(filter)
                .sort({
                    createdAt: -1
                })
                .limit(20)
                .toArray();


        // ====================================================
        // Response
        // ====================================================

        return res.status(200).json({

            searchType: type,

            query,

            count:
                patients.length,

            patients

        });


    } catch (error) {

        console.error(
            "SEARCH PATIENTS ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to search patients"

        });

    }

});


    // ========================================================
    // GET - جلب مريض واحد بواسطة ID
    // ========================================================

    router.get(
    "/:id",
    
    async (req, res) => {
 console.log("PATIENT ID ROUTE HIT");
    console.log("ID RECEIVED:", req.params.id);
        try {

            const id =
                req.params.id;


            if (!ObjectId.isValid(id)) {

                return res.status(400).json({

                    message:
                        "Invalid patient ID"

                });

            }


            const patient =
    await patientsCollection.findOne({
        _id:
            new ObjectId(id),

        
    });


            if (!patient) {

                return res.status(404).json({

                    message:
                        "Patient not found"

                });

            }


            return res.status(200).json(
                patient
            );


        } catch (error) {

            console.error(
                "GET PATIENT BY ID ERROR:",
                error
            );

            return res.status(500).json({

                message:
                    "Failed to get patient"

            });

        }

    });


    // ========================================================
    // POST - إضافة مريض
    // ========================================================

    router.post("/",async (req, res) => {

        try {

            const patientNew =
                req.body;


            if (
                !patientNew ||
                typeof patientNew !== "object" ||
                Array.isArray(patientNew)
            ) {

                return res.status(400).json({

                    message:
                        "Invalid patient data"

                });

            }


            if (
                !patientNew.name ||
                !patientNew.phone ||
                patientNew.age === undefined ||
                patientNew.age === null ||
                !patientNew.patientType ||
                !patientNew.mainProblem
            ) {

                return res.status(400).json({

                    message:
                        "Missing required patient data"

                });

            }


            const name =
                String(
                    patientNew.name
                ).trim();


            const phone =
                String(
                    patientNew.phone
                ).trim();


            const patientType =
                String(
                    patientNew.patientType
                ).trim();


            const mainProblem =
                String(
                    patientNew.mainProblem
                ).trim();


            const age =
                Number(
                    patientNew.age
                );


            if (
                !Number.isInteger(age) ||
                age < 1 ||
                age > 110
            ) {

                return res.status(400).json({

                    message:
                        "Age must be between 1 and 110"

                });

            }


            if (
                !/^[0-9]{11}$/.test(phone)
            ) {

                return res.status(400).json({

                    message:
                        "Phone must contain exactly 11 digits"

                });

            }


            if (
                !patientNew.schedule ||
                !Array.isArray(
                    patientNew.schedule.days
                ) ||
                patientNew.schedule.days.length === 0
            ) {

                return res.status(400).json({

                    message:
                        "At least one attendance day is required"

                });

            }


            const schedule = {

                days:
                    patientNew.schedule.days,

                time:
                    patientNew.schedule.time || null,

                duration:
                    patientNew.schedule.duration !== null &&
                    patientNew.schedule.duration !== undefined &&
                    patientNew.schedule.duration !== ""
                        ? Number(
                            patientNew.schedule.duration
                        )
                        : null,

                startDate:
                    patientNew.schedule.startDate ||
                    null

            };


            const lastPatient =
    await patientsCollection
        .find({
            
        })
        .sort({
            patientNumber: -1
        })
        .limit(1)
        .toArray();


            let patientNumber = 1;


            if (lastPatient.length > 0) {

                patientNumber =
                    (
                        lastPatient[0].patientNumber || 0
                    ) + 1;

            }


            const patientCode =
                `PT-${String(
                    patientNumber
                ).padStart(4, "0")}`;


            const patient = {

                patientNumber,

                patientCode,

                name,
                
                phone,

                age,

                patientType,

                mainProblem,

                schedule,

                notes:
                    patientNew.notes
                        ? String(
                            patientNew.notes
                        ).trim()
                        : "",

                createdAt:
                    new Date()

            };


            const result =
                await patientsCollection.insertOne(
                    patient
                );

                // ==========================================
// Create First Session Automatically
// ==========================================

const firstSession = await createPatientSession(
    patientCode,
    new Date(),
    {
        openImmediately: true
    }
);

            return res.status(201).json({

    message:
        "Patient and first session created successfully",

    patient: {

        ...patient,

        _id:
            result.insertedId

    },

    firstSession: {

        _id:
            firstSession._id,

        sessionNumber:
            firstSession.sessionNumber,

        status:
            firstSession.status,

        accessLink:
            firstSession.accessLink

    }

});


        } catch (error) {

            console.error(
                "POST PATIENT ERROR:",
                error
            );

            return res.status(500).json({

                message:
                    "Failed to add patient"

            });

        }

    });


    // ========================================================
    // PUT - تعديل بيانات مريض
    // ========================================================

    router.put("/:id", async (req, res) => {

        try {

            const id =
                req.params.id;


            if (!ObjectId.isValid(id)) {

                return res.status(400).json({

                    message:
                        "Invalid patient ID"

                });

            }


            const patientNew =
                req.body;


            if (
                !patientNew ||
                !patientNew.name ||
                !patientNew.phone ||
                patientNew.age === undefined ||
                !patientNew.patientType ||
                !patientNew.mainProblem
            ) {

                return res.status(400).json({

                    message:
                        "Missing required patient data"

                });

            }


            const name =
                String(
                    patientNew.name
                ).trim();


            const phone =
                String(
                    patientNew.phone
                ).trim();


            const patientType =
                String(
                    patientNew.patientType
                ).trim();


            const mainProblem =
                String(
                    patientNew.mainProblem
                ).trim();


            const age =
                Number(
                    patientNew.age
                );


            if (
                !Number.isInteger(age) ||
                age < 1 ||
                age > 110
            ) {

                return res.status(400).json({

                    message:
                        "Age must be between 1 and 110"

                });

            }


            if (
                !/^[0-9]{11}$/.test(phone)
            ) {

                return res.status(400).json({

                    message:
                        "Phone must contain exactly 11 digits"

                });

            }


            const schedule = {

                days:
                    patientNew.schedule?.days || [],

                time:
                    patientNew.schedule?.time || null,

                duration:
                    patientNew.schedule?.duration !== null &&
                    patientNew.schedule?.duration !== undefined &&
                    patientNew.schedule?.duration !== ""
                        ? Number(
                            patientNew.schedule.duration
                        )
                        : null,

                startDate:
                    patientNew.schedule?.startDate || null

            };


            const updatedData = {

                name,

                phone,

                age,

                patientType,

                mainProblem,

                schedule,

                notes:
                    patientNew.notes
                        ? String(
                            patientNew.notes
                        ).trim()
                        : "",

                updatedAt:
                    new Date()

            };


            const result =
    await patientsCollection.updateOne(
        {
            _id:
                new ObjectId(id),

            
        },
        {
            $set:
                updatedData
        }
    );


            if (
                result.matchedCount === 0
            ) {

                return res.status(404).json({

                    message:
                        "Patient not found"

                });

            }


            return res.status(200).json({

                message:
                    "Patient updated successfully",

                patientId:
                    id

            });


        } catch (error) {

            console.error(
                "PUT PATIENT ERROR:",
                error
            );

            return res.status(500).json({

                message:
                    "Failed to update patient"

            });

        }

    });


    // ========================================================
    // DELETE - حذف مريض
    // ========================================================

    // ========================================================
// DELETE - حذف المريض وكل البيانات المرتبطة به
// ========================================================

router.delete("/:id", async (req, res) => {

    try {

        const id = req.params.id;


        // ====================================================
        // Validate Patient ID
        // ====================================================

        if (!ObjectId.isValid(id)) {

            return res.status(400).json({
                message: "Invalid patient ID"
            });

        }


        // ====================================================
        // Get Patient
        // ====================================================

        const patient =
    await patientsCollection.findOne({
        _id: new ObjectId(id),
        
    });


        if (!patient) {

            return res.status(404).json({
                message: "Patient not found"
            });

        }


        // ====================================================
        // Patient Code
        // ====================================================

        const patientCode =
            patient.patientCode;


        // ====================================================
        // Get Patient Sessions
        // ====================================================

        const patientSessions =
            await sessionsCollection
                .find({
                    patientId: patientCode
                })
                .project({
                    _id: 1
                })
                .toArray();


        const sessionIds =
            patientSessions.map(
                function (session) {
                    return session._id;
                }
            );


        // ====================================================
        // Delete Session Answers
        // ====================================================

        let deletedSessionAnswers = 0;


        if (sessionIds.length > 0) {

            const answersResult =
                await sessionAnswersCollection.deleteMany({
                    sessionId: {
                        $in: sessionIds
                    }
                });


            deletedSessionAnswers =
                answersResult.deletedCount;
        }


        // ====================================================
        // Delete Follow-Ups
        // ====================================================

        const followUpsResult =
            await followUpsCollection.deleteMany({
                patientId: patientCode
            });


        // ====================================================
        // Delete Sessions
        // ====================================================

        const sessionsResult =
            await sessionsCollection.deleteMany({
                patientId: patientCode
            });


        // ====================================================
        // Delete Patient
        // ====================================================

        const patientResult =
            await patientsCollection.deleteOne({
                _id: new ObjectId(id)
            });


        // ====================================================
        // Safety Check
        // ====================================================

        if (
            patientResult.deletedCount === 0
        ) {

            return res.status(500).json({
                message:
                    "Patient could not be deleted completely"
            });

        }


        // ====================================================
        // Success Response
        // ====================================================

        console.log(
            "PATIENT AND RELATED DATA DELETED:",
            {
                patientId: patientCode,
                followUps:
                    followUpsResult.deletedCount,
                sessions:
                    sessionsResult.deletedCount,
                sessionAnswers:
                    deletedSessionAnswers
            }
        );


        return res.status(200).json({

            message:
                "Patient and all related data deleted successfully",

            patientId:
                patientCode,

            deleted: {

                patient: 1,

                sessions:
                    sessionsResult.deletedCount,

                followUps:
                    followUpsResult.deletedCount,

                sessionAnswers:
                    deletedSessionAnswers

            }

        });


    } catch (error) {

        console.error(
            "DELETE PATIENT CASCADE ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to delete patient and related data",

            error:
                error.message

        });

    }

});




//     router.get("/patient/:patientId/progress-comparison", async (req, res) => {
//     try {
//         const { patientId } = req.params;

//         const sessions = await patientsCollection
//             .find({
//                 patientId: patientId,
//                 status: "completed"
//             })
//             .sort({ sessionNumber: 1 })
//             .toArray();

//         if (sessions.length < 2) {
//             return res.status(400).json({
//                 message: "Not enough completed sessions for comparison",
//                 sessionsCount: sessions.length
//             });
//         }

//         const currentSession = sessions[sessions.length - 1];
//         const previousSession = sessions[sessions.length - 2];

//         const riskOrder = {
//             low: 1,
//             medium: 2,
//             high: 3
//         };

//         const previousRiskValue =
//             riskOrder[previousSession.assessmentResult?.riskLevel];

//         const currentRiskValue =
//             riskOrder[currentSession.assessmentResult?.riskLevel];

//         let trend = "stable";
//         let message = "لا يوجد تغير واضح بين الجلستين";

//         if (currentRiskValue < previousRiskValue) {
//             trend = "improvement";
//             message = "يوجد تحسن مقارنة بالجلسة السابقة";
//         } else if (currentRiskValue > previousRiskValue) {
//             trend = "decline";
//             message = "يوجد تراجع مقارنة بالجلسة السابقة";
//         }

//         res.status(200).json({
//             patientId,

//             previousSession: {
//                 sessionNumber: previousSession.sessionNumber,
//                 riskLevel: previousSession.assessmentResult?.riskLevel ?? null,
//                 score: previousSession.assessmentResult?.totalScore ?? null
//             },

//             currentSession: {
//                 sessionNumber: currentSession.sessionNumber,
//                 riskLevel: currentSession.assessmentResult?.riskLevel ?? null,
//                 score: currentSession.assessmentResult?.totalScore ?? null
//             },

//             comparison: {
//                 trend,
//                 message
//             }
//         });

//     } catch (error) {
//         console.error(error);

//         res.status(500).json({
//             message: "Failed to compare sessions"
//         });
//     }
// });



console.log("PATIENT ROUTER READY");
    // ========================================================
    // RETURN ROUTER
    // ========================================================

    return router;

};