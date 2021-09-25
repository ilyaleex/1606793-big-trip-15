import AbstractView from './abstract.js';
import {compareTimeStart, humanizeDateDayMonth, humanizeDateMonthDay} from '../utils/dates.js';

const MAX_DESTINATIONS = 3;

const createRouteTemplate = (destinations) => (destinations.length <= MAX_DESTINATIONS)
  ? destinations.map((destination) => destination.name).join('&nbsp;&mdash;&nbsp;')
  : `${destinations[0].name}&nbsp;&mdash;&nbsp;&hellip;&nbsp;&mdash;&nbsp;${destinations[destinations.length - 1].name}`;

const createDatesTemplate =  (events) => {
  const dateStart = events[events.length - 1].timeStart;
  const dateEnd = events[0].timeEnd;

  if (humanizeDateMonthDay(dateStart) === humanizeDateMonthDay(dateEnd)) {
    return humanizeDateMonthDay(dateStart);
  }

  return (dateStart.getMonth() === dateEnd.getMonth())
    ? `${humanizeDateMonthDay(dateStart)}&nbsp;&mdash;&nbsp;${dateEnd.getDay()}`
    : `${humanizeDateDayMonth(dateStart)}&nbsp;&mdash;&nbsp;${humanizeDateDayMonth(dateEnd)}`;
};

const createRouteInfoTemplate = (events) => {
  const destinations = events.map((event) => event.destination);
  return `<div class="trip-info__main">
    <h1 class="trip-info__title">${createRouteTemplate(destinations)}</h1>

    <p class="trip-info__dates">${createDatesTemplate(events)}</p>
  </div>`;
};

class RouteInfo extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createRouteInfoTemplate(this._events.sort(compareTimeStart));
  }
}

export default RouteInfo;
