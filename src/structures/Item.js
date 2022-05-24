const ItemDatabase = require("./ItemDatabase");

class Item {
	constructor (itemObj) {
		this.name = itemObj.name || "";
		this.description = itemObj.description || "";
		this.type = itemObj.type || "";
		this.aliases = itemObj.aliases || [];
		this.use = itemObj.use || undefined;
	}

	use (message) {
		if (this.use) {
			this.use(message);
		} else {
			throw new Error ("No use function defined for item: " + this.name);
		}
	}

	fromJSON (json) {
		return new ItemDatabase.getItem(json.name);
	}

	toJSON () {
		return this.name;
	}
}

module.exports = Item;