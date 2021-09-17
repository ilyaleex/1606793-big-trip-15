export default class Offers {
  constructor() {
    this._offers = new Map();
  }

  setOffers(offers) {
    offers.forEach((offer) => this._offers.set(offer.type, offer));
  }

  getOffers(type) {
    return this._offers.get(type);
  }

  getEventTypes() {
    return [...this._offers.keys()];
  }
}
