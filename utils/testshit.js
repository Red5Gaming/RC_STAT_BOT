const req = require('./requestHandler')

async function teststuff() {
    let stato = await req('ttvtemptr', "uplay");

    console.log(stato['progressionTotalFansGamemode.gamemode.Ranked'].value)

}

teststuff()