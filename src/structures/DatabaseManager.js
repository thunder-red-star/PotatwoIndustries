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
		this.servers.load(Database.get('servers'));
		this.users.load(Database.get('users'));
	}

	write () {
		Database.set('servers', this.servers.toJSON());
		Database.set('users', this.users.toJSON());
		Database.write();
	}
}

module.exports = DatabaseManager;