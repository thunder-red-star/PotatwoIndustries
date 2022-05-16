const Item = require('./Item');

class Inventory {
	// Inventory class, allows storage of arrays of items and counts
	constructor() {
		this.data = [];
	}

	// Adds an item to the inventory
	add(itemName, count = 1) {
		// Find item name in inventory
		let index = this.data.findIndex(i => i.item.name === itemName);
		// If item is not in inventory, add it
		if (index === -1) {
			this.data.push({
				item: new Item().fromJSON({name: itemName}),
				count: count,
			});
		} else {
			// If item is in inventory, add to count
			this.data[index].count += count;
		}
		return true;
	}

	// Removes an item from the inventory
	remove(itemName, count = 1) {
		// Find item name in inventory
		let index = this.data.findIndex(i => i.item.name === itemName);
		// If item is not in inventory, return false
		if (index === -1) {
			return false;
		} else {
			// If item is in inventory, remove from count
			this.data[index].count -= count;
			// If count is 0 or less, remove item from inventory
			if (this.data[index].count <= 0) {
				this.data.splice(index, 1);
			}
			return true;
		}
	}

	// Sets the count of an item in the inventory
	set(itemName, count) {
		// Find item name in inventory
		let index = this.data.findIndex(i => i.item.name === itemName);
		// If item is not in inventory, return false
		if (index === -1) {
			this.add(itemName, count);
		} else {
			// If item is in inventory, set count
			this.data[index].count = count;
			return true;
		}
	}

	// Returns the count of an item in the inventory
	count(itemName) {
		// Find item name in inventory
		let index = this.data.findIndex(i => i.item.name === itemName);
		// If item is not in inventory, return 0
		if (index === -1) {
			return 0;
		} else {
			// If item is in inventory, return count
			return this.data[index].count;
		}
	}

	// Returns the item in the inventory
	get(itemName) {
		// Find item name in inventory
		let index = this.data.findIndex(i => i.item.name === itemName);
		// If item is not in inventory, return null
		if (index === -1) {
			return null;
		} else {
			// If item is in inventory, return item
			return this.data[index].item;
		}
	}

	// Returns the entire inventory
	getAll() {
		return this.data;
	}

	// to JSON
	toJSON() {
		return this.data.map(i => {
			return {
				item: i.item.name,
				count: i.count,
			};
		});
	}

	fromJSON(json) {
		for (let i of json) {
			this.data.push({
				item: new Item().fromJSON({name: i.item}),
				count: i.count
			});
		}
		return this;
	}
}

module.exports = Inventory;