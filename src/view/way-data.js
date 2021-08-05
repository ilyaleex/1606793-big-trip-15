import {sortWaypointsByStartDate, getTripRouteLayout} from '../sw/tripSW.js';
import {getTripDatesLayout} from '../sw/dateSW.js';

export const createWayDataTemplate = (trip, destinations) => {

  const sortedWaypoints = trip.waypoints.length ? sortWaypointsByStartDate(trip.waypoints) : [];
  const routeLayout = getTripRouteLayout(sortedWaypoints, destinations);
  const tripDatesLayout = sortedWaypoints.length ? getTripDatesLayout(sortedWaypoints[0], sortedWaypoints[sortedWaypoints.length - 1]) : '';

  return `<div class="trip-info__main">
     <h1 class="trip-info__title">${routeLayout}</h1>
     <p class="trip-info__dates">${tripDatesLayout}</p>
   </div>`;
};


