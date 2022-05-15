// User manager
const User = require('./User');

class UserManager {
	constructor() {
		this.users = [];
	}

	addUser(user) {
		this.users.push(user);
	}

	removeUser(user) {
		this.users.splice(this.users.indexOf(user), 1);
	}

	getUser(id) {
		return this.users.find(user => user.id === id);
	}

	getUsers() {
		return this.users;
	}

	getUserCount() {
		return this.users.length;
	}

	fromJSON(json) {
		this.users = json.users.map(user => new User().fromJSON(user));
	}

	toJSON() {
		return this.users.map(user => user.toJSON());
	}
}