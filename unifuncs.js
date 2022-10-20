const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {

// define a function to get the user's balance called getBal
getDcBal: async function(userid){
    // check if the user has a balance
    if(await db.has(`${userid}.dcMoney`)){
        // if yes, return the balance
        return await db.get(`${userid}.dcMoney`);
    } else {
        // if not, return 0
        return 0;
    }
},

    getTcBal: async function(userid){
        // check if the user has a balance
        if(await db.has(`${userid}.twMoney`)){
            // if yes, return the balance
            return await db.get(`${userid}.twMoney`);
        } else {
            // if not, return 0
            return 0;
        }
    },




}