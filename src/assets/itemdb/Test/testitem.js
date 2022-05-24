const BaseItem = require('../baseitem');

class TestItem extends BaseItem {
	static itemData = {
		name: "Test Item",
		description: "A test item that sends a message to channel when used.",
		cost: 100,
		sell: 50,
		worth: 100,
		buyable: true,
		sellable: true,
		usable: true,
		tradeable: true,
		type: "Test",
		aliases: ["testitem"],
	};

	constructor() {
		super(TestItem.itemData);
	}

	static use(message) {
		return message.channel.send("Test item used!");
	}
}

module.exports = TestItem;