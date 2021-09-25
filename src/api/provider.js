import EventsModel from '../model/events';
import {isOnline} from '../utils/common';

const getSyncedEvents = (items) =>
  items
    .filter(({success}) => success)
    .map(({payload}) => payload.point);

const createStoreStructure = (items) =>
  items
    .reduce((acc, current) => Object.assign({}, acc, {
      [current.id]: current,
    }), {});

class Provider {
  constructor(api, eventsStore, destinationsStore, offersStore) {
    this._api = api;
    this._eventsStore = eventsStore;
    this._destinationsStore = destinationsStore;
    this._offersStore = offersStore;
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map(EventsModel.adaptToServer));
          this._eventsStore.setItems(items);
          return points;
        });
    }

    const storeEvents = Object.values(this._eventsStore.getItems());

    return Promise.resolve(storeEvents.map(EventsModel.adaptToClient));
  }

  updatePoint(point) {
    if (isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._eventsStore.setItem(updatedPoint.id, EventsModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._eventsStore.setItem(point.id, EventsModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._eventsStore.setItem(newPoint.id, EventsModel.adaptToServer(newPoint));
          return newPoint;
        });
    }

    return Promise.reject(new Error('Add point failed'));
  }

  deletePoint(point) {
    if (isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._eventsStore.removeItem(point.id));
    }

    return Promise.reject(new Error('Delete point failed'));
  }

  getInitialData() {
    if(isOnline()) {
      return this._api.getInitialData()
        .then((results) => {
          const [destinations, offers] = results;
          this._destinationsStore.setItems(destinations);
          this._offersStore.setItems(offers);
          return results;
        });
    }

    const storeDestinations = this._destinationsStore.getItems();
    const storeOffers = this._offersStore.getItems();
    return Promise.resolve([storeDestinations, storeOffers]);
  }

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._eventsStore.getItems());

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);
          const items = createStoreStructure([...createdEvents, ...updatedEvents]);

          this._eventsStore.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}

export default Provider;
