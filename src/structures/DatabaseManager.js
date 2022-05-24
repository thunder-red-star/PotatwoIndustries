// Database manager for bot. Manages all sub-databases (servers and users)
const ServerManager = require('./ServerManager.js');
const UserManager = require('./UserManager.js');
const AuctionHouse = require('./AuctionHouse.js');

const Database = require('../utils/database/database.js');

class DatabaseManager {
	constructor () {
		this.servers = new ServerManager();
		this.users = new UserManager();
		this.auctions = new AuctionHouse();
	}

	load () {
		Database.load();
		this.servers = new ServerManager()
		this.servers.fromJSON(Database.get('servers'));
		this.users = new UserManager()
		this.users.fromJSON(Database.get('users'));
		this.auctions = new AuctionHouse()
		this.auctions.fromJSON(Database.get('auctions'));
	}

	write () {
		Database.set('servers', this.servers.toJSON());
		Database.set('users', this.users.toJSON());
		Database.set('auctions', this.auctions.toJSON());
		Database.write();
	}
}

module.exports = DatabaseManager;