import {createDestinationTemplate} from './destination.js';

export const createDestinationsTemplate = (destinations) => (
  `<datalist id="destination-list-1">
    ${destinations.map(createDestinationTemplate).join('')}
  </datalist>`
);
