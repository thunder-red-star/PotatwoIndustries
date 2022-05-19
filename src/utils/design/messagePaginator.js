// Message command paginator (use buttons)

const DJSBuilders = require('@discordjs/builders');

const buttonArray = [
    new DJSBuilders.ButtonComponent().setCustomId('first').setStyle(1).setEmoji({
        name: '⏪',
        id: '975607423161221130',
        animated: false
    }),
    new DJSBuilders.ButtonComponent().setCustomId('back').setStyle(1).setEmoji({
        name: '◀',
        id: '975607423299616768',
        animated: false
    }),
    new DJSBuilders.ButtonComponent().setCustomId('discard').setStyle(4).setEmoji({
        name: '🗑',
        id: '975607423345766440',
        animated: false
    }),
    new DJSBuilders.ButtonComponent().setCustomId('forward').setStyle(1).setEmoji({
        name: '▶',
        id: '975607423257690202',
        animated: false
    }),
    new DJSBuilders.ButtonComponent().setCustomId('last').setStyle(1).setEmoji({
        name: '⏩',
        id: '975607423215730728',
        animated: false
    })
];

module.exports = function(message, pages) {
    // Message should be a Discord.Message
    // Pages should be an array of Discord.Embeds or DJSBuilders.Embed

    // Create the button row
    let actionRow = new DJSBuilders.ActionRow();
    for (let i = 0; i < buttonArray.length; i++) {
        actionRow.addComponent(buttonArray[i]);
    }

    // Send the page with the array of buttons
    let msg = message.reply({
        content: "Loading...",
    })

    let page = 0;

    // Send the first page
    msg.edit({
        content: `Page ${page + 1} of ${pages.length}`,
        embeds: [pages[page]],
        components: [actionRow]
    });

    // Create the button collector
    const filter = (button) => {
        button !== null;
    };

    const collector = msg.createMessageComponentCollector(filter, {
        filter,
        timeout: 60000
    });

    // Add the button collector event listeners
    collector.on('collect', (button) => {
        switch (button.customId) {
            case 'first':
                page = 0;
                break;
            case 'back':
                if (page > 0) {
                    page--;
                }
                break;
            case 'discard':
                message.delete();
                return;
            case 'forward':
                if (page < pages.length - 1) {
                    page++;
                }
                break;
            case 'last':
                page = pages.length - 1;
                break;
        }

        // Reset the timeout
        collector.resetTimer();

        // Send the new page
        msg.edit({
            content: `Page ${page + 1} of ${pages.length}`,
            embeds: [pages[page]],
            components: [actionRow]
        });
    });

    collector.on('end', (collected, reason) => {
        // If message was deleted, do nothing
        if (reason === 'messageDelete') {
            return;
        } else if (reason === 'time') {
            // Create a new action row, but with all buttons disabled
            let actionRow = new DJSBuilders.ActionRow();
            for (let i = 0; i < buttonArray.length; i++) {
                actionRow.addComponent(buttonArray[i].setDisabled(true));
            }

            // Send the new page
            msg.edit({
                content: `Page ${page + 1} of ${pages.length}`,
                embeds: [pages[page]],
                components: [actionRow]
            });
        }
    });

    return msg;
}