const Item = require("./Item");

class Auction {
    constructor() {
        this.id = "";
        this.item = new Item();
        this.user = "";
        this.price = 0;
        this.time = 0;
        this.count = 0;
    }

    getId() {
        return this.id;
    }

    getItem() {
        return this.item;
    }

    getUser() {
        return this.user;
    }

    getPrice() {
        return this.price;
    }

    getTime() {
        return this.time;
    }

    getCount() {
        return this.count;
    }

    toJSON() {
        return {
            id: this.id,
            item: this.item.toJSON(),
            user: this.user,
            price: this.price,
            time: this.time,
            count: this.count
        };
    }

    fromJSON(json) {
        this.id = json.id;
        this.item = new Item().fromJSON({ name: json.item });
        this.user = json.user;
        this.price = json.price;
        this.time = json.time;
        this.count = json.count;
        return this;
    }
}

module.exports = Auction;