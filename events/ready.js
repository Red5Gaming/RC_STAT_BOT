module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        client.user.setActivity('sich die neuesten B2B Streams an!', { type: 'WATCHING' });


// get all commands


       /* client.application.commands.fetch().then(collection => {
            collection.forEach(command => {
                console.log(`Command ${command.name} found with id ${command.id}!`);
                if(command.name === 'ping'){
                    console.log(`Command ${command.name} found and trying to change!`);
                    client.application.commands.permissions.add({command: command.id, permissions: [
                            {
                                id: '355051285621243905',
                                type: 'USER',
                                permission: true // Can not use the slash command
                            }
                        ]}).catch(console.log);
                }
            });
        }).catch(console.log);*/


    }
}