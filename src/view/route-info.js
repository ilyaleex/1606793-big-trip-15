import AbstractView from './abstract.js';
import {humanizeDateDayMonth, humanizeDateMonthDay} from '../utils/dates.js';

const MAX_DESTINATIONS = 3;

const createRouteTemplate = (destinations) => (destinations.length <= MAX_DESTINATIONS)
  ? destinations.join('&nbsp;&mdash;&nbsp;')
  : `${destinations.length - 1}&nbsp;&mdash;&nbsp;&hellip;&nbsp;&mdash;&nbsp;${destinations[0]}`;


const createDatesTemplate =  (events) => {
  const dateStart = events[events.length - 1].timeStart;
  const dateEnd = events[0].timeEnd;
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

export default class RouteInfo extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createRouteInfoTemplate(this._events);
  }
}
