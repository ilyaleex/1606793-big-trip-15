import AbstractView from './abstract';

const createTripEventsListTemplate = () => '<ul class="trip-events__list"></ul>';

class TripEventsList extends AbstractView {
  getTemplate() {
    return createTripEventsListTemplate();
  }
}

export default TripEventsList;
