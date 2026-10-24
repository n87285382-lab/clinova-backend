// ==========================================
// WHATSAPP MASTER SWITCH
// ==========================================



// ==========================================
// WHATSAPP MASTER SWITCH
// ==========================================

const WHATSAPP_ENABLED =
    process.env.WHATSAPP_ENABLED === "true";


// ==========================================
// Send Whats
async function sendWhatsAppMessage(phone, message) {
if (!WHATSAPP_ENABLED) {

    console.log(
        "WHATSAPP MESSAGE BLOCKED"
    );

    console.log({
        phone,
        message
    });

    return {
        success: true,
        skipped: true
    };
}
    // ==========================================
    // WHATSAPP MASTER SWITCH
    // ==========================================

    if (!WHATSAPP_ENABLED) {

        console.log(
            "================================="
        );

        console.log(
            "WHATSAPP MESSAGE BLOCKED"
        );

        console.log({
            phone,
            message
        });

        console.log(
            "Reason: WhatsApp sending is temporarily disabled."
        );

        console.log(
            "================================="
        );

        return {
            success: true,
            skipped: true,
            reason: "WhatsApp sending is disabled"
        };
    }


    const token =
        process.env.WHATS360_TOKEN;

    const instanceId =
        process.env.WHATS360_INSTANCE_ID;


    // ==========================================
    // Check Environment Variables
    // ==========================================

    if (!token) {

        throw new Error(
            "WHATS360_TOKEN is missing."
        );
    }


    if (!instanceId) {

        throw new Error(
            "WHATS360_INSTANCE_ID is missing."
        );
    }


    // ==========================================
    // Check Phone
    // ==========================================

    if (!phone) {

        throw new Error(
            "Phone number is missing."
        );
    }


    // ==========================================
    // Normalize Phone Number
    // ==========================================

    let normalizedPhone =
        String(phone)
            .trim()
            .replace(/\s+/g, "")
            .replace(/^\+/, "");


    // لو الرقم مصري ويبدأ بـ 01
    if (normalizedPhone.startsWith("01")) {

        normalizedPhone =
            "20" +
            normalizedPhone.slice(1);
    }


    // ==========================================
    // Create WhatsApp JID
    // ==========================================

    const jid =
        `${normalizedPhone}@s.whatsapp.net`;


    console.log(
        "WHATSAPP JID:",
        jid
    );


    // ==========================================
    // Build API URL
    // ==========================================

    const url =
        new URL(
            "https://whats360.live/api/v1/send-text"
        );


    url.searchParams.set(
        "token",
        token
    );


    url.searchParams.set(
        "instance_id",
        instanceId
    );


    url.searchParams.set(
        "jid",
        jid
    );


    url.searchParams.set(
        "msg",
        message
    );


    // ==========================================
    // Send Message
    // ==========================================

    const response =
        await fetch(
            url.toString()
        );


    const data =
        await response.json();


    console.log(
        "WHATSAPP API RESPONSE:",
        data
    );


    // ==========================================
    // Check Error
    // ==========================================

    if (!response.ok) {

        throw new Error(
            data?.message ||
            "Failed to send WhatsApp message."
        );
    }


    return data;
}




module.exports = {

    sendWhatsAppMessage

};