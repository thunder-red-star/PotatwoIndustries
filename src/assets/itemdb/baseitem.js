class BaseItem {
  constructor(props) {
    this.name = props.name;
    this.description = props.description || "";
    this.cost = props.cost || 0;
    this.sell = props.sell || 0;
    this.worth = props.worth || 0;
    this.buyable = props.buyable || false;
    this.sellable = props.sellable || false;
    this.usable = props.usable || false;
    this.tradeable = props.tradeable || false;
    this.type = props.type || "";
    this.aliases = props.aliases || [];
  }

  static use(message) {
    // Do nothing, this will be overridden in subclasses
  }
}

module.exports = BaseItem;
