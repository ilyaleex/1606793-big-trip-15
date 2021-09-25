import AbstractObserver from '../utils/abstract-observer';
import {UpdateType} from '../const';

class Events extends AbstractObserver {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(events) {
    this._events = events.slice();
    this._notify(UpdateType.INIT, this._events);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events,
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
      {},
      event,
      {
        price: event['base_price'],
        timeStart: new Date(event['date_from']),
        timeEnd: new Date(event['date_to']),
        isFavorite: event['is_favorite'],
      },
    );

    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign(
      {},
      event,
      {
        'base_price': event.price,
        'date_from': event.timeStart instanceof Date ? event.timeStart.toISOString() : event.timeStart,
        'date_to': event.timeEnd instanceof Date ? event.timeEnd.toISOString() : event.timeEnd,
        'is_favorite': event.isFavorite,
      },
    );

    delete adaptedEvent.price;
    delete adaptedEvent.timeStart;
    delete adaptedEvent.timeEnd;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}

export default Events;

