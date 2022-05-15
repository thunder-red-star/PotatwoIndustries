// Server list manager (holds an array of servers)

const Server = require('./Server');

class ServerManager {
    constructor() {
        this.servers = [];
    }

    addServer(server) {
        this.servers.push(server);
    }

    removeServer(server) {
        this.servers.splice(this.servers.indexOf(server), 1);
    }

    getServer(id) {
        return this.servers.find(server => server.id === id);
    }

    getServers() {
        return this.servers;
    }

		toJSON() {
			return this.servers.map(server => server.toJSON());
		}

		fromJSON(json) {
			this.servers = json.map(server => new Server().fromJSON(server));
		}
}