const crypto = require("crypto");


// ========================================================
// فحص التذكيرات
// ========================================================

async function checkReminders(db) {

    const now = new Date();

    console.log(
        "Current time:",
        now.toISOString()
    );


    console.log(
        "Checking patients..."
    );


    // ====================================================
    // جلب المرضى
    // ====================================================

    const patients =
        await db
            .collection("patients")
            .find({})
            .toArray();


    console.log(
        "Patients found:",
        patients.length
    );


    // ====================================================
    // المرور على المرضى
    // ====================================================

    for (const patient of patients) {

        console.log(
            "-----------------------------"
        );


        console.log(
            "Patient:",
            patient.name
        );


        // ==============================================
        // التأكد من وجود schedule
        // ==============================================

        if (!patient.schedule) {

            console.log(
                "No schedule"
            );

            continue;
        }


        const days =
            patient.schedule.days;

        const time =
            patient.schedule.time;

        const startDate =
            patient.schedule.startDate;


        console.log(
            "Days:",
            days
        );


        console.log(
            "Time:",
            time
        );


        console.log(
            "Start date:",
            startDate
        );


        // ==============================================
        // التأكد من البيانات
        // ==============================================

        if (
            !days ||
            !Array.isArray(days) ||
            !time ||
            !startDate
        ) {

            console.log(
                "Incomplete schedule data"
            );

            continue;
        }


        // ==============================================
        // حساب الموعد القادم
        // ==============================================

        const nextSession =
            getNextSession(
                days,
                time,
                startDate
            );


        // ==============================================
        // التأكد من وجود موعد
        // ==============================================

        if (!nextSession) {

            console.log(
                "No upcoming session"
            );

            continue;
        }


        console.log(
            "Next session:",
            nextSession.toISOString()
        );


        // ==============================================
        // حساب موعد تذكير الـ24 ساعة
        // ==============================================

        const reminderTime =
            getReminderTime(nextSession);


        console.log(
            "Reminder time:",
            reminderTime.toISOString()
        );


        // ==============================================
        // هل وصل وقت التذكير؟
        // ==============================================

        const reminderDue =
            isReminderDue(
                reminderTime,
                now
            );


        console.log(
            "Reminder due:",
            reminderDue
        );


        // ==============================================
        // هل أرسلنا التذكير من قبل؟
        // ==============================================

        const reminder24Sent =
            patient.reminder24Sent || false;

const confirmationStatus =
    patient.confirmationStatus || "pending";

console.log(
    "Confirmation status:",
    confirmationStatus
);

if (confirmationStatus === "confirmed") {

    console.log(
        "Patient confirmed the appointment"
    );

} else if (confirmationStatus === "cancelled") {

    console.log(
        "Patient cancelled the appointment"
    );

} else {

    console.log(
        "Patient has not responded yet"
    );

}

        console.log(
            "Reminder 24 sent:",
            reminder24Sent
        );


const secondReminderTime =
    getSecondReminderTime(nextSession);

console.log(
    "Second reminder time:",
    secondReminderTime.toISOString()
);


const secondReminderDue =
    isReminderDue(
        secondReminderTime,
        now
    );

console.log(
    "Second reminder due:",
    secondReminderDue
);



const reminder3Sent =
    patient.reminder3Sent === true;

console.log(
    "DEBUG reminder3Sent:",
    patient.reminder3Sent
);

console.log(
    "DEBUG reminder3Sent type:",
    typeof patient.reminder3Sent
);

console.log(
    "DEBUG reminder3Sent local:",
    reminder3Sent
);

console.log(
    "Reminder 3 sent:",
    reminder3Sent
);

if (secondReminderDue) {

    if (confirmationStatus === "cancelled") {

        console.log(
            "Second reminder skipped because patient cancelled"
        );

    } else if (reminder3Sent) {

        console.log(
            "Second reminder already sent"
        );

    } else {

        console.log(
            "Second reminder is due"
        );

        await db
            .collection("patients")
            .updateOne(
                { _id: patient._id },
                {
                    $set: {
                        reminder3Sent: true
                    }
                }
            );

        console.log(
            "Second reminder marked as sent"
        );

    }

}




        // ==============================================
        // إرسال التذكير مرة واحدة فقط
        // ==============================================

        if (
            reminderDue &&
            !reminder24Sent
        ) {

            console.log(
                "24-hour reminder is due"
            );


            await db
                .collection("patients")
                .updateOne(

                    {
                        _id: patient._id
                    },

                    {
                        $set: {
                            reminder24Sent: true
                        }
                    }

                );


            console.log(
                "24-hour reminder marked as sent"
            );

        }

    }

}




