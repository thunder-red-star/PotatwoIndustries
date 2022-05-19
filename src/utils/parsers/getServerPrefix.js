module.exports = function(message) {
    // Get server prefix function
    let prefix;
    let serverData = message.client.database.servers.get(message.guild.id);
    if (serverData && serverData !== null) {
        prefix = serverData.getPrefix();
    } else {
        prefix = message.client.config.defaultPrefix;
    }
}