const Inventory = require('./Inventory');

class User {
	// Class representing the profile of a discord bot user.

	constructor (id = "") {
		this.id = id;
		this.count = 0;
		this.inventory = new Inventory();
		this.blacklisted = false;
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
		this.id = json.id;
		this.count = json.count;
		this.inventory = new Inventory().fromJSON(json.inventory);
		this.blacklisted = json.blacklisted;
		return this;
	}

	toJSON () {
		return {
			id: this.id,
			count: this.count,
			inventory: this.inventory.toJSON(),
			blacklisted: this.blacklisted
		};
	}
}

module.exports = User;