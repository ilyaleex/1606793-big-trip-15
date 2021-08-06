import dayjs from 'dayjs';
import Waypoint from '../model/Waypoint.js';
import {getRandomInt, generateId} from '../utils.js';

const generateValue = (items) => {
  const randomIndex = getRandomInt(0, items.length - 1);

  return items[randomIndex].id;
};

const getOfferIds = (waypointTypeId, offers) => {
  const offer = offers.find((x) => x.typeId === waypointTypeId);
  const offerIds = offer.offers.map((x) => x.id);
  const randomIndex = getRandomInt(0, offerIds.length - 1);

  return offerIds.splice(randomIndex);
};

const generateBasePrice = () => {
  const prices = [2220, 554, 459, 500, 786, 1235];
  const randomIndex = getRandomInt(0, prices.length - 1);

  return prices[randomIndex];
};

const generateDate = (startDate, endDate) => {
  const daysGap = getRandomInt(startDate, endDate);

  const minuteGap = getRandomInt(0, 35);

  return dayjs().add(daysGap, 'day').add(minuteGap, 'minute').toDate();
};

export const generateWaypoint = (waypointTypes, destinations, offers) => {
  const datePeriodFromStart = -14;
  const datePeriodFromEnd = -7;
  const datePeriodToStart = -6;
  const datePeriodToEnd = 7;

  const id = generateId();
  const waypointTypeId = generateValue(waypointTypes);
  const destinationId = generateValue(destinations);
  const selectedOfferIds = getOfferIds(waypointTypeId, offers);
  const isFavorite = Boolean(getRandomInt());
  const basePrice = generateBasePrice();
  const dateFrom = generateDate(datePeriodFromStart, datePeriodFromEnd);
  const dateTo = generateDate(datePeriodToStart, datePeriodToEnd);

  const waypoint = new Waypoint(id, basePrice, dateFrom, dateTo, destinationId, isFavorite, selectedOfferIds, waypointTypeId);
  return waypoint;
};

