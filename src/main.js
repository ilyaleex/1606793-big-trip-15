import BoardPresenter from './presenter/board';
import TripInfoPresenter from './presenter/trip-info';
import FiltersPresenter from './presenter/filters';
import StatisticsPresenter from './presenter/statistics';

import DestinationsModel from './model/destinations';
import EventsModel from './model/events';
import OffersModel from './model/offers';
import FiltersModel from './model/filters';
import {compareTimeStart} from './utils/dates';

import SiteMenuView from './view/site-menu';
import NewEventButtonView from './view/new-event-button';

import {render, RenderPosition} from './utils/render';
import {MenuItem, UpdateType, FilterType} from './const';

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
const siteMenuContainer = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');

const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const tripInfoPresenter = new TripInfoPresenter(tripMainElement, eventsModel);

const filtersPresenter = new FiltersPresenter(tripFiltersElement, filtersModel, eventsModel);
const tripPresenter = new BoardPresenter(tripEventsElement, eventsModel, filtersModel, destinationsModel, offersModel);
const statisticsPresenter = new StatisticsPresenter(pageMainElement, eventsModel, offersModel.getEventTypes());
const siteMenuComponent = new SiteMenuView();
const newEventButtonComponent = new NewEventButtonView();

render(siteMenuContainer, siteMenuComponent, RenderPosition.BEFOREEND);
render(tripMainElement, newEventButtonComponent, RenderPosition.BEFOREEND);

const handleNewEventFormClose = () => {
  newEventButtonComponent.getElement().disabled = false;
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_EVENT:
      statisticsPresenter.destroy();
      tripPresenter.destroy();
      filtersModel.setFilter(UpdateType.RESET, FilterType.EVERYTHING);
      tripPresenter.createEvent(handleNewEventFormClose);
      tripPresenter.init();
      newEventButtonComponent.getElement().disabled = true;
      filtersPresenter.init();
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.TABLE:
      statisticsPresenter.destroy();
      tripPresenter.init();
      filtersPresenter.init();
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsPresenter.init();
      filtersPresenter.init(true);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
newEventButtonComponent.setMenuClickHandler(handleSiteMenuClick);

tripInfoPresenter.init();
tripPresenter.init();
filtersPresenter.init();


