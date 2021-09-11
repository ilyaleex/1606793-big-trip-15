import {getRandomInt, getRandomArrayElement} from '../utils/common';
import {EVENT_TYPES} from '../const';

const MAX_COUNT_OFFERS = 5;

const generateOffersForType = (type, countOffers) => {
  const titles = [
    'Lorem ipsum',
    'Cras aliquet',
    'Nullam nunc ex',
    'Aliquam id orci',
    'Phasellus eros',
    'Sed sed nisi',
    'Sed blandit',
  ];

  const offers = [];

  for (let i = 0; i < countOffers; i++) {
    offers.push({
      title: `${i} ${type} ${getRandomArrayElement(titles)}`,
      price: getRandomInt(1, 20) * 10,
    });
  }

  return offers;
};

const generateAllOffers = () => {
  const offersForTypes = [];
  for (const waypointType of EVENT_TYPES) {
    offersForTypes.push({
      type: waypointType,
      offers: generateOffersForType(waypointType, getRandomInt(0, MAX_COUNT_OFFERS)),
    });
  }
  return offersForTypes;
};

export const allOffers = generateAllOffers();
