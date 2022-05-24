class BaseItem {
  constructor(props) {
    this.name = props.name;
    this.description = props.description || "";
    this.cost = props.cost || 0;
    this.sell = props.sell || 0;
    this.worth = props.worth || 0;
    this.sellable = props.sellable || false;
    this.tradeable = props.tradeable || false;
    this.type = props.type || "";
    this.aliases = props.aliases || [];
  }

  use(message) {
    // Do nothing, this will be overridden in subclasses
  }
}

