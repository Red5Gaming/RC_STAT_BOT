
const config = require("../config.json");
const superagent = require("superagent");

const {QuickDB} = require("quick.db");
const db = new QuickDB({filePath: 'db/json.sqlite'});
const requestDb = db.table("requests");
const fs = require("fs");

async function checkAndGetNewTicket() {
    const options1 = {
        hostname: "https://public-ubiservices.ubi.com/v3/profiles/sessions",
        headers: {
            "Ubi-AppId": "f35adcb5-1911-440c-b1c9-48fdc1701c68",
            "Ubi-RequestedPlatformType": "uplay",
            "Content-Type": "application/json",
            Authorization: config.ubiauth,
        },
    };

    let expirationDate = new Date(
        await requestDb.get("expirationDate")
    ).getTime();
    let currentDate = new Date().getTime();

    if (Number(currentDate) > Number(expirationDate)) {
        // Case if ticket is expired

        //console.log("Requesting new ticket");

        const response = await superagent
            .post(options1.hostname)
            .set(options1.headers);

        await requestDb.set("expirationDate", response.body.expiration);
        await requestDb.set("LastTicket", response.body.ticket);
        await requestDb.set("LastSessionId", response.body.sessionId);

        return {
            ticketreturnobejct: {
                ticket: response.body.ticket,
                sessionId: response.body.sessionId,
            },
        };
    } else {
        // case if ticket is not expired

        //await console.log("Ticket is still valid");

        return {
            ticketreturnobejct: {
                ticket: await requestDb.get("LastTicket"),
                sessionId: await requestDb.get("LastSessionId"),
            },
        };
    }

}

async function returnProfileId(name, platform) {
    try {
        let ticketReturn = await checkAndGetNewTicket();
        let ticketId = ticketReturn.ticketreturnobejct.ticket;
        let sessionId = ticketReturn.ticketreturnobejct.sessionId;

        const options2 = {
            hostname: "https://public-ubiservices.ubi.com/v3/profiles",
            query: {
                nameOnPlatform: name,
                platformType: platform,
            },
            headers: {
                Authorization: `ubi_v1 t=${ticketId}`,
                "Ubi-AppId": "f35adcb5-1911-440c-b1c9-48fdc1701c68",
            },
        };

        const response2 = await superagent
            .get(options2.hostname)
            .query(options2.query)
            .set(options2.headers);

        if (response2.body.profiles.length === 0) {



            return;

        } else {

            return response2.body.profiles[0].profileId;
        }

    } catch (error) {
        console.log(error);
    }
}

// await console.log(returnProfileId("RedGaming_5", "uplay"));


async function checkIfUserExists(name, platform) {
    try {
        let ticketReturn = await checkAndGetNewTicket();
        let ticketId = ticketReturn.ticketreturnobejct.ticket;
        let sessionId = ticketReturn.ticketreturnobejct.sessionId;

        const options2 = {
            hostname: "https://public-ubiservices.ubi.com/v3/profiles",
            query: {
                nameOnPlatform: name,
                platformType: platform,
            },
            headers: {
                Authorization: `ubi_v1 t=${ticketId}`,
                "Ubi-AppId": "f35adcb5-1911-440c-b1c9-48fdc1701c68",
            },
        };

        const response2 = await superagent
            .get(options2.hostname)
            .query(options2.query)
            .set(options2.headers);

        if (response2.body.profiles.length === 0) {
            return false;
        }
        else {
            return true;
        }
    } catch (error) {
        console.log(error);
    }
}


async function returnStatObject(name, platform) {
    try {
        let ticketReturn = await checkAndGetNewTicket();
        let ticketId = ticketReturn.ticketreturnobejct.ticket;
        let sessionId = ticketReturn.ticketreturnobejct.sessionId;

        const options2 = {
            hostname: "https://public-ubiservices.ubi.com/v3/profiles",
            query: {
                nameOnPlatform: name,
                platformType: platform,
            },
            headers: {
                Authorization: `ubi_v1 t=${ticketId}`,
                "Ubi-AppId": "f35adcb5-1911-440c-b1c9-48fdc1701c68",
            },
        };

        const response2 = await superagent
            .get(options2.hostname)
            .query(options2.query)
            .set(options2.headers);

        if (response2.body.profiles.length === 0) {

            //console.log("No user found")

            return;

        } else {


            //console.log("User found");

            const options3 = {
                hostname: "https://public-ubiservices.ubi.com/v1/profiles/stats",
                query: {
                    profileIds: response2.body.profiles[0].userId,
                    spaceId: "20d5c466-84fe-4f1e-8625-f6a4e2319edf",
                },
                headers: {
                    Authorization: `ubi_v1 t=${ticketId}`,
                    "Ubi-SessionId": sessionId,
                    "Ubi-AppId": "f35adcb5-1911-440c-b1c9-48fdc1701c68",
                },
            };

            const response3 = await superagent
                .get(options3.hostname)
                .query(options3.query)
                .set(options3.headers);


            let stato = await response3.body.profiles[0].stats;


            return stato

        }

    } catch (err) {
        console.log(err);
    }
}

async function getLatestPatchNotes() {
    let newsUrl = "http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=2211280&count=3&maxlength=655&format=json"
    let patchnotes = await superagent.get(newsUrl)
    return patchnotes.body.appnews.newsitems[0].contents
}

async function getLatestPatchLink() {
    let newsUrl = "http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=2211280&count=3&maxlength=655&format=json"
    let patchnotes = await superagent.get(newsUrl)
    return patchnotes.body.appnews.newsitems[0].url
}

async function getSteamPlayerbase() {
    const headers = {
        "Client-ID": "F07D7ED5C43A695B3EBB01C28B6A18E5",
    }

    let url ="https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?format=json&appid=2211280"

    let playerbase = await superagent.get(url)
        .set(headers)
    return playerbase.body.response.player_count
}


module.exports = {
    stat: returnStatObject,
    profId: returnProfileId,
    checkIfUserExists: checkIfUserExists,
    getLatestPatchNotes: getLatestPatchNotes,
    getSteamPlayerbase: getSteamPlayerbase,
    getLatestPatchLink: getLatestPatchLink
}