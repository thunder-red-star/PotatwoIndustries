const Inventory = require('./Inventory');

class User {
	// Class representing the profile of a discord bot user.

	constructor (id = "") {
		this.id = id;
		this.count = 0;
		this.inventory = new Inventory();
		this.blacklisted = false;
		this.passive = false;
	}

	// Set count
	setPotatoes (count) {
		this.count = count;
	}

	// Add count
	addPotatoes (count) {
		this.count += count;
	}

	// Get count
	getPotatoes () {
		return this.count;
	}

	// Toggle blacklisted
	toggleBlacklisted () {
		this.blacklisted = !this.blacklisted;
	}

	// Set blacklisted
	setBlacklisted (blacklisted) {
		this.blacklisted = blacklisted;
	}

	// Get blacklisted
	isBlacklisted () {
		return this.blacklisted;
	}

	// Get inventory
	getInventory () {
		return this.inventory;
	}

	// Get passive
	isPassive () {
		return this.passive;
	}

	// Toggle passive
	togglePassive () {
		this.passive = !this.passive;
	}

	// Set passive
	setPassive (passive) {
		this.passive = passive;
	}

	// Get bank
	getBank () {
		return this.bank;
	}

	// Set bank
	setBank (bank) {
		this.bank = bank;
	}

	// Add bank
	addBank (bank) {
		this.bank += bank;
	}

	fromJSON (json) {
		this.id = json.id;
		this.count = json.count;
		this.inventory = new Inventory().fromJSON(json.inventory);
		this.blacklisted = json.blacklisted;
		this.passive = json.passive || false;
		this.bank = json.bank || 0;
		return this;
	}

	toJSON () {
		return {
			id: this.id,
			count: this.count,
			inventory: this.inventory.toJSON(),
			blacklisted: this.blacklisted,
			passive: this.passive,
			bank: this.bank
		};
	}
}

module.exports = User;