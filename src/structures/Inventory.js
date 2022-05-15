const Item = require('./Item');

class Inventory {
	// Inventory class, allows storage of arrays of items and counts
	constructor() {
		this.data = {};
	}

	fromJSON(json) {
		this.data = json.map(itemEntry => {
				return {
					item: new Item(itemEntry.item),
					count: itemEntry.count
				};
			});
		}


	toJSON() {
		return this.data.map(itemEntry => {
			return {
				item: itemEntry.item.toJSON(),
				count: itemEntry.count
			};
		});
	}

	add(item, count = 1) {
		if (this.data[item] === undefined) {
			this.data[item] = count;
			return true;
		} else {
			this.data[item] += count;
			return true;
		}
	}

	remove(item, count = 1) {
		if (this.data[item] === undefined) {
			return false;
		} else {
			if (this.data[item] - count < 0) {
				return false;
			} else {
				this.data[item] -= count;
			}
			return true;
		}
	}

	set (item, count) {
		this.data[item] = count;
	}

	get(item) {
		if (this.data[item] === undefined) {
			return 0;
		} else {
			return this.data[item];
		}
	}

	has(item) {
		return this.data[item] !== undefined && this.data[item] > 0;
	}
}

module.exports = Inventory;