module.exports = function (db) {

    const questionsCollection =
        db.collection("questions");

    const answersCollection =
        db.collection("sessionAnswers");

const mainQuestionsCache =
    new Map();

const MAIN_QUESTIONS_CACHE_TTL =
    5 * 60 * 1000; // 5 minutes
    // ==========================================
    // Validate Patient Type
    // ==========================================

    function validatePatientType(patientType) {

        if (
            patientType !== "adult" &&
            patientType !== "child"
        ) {
            throw new Error(
                "Invalid patient type. Must be adult or child."
            );
        }
    }


    // ==========================================
    // Get Question
    // ==========================================

    async function getQuestion(
        questionId,
        patientType
    ) {

        validatePatientType(patientType);

        const question =
            await questionsCollection.findOne({

                questionId: questionId,

                patientType: patientType,

                active: true

            });


        if (!question) {

            throw new Error(
                `Question not found: ${questionId} (${patientType})`
            );

        }

        return question;
    }


    // ==========================================
    // Find Answer
    // ==========================================

    function findAnswer(
        question,
        answerId
    ) {

        if (
            !Array.isArray(
                question.answers
            )
        ) {

            return null;

        }


        return question.answers.find(
            function (answer) {

                return answer.id === answerId;

            }
        );
    }


    // ==========================================
    // Determine Next Question
    // ==========================================

    async function determineNextQuestion(
        question,
        answer,
        patientType
    ) {

        if (!answer) {

            return null;

        }


        if (!answer.nextQuestionId) {

            return null;

        }


        const nextQuestion =
            await getQuestion(
                answer.nextQuestionId,
                patientType
            );


        return nextQuestion;
    }


    // ==========================================
    // Save Answer
    // ==========================================
// ==========================================
// Save / Update Answer
// ==========================================

async function saveAnswer(data) {

    const {
        sessionId,
        questionId,
        answerId,
        answerText,
        patientType
    } = data;

    await answersCollection.updateOne(

        {
            sessionId,
            questionId
        },

        {
            $set: {

                patientType,

                answerId:
                    answerId || null,

                answerText:
                    answerText || null,

                updatedAt:
                    new Date()

            },

            $setOnInsert: {

                createdAt:
                    new Date()

            }

        },

        {
            upsert: true
        }

    );
}
// ==========================================
// Process Answer
// ==========================================
async function getCachedMainQuestions(
    patientType,
    sessionNumber
) {
    const cacheKey =
        `${patientType}:${Number(sessionNumber)}`;

    const cached =
        mainQuestionsCache.get(cacheKey);

    const now = Date.now();

    // ==========================================
    // Return Cached Data
    // ==========================================
    if (
        cached &&
        (now - cached.timestamp) <
            MAIN_QUESTIONS_CACHE_TTL
    ) {
        return cached.questions;
    }

    // ==========================================
    // Load From MongoDB
    // ==========================================
    const questions =
        await questionsCollection
            .find({
                patientType,
                sessionNumber:
                    Number(sessionNumber),
                active: {
                    $ne: false
                },
                type: {
                    $ne: "sub"
                },
                isMain: true
            })
            .sort({
                order: 1
            })
            .toArray();

    // ==========================================
    // Save To Cache
    // ==========================================
    mainQuestionsCache.set(
        cacheKey,
        {
            questions,
            timestamp: now
        }
    );

    return questions;
}

function clearMainQuestionsCache() {
    mainQuestionsCache.clear();

    console.log(
        "MAIN QUESTIONS CACHE CLEARED"
    );
}


async function processAnswer(data) {

    const {
        sessionId,
        questionId,
        answerId,
        answerText,
        patientType
    } = data;

    // --------------------------------------
    // 1. Validate Patient Type
    // --------------------------------------
    validatePatientType(patientType);

    // --------------------------------------
    // 2. Get Current Question
    // --------------------------------------
    const question =
        await getQuestion(
            questionId,
            patientType
        );

    // --------------------------------------
    // 3. Validate Question
    // --------------------------------------
    if (!question) {
        throw new Error(
            `Question "${questionId}" not found.`
        );
    }

    if (
        question.type !== "single" &&
        question.type !== "text"
    ) {
        throw new Error(
            `Unsupported question type: ${question.type}`
        );
    }

    // --------------------------------------
    // 4. Determine Answer
    // --------------------------------------
    let answer = null;

    // ======================================
    // SINGLE QUESTION
    // ======================================
    if (question.type === "single") {

        if (!answerId) {
            throw new Error(
                "answerId is required for single question."
            );
        }

        answer = findAnswer(
            question,
            answerId
        );

        if (!answer) {
            throw new Error(
                `Invalid answer "${answerId}" for question "${questionId}".`
            );
        }
    }

    // ======================================
    // TEXT QUESTION
    // ======================================
    if (question.type === "text") {

        if (
            !answerText ||
            !String(answerText).trim()
        ) {
            throw new Error(
                "answerText is required for text question."
            );
        }
    }

    // --------------------------------------
    // 5. Main Questions For THIS Session
    // --------------------------------------
    const sessionNumber =
        Number(question.sessionNumber);

    const mainQuestions =
    await getCachedMainQuestions(
        patientType,
        sessionNumber
    );

    const totalMainQuestions =
        mainQuestions.length;

    const mainQuestionIds =
        mainQuestions.map(function (item) {
            return item.questionId;
        });

    // --------------------------------------
    // 6. Save + Determine Next In Parallel
    // --------------------------------------
    let nextQuestion = null;

    if (question.type === "single") {

        [
            ,
            nextQuestion
        ] = await Promise.all([
            saveAnswer({
                sessionId,
                patientType,
                questionId,
                answerId: answerId || null,
                answerText: answerText || null
            }),

            determineNextQuestion(
                question,
                answer,
                patientType
            )
        ]);

    } else if (question.type === "text") {

        [
            ,
            nextQuestion
        ] = await Promise.all([
            saveAnswer({
                sessionId,
                patientType,
                questionId,
                answerId: null,
                answerText:
                    answerText || null
            }),

            question.nextQuestionId
                ? getQuestion(
                    question.nextQuestionId,
                    patientType
                )
                : Promise.resolve(null)
        ]);
    }

    // --------------------------------------
    // 7. Get Answered Main Questions
    // --------------------------------------
    const answeredMainQuestionIds =
        mainQuestionIds.length > 0
            ? await answersCollection.distinct(
                "questionId",
                {
                    sessionId,
                    questionId: {
                        $in: mainQuestionIds
                    }
                }
            )
            : [];

    const completedMainQuestions =
        answeredMainQuestionIds.length;

    // --------------------------------------
    // 8. Calculate Progress
    // --------------------------------------
    const percentage =
        totalMainQuestions > 0
            ? Math.round(
                (
                    completedMainQuestions /
                    totalMainQuestions
                ) * 100
            )
            : 0;

    // --------------------------------------
    // 9. Debug
    // --------------------------------------
    console.log(
        "========== BACKEND PROGRESS =========="
    );

    console.log({
        sessionId,
        questionId,
        sessionNumber,
        completedMainQuestions,
        totalMainQuestions,
        percentage,
        nextQuestionId:
            nextQuestion
                ? nextQuestion.questionId
                : null
    });

    console.log(
        "======================================="
    );

    // --------------------------------------
    // 10. Return Result
    // --------------------------------------
    return {
        currentQuestion: {
            questionId,
            answerId:
                answerId || null,
            answerText:
                answerText || null
        },

        nextQuestion,

        progress: {
            current:
                completedMainQuestions,
            total:
                totalMainQuestions,
            percentage
        }
    };
}

    // ==========================================
    // Public API
    // ==========================================

    return {

        getQuestion,

        processAnswer

    };

};