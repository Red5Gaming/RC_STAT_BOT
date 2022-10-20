const { QuickDB } = require("quick.db");
const db = new QuickDB();

async function addAttributeArrayToAllUsers(key) {
    let users = await db.all();
    for (let i = 0; i < users.length; i++) {
       let user = users[i].id;
        await db.set(`${users[i].id}.${key}`, []);
    }
    return console.log(`Added array ${key} to all users`);
}

async function addAttributeToAllUsers(key, value) {
    let users = await db.all();
    for (let i = 0; i < users.length; i++) {
       let user = users[i].id;
        await db.set(`${users[i].id}.${key}`, value);
    }
}

addAttributeArrayToAllUsers('warns');