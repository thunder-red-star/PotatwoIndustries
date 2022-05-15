const Inventory = require('./Inventory');

class User {
	// Class representing the profile of a discord bot user.
	id = null;
	count = 0;
	inv = null;

	constructor (id) {
		this.id = id;
		this.count = 0;
		this.inv = new Inventory();
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