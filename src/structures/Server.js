class Server {
	// Class representing a discord server the bot is in.
	constructor(server) {
		this.serverId = server;
		this.serverPrefix = server.name.toLowerCase();
		this.serverConfig = {};
	}

	// Get the server's id.
	getId() {
		return this.serverId;
	}

	// Get the server's prefix.
	getPrefix() {
		return this.serverPrefix;
	}

	// Get the server's config.
	getConfig() {
		return this.serverConfig;
	}

	// Set the server's config.
	setConfig(config) {
		this.serverConfig = config;
	}

	// Edit a config option.
	editConfig(key, value) {
		this.serverConfig[key] = value;
	}

	// Static method to return a server object from a server id.
	static getServer(serverId) {
		return serverList[serverId];
	}
}