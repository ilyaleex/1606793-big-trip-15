import Destination from './model/Destination.js';
import Offer from './model/Offer.js';
import Offers from './model/Offers.js';
import WaypointType from './model/WaypointType.js';
import * as constants from './constants.js';
import {v4 as uuidv4} from 'uuid';

export const getRandomInt = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const generateId = uuidv4;

export const generateFishDescriptions = () => {
  const fishDescriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    'Cras aliquet varius magna, non porta ligula feugiat eget',
    'Fusce tristique felis at fermentum pharetra',
    'Aliquam id orci ut lectus varius viverra',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui',
    'Sed sed nisi sed augue convallis suscipit in sed felis',
    'Aliquam erat volutpat',
    'Nunc fermentum tortor ac porta dapibus',
    'In rutrum ac purus sit amet tempus',
  ];

  const randomIndex = getRandomInt(0, fishDescriptions.length -1);

  return fishDescriptions[randomIndex];
};

const generateWaypointType = (name) => {
  const id = generateId();
  const waypointType = new WaypointType(id, name);

  return waypointType;
};

export const plugImage = () => `http://picsum.photos/248/152?r=${Math.random()}`;

const generatePictures = (count = 5) => {
  const pictures = [];

  for(let i = 1; i < count; i++) {
    pictures.push(plugImage());
  }
  return pictures;
};

const generateDestination = (name) => {
  const id = generateId();
  const description = generateFishDescriptions();
  const pictures = generatePictures();

  const destination = new Destination(id, name, description, pictures);

  return destination;
};

const generateOffersForType = () => {
  const randomIndex = getRandomInt(0, constants.OFFER_NAMES.length - 1);
  const offerNames = constants.OFFER_NAMES.slice(randomIndex);
  const offers = [];

  for (const offerName of offerNames) {
    const id = generateId();
    const prices = [5, 60, 35, 15, 50, 100];
    const priceRandomIndex = getRandomInt(0, prices.length - 1);

    const offer = new Offer(id, offerName, prices[priceRandomIndex]);
    offers.push(offer);
  }

  return offers;
};

const generateOffer = (waypointTypeId) => {
  const id = generateId();
  const offers = generateOffersForType();
  const offer = new Offers(id, waypointTypeId, offers);

  return offer;
};

const generateItemByType = {
  'destination': generateDestination,
  'offers': generateOffer,
  'waypoint': generateWaypointType,
};

export const generateItems = (collection, type) => {
  const items = [];
  collection.forEach((x) => items.push(generateItemByType[type](x)));
  return items;
};

export const bindActionToElement = (id, event, func) => {
  const element = document.getElementById(id);
  if (element) {
    element[event] = func;
  }
};


