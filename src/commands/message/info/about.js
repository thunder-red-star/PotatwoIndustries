// Bot ping command.

const DJSBuilders = require("@discordjs/builders");

module.exports = {
	botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
	userPermissions: [],
	enabled: true,
	guildOnly: false,
	ownerOnly: false,
	name: "about",
	aliases: [],
	description: "Sends general bot information.",
	detailedDescription: "Sends general bot information.",
	cooldown: 1000,
	args: [],
	run: async function(message, client, args) {
		// Create an about embed.
		const aboutEmbed = new DJSBuilders.EmbedBuilder()
			.setTitle("About " + client.user.username)
			.addFields([
				{
					name: "Contributors",
					value: "<@698218089010954481> <@701554023337033808> <@691009964570968144>",
					inline: true
				},
				{
					name: "Support server",
					value: "https://discord.gg/vX2JgPQC7W",
					inline: true
				},
				{
					name: "Original bot voting page",
					value: "https://top.gg/bot/839966871143186472/vote",
					inline: true
				},
				{
					name: "Nick's youtube channel",
					value: "https://www.youtube.com/channel/UCqiV-VjdA7Iydx3Y8Y1z0TQ",
					inline: true
				},
				{
					name: "Made by",
					value: "ThunderRedStar",
				}
			])
			.setColor(client.colors.success)
			.setFooter("Expecting other values? Try `" + client.getServerPrefix(message) + "stats` instead.")

		const ytButton = new DJSBuilders.ButtonBuilder()
			.setLabel("Nick's YT")
			.setURL(`https://www.youtube.com/channel/UCqiV-VjdA7Iydx3Y8Y1z0TQ`)
			.setStyle(5);

		const supportButton = new DJSBuilders.ButtonBuilder()
			.setLabel("Support server")
			.setURL(`https://discord.gg/vX2JgPQC7W`)

		const buttonRow = new DJSBuilders.ActionRowBuilder()
			.addComponents(ytButton, supportButton);

		return message.reply({
			embeds: [aboutEmbed],
			components: [buttonRow]
		});
	}
}
