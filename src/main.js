import BoardPresenter from './presenter/board';
import FiltersPresenter from './presenter/filters';
import DestinationsModel from './model/destinations';
import EventsModel from './model/events';
import OffersModel from './model/offers';
import FiltersModel from './model/filters';
import {compareTimeStart} from './utils/dates';

import {generateEvent} from './mock/events';
import {allDestinations} from './mock/destinations';
import {allOffers} from './mock/offers';

const destinationsModel = new DestinationsModel();
destinationsModel.setDestinations(allDestinations);

const offersModel = new OffersModel();
offersModel.setOffers(allOffers);

const filtersModel = new FiltersModel();

const TRIP_EVENT_COUNT = 15;

const events = Array(TRIP_EVENT_COUNT).fill().map(generateEvent).sort(compareTimeStart);
const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const tripMainElement = document.querySelector('.trip-main');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');

const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const filtersPresenter = new FiltersPresenter(tripFiltersElement, filtersModel);
const tripPresenter = new BoardPresenter(tripMainElement, tripEventsElement, eventsModel, filtersModel, destinationsModel, offersModel);
tripPresenter.init();
filtersPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});

