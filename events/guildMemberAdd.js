//const { QuickDB } = require("quick.db");
//const db = new QuickDB();

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member) {

        // await console.log(member.id);

        // get the guild id
        let guildid = member.guild.id;

        let sampleStructure = await db.get("sampleuser");

        if(await db.has(`${member.id}`)) {
                console.log("User already exists");
        } else {
            await db.set(`${guildid}_${member.id}`, sampleStructure);
            console.log("User added");
        }


    }
}