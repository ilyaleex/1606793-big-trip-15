import {createWaypointTypesTemplate} from './waypoint-types.js';
import {createDestinationsTemplate} from './destinations.js';
import {createOffersEditTemplate} from './offers-edit.js';
import {createDestinationDetailsTemplate} from './destination-details.js';
import {dateConverter} from '../sw/dateSW.js';
import {generateId} from '../utils.js';
import Waypoint from '../model/Waypoint.js';
import * as constants from '../constants.js';

export const createEditingFormTemplate = (waypointTypes, destinations, offers, waypoint = null) => {

  let waypointType = waypointTypes[0];
  let destination;
  let offer;

  if (!waypoint) {
    const id = generateId();
    waypoint = new Waypoint(id);
  } else {
    waypointType = waypointTypes.find((type) => type.id === waypoint.typeId);
    destination = destinations.find((x) => x.id === waypoint.destinationId);
    offer = offers.find((x) => x.typeId === waypoint.typeId);
  }
  const defaultWaypointTypeIcon = constants.WAYPOINT_TYPE_ICON_MAPPING[waypointTypes[0].name];

  return `<li class="trip-events__item">
     <form class="event event--edit" action="#" method="post">
       <header class="event__header">
         <div class="event__type-wrapper">
           <label class="event__type  event__type-btn" for="${waypoint.id}">
             <span class="visually-hidden">Choose event type</span>
             <img class="event__type-icon" width="17" height="17" src="${defaultWaypointTypeIcon}" alt="Event type icon">
           </label>
           <input class="event__type-toggle  visually-hidden" id="${waypoint.id}" type="checkbox">

           <div class="event__type-list">
             ${createWaypointTypesTemplate(waypointTypes, waypoint)}
           </div>
         </div>

         <div class="event__field-group  event__field-group--destination">
           <label class="event__label  event__type-output" for="event-destination-1">
             ${waypointType.name}
           </label>
           <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-1">
           ${createDestinationsTemplate(destinations)}
         </div>

         <div class="event__field-group  event__field-group--time">
           <label class="visually-hidden" for="event-start-time-1">From</label>
           <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateConverter(waypoint.dateFrom, constants.DATE_FORMAT_D_M_YYYY_H_MM)}">
           &mdash;
           <label class="visually-hidden" for="event-end-time-1">To</label>
           <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateConverter(waypoint.dateTo, constants.DATE_FORMAT_D_M_YYYY_H_MM)}">
         </div>

         <div class="event__field-group  event__field-group--price">
           <label class="event__label" for="event-price-1">
             <span class="visually-hidden">Price</span>
             &euro;
           </label>
           <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" pattern="[0-9]+" value="${waypoint.basePrice ? waypoint.basePrice : ''}">
         </div>

         <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
         <button class="event__reset-btn" type="reset">Delete</button>
         <button class="event__rollup-btn" type="button">
           <span class="visually-hidden">Open event</span>
         </button>
       </header>
       <section class="event__details">
         ${offer ? createOffersEditTemplate(offer, waypoint) : ''}
         ${destination ? createDestinationDetailsTemplate(destination) : ''}
       </section>
     </form>
   </li>`;
};


