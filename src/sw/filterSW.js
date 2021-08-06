import dayjs from 'dayjs';

export const isEverythingFilterDisabled = (trip) => !trip.waypoints.length;

export const isFutureFilterDisabled = (trip) => !trip.waypoints.some((waypoint) => dayjs().isAfter(waypoint.dateFrom));

export const isPastFilterDisabled = (trip) => !trip.waypoints.some((waypoint) => dayjs().isBefore(waypoint.dateTo));
