import TripPresenter from './presenter/trip';
import {compareTimeStart} from './utils/dates';

import {generatePoint} from './mock/points';


const TRIP_EVENT_COUNT = 15;

const points = Array(TRIP_EVENT_COUNT).fill().map(generatePoint).sort(compareTimeStart);

const tripMainElement = document.querySelector('.trip-main');

const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement);
tripPresenter.init(points);
