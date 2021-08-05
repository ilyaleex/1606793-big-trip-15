import {createDestinationPicturesTemplate} from './destination-pictures.js';

export const createDestinationDetailsTemplate = (destination) => (
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
    <div class="event__photos-container">
      ${createDestinationPicturesTemplate(destination)}
    </div>
  </section>`
);
