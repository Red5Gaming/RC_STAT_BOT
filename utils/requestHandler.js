const {QuickDB} = require("quick.db");
const config = require("../config.json");
const superagent = require("superagent");
const db = new QuickDB();
const requestDb = db.table("requests");


async function checkAndGetNewTicket() {

    const options1 = {
        hostname: 'https://public-ubiservices.ubi.com/v3/profiles/sessions',
        headers: {
            'Ubi-AppId': 'f35adcb5-1911-440c-b1c9-48fdc1701c68',
            'Ubi-RequestedPlatformType': "uplay",
            'Content-Type': 'application/json',
            'Authorization': config.ubiauth
        }
    }

    let expirationDate = new Date(await requestDb.get("expirationDate")).getTime()
    let currentDate = new Date().getTime()



    if (Number(currentDate) > Number(expirationDate)) {
        // Case if ticket is expired

        console.log("Requesting new ticket")

        const response = await superagent
            .post(options1.hostname)
            .set(options1.headers)

        await requestDb.set("expirationDate", response.body.expiration);
        await requestDb.set("LastTicket", response.body.ticket);
        await requestDb.set("LastSessionId", response.body.sessionId);

        return {
            ticketreturnobejct: {
                ticket: response.body.ticket,
                sessionId: response.body.sessionId
            }
        }


    } else {
        // case if ticket is not expired

        await console.log("Ticket is still valid")

        return {
            ticketreturnobejct: {
                ticket: await requestDb.get("LastTicket"),
                sessionId: await requestDb.get("LastSessionId")
            }
        }

    }

console.log("Ran function")

}

async function returnStatObject(name, platform) {
    try {

        // TODO: Running function two times, should be only once for both values and better performance
        let ticketReturn = (await checkAndGetNewTicket())
        let ticketId = ticketReturn.ticketreturnobejct.ticket
        let sessionId = ticketReturn.ticketreturnobejct.sessionId


        const options2 = {
            hostname: 'https://public-ubiservices.ubi.com/v3/profiles',
            query: {
                'nameOnPlatform': name,
                'platformType': platform
            },
            headers: {
                'Authorization': `ubi_v1 t=${ticketId}`,
                'Ubi-AppId': 'f35adcb5-1911-440c-b1c9-48fdc1701c68',
            }
        }


        const response2 = await superagent
            .get(options2.hostname)
            .query(options2.query)
            .set(options2.headers)


        const options3 = {
            hostname: 'https://public-ubiservices.ubi.com/v1/profiles/stats',
            query: {
                'profileIds': response2.body.profiles[0].userId,
                'spaceId': '20d5c466-84fe-4f1e-8625-f6a4e2319edf'
            },
            headers: {
                'Authorization': `ubi_v1 t=${ticketId}`,
                'Ubi-SessionId': sessionId,
                'Ubi-AppId': 'f35adcb5-1911-440c-b1c9-48fdc1701c68',
            }
        }


        const response3 = await superagent
            .get(options3.hostname)
            .query(options3.query)
            .set(options3.headers)

        // await console.log(response3.body.profiles[0].stats);

        let stato = response3.body.profiles[0].stats;

        return stato;
        // console.log(stato)
    } catch (err) {
        console.log(err)
    }

}


module.exports = returnStatObject;

