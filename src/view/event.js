import AbstractView from './abstract.js';
import {
  convertDateToISO,
  humanizeDateMonthDay,
  humanizeTime,
  calculateTimeDifference
} from '../utils/dates';


const createSelectedOfferTemplate = (offer) => (
  `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`
);

const createSelectedOffersTemplate = (offers) => (
  `<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${offers.map(createSelectedOfferTemplate).join('')}
  </ul>`
);

const createEventTemplate = (point) => {
  const {type, destination, offers, timeStart, timeEnd, price, isFavorite} = point;

  const selectedOffers = (offers.length > 0) ? createSelectedOffersTemplate(offers) : '';

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${convertDateToISO(timeStart, false)}">${humanizeDateMonthDay(timeStart)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${convertDateToISO(timeStart)}">${humanizeTime(timeStart)}</time>
          &mdash;
          <time class="event__end-time" datetime="${convertDateToISO(timeEnd)}">${humanizeTime(timeEnd)}</time>
        </p>
        <p class="event__duration">${calculateTimeDifference(timeEnd, timeStart)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      ${selectedOffers}
      <button class="${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class Event extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._point);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }
}

