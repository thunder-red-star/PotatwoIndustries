module.exports = function(message) {
    // Get server prefix function
    let prefix;
    let serverData = client.database.servers.get(message.guild.id);
    if (serverData && serverData !== null) {
        prefix = serverData.getPrefix();
    } else {
        prefix = client.config.defaultPrefix;
    }
}