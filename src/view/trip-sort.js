import AbstractView from './abstract';
import {SortType} from '../const';

export const createTripSortTemplate = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
     <div class="trip-sort__item  trip-sort__item--day">
       <input id="sort-day" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.DAY}" type="radio" name="trip-sort" value="sort-day">
       <label class="trip-sort__btn" for="sort-day">Day</label>
     </div>
     <div class="trip-sort__item  trip-sort__item--event">
       <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
       <label class="trip-sort__btn" for="sort-event">Event</label>
     </div>
      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.TIME}" type="radio" name="trip-sort" value="sort-time">
        <label class="trip-sort__btn" for="sort-time">Time</label>
      </div>
      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.PRICE}" type="radio" name="trip-sort" value="sort-price" checked>
        <label class="trip-sort__btn" for="sort-price">Price</label>
      </div>
      <div class="trip-sort__item  trip-sort__item--offer">
        <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
      </div>
  </form>`
);

export default class TripSort extends AbstractView {
  constructor() {
    super();

    this._changeSortTypeHandler = this._changeSortTypeHandler.bind(this);
  }

  getTemplate() {
    return createTripSortTemplate();
  }

  _changeSortTypeHandler(evt) {
    this._callback.changeSortType(evt.target.dataset.sortType);
  }

  setChangeSortTypeHandler(callback) {
    this._callback.changeSortType = callback;
    this.getElement().addEventListener('change', this._changeSortTypeHandler);
  }
}
