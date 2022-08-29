// Bot stats command.

const DJSBuilders = require("@discordjs/builders");
const os = require("os");
const moment = require("moment");
const package = require("../../../../package.json");

function buildGaugeString (value, max) {
	// Max gauge width excluding the side borders is 20.
	const gaugeWidth = 20;
	const gaugeFill = "█";
	const gaugeEmpty = " ";
	let calculatedValue = value / max * gaugeWidth;
	let string = "`";
	for (let i = 0; i < gaugeWidth; i++) {
		if (i < calculatedValue) {
			string += gaugeFill;
		} else {
			string += gaugeEmpty;
		}
	}
	return string + "`";
}

function calculateLoadPercentAndReturnAString() {
	// The string will be formatted as "<average load>% <gauge>"
	const load = os.loadavg();
	const averageLoad = Math.round(load[0] * 100);
	const gauge = buildGaugeString(averageLoad, 100);
	return `${averageLoad}% ${gauge}`;
}

function calculateMemoryUsageAndReturnAString() {
	const memoryUsage = process.memoryUsage();
	const totalMemory = Math.round(memoryUsage.heapTotal / 1024 / 1024);
	const usedMemory = Math.round(memoryUsage.heapUsed / 1024 / 1024);
	const gauge = buildGaugeString(usedMemory, totalMemory);
	return `${usedMemory}/${totalMemory}MB ${gauge}`;
}

function calculateSystemMemoryUsageAndReturnAString() {
	const memoryUsage = os.freemem();
	const totalMemory = Math.round(os.totalmem() / 1024 / 1024);
	const usedMemory = Math.round(memoryUsage / 1024 / 1024);
	const gauge = buildGaugeString(usedMemory, totalMemory);
	return `${usedMemory}/${totalMemory}MB ${gauge}`;
}

module.exports = {
	botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
	userPermissions: [],
	enabled: true,
	guildOnly: false,
	ownerOnly: false,
	name: "stats",
	aliases: [],
	description: "Sends bot statistics.",
	detailedDescription: "Sends bot statistics not covered in the about command.",
	cooldown: 1000,
	args: [],
	run: async function(message, client, args) {
		let totalUsers = 0;
		for (let guild of client.guilds.cache.values()) {
			totalUsers += guild.memberCount;
		}
		// Create a statistics embed.
		let discordJSVersion = package.dependencies["discord.js"].replace(/^(\d+\.\d+\.\d+).*$/, "$1");
		let otherDependencies = Object.keys(package.dependencies).filter(dependency => dependency !== "discord.js");
		let otherDependenciesString = "";
		if (otherDependencies.length > 0) {
			// Create a string of other dependencies. Each line should look like this:
			// "name@version"
			otherDependenciesString = otherDependencies.map(dependency => `${dependency}@${package.dependencies[dependency].replace(/^(\d+\.\d+\.\d+).*$/, "$1")}`).join(", ");
		}
		const statsEmbed = new DJSBuilders.EmbedBuilder()
			.setTitle("Statistics")
			.addFields([
				{
					name: "Development statistics",
					value: `Node Version: ${process.version}
					Library: discord.js@${discordJSVersion}
					Depends on: ${otherDependenciesString}
					`
				},
				{
					name: "System statistics",
					value: `
					OS: ${os.type()} ${os.release()}
					CPU: ${os.cpus()[0].model} (os.cpus()[0].speed MHz) x${os.cpus().length}
					System Load: ${calculateLoadPercentAndReturnAString()}
					System Memory: ${calculateSystemMemoryUsageAndReturnAString()}
				  `
				},
				{
					name: "Bot statistics",
					value: `
					Uptime: ${moment.duration(client.uptime).format("d[ days], h[ hours], m[ minutes], s[ seconds]")}
					Memory Usage: ${calculateMemoryUsageAndReturnAString()}
					Number of guilds: ${client.guilds.size}
					Number of users: ${totalUsers}
					Number of cached users: ${client.users.cache.size}
					`
				},
				{
					name: "Economy statistics",
					value: `
					Number of users with ${client.user.username} accounts: ${client.database.users.length()}
					Total potatoes in circulation: ${client.database.users.toJSON().reduce((acc, user) => acc + user.count + user.bank, 0)} ${client.customEmojis.potato}
					`
				}
			])
			.setColor(client.colors.potato)
			.setFooter({
				text: `${client.user.username} v${package.version}`
			})
			.setTimestamp()

		message.channel.send({
			embed: statsEmbed
		});
	}
}
