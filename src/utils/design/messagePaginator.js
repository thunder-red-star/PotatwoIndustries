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

module.exports = async function(message, pages) {
    // Message should be a Discord.Message
    // Pages should be an array of Discord.Embeds or DJSBuilders.Embed

    let newActionRow = new DJSBuilders.ActionRow();
    let page = 0;
    for (let i = 0; i < buttonArray.length; i++) {
        // Copy the button into a new button
        let newButton = new DJSBuilders.ButtonComponent().setCustomId(buttonArray[i].custom_id).setStyle(buttonArray[i].style).setEmoji(buttonArray[i].emoji);
        if (page === 0 && (i === 0 || i === 1)) {
            newButton.setDisabled(true);
        }
        if (page === pages.length - 1 && (i === 3 || i === 4)) {
            newButton.setDisabled(true);
        }
        newActionRow.addComponents(newButton);
    }

    // Send the page with the array of buttons
    let msg = await message.reply({
        content: "Loading...",
    })


    // Send the first page
    await msg.edit({
        content: `Page ${page + 1} of ${pages.length}`,
        embeds: [pages[page]],
        components: [newActionRow]
    });

    // Create the button collector
    const filter = (button) => {
        button !== null;
    };

    const collector = await msg.createMessageComponentCollector(filter, {
        filter,
        timeout: 60000
    });

    // Add the button collector event listeners
    collector.on('collect', async (button) => {
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
                msg.delete();
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

        await button.deferUpdate();

        // Reset the timeout
        collector.resetTimer();

        let newActionRow = new DJSBuilders.ActionRow();
        for (let i = 0; i < buttonArray.length; i++) {
            // Copy the button into a new button
            let newButton = new DJSBuilders.ButtonComponent().setCustomId(buttonArray[i].custom_id).setStyle(buttonArray[i].style).setEmoji(buttonArray[i].emoji);
            if (page === 0 && (i === 0 || i === 1)) {
                newButton.setDisabled(true);
            }
            if (page === pages.length - 1 && (i === 3 || i === 4)) {
                newButton.setDisabled(true);
            }
            newActionRow.addComponents(newButton);
        }

        // Send the new page
        await msg.edit({
            content: `Page ${page + 1} of ${pages.length}`,
            embeds: [pages[page]],
            components: [newActionRow]
        });
    });

    collector.on('end', async (collected, reason) => {
        // If message was deleted, do nothing
        try {
            // Create a new action row, but with all buttons disabled
            let actionRow = new DJSBuilders.ActionRow();
            for (let i = 0; i < buttonArray.length; i++) {
                actionRow.addComponents(buttonArray[i].setDisabled(true));
            }

            // Send the new page
            await msg.edit({
                content: `Page ${page + 1} of ${pages.length}`,
                embeds: [pages[page]],
                components: [actionRow]
            });
        } catch (e) {
            // Do nothing since message was deleted
        }
    });

    return msg;
}