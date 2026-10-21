const express = require("express");

module.exports = function (db) {

    const router = express.Router();

    const doctorNotesCollection =
        db.collection("doctorNotes");


    // ==========================================
    // GET - Get Patient Notes
    // ==========================================

    router.get("/:patientCode", async function (req, res) {

        try {

            const patientCode =
                String(
                    req.params.patientCode || ""
                )
                    .trim();

            if (!patientCode) {

                return res.status(400).json({
                    message:
                        "Patient code is required"
                });

            }

            const notes =
                await doctorNotesCollection
                    .find({ patientCode })
                    .sort({
                        createdAt: -1
                    })
                    .toArray();

            return res.status(200).json({
                success: true,
                notes
            });

        } catch (error) {

            console.error(
                "GET DOCTOR NOTES ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to load doctor notes"
            });
        }
    });


    // ==========================================
    // POST - Add Note
    // ==========================================

    router.post("/:patientCode", async function (req, res) {

        try {

            const patientCode =
                String(
                    req.params.patientCode || ""
                )
                    .trim();

            const text =
                String(
                    req.body?.text || ""
                )
                    .trim();

            if (!patientCode) {

                return res.status(400).json({
                    message:
                        "Patient code is required"
                });

            }

            if (!text) {

                return res.status(400).json({
                    message:
                        "Note text is required"
                });

            }

            if (text.length > 2000) {

                return res.status(400).json({
                    message:
                        "Note is too long"
                });

            }

            const now =
                new Date();

            const note = {

                patientCode,

                text,

                createdAt:
                    now,

                updatedAt:
                    now
            };

            const result =
                await doctorNotesCollection
                    .insertOne(note);

            return res.status(201).json({

                success: true,

                note: {
                    ...note,
                    _id: result.insertedId
                }

            });

        } catch (error) {

            console.error(
                "CREATE DOCTOR NOTE ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to create doctor note"
            });
        }
    });


    // ==========================================
    // PUT - Update Note
    // ==========================================

    router.put("/:noteId", async function (req, res) {

        try {

            const { ObjectId } =
                require("mongodb");

            const noteId =
                String(
                    req.params.noteId || ""
                )
                    .trim();

            const text =
                String(
                    req.body?.text || ""
                )
                    .trim();

            if (!ObjectId.isValid(noteId)) {

                return res.status(400).json({
                    message:
                        "Invalid note id"
                });

            }

            if (!text) {

                return res.status(400).json({
                    message:
                        "Note text is required"
                });

            }

            if (text.length > 2000) {

                return res.status(400).json({
                    message:
                        "Note is too long"
                });

            }

            const result =
                await doctorNotesCollection.updateOne(

                    {
                        _id:
                            new ObjectId(noteId)
                    },

                    {
                        $set: {
                            text,

                            updatedAt:
                                new Date()
                        }
                    }
                );

            if (result.matchedCount === 0) {

                return res.status(404).json({
                    message:
                        "Note not found"
                });

            }

            const updatedNote =
                await doctorNotesCollection.findOne({
                    _id:
                        new ObjectId(noteId)
                });

            return res.status(200).json({
                success: true,
                note: updatedNote
            });

        } catch (error) {

            console.error(
                "UPDATE DOCTOR NOTE ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to update doctor note"
            });
        }
    });


    // ==========================================
    // DELETE - Delete Note
    // ==========================================

    router.delete("/:noteId", async function (req, res) {

        try {

            const { ObjectId } =
                require("mongodb");

            const noteId =
                String(
                    req.params.noteId || ""
                )
                    .trim();

            if (!ObjectId.isValid(noteId)) {

                return res.status(400).json({
                    message:
                        "Invalid note id"
                });

            }

            const result =
                await doctorNotesCollection.deleteOne({
                    _id:
                        new ObjectId(noteId)
                });

            if (result.deletedCount === 0) {

                return res.status(404).json({
                    message:
                        "Note not found"
                });

            }

            return res.status(200).json({
                success: true
            });

        } catch (error) {

            console.error(
                "DELETE DOCTOR NOTE ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to delete doctor note"
            });
        }
    });


    return router;
};