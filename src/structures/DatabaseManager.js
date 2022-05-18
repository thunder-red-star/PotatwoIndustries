// Database manager for bot. Manages all sub-databases (servers and users)
const ServerManager = require('./ServerManager.js');
const UserManager = require('./UserManager.js');

const Database = require('../utils/database/database.js');

class DatabaseManager {
	constructor () {
		this.servers = new ServerManager();
		this.users = new UserManager();
	}

	load () {
		this.servers = new ServerManager()
		this.servers.fromJSON(Database.get('servers'));
		console.log(this.servers)
		this.users = new UserManager()
		this.users.fromJSON(Database.get('users'));
		console.log(this.users)
	}

	write () {
		Database.set('servers', this.servers.toJSON());
		Database.set('users', this.users.toJSON());
		Database.write();
	}
}

module.exports = DatabaseManager;