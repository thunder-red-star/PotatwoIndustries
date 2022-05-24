// Item database, converts item strings to item classes found in src/assets/itemdb/*

const fs = require("fs");

class ItemDatabase {
  static init() {
    this.items = {};
    this.itemAliases = {};
    // Reads items folder and list directories within
    let itemTypes = fs.readdirSync("./src/assets/itemdb/").filter(
      file => fs.statSync("./src/assets/itemdb/" + file).isDirectory()
    );
    // For each item type
    for (let i = 0; i < itemTypes.length; i++) {
      // Read the item type folder
      let itemType = itemTypes[i];
      let items = fs.readdirSync("./src/assets/itemdb/" + itemType);
      // For each item in the item type folder
      for (let j = 0; j < items.length; j++) {
        // Load the class and set the json key with the item name to the class
        let item = require("../assets/itemdb/" + itemType + "/" + items[j]);
        this.items[item.itemData.name] = item;
        // Load the aliases for the item
        let itemAliases = require("../assets/itemdb/" + itemType + "/" + items[j]).itemData.aliases;
        // For each alias
        for (let k = 0; k < itemAliases.length; k++) {
          // Set the alias to the item name
          this.itemAliases[itemAliases[k]] = item.itemData.name;
        }
      }
    }
  }

  static fromAlias(itemName) {
    // If the item is not in the database, return null
    if (!this.itemAliases[itemName]) {
      return null;
    } else {
      // If the item is in the database, return the item
      return this.items[this.itemAliases[itemName]];
    }
  }

  static getItem(itemName) {
    // If the item is not in the database, return null
    if (!this.items[itemName]) {
      return null;
    } else {
      if (this.fromAlias(itemName) !== null) {
        return this.fromAlias(itemName);
      } else {
        return this.items[itemName];
      }
    }
  }
}

module.exports = ItemDatabase;