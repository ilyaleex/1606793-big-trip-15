import {createOfferTemplate} from './offer.js';
import {getTripDatesLayout} from '../sw/dateSW.js';
import * as waypointService from '../sw/waypointSW.js';

export const createWaypointTemplate = (waypoint, waypointTypes, destinations, offers) => {

  const dateLayout = getTripDatesLayout(waypoint, waypoint);
  const dateFrom = waypointService.getDateTime(waypoint.dateFrom);
  const dateTo = waypointService.getDateTime(waypoint.dateTo);
  const eventDuration = waypointService.getEventDurationLayout(waypoint);
  const destination = waypointService.getDestination(waypoint, destinations);
  const selectedOffers = waypointService.getSelectedOffers(waypoint, offers);
  const waypointType = waypointService.getWaypointType(waypoint, waypointTypes);
  const waypointTypeIcon = waypointService.getWaypointTypeIcon(waypointType);
  const favoriteClass = waypoint.isFavorite ? 'event__favorite-btn--active' : '';


  return `<li class="trip-events__item">
     <div class="event">
       <time class="event__date" datetime="2019-03-18">${waypoint.dateFrom}">${dateLayout}</time>
       <div class="event__type">
         <img class="event__type-icon" width="42" height="42" src="${waypointTypeIcon}" alt="Event type icon">
       </div>
       <h3 class="event__title">${waypointType.name} ${destination.name}</h3>
       <div class="event__schedule">
         <p class="event__time">
           <time class="event__start-time" datetime="${waypoint.dateFrom}">${dateFrom}</time>
           &mdash;
           <time class="event__end-time" datetime="${waypoint.dateTo}">${dateTo}</time>
         </p>
         <p class="event__duration">${eventDuration}</p>
       </div>
       <p class="event__price">
         &euro;&nbsp;<span class="event__price-value">${waypoint.basePrice}</span>
       </p>
       <h4 class="visually-hidden">Offers:</h4>
       <ul class="event__selected-offers">
         ${selectedOffers.map((x) => createOfferTemplate(x)).join('')}
       </ul>
       <button class="event__favorite-btn ${favoriteClass}" type="button">
         <span class="visually-hidden">Add to favorite</span>
         <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
           <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
         </svg>
       </button>
       <button class="event__rollup-btn" type="button">
         <span class="visually-hidden">Open event</span>
       </button>
     </div>
   </li>`;
};


