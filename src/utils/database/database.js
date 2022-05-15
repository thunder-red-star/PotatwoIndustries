const fs = require('fs');

// Database class (for manipulating the JSON database of the bot)
class Database {
	constructor(filePath = './data/database.json') {
		this.filePath = filePath;
		this.data = {};
	}

	static setFilePath(filePath) {
		this.filePath = filePath;
	}

	static load() {
		if (!fs.existsSync(this.filePath)) {
			fs.writeFileSync(this.filePath, '{}');
		}
		this.data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
	}

	static write(data) {
		fs.writeFileSync(this.filePath, JSON.stringify(data, null, 4), 'utf8');
	}

	static get(key) {
		// If key is an array, split it and traverse the object in order with the keys
		if (Array.isArray(key)) {
			let current = this.data;
			for (let i = 0; i < key.length; i++) {
				current = current[key[i]];
			}
			return current;
		} else if (typeof key === 'string') {
			if (key.includes('.')) {
				let keys = key.split('.');
				// Call this function with the keys array
				return this.get(keys);
			} else {
				return this.data[key];
			}
		}
	}

	static set(key, value) {
		// If key is an array, split it and traverse the object in order with the keys
		if (Array.isArray(key)) {
			let current = this.data;
			for (let i = 0; i < key.length; i++) {
				if (i === key.length - 1) {
					current[key[i]] = value;
				} else {
					current = current[key[i]];
				}
			}
		} else if (typeof key === 'string') {
			if (key.includes('.')) {
				let keys = key.split('.');
				// Call this function with the keys array
				this.set(keys, value);
			} else {
				this.data[key] = value;
			}
		}
	}

	// For the add function, add the value provided to the key provided if the key's value is a number, if the key's value is not a number, throw an error. If the key doesn't exist, set the value to the value provided.
	static add(key, value) {
		if (Array.isArray(key)) {
			let current = this.data;
			for (let i = 0; i < key.length; i++) {
				if (i === key.length - 1) {
					if (typeof current[key[i]] === 'number' && typeof value === 'number') {
						current[key[i]] += value;
					} else {
						if (typeof current[key[i]] === 'number') {
							throw new Error(`The value provided ${value} is not a number.`);
						} else {
							throw new Error(`The key ${key[i]} does not contain a number.`);
						}
					}
				} else {
					current = current[key[i]];
				}
			}
		} else if (typeof key === 'string') {
			if (key.includes('.')) {
				let keys = key.split('.');
				// Call this function with the keys array
				this.add(keys, value);
			} else {
				if (typeof this.data[key] === 'number' && this.data[key] !== undefined) {
					this.data[key] += value;
				} else if (this.data[key] === undefined) {
					this.data[key] = value;
				} else {
					throw new Error(`The key ${key} does not contain a number.`);
				}
			}
		}
	}

	// Check if a key exists in the database
	static keyExists (key) {
		if (Array.isArray(key)) {
			let current = this.data;
			for (let i = 0; i < key.length; i++) {
				if (current[key[i]] === undefined) {
					return false;
				} else {
					current = current[key[i]];
				}
			}
			return true;
		} else if (typeof key === 'string') {
			if (key.includes('.')) {
				let keys = key.split('.');
				// Call this function with the keys array
				return this.keyExists(keys);
			} else {
				return this.data[key] !== undefined;
			}
		}
	}
}