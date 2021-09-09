import SmartView from './smart';
import {DESTINATIONS} from '../mock/waypoint-mocks';
import {EVENT_TYPES} from '../const';
import {humanizeDateTime} from '../utils/dates';
import he from 'he';

const BLANK_EVENT = {
  type: EVENT_TYPES[0],
  destination: DESTINATIONS[0],
  offers: [],
  timeStart: Date.now(),
  timeEnd: Date.now(),
  price: '',
};

const createEventTypeInputTemplate = (type, isCurrentType) => {
  const checkedStatus = isCurrentType ? 'checked' : '';
  return `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${checkedStatus}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase() + type.slice(1)}</label>
  </div>`;
};

const createDestinationOptionTemplate = (destination) => `<option value="${he.encode(destination)}"></option>`;

const createOfferTemplate = ({title, price}, isChecked = false) => {
  const checkedStatus = (isChecked) ? 'checked' : '';
  return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title.split(' ').join('-')}-1" type="checkbox" name="event-offer-${title.split(' ').join('-')}" ${checkedStatus}>
    <label class="event__offer-label" for="event-offer-${title.split(' ').join('-')}-1">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`;
};

const createAllOffersTemplate = (offersOfType, offersOfData) => offersOfType.map((offerOfType) => (
  offersOfData.some((offerOfData) => offerOfData.title === offerOfType.title)
    ? createOfferTemplate(offerOfType, true)
    : createOfferTemplate(offerOfType, false)
)).join('');

const createOffersTemplate = (offersOfType, offersOfData) => {

  const offersTemplate = createAllOffersTemplate(offersOfType, offersOfData);

  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${offersTemplate}
            </div>
          </section>`;
};

const createParagraphTemplate = (description) => `<p class="event__destination-description">${description}</p>`;
const createPhotoTemplate = ({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`;
const createPhotosTemplate = (photos) => (
  `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${photos.map(createPhotoTemplate).join('')}
    </div>
  </div>`
);

const createDestinationInfoTemplate = ({description, pictures}, isDescription, isPhotos) => (
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    ${(isDescription) ? createParagraphTemplate(description) : ''}

    ${(isPhotos) ? createPhotosTemplate(pictures) : ''}
  </section>`
);

const createEditFormTemplate = (data, currentOffersOfType, isEdit = false) => {
  const {
    type,
    destination,
    offers,
    timeStart,
    timeEnd,
    price,
    information,
    isDescription,
    isPhotos,
  } = data;

  const offersOfType = currentOffersOfType ? currentOffersOfType.slice() : null;
  const pointTypeFieldset = EVENT_TYPES.map(createEventTypeInputTemplate).join('');
  const destinationDatalist = DESTINATIONS.map(createDestinationOptionTemplate).join('');
  const resetButton = (isEdit) ? '<button class="event__reset-btn" type="reset">Delete</button>' : '<button class="event__reset-btn" type="reset">Cancel</button>';
  const editButton = (isEdit) ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : '';
  const offersTemplate = (offersOfType && offersOfType.length) ? createOffersTemplate(offersOfType, offers) : '';
  const informationTemplate = (isDescription || isPhotos) ? createDestinationInfoTemplate(information, isDescription, isPhotos) : '';

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${pointTypeFieldset}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination)}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationDatalist}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDateTime(timeStart)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDateTime(timeEnd)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        ${resetButton}
        ${editButton}
      </header>
      <section class="event__details">
        ${offersTemplate}

        ${informationTemplate}
      </section>
    </form>
  </li>`;
};

export default class EditForm extends SmartView {
  constructor(event = BLANK_EVENT, destinationInfo, currentOffersOfType, isEdit) {
    super();
    this._data = EditForm.parseEventToData(event, destinationInfo);
    this._destinationInfo = destinationInfo;
    this._currentOffersOfType = currentOffersOfType;
    this._isEdit = isEdit;

    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._changeTypeHandler = this._changeTypeHandler.bind(this);
    this._changeDestinationHandler = this._changeDestinationHandler.bind(this);
    this._changePriceHandler = this._changePriceHandler.bind(this);

    this._setInnerHandler();
  }

  getTemplate() {
    return createEditFormTemplate(this._data, this._currentOffersOfType, this._isEdit);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._closeClickHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    const eventOffers = [];
    const eventOfferElements = this.getElement().querySelectorAll('.event__offer-checkbox');
    const offersOfType = this._currentOffersOfType.offers;

    eventOfferElements.forEach((element) => {
      if (element.checked) {
        const name = element.name.split('-').splice(2).join(' ');
        eventOffers.push(offersOfType.find((offer) => offer.title === name));
      }
    });

    this.updateData({
      offers: eventOffers,
    }, true);

    this._callback.submitForm(EditForm.parseDataToEvent(this._data));
  }

  setSubmitFormHandler(callback) {
    this._callback.submitForm = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  _changePriceHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.currentTarget.value,
    }, true);
  }

  _changeDestinationHandler(evt) {
    evt.preventDefault();

    const inputDestination = evt.currentTarget;

    this._destinationInfo = this._callback.changeDestination(inputDestination.value);
    this.updateData({
      destination: inputDestination.value,
      information: this._destinationInfo,
      isDescription: !!this._destinationInfo.description,
      isPhotos: Boolean(this._destinationInfo.pictures && this._destinationInfo.pictures.length),
    });
  }

  _changeTypeHandler(evt) {
    evt.preventDefault();
    this.updateData(
      {
        type: evt.target.value,
        offers: [],
      },
    );
  }

  _setInnerHandler() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._changeTypeHandler);

    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._changeDestinationHandler);

    this.getElement().querySelector('.event__input--price').addEventListener('input', this._changePriceHandler);
  }

  restoreHandlers() {
    this._setInnerHandler();
    this.setCloseClickHandler(this._callback.closeClick);
    this.setSubmitFormHandler(this._callback.submitForm);
  }

  reset(event) {
    this.updateData(EditForm.parseEventToData(event));
  }

  static parseEventToData(event, destinationInfo) {
    const information = (event.destination) ? destinationInfo : null;
    return Object.assign(
      {},
      event,
      {
        information,
        isDescription: !!information.description,
        isPhotos: Boolean(information.pictures && information.pictures.length),
      },
    );
  }

  static parseDataToEvent(data) {
    const event = Object.assign({}, data);

    delete event.information;
    delete event.isDescription;
    delete event.isPhotos;

    return event;
  }
}

