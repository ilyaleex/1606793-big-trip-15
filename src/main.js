import {createMenuTemplate} from './view/menu.js';
import {createWayDataTemplate} from './view/way-data.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripPriceTemplate} from './view/trip-price.js';
import {createFiltersTemplate} from './view/filters.js';
import {createTripSortTemplate} from './view/trip-sort.js';
import {createTripEventsListTemplate} from './view/trip-events-list.js';
import {createTripEventTemplate} from './view/trip-event.js';
import {createEditingFormTemplate} from './view/editing-form.js';
import {createWaypointTemplate} from './view/waypoint.js';
import {createOfferTemplate} from './view/offer-edit.js';

import {getRandomInt, bindActionToElement} from './utils.js';
import * as actionService from './sw/tripTabsSW.js';
import {generateWaypointTypes} from './mock/waypoint-type.js';
import {generateWaypoint} from './mock/waypoint.js';
import {generateDestinations} from './mock/destination.js';
import {generateOffers} from './mock/offers.js';
import Trip from './model/Trip.js';

const WAYPOINT_COUNT = getRandomInt(0, 20);
const waypointTypes = generateWaypointTypes();
const destinations = generateDestinations();
const offers = generateOffers(waypointTypes);
const waypoints = new Array(WAYPOINT_COUNT).fill().map(() => generateWaypoint(waypointTypes, destinations, offers));
const trip = new Trip(waypoints);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const addTripEvent = (container, event) => {
  const template = createTripEventTemplate(event);
  render(container, template, 'beforeend');
};

const addTripEvents = (container) => {
  addTripEvent(container, createEditingFormTemplate(waypointTypes, destinations, offers));

  let isFirst = true;
  for (const waypoint of trip.waypoints) {
    addTripEvent(container, createWaypointTemplate(waypoint, waypointTypes, destinations, offers));
    if (isFirst) {
      addTripEvent(container, createEditingFormTemplate(waypointTypes, destinations, offers, trip.waypoints[0]));
      isFirst = false;
    }
  }
};

const getTotalPrice = () => {
  let totalCost = 0;

  for (const waypoint of trip.waypoints) {
    const offer = offers.find((x) => x.typeId === waypoint.typeId);
    let offerPrices = 0;
    const selectedOffers = offer.offers.filter((x) => waypoint.selectedOfferIds.some((y) => y === x.id));
    if (selectedOffers.length) {
      const initialValue = 0;
      offerPrices = selectedOffers.reduce((accumulator, currentValue) => {
        if (Object.prototype.hasOwnProperty.call(currentValue, 'cost')) {
          return accumulator + currentValue.cost;
        }
        return accumulator;
      }, initialValue);
    }

    totalCost += offerPrices + waypoint.basePrice;
  }

  return totalCost;
};

const siteTripMainElement = document.querySelector('.trip-main');
render(siteTripMainElement, createTripInfoTemplate(), 'afterbegin');

const siteTripInfoElement = siteTripMainElement.querySelector('.trip-info');
render(siteTripInfoElement, createWayDataTemplate(trip, destinations), 'afterbegin');
render(siteTripInfoElement, createTripPriceTemplate(getTotalPrice()), 'beforeend');

const siteTripControlsElement = siteTripMainElement.querySelector('.trip-controls');
const siteControlsNavigationElement = siteTripControlsElement.querySelector('.trip-controls__navigation');
render(siteControlsNavigationElement, createMenuTemplate(), 'afterbegin');

const siteTripControlsFiltersElement = siteTripControlsElement.querySelector('.trip-controls__filters');
render(siteTripControlsFiltersElement, createFiltersTemplate(trip), 'beforeend');

const siteTripEventsElement = document.querySelector('.trip-events');
render(siteTripEventsElement, createTripSortTemplate(), 'beforeend');

const siteTripSortElement = siteTripEventsElement.querySelector('.trip-sort');
render(siteTripSortElement, createTripEventsListTemplate(), 'afterend');

const siteTripEventsListElement = siteTripEventsElement.querySelector('.trip-events__list');
addTripEvents(siteTripEventsElement);

const siteEventAvailableOffers = siteTripEventsListElement.querySelector('.event__available-offers');
render(siteEventAvailableOffers, createOfferTemplate(), 'beforeend');

bindActionToElement('table-tab', 'onclick', actionService.changeActiveTab);
