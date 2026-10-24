const crypto = require("crypto");

module.exports = function (db) {

    const patientsCollection =
        db.collection("patients");

    const sessionsCollection =
        db.collection("sessions");

    const questionsCollection =
        db.collection("questions");
const answersCollection =
    db.collection("sessionAnswers");

const {
    determineFollowUpTrend
} = require("./trendEngine");

    // ==========================================
    // Generate Session Token
    // ==========================================

    function generateSessionToken() {

        return crypto
            .randomBytes(32)
            .toString("hex");

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
// ==========================================
// Current Question Set Version
// ==========================================

const CURRENT_QUESTION_SET_VERSION = 2;


    // ==========================================
    // Create Patient Session
    // ==========================================

    async function createPatientSession(

        patientId,
        scheduledAt,
        options = {}

    ) {

        const {
    openImmediately = false,
    skipPreviousSessionCheck = false
} = options;


        // ==========================================
        // Validate Date
        // ==========================================

        const sessionDate =
            new Date(scheduledAt);

        if (

            isNaN(
                sessionDate.getTime()
            )

        ) {

            throw new Error(
                "Invalid scheduledAt"
            );

        }


        // ==========================================
        // Get Patient
        // ==========================================

        const patient =
            await patientsCollection.findOne({

                patientCode:
                    patientId

            });


        if (!patient) {

            throw new Error(
                "Patient not found"
            );

        }


        // ==========================================
        // Validate Patient Type
        // ==========================================

        const patientType =
            String(

                patient.patientType ||
                ""

            )

                .trim()
                .toLowerCase();


        if (

            patientType !== "adult" &&
            patientType !== "child"

        ) {

            throw new Error(
                "Invalid patient type"
            );

        }


        // ==========================================
// Get Last Session
// ==========================================
const lastSession =
    await sessionsCollection.findOne(
        {
            patientId:
                patientId
        },
        {
            sort: {
                sessionNumber: -1
            }
        }
    );

// ==========================================
// First Session
// ==========================================
if (!lastSession) {

    // أول جلسة مسموح إنشاؤها
} else {

    // ==========================================
    // Previous Session Must Be Completed
    // Before Creating The Next Session
    // ==========================================
    if (!skipPreviousSessionCheck) {

    if (lastSession.status !== "completed") {
        console.log(
            "PREVIOUS SESSION CHECK:",
            {
                patientId,
                lastSession: lastSession
                    ? {
                        _id: lastSession._id,
                        sessionNumber: lastSession.sessionNumber,
                        status: lastSession.status,
                        attendanceStatus: lastSession.attendanceStatus,
                        scheduledAt: lastSession.scheduledAt,
                        completedAt: lastSession.completedAt
                    }
                    : null
            }
        );

        throw new Error(
            "Previous session is not completed"
        );
    }

    if (lastSession.attendanceStatus !== "present") {
        throw new Error(
            "Previous session attendance is not present"
        );
    }

}
}

const nextSessionNumber =
    lastSession
        ? lastSession.sessionNumber + 1
        : 1;

const isFirstSession = !lastSession;

const shouldOpenImmediately =
    isFirstSession || openImmediately;
        // ==========================================
        // Get Session Questions
        // ==========================================

const sessionQuestions =
    await questionsCollection
        .find({
            patientType:
                patientType,

            questionSetVersion:
                CURRENT_QUESTION_SET_VERSION,

            sessionNumber:
                nextSessionNumber
        })
        .sort({
            order:
                1
        })
        .toArray();


        if (

            sessionQuestions.length === 0

        ) {

            throw new Error(

                `Questions for session ${nextSessionNumber} not found`

            );

        }


        // ==========================================
        // Generate Access Token
        // ==========================================

        const accessToken =
            generateSessionToken();


        const accessLink =
    `http://localhost:5501/follow.html?token=${accessToken}`;


        const now =
            new Date();


        // ==========================================
        // Create Session
        // ==========================================

        const newSession = {

             patientId:
        patientId,

    patientName:
        patient.name,

    patientType:
        patientType,

    sessionNumber:
        nextSessionNumber,

    questionSetVersion:
        CURRENT_QUESTION_SET_VERSION,

    questions:
        sessionQuestions,

            // ======================================
            // Session Status
            // ======================================

            status:
    shouldOpenImmediately
        ? "opened"
        : "scheduled",

openedAt:
    shouldOpenImmediately
        ? now
        : null,


            attendanceStatus:
    "pending",

absentDecision:
    "pending",

absentDecisionAt:
    null,


            scheduledAt:
                sessionDate,


            // openedAt:

            //     openImmediately

            //         ? now

            //         : null,


            completedAt:
                null,


            accessToken:
                accessToken,


            accessLink:
                accessLink,


            accessTokenCreatedAt:
                now,


            createdAt:
                now,


            updatedAt:
                now

        };


        // ==========================================
        // Save Session
        // ==========================================

        const result =
            await sessionsCollection.insertOne(

                newSession

            );


        return {

            _id:
                result.insertedId,

            ...newSession

        };

    }




    // ==========================================
// Get One Session For Doctor
// Read Only
// ==========================================
async function getDoctorSession(
    patientId,
    sessionNumber
) {

    // ==========================================
    // Validate Patient Code
    // ==========================================

    if (!patientId) {

        throw new Error(
            "Patient ID is required"
        );

    }


    // ==========================================
    // Validate Session Number
    // ==========================================

    const parsedSessionNumber =
        Number(sessionNumber);

    if (
        !Number.isInteger(
            parsedSessionNumber
        ) ||
        parsedSessionNumber < 1
    ) {

        throw new Error(
            "Invalid session number"
        );

    }


    // ==========================================
    // Get Session
    // ==========================================

    const session =
        await sessionsCollection.findOne({

            patientId,

            sessionNumber:
                parsedSessionNumber

        });


    if (!session) {

        throw new Error(
            "Session not found"
        );

    }


    // ==========================================
    // Get Session Answers
    // ==========================================

    const answers =
        await answersCollection
            .find({

                sessionId:
                    String(session._id)

            })
            .sort({

                createdAt:
                    1

            })
            .toArray();


    // ==========================================
    // Build Session Question Map
    //
    // Session Snapshot Has Priority
    // ==========================================

    const sessionQuestions =
        Array.isArray(
            session.questions
        )
            ? session.questions
            : [];


    const questionMap =
        new Map();


    for (
        const question
        of sessionQuestions
    ) {

        if (
            !question?.questionId
        ) {

            continue;

        }


        questionMap.set(
            question.questionId,
            question
        );

    }


    // ==========================================
    // Load Question Catalog For Missing Questions
    // ==========================================

    const questionSetVersion =
        session.questionSetVersion ??
        CURRENT_QUESTION_SET_VERSION;


    const questionCatalog =
        await questionsCollection
            .find({

                patientType:
                    session.patientType,

                questionSetVersion:
                    questionSetVersion

            })
            .sort({

                order:
                    1

            })
            .toArray();


    // ==========================================
    // Fill Missing Questions
    //
    // Important:
    // This does NOT make unanswered questions
    // appear, because we iterate over answers
    // later.
    // ==========================================

    for (
        const question
        of questionCatalog
    ) {

        if (
            !question?.questionId
        ) {

            continue;

        }


        if (
            questionMap.has(
                question.questionId
            )
        ) {

            continue;

        }


        questionMap.set(
            question.questionId,
            question
        );

    }


    // ==========================================
    // Build Question + Answer View
    //
    // IMPORTANT:
    // Only answered records are included.
    // Unopened / unanswered follow-ups are
    // automatically excluded.
    // ==========================================

    const questionAnswers = [];


    for (
        const answer
        of answers
    ) {

        if (
            !answer?.questionId
        ) {

            continue;

        }


        const question =
            questionMap.get(
                answer.questionId
            );


        // ======================================
        // Question Not Found
        // ======================================

        if (!question) {

            questionAnswers.push({

                questionId:
                    answer.questionId,

                order:
                    null,

                questionText:
                    null,

                answerId:
                    answer.answerId ??
                    null,

                answerValue:
                    null,

                answerText:
                    answer.answerText ??
                    null,

                score:
                    null,

                riskLevel:
                    null,

                trackKey:
                    null,

                answered:
                    true

            });

            continue;

        }


        // ======================================
        // Find Actual Selected Answer
        // ======================================

        const selectedAnswer =
            Array.isArray(
                question.answers
            )
                ? question.answers.find(
                    function (item) {

                        return (
                            item?.id ===
                            answer?.answerId
                        );

                    }
                )
                : null;


        // ======================================
        // Build Doctor Answer
        // ======================================

        questionAnswers.push({

            questionId:
                answer.questionId,

            order:
                question.order ??
                null,

            questionText:
                question.questionText ??
                question.text ??
                null,

            answerId:
                answer.answerId ??
                null,

            answerValue:
                selectedAnswer?.value ??
                null,

            answerText:
                selectedAnswer?.text ??
                answer.answerText ??
                null,

            score:
                selectedAnswer?.score ??
                null,

            riskLevel:
                selectedAnswer?.riskLevel ??
                null,

            trackKey:
                question.trackKey ??
                selectedAnswer?.trackKey ??
                null,

            answered:
                true

        });

    }


    // ==========================================
    // Sort
    //
    // Main questions with order first,
    // follow-ups without order remain after them.
    // Within unanswered-order cases, preserve
    // answer creation order from MongoDB.
    // ==========================================

    questionAnswers.sort(
        function (first, second) {

            const firstOrder =
                first.order ??
                Number.MAX_SAFE_INTEGER;


            const secondOrder =
                second.order ??
                Number.MAX_SAFE_INTEGER;


            return (
                Number(firstOrder) -
                Number(secondOrder)
            );

        }
    );


    // ==========================================
    // Return Safe Doctor View
    // ==========================================

    return {

        sessionId:
            session._id,

        patientId:
            session.patientId,

        patientName:
            session.patientName,

        patientType:
            session.patientType,

        sessionNumber:
            session.sessionNumber,

        questionSetVersion:
            session.questionSetVersion ??
            null,

        status:
            session.status,

        scheduledAt:
            session.scheduledAt ??
            null,

        openedAt:
            session.openedAt ??
            null,

        completedAt:
            session.completedAt ??
            null,

        answersCount:
            answers.length,

        questionAnswers

    };

}
// =====================================================
// Attendance Window
// تحديد هل تسجيل الحضور متاح حاليًا
// =====================================================

async function getDoctorSession(
    patientId,
    sessionNumber
) {

    // ==========================================
    // Validate Patient Code
    // ==========================================

    if (!patientId) {

        throw new Error(
            "Patient ID is required"
        );

    }


    // ==========================================
    // Validate Session Number
    // ==========================================

    const parsedSessionNumber =
        Number(sessionNumber);

    if (
        !Number.isInteger(parsedSessionNumber) ||
        parsedSessionNumber < 1
    ) {

        throw new Error(
            "Invalid session number"
        );

    }


    // ==========================================
    // Get Session
    // ==========================================

    const session =
        await sessionsCollection.findOne({

            patientId,

            sessionNumber:
                parsedSessionNumber

        });


    if (!session) {

        throw new Error(
            "Session not found"
        );

    }


    // ==========================================
    // Get Only Answers Of This Session
    // ==========================================

    const answers =
        await answersCollection
            .find({

                sessionId:
                    String(session._id)

            })
            .sort({

                createdAt: 1

            })
            .toArray();


    // ==========================================
    // Build Question Map From Session Snapshot
    // ==========================================

    const questionMap =
        new Map();


    const sessionQuestions =
        Array.isArray(session.questions)
            ? session.questions
            : [];


    for (
        const question
        of sessionQuestions
    ) {

        if (!question?.questionId) {
            continue;
        }

        questionMap.set(
            question.questionId,
            question
        );

    }


    // ==========================================
    // Load Question Catalog
    // Used only to explain answers that are
    // not inside the session snapshot
    // ==========================================

    const questionSetVersion =
        session.questionSetVersion ??
        CURRENT_QUESTION_SET_VERSION;


    const questionCatalog =
        await questionsCollection
            .find({

                patientType:
                    session.patientType,

                questionSetVersion:
                    questionSetVersion

            })
            .toArray();


    for (
        const question
        of questionCatalog
    ) {

        if (!question?.questionId) {
            continue;
        }


        if (
            questionMap.has(
                question.questionId
            )
        ) {
            continue;
        }


        questionMap.set(
            question.questionId,
            question
        );

    }


    // ==========================================
    // Keep ONLY Actually Answered Questions
    //
    // One answer record = one displayed item
    //
    // Main question:
    //   S2-Q01 -> A2
    //
    // Follow-up choice:
    //   treatment_plan_reason -> A3
    //
    // Follow-up text:
    //   continuation_barrier_other -> "..."
    // ==========================================

    const questionAnswers = [];


    for (
        const answer
        of answers
    ) {

        if (!answer?.questionId) {
            continue;
        }


        // --------------------------------------
        // Determine whether this answer
        // actually contains a response
        // --------------------------------------

        const hasAnswerId =
            answer.answerId !== null &&
            answer.answerId !== undefined &&
            answer.answerId !== "";


        const hasAnswerText =
            typeof answer.answerText === "string" &&
            answer.answerText.trim() !== "";


        if (
            !hasAnswerId &&
            !hasAnswerText
        ) {

            continue;

        }


        // --------------------------------------
        // Find Question
        // --------------------------------------

        const question =
            questionMap.get(
                answer.questionId
            );


        // --------------------------------------
        // If question definition exists
        // --------------------------------------

        let selectedAnswer =
            null;


        if (
            question &&
            Array.isArray(question.answers) &&
            hasAnswerId
        ) {

            selectedAnswer =
                question.answers.find(
                    function (item) {

                        return (
                            item?.id ===
                            answer.answerId
                        );

                    }
                ) || null;

        }


        // ======================================
        // Build Doctor View
        // ======================================

        questionAnswers.push({

            questionId:
                answer.questionId,

            order:
                question?.order ??
                null,

            questionText:
                question?.questionText ??
                question?.text ??
                null,

            answerId:
                answer.answerId ??
                null,

            answerValue:
                selectedAnswer?.value ??
                null,

            answerText:
                selectedAnswer?.text ??
                (
                    hasAnswerText
                        ? answer.answerText
                        : null
                ),

            score:
                selectedAnswer?.score ??
                null,

            riskLevel:
                selectedAnswer?.riskLevel ??
                null,

            trackKey:
                question?.trackKey ??
                selectedAnswer?.trackKey ??
                null,

            answered:
                true

        });

    }


    // ==========================================
    // Preserve Natural Answer Order
    //
    // Main questions with an order come first.
    // Follow-up questions without an order
    // remain in their answer creation order.
    // ==========================================

    questionAnswers.sort(
        function (first, second) {

            const firstOrder =
                first.order ??
                Number.MAX_SAFE_INTEGER;


            const secondOrder =
                second.order ??
                Number.MAX_SAFE_INTEGER;


            if (
                Number(firstOrder) !==
                Number(secondOrder)
            ) {

                return (
                    Number(firstOrder) -
                    Number(secondOrder)
                );

            }


            return 0;

        }
    );


    // ==========================================
    // Return Doctor View
    // ==========================================

    return {

        sessionId:
            session._id,

        patientId:
            session.patientId,

        patientName:
            session.patientName,

        patientType:
            session.patientType,

        sessionNumber:
            session.sessionNumber,

        questionSetVersion:
            session.questionSetVersion ??
            null,

        status:
            session.status,

        scheduledAt:
            session.scheduledAt ??
            null,

        openedAt:
            session.openedAt ??
            null,

        completedAt:
            session.completedAt ??
            null,

        answersCount:
            questionAnswers.length,

        questionAnswers

    };

}







// ==========================================
// Calculate Session Severity
// 1 = Best
// 4 = Worst
// Result: 0 - 100
// ==========================================
function calculateSessionSeverity(answers) {
    const scoredAnswers = answers.filter(function (answer) {
        return (
            answer &&
            typeof answer.score === "number"
        );
    });

    if (scoredAnswers.length === 0) {
        return null;
    }

    const normalizedValues =
        scoredAnswers.map(function (answer) {
            return (
                ((answer.score - 1) / 3) * 100
            );
        });

    const total =
        normalizedValues.reduce(
            function (sum, value) {
                return sum + value;
            },
            0
        );

    return (
        total / normalizedValues.length
    );
}


// ==========================================
// Get Overall Risk For One Session
// ==========================================
function getSessionRisk(answers) {
    const riskOrder = {
        none: 0,
        low: 1,
        medium: 2,
        high: 3
    };

    let highestRisk = "none";

    for (const answer of answers) {
        const risk =
            answer?.riskLevel;

        if (!risk) {
            continue;
        }

        if (
            riskOrder[risk] >
            riskOrder[highestRisk]
        ) {
            highestRisk = risk;
        }
    }

    return highestRisk;
}


// ==========================================
// Compare Current Session With Previous
// ==========================================
// ==========================================
// Compare One Session With Previous Session
// Uses The Same Logic As compareAllSessions()
// ==========================================
function compareSessionPair(
    previousSession,
    currentSession,
    previousAnswers,
    currentAnswers
) {

    // ==========================================
    // Risk Order
    // ==========================================
    const riskOrder = {
        none: 0,
        low: 1,
        medium: 2,
        high: 3
    };

    // ==========================================
    // Previous Answers Map
    // Key = trackKey
    // ==========================================
    const previousMap =
        new Map();

    for (
        const answer
        of previousAnswers
    ) {

        if (
            !answer?.trackKey
        ) {
            continue;
        }

        previousMap.set(
            answer.trackKey,
            answer
        );
    }

    // ==========================================
    // Direct Comparisons
    // ==========================================
    const trackComparisons = [];

    for (
        const currentAnswer
        of currentAnswers
    ) {

        const trackKey =
            currentAnswer?.trackKey;

        // ==========================================
        // No Track Key
        // ==========================================
        if (!trackKey) {
            continue;
        }

        // ==========================================
        // Get Previous Answer
        // ==========================================
        const previousAnswer =
            previousMap.get(
                trackKey
            );

        // ==========================================
        // Track Does Not Exist In Previous Session
        // ==========================================
        if (!previousAnswer) {
            continue;
        }

        // ==========================================
        // Determine Trend
        // EXACT SAME LOGIC AS compareAllSessions
        // ==========================================
        let trend =
            determineFollowUpTrend(
                trackKey,
                currentAnswer?.answerValue
            );

        // ==========================================
        // Risk Fallback
        // ==========================================
        if (
            trend === "not_comparable" &&
            previousAnswer?.riskLevel &&
            currentAnswer?.riskLevel
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
                    trend =
                        "improving";

                } else if (
                    currentRisk >
                    previousRisk
                ) {
                    trend =
                        "worsening";

                } else {
                    trend =
                        "stable";
                }
            }
        }

        // ==========================================
        // Score Difference
        // ==========================================
        let scoreDifference = null;

        if (
            typeof previousAnswer?.score === "number" &&
            typeof currentAnswer?.score === "number"
        ) {

            scoreDifference =
                currentAnswer.score -
                previousAnswer.score;
        }

        // ==========================================
        // Save Comparison
        // ==========================================
        trackComparisons.push({

            trackKey,

            previous: {
                sessionNumber:
                    previousSession.sessionNumber,

                questionId:
                    previousAnswer.questionId ??
                    null,

                questionText:
                    previousAnswer.questionText ??
                    null,

                answerId:
                    previousAnswer.answerId ??
                    null,

                answerValue:
                    previousAnswer.answerValue ??
                    null,

                answerText:
                    previousAnswer.answerText ??
                    null,

                score:
                    previousAnswer.score ??
                    null,

                riskLevel:
                    previousAnswer.riskLevel ??
                    null
            },

            current: {
                sessionNumber:
                    currentSession.sessionNumber,

                questionId:
                    currentAnswer.questionId ??
                    null,

                questionText:
                    currentAnswer.questionText ??
                    null,

                answerId:
                    currentAnswer.answerId ??
                    null,

                answerValue:
                    currentAnswer.answerValue ??
                    null,

                answerText:
                    currentAnswer.answerText ??
                    null,

                score:
                    currentAnswer.score ??
                    null,

                riskLevel:
                    currentAnswer.riskLevel ??
                    null
            },

            scoreDifference,

            trend
        });
    }

    // ==========================================
    // Separate Trends
    // ==========================================
    const improving =
        trackComparisons.filter(
            function (item) {
                return (
                    item.trend ===
                    "improving"
                );
            }
        );

    const worsening =
        trackComparisons.filter(
            function (item) {
                return (
                    item.trend ===
                    "worsening"
                );
            }
        );

    const stable =
        trackComparisons.filter(
            function (item) {
                return (
                    item.trend ===
                    "stable"
                );
            }
        );

    // ==========================================
    // Calculate Severity
    // ONLY from comparable tracks
    // ==========================================
    const previousSeverityValues =
        trackComparisons
            .filter(function (item) {
                return (
                    typeof item?.previous?.score ===
                    "number"
                );
            })
            .map(function (item) {
                return (
                    (
                        (
                            item.previous.score - 1
                        ) / 3
                    ) * 100
                );
            });

    const currentSeverityValues =
        trackComparisons
            .filter(function (item) {
                return (
                    typeof item?.current?.score ===
                    "number"
                );
            })
            .map(function (item) {
                return (
                    (
                        (
                            item.current.score - 1
                        ) / 3
                    ) * 100
                );
            });

    let previousSeverity = null;
    let currentSeverity = null;
    let severityDifference = null;
    let percentage = 0;
    let overallTrend = "stable";

    // ==========================================
    // Previous Severity
    // ==========================================
    if (
        previousSeverityValues.length > 0
    ) {

        const totalPrevious =
            previousSeverityValues.reduce(
                function (sum, value) {
                    return sum + value;
                },
                0
            );

        previousSeverity =
            totalPrevious /
            previousSeverityValues.length;
    }

    // ==========================================
    // Current Severity
    // ==========================================
    if (
        currentSeverityValues.length > 0
    ) {

        const totalCurrent =
            currentSeverityValues.reduce(
                function (sum, value) {
                    return sum + value;
                },
                0
            );

        currentSeverity =
            totalCurrent /
            currentSeverityValues.length;
    }

    // ==========================================
    // Overall Comparison
    // Same Direction As compareScores()
    // ==========================================
    if (
        typeof previousSeverity === "number" &&
        typeof currentSeverity === "number"
    ) {

        severityDifference =
            currentSeverity -
            previousSeverity;

        if (
            currentSeverity <
            previousSeverity
        ) {
            overallTrend =
                "improving";

        } else if (
            currentSeverity >
            previousSeverity
        ) {
            overallTrend =
                "worsening";

        } else {
            overallTrend =
                "stable";
        }

        // ==========================================
        // Percentage
        // ==========================================
        if (
            previousSeverity > 0
        ) {

            if (
                overallTrend ===
                "improving"
            ) {

                percentage =
                    (
                        (
                            previousSeverity -
                            currentSeverity
                        ) /
                        previousSeverity
                    ) * 100;

            } else if (
                overallTrend ===
                "worsening"
            ) {

                percentage =
                    (
                        (
                            currentSeverity -
                            previousSeverity
                        ) /
                        previousSeverity
                    ) * 100;
            }
        }
    }

    // ==========================================
    // Round Numeric Values
    // ==========================================
    previousSeverity =
        previousSeverity === null
            ? null
            : Math.round(
                previousSeverity * 100
            ) / 100;

    currentSeverity =
        currentSeverity === null
            ? null
            : Math.round(
                currentSeverity * 100
            ) / 100;

    severityDifference =
        severityDifference === null
            ? null
            : Math.round(
                severityDifference * 100
            ) / 100;

    percentage =
        Math.round(
            percentage * 100
        ) / 100;

    // ==========================================
    // Final Result
    // ==========================================
    return {

        previousSession:
            previousSession.sessionNumber,

        currentSession:
            currentSession.sessionNumber,

        comparableTracks:
            trackComparisons.length,

        trend:
            overallTrend,

        previousSeverity,

        currentSeverity,

        severityDifference,

        percentage,

        improving,

        worsening,

        stable,

        trackComparisons
    };
}


