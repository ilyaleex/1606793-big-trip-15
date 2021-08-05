import * as constants from '../constants.js';

export const sortWaypointsByStartDate = (waypoints) =>
  waypoints.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

export const getTripRouteLayout = (waypoints, destinations) => {
  let routeLayout = '';

  if (waypoints.length > constants.MAX_DESTINATIONS) {
    const firstDestination = destinations.find((destination) => destination.id === waypoints[0].destinationId);
    const lastDestination = destinations.find((destination) => destination.id === waypoints[waypoints.length - 1].destinationId);
    routeLayout = `${firstDestination.name} &mdash; ... &mdash; ${lastDestination.name}`;
  } else {
    const tripDestinations = destinations.filter((destination) =>
      waypoints.some((waypoint) => waypoint.destinationId === destination.id),
    );

    routeLayout = tripDestinations.map((x) => x.name).join(' &mdash; ');
  }

  return routeLayout;
};
