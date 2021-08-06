import * as constants from '../constants.js';
import dayjs from 'dayjs';

const getDisplayTime = (time) => time > constants.LAST_SINGLE_DECIMAL_NUMBER ? time.toString() : `0${time}`;

export const getDateTime = (date) => {
  const convertedDate = dayjs(date);
  const displayHours = getDisplayTime(convertedDate.get('hour'));
  const displayMinutes = getDisplayTime(convertedDate.get('minute'));
  const dateTime = `${displayHours}:${displayMinutes}`;

  return dateTime;
};

export const getWaypointType = (waypoint, waypointTypes) => waypointTypes.find((type) => type.id === waypoint.typeId);

export const getDestination = (waypoint, destinations) => destinations.find((destination) => destination.id === waypoint.destinationId);

export const getSelectedOffers = (waypoint, offers) => {
  const offer = offers.find((x) => x.typeId === waypoint.typeId);
  const selectedOffers = offer.offers.filter((x) => waypoint.selectedOfferIds.some((id) => id === x.id));
  return selectedOffers;
};

export const getWaypointTypeIcon = (waypointType) => constants.WAYPOINT_TYPE_ICON_MAPPING[waypointType.name];

export const getEventDurationLayout = (waypoint) => {
  const convertedDateFrom = dayjs(waypoint.dateFrom);
  const convertedDateTo = dayjs(waypoint.dateTo);
  const differenceDay = convertedDateTo.diff(convertedDateFrom, 'day');
  const differenceHours = convertedDateTo.subtract(differenceDay, 'day').diff(convertedDateFrom, 'hour');
  const differenceMinutes = convertedDateTo.subtract(differenceDay, 'day').subtract(differenceHours, 'hour').diff(convertedDateFrom, 'minute');

  const displayHours = getDisplayTime(differenceHours);
  const displayMinutes = getDisplayTime(differenceMinutes);

  if (differenceDay > 0) {
    return `${differenceDay}D ${displayHours}H ${displayMinutes}M`;
  }

  if (differenceHours > 0) {
    return `${displayHours}H ${displayMinutes}M`;
  }

  return `${displayMinutes}M`;
};
