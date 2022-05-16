// Server list manager (holds an array of servers)

const Server = require('./Server');

class ServerManager {
	constructor() {
		this.servers = [];
	}

	addServer(serverId) {
		this.servers.push(new Server(serverId));
	}

	removeServer(serverId) {
		this.servers = this.servers.filter(server => server.serverId !== serverId);
	}

	get(id) {
		return this.servers.find(server => server.serverId === id);
	}

	getAll() {
		return this.servers;
	}

	toJSON() {
		return this.servers.map(server => server.toJSON());
	}

	fromJSON(json) {
		this.servers = json.map(server => new Server(server.serverId).fromJSON(server));
	}
}

module.exports = ServerManager;