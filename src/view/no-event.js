import AbstractView from './abstract';

const NoEventMessage = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  FUTURE: 'There are no future events now',
};

const createNoEventTemplate = (filter) => `<p class="trip-events__msg">${NoEventMessage[filter.toUpperCase()]}</p>`;

class NoEvent extends AbstractView {
  constructor(filter) {
    super();
    this._filter = filter;
  }

  getTemplate() {
    return createNoEventTemplate(this._filter);
  }
}

export default NoEvent;
