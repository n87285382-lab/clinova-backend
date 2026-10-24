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
// MongoDB
// ========================================================

const { MongoClient } = require("mongodb");


const client = new MongoClient(
    process.env.MONGODB_URI,
    {
        serverSelectionTimeoutMS: 15000
    }
);


async function testMongo() {

    try {

        console.log(
            "Testing MongoDB connection..."
        );

        console.log(
            "DNS Servers:",
            dns.getServers()
        );

        await client.connect();

        console.log(
            "MongoDB CONNECTED SUCCESSFULLY!"
        );


        const db =
            client.db("clinova");


        await db.command({
            ping: 1
        });


        console.log(
            "MongoDB PING SUCCESSFUL!"
        );

    } catch (error) {

        console.error(
            "MongoDB TEST FAILED:"
        );

        console.error(error);

    } finally {

        await client.close();

        console.log(
            "MongoDB connection closed."
        );

    }

}


testMongo();