// ========================================================
// فحص المتابعات الدورية تلقائيًا
// ========================================================

async function checkFollowUps(db) {

    try {

        const now = new Date();

        console.log(
            "Checking follow-ups:",
            now.toISOString()
        );

        const sessionsCollection =
            db.collection("sessions");

        const followUpsCollection =
            db.collection("followUps");

        // ==============================================
        // البحث عن الجلسات المكتملة
        // ==============================================

        const sessions =
            await sessionsCollection
                .find({
                    status: "completed",
                    openedAt: {
                        $exists: true
                    }
                })
                .toArray();

        console.log(
            "Completed sessions found:",
            sessions.length
        );

        // ==============================================
        // المرور على الجلسات
        // ==============================================

        for (const session of sessions) {

            // ------------------------------------------
            // وقت بداية الجلسة
            // ------------------------------------------
// ==============================================
// إنشاء جلسة المريض القادمة تلقائيًا
// ==============================================

const patient =
    await db
        .collection("patients")
        .findOne({
            patientCode:
                session.patientId
        });

if (patient) {

    await createNextSessionIfNeeded(
        db,
        patient,
        session
    );

} else {

    console.log(
        "Patient not found for session:",
        session.patientId
    );
}
            const sessionScheduledAt =
    new Date(session.scheduledAt);

const availableAt =
    new Date(
        sessionScheduledAt.getTime() +
        (24 * 60 * 60 * 1000)
    );
if (
    !session.scheduledAt ||
    Number.isNaN(sessionScheduledAt.getTime())
) {
    console.log(
        "Invalid scheduledAt for session:",
        session._id
    );

    continue;
}
            console.log(
                "Patient:",
                session.patientId
            );

            console.log(
                "Session:",
                session.sessionNumber
            );

            console.log(
                "Follow-up available at:",
                availableAt.toISOString()
            );

            // ------------------------------------------
            // لم يحن الموعد
            // ------------------------------------------

            if (now < availableAt) {

                console.log(
                    "Follow-up is not available yet"
                );

                continue;
            }

            // ------------------------------------------
            // البحث عن المتابعة الخاصة بهذه الجلسة
            // ------------------------------------------

            const followUp =
                await followUpsCollection.findOne({

                    sessionId:
                        session._id.toString()

                });

            // ------------------------------------------
            // لا توجد متابعة
            // ------------------------------------------

            if (!followUp) {

                console.log(
                    "No follow-up found"
                );

                continue;
            }

            // ------------------------------------------
            // المتابعة ليست في حالة الانتظار
            // ------------------------------------------

            if (
                followUp.status !==
                "not_started"
            ) {

                console.log(
                    "Follow-up already processed:",
                    followUp.status
                );

                continue;
            }

            // ------------------------------------------
            // فتح المتابعة
            // ------------------------------------------

            await followUpsCollection.updateOne(

                {
                    _id: followUp._id,
                    status: "not_started"
                },

                {
                    $set: {

                        status: "available",

                        availableAt:
                            availableAt,

                        updatedAt:
                            new Date()

                    }
                }

            );

            console.log(
                "Follow-up is now available"
            );

        }

    } catch (error) {

        console.error(
            "Follow-up check error:",
            error
        );

    }

}





// ========================================================
// حساب موعد التذكير الثاني
// ========================================================

function getSecondReminderTime(sessionDate) {

    const reminderDate =
        new Date(sessionDate);

    reminderDate.setHours(
        reminderDate.getHours() - 3
    );

    return reminderDate;
}


// ========================================================
// حساب الموعد القادم للمريض
// ========================================================

