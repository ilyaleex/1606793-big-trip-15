import {createMenuTemplate} from './view/menu.js';
import {createRouteDataTemplate} from './view/route-data.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripPriceTemplate} from './view/trip-price.js';
import {createFiltersTemplate} from './view/filters.js';
import {createTripSortTemplate} from './view/trip-sort';
import {createTripEventsListTemplate} from './view/trip-events-list.js';
import {createCreationFormTemplate} from './view/creation-form.js';
import {createEditingFormTemplate} from './view/editing-form.js';
import {createRoutePointTemplate} from './view/route-point.js';

const TEMPLATE_COUNT = 3;

const render = (container, place, template) => {
  container.insertAdjacentHTML(place, template);
};

const siteTripMainElement = document.querySelector('.trip-main');
const siteTripInfoElement = document.querySelector('.trip-info');
const siteTripControlsElement = document.querySelector('.trip-controls');
const siteTripControlsFiltersElement = siteTripControlsElement.querySelector('.trip-controls__filters');
const siteControlsNavigationElement = siteTripControlsElement.querySelector('.trip-controls__navigation');
const siteTripEventsListElement = document.querySelector('.trip-events__list');
const siteTripSortElement = document.querySelector('.trip-sort');


render(siteTripMainElement, createTripInfoTemplate(), 'afterbegin');
render(siteTripMainElement, createRouteDataTemplate(), 'afterbegin');
render(siteTripInfoElement, createTripPriceTemplate(), 'beforeend');

render(siteControlsNavigationElement, createMenuTemplate(), 'afterbegin');
render(siteTripControlsFiltersElement, createFiltersTemplate(), 'beforeend');

render(siteTripEventsListElement, createTripSortTemplate(), 'beforebegin');

render(siteTripSortElement, createTripEventsListTemplate(), 'afterend');
render(siteTripEventsListElement, createCreationFormTemplate(), 'beforeend');
render(siteTripEventsListElement, createEditingFormTemplate(), 'afterbegin');
for (let i = 0; i < TEMPLATE_COUNT; i++) {
  render(siteTripEventsListElement, createRoutePointTemplate(), 'afterend');
}


