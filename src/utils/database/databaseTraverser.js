const Database = require('./database');

class DatabaseTraverser {
	// A database traverser

	constructor () {
		this.database = Database.load();
	}
}

module.exports = DatabaseTraverser;