function getNextSession(
    days,
    time,
    startDate
) {

    const start =
        new Date(startDate);

    if (Number.isNaN(start.getTime())) {

        console.log(
            "Invalid start date:",
            startDate
        );

        return null;
    }

    const [hours, minutes] =
        time
            .split(":")
            .map(Number);

    if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes)
    ) {
        console.log(
            "Invalid schedule time:",
            time
        );

        return null;
    }

    const dayMap = {

        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6

    };

    // نبدأ البحث من موعد الـ Session الحالية
    // وليس من وقت تشغيل السيرفر

    const baseDate =
        new Date(start);

    // نبحث عن أول موعد بعد الـ Session الحالية
    for (
        let i = 1;
        i <= 7;
        i++
    ) {

        const candidate =
            new Date(baseDate);

        candidate.setDate(
            baseDate.getDate() + i
        );

        candidate.setHours(
            hours,
            minutes,
            0,
            0
        );

        const candidateDay =
            candidate.getDay();

        const matchingDay =
            days.some(
                function (day) {

                    return (
                        dayMap[
                            String(day).toLowerCase()
                        ] === candidateDay
                    );

                }
            );

        if (!matchingDay) {
            continue;
        }

        // لازم يكون الموعد القادم
        // بعد الـ Session الحالية فعلًا

        if (candidate > start) {

            return candidate;

        }

    }

    return null;
}


// ========================================================
// إنشاء Session القادمة تلقائيًا
// ========================================================
// ========================================================
// حساب الموعد القادم تلقائيًا
// ملاحظة:
// هذه الدالة لا تنشئ Session جديدة.
// هي فقط تحسب موعد العيادة القادم من Schedule.
// ========================================================

async function createNextSessionIfNeeded(
    db,
    patient,
    currentSession
) {
    try {

        // ==================================================
        // 1) لازم يكون عندنا Session وموعد حقيقي
        // ==================================================

        if (
            !currentSession ||
            !currentSession.scheduledAt
        ) {
            return null;
        }

        const currentScheduledAt =
            new Date(
                currentSession.scheduledAt
            );

        if (
            Number.isNaN(
                currentScheduledAt.getTime()
            )
        ) {
            return null;
        }


        // ==================================================
        // 2) الموعد الحالي لازم يكون انتهى
        // ==================================================

        const now = new Date();

        if (currentScheduledAt > now) {
            return null;
        }


        // ==================================================
        // 3) بيانات المريض والـ Schedule
        // ==================================================

        if (
            !patient ||
            !patient.patientCode ||
            !patient.schedule
        ) {
            return null;
        }

        const days =
            patient.schedule.days;

        const time =
            patient.schedule.time;

        if (
            !Array.isArray(days) ||
            days.length === 0 ||
            !time
        ) {
            return null;
        }


        // ==================================================
        // 4) حساب الموعد القادم
        // ==================================================

        const nextScheduledAt =
            getNextSession(
                days,
                time,
                currentScheduledAt
            );


        // ==================================================
        // 5) Debug
        // ==================================================

        console.log(
            "NEXT APPOINTMENT DEBUG",
            {
                patientId:
                    patient.patientCode,

                currentSessionNumber:
                    currentSession.sessionNumber,

                currentScheduledAt:
                    currentSession.scheduledAt,

                nextScheduledAt
            }
        );


        // ==================================================
        // 6) مفيش موعد قادم
        // ==================================================

        if (!nextScheduledAt) {
            return null;
        }


        // ==================================================
        // 7) مهم جدًا:
        // لا ننشئ Session جديدة
        // لا نستخدم sessionService
        // لا نحتاج Questions
        // لا نحتاج Session Number جديدة
        // ==================================================

        console.log(
            "NEXT CLINIC APPOINTMENT FOUND",
            {
                patientId:
                    patient.patientCode,

                nextAppointment:
                    nextScheduledAt
            }
        );


        // ==================================================
        // 8) نرجع الموعد فقط
        // ==================================================

        return {
            patientId:
                patient.patientCode,

            appointmentAt:
                nextScheduledAt
        };

    } catch (error) {

        console.error(
            "NEXT APPOINTMENT ERROR:",
            error
        );

        return null;
    }
}


// ========================================================
// Export
// ========================================================




function getReminderTime(sessionDate) {

    const reminderDate =
        new Date(sessionDate);

    reminderDate.setHours(
        reminderDate.getHours() - 24
    );

    return reminderDate;
}
function isReminderDue(
    reminderTime,
    now
) {

    return now >= reminderTime;

}








module.exports = {
    checkReminders,
    checkFollowUps,
    getNextSession,
    getReminderTime,
    getSecondReminderTime,
    createNextSessionIfNeeded
};
