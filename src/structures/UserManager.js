// User manager
const User = require('./User');

class UserManager {
	constructor() {
		this.users = [];
	}

	addUser(userId) {
		this.users.push(new User(userId));
	}

	removeUser(userId) {
		this.users = this.users.filter(user => user.id !== userId);
	}

	get(id) {
		return this.users.find(user => user.id === id);
	}

	getUsers() {
		return this.users;
	}

	getUserCount() {
		return this.users.length;
	}

	fromJSON(json) {
		try {
			this.users = json.map(user => new User().fromJSON(user));
		} catch (e) {
			// This should only happen if the user list is empty
		}
	}

	toJSON() {
		console.log(this.users)
		return this.users.map(user => user.toJSON());
	}
}

module.exports = UserManager;