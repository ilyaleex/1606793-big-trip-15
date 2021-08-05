export const createOfferTemplate = (offer, id, isChecked) => {
  `<div class="event__offer-selector">
     <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="${offer.name}" ${isChecked ? 'checked' : ''}>
     <label class="event__offer-label" for="${id}">
       <span class="event__offer-title">${offer.name}</span>
       &plus;&euro;&nbsp;
       <span class="event__offer-price">${offer.price}</span>
     </label>
  </div>`;
};
