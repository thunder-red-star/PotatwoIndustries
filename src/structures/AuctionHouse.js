const Auction = require('./Auction');

class AuctionHouse {
    constructor() {
        this.auctions = [];
    }

    addAuction(auction) {
        this.auctions.push(new Auction().fromJSON(auction));
    }

    getAuction(id) {
        for (let i = 0; i < this.auctions.length; i++) {
            if (this.auctions[i].id == id) {
                return this.auctions[i];
            }
        }
        return null;
    }

    getAuctions() {
        return this.auctions;
    }

    getAuctionsByItem(item) {
        let auctions = [];
        for (let i = 0; i < this.auctions.length; i++) {
            if (this.auctions[i].item.name == item) {
                auctions.push(this.auctions[i]);
            }
        }
        return auctions;
    }

    getAuctionsByUser(user) {
        let auctions = [];
        for (let i = 0; i < this.auctions.length; i++) {
            if (this.auctions[i].user.id == user.id) {
                auctions.push(this.auctions[i]);
            }
        }
        return auctions;
    }

    getAuctionCount() {
        return this.auctions.length;
    }

    removeAuction(id) {
        for (let i = 0; i < this.auctions.length; i++) {
            if (this.auctions[i].id == id) {
                this.auctions.splice(i, 1);
            }
        }
    }

    fromJSON(json) {
        try {
            this.auctions = json.map(auction => new Auction().fromJSON(auction));
        } catch (e) {
            this.auctions = [];
        }
    }

    toJSON() {
        return this.auctions.map(auction => auction.toJSON());
    }
}

module.exports = AuctionHouse;