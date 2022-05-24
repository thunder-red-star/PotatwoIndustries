module.exports = {
  botPermissions: ["SEND_MESSAGES", "MANAGE_MESSAGES", "CREATE_INSTANT_INVITE"],
  userPermissions: ["MANAGE_MESSAGES"],
  enabled: true,
  guildOnly: false,
  ownerOnly: false,
  name: "createinv",
  aliases: ["createinvite", "serverinvite"],
  description: "Create an invite for the server.",
  detailedDescription: "Creates a permanent invite for the server.",
  cooldown: 2500,
  args: [],
  run: async function(message, client, args) {
    let invite = await message.channel.createInvite({
      maxAge: 0,
      maxUses: 0,
    });
    return message.reply({
      embeds: [{
        title: "Invite",
        description: client.customEmojis.check + " Here is your invite: " + invite.url,
        color: client.colors.success
      }]
    });
  }
}
