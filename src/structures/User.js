const Inventory = require('./Inventory');

class User {
	// Class representing the profile of a discord bot user.
	id = null;
	blacklisted = false;
	count = 0;
	inventory = null;

	constructor (id) {
		this.id = id;
		this.count = 0;
		this.inventory = new Inventory();
	}

	// Set count
	setCount (count) {
		this.count = count;
	}

	// Get count
	getCount () {
		return this.count;
	}

	// Toggle blacklisted
	toggleBlacklisted () {
		this.blacklisted = !this.blacklisted;
	}

	// Get blacklisted
	isBlacklisted () {
		return this.blacklisted;
	}

	fromJSON (json) {
		let user = new User(json.id);
		user.count = json.count;
		user.inv = new Inventory().fromJSON(json.inv);
		return user;
	}

	toJSON (user) {
		return {
			id: user.id,
			count: user.count,
			inv: user.inv.toJSON()
		};
	}
}

module.exports = User;