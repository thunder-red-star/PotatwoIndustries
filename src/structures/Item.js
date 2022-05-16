class Item {
	constructor (itemObj) {
		this.name = itemObj.name;
		this.description = itemObj.description;
		this.type = itemObj.type;
		this.aliases = itemObj.aliases;
		this.use = itemObj.use;
	}

	use () {
		if (this.use) {
			this.use();
		} else {
			throw new Error ("No use function defined for item: " + this.name);
		}
	}

	fromJSON (json) {
		this.name = json.name;
		this.description = json.description || "";
		this.type = json.type || "";
		this.aliases = json.aliases || [];
		this.use = json.use || null;
	}

	toJSON () {
		return this.name;
	}
}

module.exports = Item;