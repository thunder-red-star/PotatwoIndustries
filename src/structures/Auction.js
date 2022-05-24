class Auction {
    constructor() {

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
            item: this.item,
            user: this.user,
            price: this.price,
            time: this.time,
            count: this.count
        };
    }

    fromJSON(json) {
        this.id = json.id;
        this.item = json.item;
        this.user = json.user;
        this.price = json.price;
        this.time = json.time;
        this.count = json.count;
    }
}

module.exports = Auction;