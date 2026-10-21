const express = require("express");

function questionsRouter(db) {

    const router = express.Router();

    const questionsCollection =
        db.collection("questions");


    // ========================================================
    // GET - جلب الأسئلة حسب نوع المريض
    // ========================================================

    router.get("/:patientType", async (req, res) => {

        try {

            const patientType =
                String(
                    req.params.patientType
                ).trim().toLowerCase();


            // ====================================================
            // التأكد من نوع المريض
            // ====================================================

            if (
                patientType !== "adult" &&
                patientType !== "child"
            ) {

                return res.status(400).json({

                    message:
                        "Invalid patient type"

                });

            }


            // ====================================================
            // جلب الأسئلة
            // ====================================================

            const questions =
                await questionsCollection
                    .find({

                        patientType:

                            patientType

                    })
                    .sort({

                        sessionNumber: 1,

                        order: 1

                    })
                    .toArray();


            return res.status(200).json({

                patientType,

                count:
                    questions.length,

                questions

            });


        } catch (error) {

            console.error(
                "GET QUESTIONS ERROR:",
                error
            );


            return res.status(500).json({

                message:
                    "Failed to get questions"

            });

        }

    });


    return router;

}

module.exports = questionsRouter;