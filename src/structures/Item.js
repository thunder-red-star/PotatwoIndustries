const ItemDatabase = require("./ItemDatabase");

class Item {
	constructor () {

	}

	use (message) {
		if (this.use) {
			this.use(message);
		} else {
			throw new Error ("No use function defined for item: " + this.name);
		}
	}

	fromJSON (json) {
		let itemClass = ItemDatabase.getItem(json.name);
		return new itemClass();
	}

	toJSON () {
		return this.name;
	}
}

module.exports = Item;