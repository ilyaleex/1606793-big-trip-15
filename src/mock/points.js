import dayjs from 'dayjs';
import {EVENT_TYPES, DESTINATIONS} from './waypoint-mocks';
import {allOffers} from './offers.js';
import {getRandomInt, getRandomArrayElement, getRandomArrayElements} from '../utils';
import {nanoid} from 'nanoid';

const generateType = () => getRandomArrayElement(EVENT_TYPES);

const generateDestination = () => getRandomArrayElement(DESTINATIONS);

const generateTimeStart = () => {

  const maxDaysGap = 7;
  const daysGap = getRandomInt(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

export const generatePoint = () => {
  const type = generateType();
  const typeOffers = allOffers.find((item) => item.type === type).offers;
  const destination = generateDestination();
  const timeStart = generateTimeStart();
  const timeEnd = dayjs(timeStart).add(getRandomInt(30, 2160), 'minute').toDate();

  return {
    id: nanoid(),
    type,
    destination,
    offers: getRandomArrayElements(typeOffers, getRandomInt(0, typeOffers.length)),
    timeStart,
    timeEnd,
    price: getRandomInt(5, 20) * 100,
    isFavorite: Boolean(getRandomInt(0, 1)),
  };
};
