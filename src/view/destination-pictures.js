import {createDestinationPictureTemplate} from './destination-picture.js';

export const createDestinationPicturesTemplate = (destination) => (
  `<div class="event__photos-tape">
  ${destination.pictures.map(createDestinationPictureTemplate).join('')}
  </div>`
);
