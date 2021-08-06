import {createSortTemplate} from './trip-sort-item.js';

export const createTripSortTemplate = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${createSortTemplate('sort-day', 'sort-day', 'Day')}
    ${createSortTemplate('sort-event', 'sort-event', 'Event', true)}
    ${createSortTemplate('sort-time', 'sort-time', 'Time')}
    ${createSortTemplate('sort-price', 'sort-price', 'Price', false, true)}
    ${createSortTemplate('sort-offer', 'sort-offer', 'Offers', true)}
  </form>`
);


