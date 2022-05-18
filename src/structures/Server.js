class Server {
	// Class representing a discord server the bot is in.
	constructor() {
		this.serverId = "";
		this.serverPrefix = "";
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

	setPrefix(prefix) {
		this.serverPrefix = prefix;
	}

	// Edit a config option.
	editConfig(key, value) {
		this.serverConfig[key] = value;
	}

	fromJSON(json) {
		this.serverId = json.serverId;
		this.serverPrefix = json.serverPrefix;
		this.serverConfig = json.serverConfig;
		return this;
	}

	toJSON() {
		return {
			serverId: this.serverId,
			serverPrefix: this.serverPrefix,
			serverConfig: this.serverConfig
		};
	}
}

module.exports = Server;