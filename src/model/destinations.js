export default class Destinations {
  constructor() {
    this._destinations = new Map();
  }

  setDestinations(destinations) {
    destinations.forEach((destination) => this._destinations.set(destination.name, destination));
  }

  getDestination(name) {
    return this._destinations.get(name);
  }
}
