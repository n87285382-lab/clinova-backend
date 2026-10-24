// 1. دالة التحقق من التعارض (باستخدام MongoDB المباشر)
async function checkTable(db, doctorId, scheduledDate, duration) {
    let startTime = new Date(scheduledDate);
    let endTime = new Date(startTime.getTime() + duration * 60000);

    const conflictingAppointment = await db.collection('appointments').findOne({
        doctorId: doctorId,
        status: "booked",
        $or: [
            // الحالة الأولى: موعد جديد يبدأ أثناء موعد قديم قائم
            { scheduledDate: { $lte: startTime }, $expr: { $gt: [{ $add: ["$scheduledDate", { $multiply: ["$duration", 60000] }] }, startTime] } },
            // الحالة الثانية: موعد جديد ينتهي أثناء موعد قديم قائم
            { scheduledDate: { $lt: endTime }, scheduledDate: { $gte: startTime } }
        ]
    });

    return conflictingAppointment ? true : false;
}

// 2. دالة توليد الأوقات المتاحة (محسنة الأداء وخالية من Mongoose)
// 1. دالة توليد الأوقات المتاحة باستخدام MongoDB المباشر وبأداء صاروخي
async function availabeleSlots(db, doctorId, dateString, duration) {
    
    // أ. جلب إعدادات الدكتور مرنة
    const doctorSettings = await db.collection('doctors').findOne({ doctorId: doctorId });
    const workStartHour = doctorSettings ? doctorSettings.workStartHour : 9; 
    const workEndHour = doctorSettings ? doctorSettings.workEndHour : 17; 

    // ب. تحديد بداية ونهاية اليوم المطلوب
    let startOfDay = new Date(dateString);
    startOfDay.setHours(workStartHour, 0, 0, 0);

    let endOfDay = new Date(dateString);
    endOfDay.setHours(workEndHour, 0, 0, 0);

    // ج. (تحسين الأداء): جلب كل مواعيد الدكتور المحجوزة في هذا اليوم "مرة واحدة فقط"
    const bookedAppointments = await db.collection('appointments').find({
        doctorId: doctorId,
        status: "booked",
        scheduledDate: { $gte: startOfDay, $lt: endOfDay }
    }).toArray();

    let availableSlots = [];
    let currentDate = new Date(startOfDay);

    // د. حلقة تكرارية تفحص الفترات في الذاكرة (RAM) بدون استعلامات متكررة للـ DB
    while (currentDate < endOfDay) {
        let slotEndTime = new Date(currentDate.getTime() + duration * 60000);

        if (slotEndTime <= endOfDay) {
            // هل الوقت الحالي يتعارض مع أي موعد من القائمة اللي جبناها مرة واحدة؟
            let isConflicting = bookedAppointments.some(appt => {
                let apptStartTime = new Date(appt.scheduledDate);
                let apptEndTime = new Date(apptStartTime.getTime() + (appt.duration || 60) * 60000);

                // معادلة التداخل البسيطة في الذاكرة
                return (currentDate < apptEndTime && slotEndTime > apptStartTime);
            });

            if (!isConflicting) {
                availableSlots.push({
                    startTime: new Date(currentDate),
                    endTime: new Date(slotEndTime)
                });
            }
            
            currentDate = slotEndTime; // الانتقال للفترة التالية
        } else {
            break;
        }
    }

    return availableSlots;
}

// 3. دالة إنشاء الفهرس لزيادة سرعة البحث في الملايين من السجلات مستقبلاً
async function createIndexes(db) {
    await db.collection('appointments').createIndex({ doctorId: 1, scheduledDate: 1 ,status:1});
}

module.exports = { checkTable, availabeleSlots, createIndexes };