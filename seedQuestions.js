// ========================================================
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
    MongoClient
} = require("mongodb");

const questions =
    require("./questionsData");


// ========================================================
// MongoDB Client
// ========================================================

const client =
    new MongoClient(
        process.env.MONGODB_URI,
        {
            serverSelectionTimeoutMS: 15000
        }
    );


// ========================================================
// SEED QUESTIONS
// ========================================================

async function seedQuestions() {

    try {

        // ====================================================
        // CONNECT TO MONGODB
        // ====================================================

        await client.connect();

        console.log(
            "MongoDB connected for seeding"
        );


        // ====================================================
        // DATABASE
        // ====================================================

        const db =
            client.db("clinova");


        // ====================================================
        // QUESTIONS COLLECTION
        // ====================================================

        const questionsCollection =
            db.collection("questions");


        // ====================================================
        // PROCESS COUNTERS
        // ====================================================

        let processedQuestions = 0;

        let insertedQuestions = 0;

        let updatedQuestions = 0;


        // ====================================================
        // VALIDATE questionsData
        // ====================================================

        if (
            !questions ||
            typeof questions !== "object"
        ) {

            throw new Error(
                "questionsData is invalid"
            );
        }


        // ====================================================
        // LOOP PATIENT TYPES
        // ====================================================

        for (
            const [
                patientType,
                patientSessions
            ]
            of Object.entries(questions)
        ) {

            console.log(
                `Processing patient type: ${patientType}`
            );


            // ==================================================
            // Validate Patient Type
            // ==================================================

            if (
                patientType !== "adult" &&
                patientType !== "child"
            ) {

                console.warn(
                    `Skipping unknown patient type: ${patientType}`
                );

                continue;
            }


            // ==================================================
            // LOOP SESSIONS
            // ==================================================

            for (
                const sessionQuestions
                of Object.values(
                    patientSessions || {}
                )
            ) {

                // ==============================================
                // Validate Session Questions
                // ==============================================

                if (
                    !Array.isArray(
                        sessionQuestions
                    )
                ) {

                    console.warn(
                        `Skipping invalid session data for ${patientType}`
                    );

                    continue;
                }


                // ==============================================
                // LOOP QUESTIONS
                // ==============================================

                for (
                    const question
                    of sessionQuestions
                ) {

                    // ==========================================
                    // Validate Question
                    // ==========================================

                    if (
                        !question ||
                        !question.questionId
                    ) {

                        console.warn(
                            `Skipping invalid question for ${patientType}`
                        );

                        continue;
                    }


                    // ==========================================
                    // Prepare Answers
                    // ==========================================

                    const answers =
                        Array.isArray(
                            question.answers
                        )
                            ? question.answers.map(
                                function (answer) {

                                    return {

                                        ...answer,

                                        nextQuestionId:
                                            answer.nextQuestionId ||
                                            null

                                    };
                                }
                            )
                            : [];


                    // ==========================================
                    // Prepare Question Data
                    // ==========================================

                    const questionData = {

                        ...question,

                        patientType,

                        answers

                    };


                    // ==========================================
                    // Save Question
                    // ==========================================

                    const result = await questionsCollection.updateOne(
    {
        questionId: questionData.questionId,
        patientType: questionData.patientType,
        questionSetVersion: questionData.questionSetVersion
    },
    {
        $set: questionData
    },
    {
        upsert: true
    }
);


                    // ==========================================
                    // Count Result
                    // ==========================================

                    processedQuestions++;


                    if (
                        result.upsertedCount > 0
                    ) {

                        insertedQuestions++;

                    } else if (
                        result.modifiedCount > 0
                    ) {

                        updatedQuestions++;

                    }


                    // ==========================================
                    // Log
                    // ==========================================

                    console.log(
                        `Question ${questionData.questionId} ` +
                        `(${patientType}) saved`
                    );

                }
            }
        }


        // ====================================================
        // Final Count From MongoDB
        // ====================================================

        const totalQuestions =
            await questionsCollection.countDocuments();


        const adultQuestions =
            await questionsCollection.countDocuments({
                patientType: "adult"
            });


        const childQuestions =
            await questionsCollection.countDocuments({
                patientType: "child"
            });


        // ====================================================
        // SUCCESS
        // ====================================================

        console.log(
            "========================================"
        );

        console.log(
            "QUESTIONS SEED COMPLETED SUCCESSFULLY"
        );

        console.log(
            "========================================"
        );

        console.log(
            `Processed: ${processedQuestions}`
        );

        console.log(
            `Inserted: ${insertedQuestions}`
        );

        console.log(
            `Updated: ${updatedQuestions}`
        );

        console.log(
            `Total in MongoDB: ${totalQuestions}`
        );

        console.log(
            `Adult questions: ${adultQuestions}`
        );

        console.log(
            `Child questions: ${childQuestions}`
        );

        console.log(
            "========================================"
        );

    } catch (error) {

        // ====================================================
        // ERROR
        // ====================================================

        console.error(
            "========================================"
        );

        console.error(
            "SEED ERROR"
        );

        console.error(
            "========================================"
        );

        console.error(
            error
        );

    } finally {

        // ====================================================
        // CLOSE CONNECTION
        // ====================================================

        try {

            await client.close();

            console.log(
                "MongoDB seed connection closed"
            );

        } catch (closeError) {

            console.error(
                "Error closing MongoDB connection:",
                closeError
            );

        }

    }
}


// ========================================================
// RUN SEED
// ========================================================

seedQuestions();