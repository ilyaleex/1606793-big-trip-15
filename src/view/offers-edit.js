import {createOfferEditTemplate} from './offer-edit.js';

export const createOffersEditTemplate = (offer, waypoint) => (
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${offer.offers.map((x) => {
    const isChecked = waypoint.selectedOfferIds.some((id) => id === x.id);
    return createOfferEditTemplate(x, `event-offer-${x.id}-${waypoint.id}`, isChecked);
  }).join('')}
    </div>
  </section>`
);
