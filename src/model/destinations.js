class Destinations {
  constructor() {
    this._destinations = new Map();
  }

  setDestinations(destinations) {
    destinations.forEach((destination) => this._destinations.set(destination.name, destination));
  }

  getDestinations() {
    return this._destinations;
  }
}

export default Destinations;