// ==========================================
// Build Doctor Follow-up Overview
// ==========================================
// ==========================================
// Get Doctor Follow-up Overview
// All Completed Sessions + Session Summaries
// ==========================================
// ==========================================
// Get Doctor Follow-up Overview
// All Completed Sessions + Session Summaries
// ==========================================
async function getDoctorFollowUpOverview(patientId) {

    // ==========================================
    // Validate Patient ID
    // ==========================================
    if (!patientId) {
        throw new Error(
            "Patient ID is required"
        );
    }

    // ==========================================
    // Get Patient
    // ==========================================
    const patient =
        await patientsCollection.findOne({
            patientCode: patientId
        });

    if (!patient) {
        throw new Error(
            "Patient not found"
        );
    }

    // ==========================================
    // Normalize Patient Type
    // ==========================================
    const patientType =
        String(
            patient.patientType || ""
        )
            .trim()
            .toLowerCase();

    // ==========================================
    // Get Completed Sessions
    // ==========================================
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

    // ==========================================
    // No Completed Sessions
    // ==========================================
    if (sessions.length === 0) {
        return {
            patientId,

            patientName:
                patient.name ?? null,

            patientType:
                patientType || null,

            sessions: []
        };
    }

    // ==========================================
    // Get All Session IDs
    // ==========================================
    const sessionIds =
        sessions.map(function (session) {
            return String(
                session._id
            );
        });

    // ==========================================
    // Get All Answers In One Query
    // ==========================================
    const allAnswers =
        await answersCollection
            .find({
                sessionId: {
                    $in: sessionIds
                }
            })
            .sort({
                createdAt: 1
            })
            .toArray();

    // ==========================================
    // Group Answers By Session
    // ==========================================
    const answersBySession =
        new Map();

    for (
        const answer
        of allAnswers
    ) {

        const sessionKey =
            String(
                answer.sessionId
            );

        if (
            !answersBySession.has(
                sessionKey
            )
        ) {
            answersBySession.set(
                sessionKey,
                []
            );
        }

        answersBySession
            .get(sessionKey)
            .push(answer);
    }

    // ==========================================
    // Get Question Set Version Used By Sessions
    // ==========================================
    const questionSetVersions = [
        ...new Set(
            sessions
                .map(function (session) {
                    return session.questionSetVersion;
                })
                .filter(function (version) {
                    return (
                        typeof version === "number"
                    );
                })
        )
    ];

    // ==========================================
    // Load Full Question Catalog
    // For Main + Follow-up Questions
    // ==========================================
    const questionCatalog =
        await questionsCollection
            .find({
                patientType,

                questionSetVersion: {
                    $in:
                        questionSetVersions.length > 0
                            ? questionSetVersions
                            : [
                                CURRENT_QUESTION_SET_VERSION
                            ]
                }
            })
            .sort({
                order: 1
            })
            .toArray();

    // ==========================================
    // Build Question Catalog Map
    // Key = patientType + version + questionId
    // ==========================================
    const questionCatalogMap =
        new Map();

    for (
        const question
        of questionCatalog
    ) {

        if (!question?.questionId) {
            continue;
        }

        const key =
            [
                String(
                    question.patientType ||
                    patientType
                ),
                String(
                    question.questionSetVersion ??
                    CURRENT_QUESTION_SET_VERSION
                ),
                question.questionId
            ].join("|");

        questionCatalogMap.set(
            key,
            question
        );
    }

    // ==========================================
    // Build Enriched Answers
    // For Every Session
    // ==========================================
    const enrichedAnswersBySession =
        new Map();

    // ==========================================
    // Build Question Maps
    // Per Session
    // ==========================================
    const questionMapsBySession =
        new Map();

    for (
        const session
        of sessions
    ) {

        const sessionKey =
            String(
                session._id
            );

        // ==========================================
        // Session Questions Snapshot
        // ==========================================
        const sessionQuestions =
            Array.isArray(
                session.questions
            )
                ? session.questions
                : [];

        // ==========================================
        // Build Session Question Map
        // Snapshot Has Priority
        // ==========================================
        const questionMap =
            new Map();

        for (
            const question
            of sessionQuestions
        ) {

            if (!question?.questionId) {
                continue;
            }

            questionMap.set(
                question.questionId,
                question
            );
        }

        // ==========================================
        // Fill Missing Questions From Catalog
        // This Includes Follow-up Questions
        // ==========================================
        for (
            const question
            of questionCatalog
        ) {

            if (
                question?.patientType !==
                    session.patientType
            ) {
                continue;
            }

            if (
                question?.questionSetVersion !==
                    session.questionSetVersion
            ) {
                continue;
            }

            if (
                !question?.questionId
            ) {
                continue;
            }

            // Don't overwrite session snapshot
            if (
                questionMap.has(
                    question.questionId
                )
            ) {
                continue;
            }

            questionMap.set(
                question.questionId,
                question
            );
        }

        questionMapsBySession.set(
            sessionKey,
            questionMap
        );

        // ==========================================
        // Get Raw Answers
        // ==========================================
        const rawAnswers =
            answersBySession.get(
                sessionKey
            ) || [];

        // ==========================================
        // Enrich Answers
        // ==========================================
        const enrichedAnswers = [];

        for (
            const answer
            of rawAnswers
        ) {

            const question =
                questionMap.get(
                    answer?.questionId
                );

            // ==========================================
            // Question Not Found
            // ==========================================
            if (!question) {

                enrichedAnswers.push({
                    ...answer,

                    questionText:
                        null,

                    answerValue:
                        null,

                    answerText:
                        answer?.answerText ??
                        null,

                    score:
                        null,

                    riskLevel:
                        null,

                    trackKey:
                        null
                });

                continue;
            }

            // ==========================================
            // Find Selected Answer
            // IMPORTANT:
            // Question Answers use "id"
            // Saved Answer uses "answerId"
            // ==========================================
            const selectedAnswer =
                Array.isArray(
                    question.answers
                )
                    ? question.answers.find(
                        function (item) {
                            return (
                                item?.id ===
                                answer?.answerId
                            );
                        }
                    )
                    : null;

            // ==========================================
            // Build Enriched Answer
            // ==========================================
            enrichedAnswers.push({

                ...answer,

                questionText:
                    question.questionText ??
                    question.text ??
                    null,

                answerValue:
                    selectedAnswer?.value ??
                    null,

                answerText:
                    selectedAnswer?.text ??
                    answer?.answerText ??
                    null,

                score:
                    selectedAnswer?.score ??
                    null,

                riskLevel:
                    selectedAnswer?.riskLevel ??
                    null,

                trackKey:
                    question.trackKey ??
                    selectedAnswer?.trackKey ??
                    null
            });
        }

        enrichedAnswersBySession.set(
            sessionKey,
            enrichedAnswers
        );
    }

    // ==========================================
    // Build Session Overview
    // ==========================================
    const sessionOverview = [];

    for (
        let index = 0;
        index < sessions.length;
        index++
    ) {

        const session =
            sessions[index];

        const sessionKey =
            String(
                session._id
            );

        // ==========================================
        // Current Enriched Answers
        // ==========================================
        const enrichedAnswers =
            enrichedAnswersBySession.get(
                sessionKey
            ) || [];

        // ==========================================
        // Current Session Question Map
        // ==========================================
        const questionMap =
            questionMapsBySession.get(
                sessionKey
            ) || new Map();

        // ==========================================
// Calculate Raw Total Score
// مجموع الدرجات الفعلية للجلسة
// ==========================================
// ==========================================
// Calculate Raw Total Score
// مجموع الدرجات الفعلية للجلسة
// ==========================================
const totalScore =
    enrichedAnswers.reduce(
        function (total, answer) {
            const score =
                Number(answer?.score);

            if (
                !Number.isFinite(score)
            ) {
                return total;
            }

            return total + score;
        },
        0
    );

// ==========================================
// Calculate Maximum Possible Score
// أعلى مجموع ممكن للأسئلة التي لها درجات
// ==========================================
const maxScore =
    enrichedAnswers.reduce(
        function (total, answer) {

            if (
                !Number.isFinite(
                    Number(answer?.score)
                )
            ) {
                return total;
            }

            const question =
                questionMap.get(
                    answer?.questionId
                );

            if (
                !question ||
                !Array.isArray(question.answers)
            ) {
                return total;
            }

            const possibleScores =
                question.answers
                    .map(function (item) {
                        const score =
                            Number(item?.score);

                        return Number.isFinite(score)
                            ? score
                            : null;
                    })
                    .filter(function (score) {
                        return score !== null;
                    });

            if (
                possibleScores.length === 0
            ) {
                return total;
            }

            const questionMaxScore =
                Math.max(...possibleScores);

            return total + questionMaxScore;
        },
        0
    );

// ==========================================
// Calculate Score Percentage
// نسبة الدرجة من الحد الأقصى
// ==========================================
const scorePercentage =
    maxScore > 0
        ? (totalScore / maxScore) * 100
        : null;

// ==========================================
// Determine Overall Session Evaluation
// التقييم العام للجلسة
// ==========================================
let overallEvaluation = "غير متاح";

if (scorePercentage !== null) {

    if (scorePercentage < 25) {
        overallEvaluation = "ممتاز";
    } else if (scorePercentage < 50) {
        overallEvaluation = "جيد جدًا";
    } else if (scorePercentage < 75) {
        overallEvaluation = "جيد";
    } else if (scorePercentage < 90) {
        overallEvaluation = "يحتاج انتباه";
    } else {
        overallEvaluation = "مرتفع القلق";
    }
}
        // ==========================================
        // Calculate Session Risk
        // ==========================================
        const riskLevel =
            getSessionRisk(
                enrichedAnswers
            );

        // ==========================================
        // Comparison With Previous Completed Session
        // ==========================================
        let comparison = null;

        if (index > 0) {

            const previousSession =
                sessions[index - 1];

            const previousSessionKey =
                String(
                    previousSession._id
                );

            const previousAnswers =
                enrichedAnswersBySession.get(
                    previousSessionKey
                ) || [];

            comparison =
                compareSessionPair(
                    previousSession,
                    session,
                    previousAnswers,
                    enrichedAnswers
                );
        }

        // ==========================================
        // Summary Arrays
        // ==========================================
        const improvements = [];
        const worsenings = [];
        const stable = [];

        // ==========================================
        // Build Summary
        // ==========================================
        if (comparison) {

            // ==========================================
            // Improvements
            // ==========================================
            for (
                const item
                of comparison.improving
            ) {

                const currentQuestion =
                    questionMap.get(
                        item?.current?.questionId
                    );

                improvements.push({

                    trackKey:
                        item?.trackKey ??
                        null,

                    questionId:
                        item?.current?.questionId ??
                        null,

                    questionText:
                        currentQuestion?.questionText ??
                        currentQuestion?.text ??
                        item?.current?.questionText ??
                        null,

                    answerText:
                        item?.current?.answerText ??
                        null,

                    answerValue:
                        item?.current?.answerValue ??
                        null,

                    score:
                        item?.current?.score ??
                        null,

                    riskLevel:
                        item?.current?.riskLevel ??
                        null
                });
            }

            // ==========================================
            // Worsenings
            // ==========================================
            for (
                const item
                of comparison.worsening
            ) {

                const currentQuestion =
                    questionMap.get(
                        item?.current?.questionId
                    );

                worsenings.push({

                    trackKey:
                        item?.trackKey ??
                        null,

                    questionId:
                        item?.current?.questionId ??
                        null,

                    questionText:
                        currentQuestion?.questionText ??
                        currentQuestion?.text ??
                        item?.current?.questionText ??
                        null,

                    answerText:
                        item?.current?.answerText ??
                        null,

                    answerValue:
                        item?.current?.answerValue ??
                        null,

                    score:
                        item?.current?.score ??
                        null,

                    riskLevel:
                        item?.current?.riskLevel ??
                        null
                });
            }

            // ==========================================
            // Stable
            // ==========================================
            for (
                const item
                of comparison.stable
            ) {

                const currentQuestion =
                    questionMap.get(
                        item?.current?.questionId
                    );

                stable.push({

                    trackKey:
                        item?.trackKey ??
                        null,

                    questionId:
                        item?.current?.questionId ??
                        null,

                    questionText:
                        currentQuestion?.questionText ??
                        currentQuestion?.text ??
                        item?.current?.questionText ??
                        null,

                    answerText:
                        item?.current?.answerText ??
                        null,

                    answerValue:
                        item?.current?.answerValue ??
                        null,

                    score:
                        item?.current?.score ??
                        null,

                    riskLevel:
                        item?.current?.riskLevel ??
                        null
                });
            }
        }

        // ==========================================
        // Build Session Card Data
        // ==========================================
        sessionOverview.push({

            sessionId:
                session._id,

            sessionNumber:
                session.sessionNumber,

            status:
                session.status,

            patientId:
                session.patientId,

            patientName:
                session.patientName,

            patientType:
                session.patientType,

            questionSetVersion:
                session.questionSetVersion ??
                null,

            scheduledAt:
                session.scheduledAt ??
                null,

            openedAt:
                session.openedAt ??
                null,

            completedAt:
                session.completedAt ??
                null,

            totalScore:
    totalScore,

maxScore:
    maxScore,

scorePercentage:
    scorePercentage === null
        ? null
        : Math.round(
            scorePercentage * 100
        ) / 100,

overallEvaluation:
    overallEvaluation,

            risk: {
                level:
                    riskLevel
            },

            comparison,

            summary: {

                improving:
                    improvements,

                worsening:
                    worsenings,

                stable:
                    stable,

                counts: {

                    improving:
                        improvements.length,

                    worsening:
                        worsenings.length,

                    stable:
                        stable.length
                }
            }
        });
    }

    // ==========================================
    // Final Response
    // ==========================================
    return {

        patientId,

        patientName:
            patient.name ?? null,

        patientType:
            patientType || null,

        sessions:
            sessionOverview
    };
}


    return {
    createPatientSession,
    // getAttendanceWindow,
    getDoctorSession,
    getDoctorFollowUpOverview
};

};