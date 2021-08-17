import EditFormView from './view/editing-form';
import EventView from './view/event';
import FiltersView from './view/filters';
import EventListView from './view/trip-events-list';
import TripSortView from './view/trip-sort';
import RouteInfo from './view/route-info';
import MenuView from './view/menu';
import TripPriceView from './view/trip-price';
import TripInfoView from './view/trip-info';
import NoEventView from './view/no-event';
import {compareTimeStart} from './utils/dates';
import {RenderPosition, render, replace} from './utils/render';

import {generatePoint} from './mock/points';

const FILTERS = ['Everything', 'Future', 'Past'];

const TRIP_EVENT_COUNT = 15;

const points = Array(TRIP_EVENT_COUNT).fill().map(generatePoint).sort(compareTimeStart);

const renderEvent = (eventListElement, point) => {
  const eventComponent = new EventView(point);
  const editFormComponent = new EditFormView(point, true);

  const replaceEventToForm = () => {
    replace(editFormComponent, eventComponent);
  };

  const replaceFormToEvent = () => {
    replace(eventComponent, editFormComponent);
  };

  function onEscKeydown (evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener('keydown', onEscKeydown);
    }
  }

  eventComponent.setEditClickHandler(() => {
    replaceEventToForm();
    document.addEventListener('keydown', onEscKeydown);
  });

  editFormComponent.setCloseClickHandler(() => {
    replaceFormToEvent();
    document.removeEventListener('keydown', onEscKeydown);
  });

  editFormComponent.setSubmitFormHandler(() => {
    replaceFormToEvent();
    document.removeEventListener('keydown', onEscKeydown);
  });

  render(eventListElement, eventComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (events) => {
  const tripMainElement = document.querySelector('.trip-main');

  const siteMenuElement = tripMainElement.querySelector('.trip-controls__navigation');
  render(siteMenuElement, new MenuView(), RenderPosition.BEFOREEND);

  const eventFilterElement = tripMainElement.querySelector('.trip-controls__filters');
  render(eventFilterElement, new FiltersView(), RenderPosition.BEFOREEND);

  const pageMainElement = document.querySelector('.page-main');
  const tripEventsElement = pageMainElement.querySelector('.trip-events');

  if (!events || events.length === 0) {
    render(tripEventsElement, new NoEventView(FILTERS[0]), RenderPosition.BEFOREEND);
    return;
  }

  const tripInfoComponent = new TripInfoView();
  render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
  render(tripInfoComponent, new RouteInfo(events), RenderPosition.BEFOREEND);
  render(tripInfoComponent, new TripPriceView(events), RenderPosition.BEFOREEND);


  render(tripEventsElement, new TripSortView(), RenderPosition.BEFOREEND);

  const eventListComponent = new EventListView();
  render(tripEventsElement, eventListComponent, RenderPosition.BEFOREEND);

  for (events of events) {
    renderEvent(eventListComponent.getElement(), events);
  }
};

renderBoard(points);
