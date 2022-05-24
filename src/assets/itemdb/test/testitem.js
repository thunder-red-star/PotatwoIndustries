class TestItem extends BaseItem {
	static itemData = {
		name: "Test Item",
		description: "A test item that sends a message to channel when used.",
		cost: 100,
		sell: 50,
		worth: 100,
		sellable: true,
		tradeable: true,
		type: "test",
		aliases: ["testitem"],
	};

	constructor() {
		super({
			name: "Test Item",
			description: "A test item that sends a message to channel when used.",
			cost: 100,
			sell: 50,
			worth: 100,
			sellable: true,
			tradeable: true,
			type: "test",
			aliases: ["testitem"],
		});
	}

	use(message) {
		return message.channel.send("Test item used!");
	}
}

module.exports = TestItem;