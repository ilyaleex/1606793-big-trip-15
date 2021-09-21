import SmartView from './smart';
import {humanizeDateTime} from '../utils/dates';
import {EVENT_TYPES} from '../const';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import {toast} from '../utils/toast';

const createEventTypeInputTemplate = (type, isCurrentType, id) => {
  const checkedStatus = isCurrentType ? 'checked' : '';
  return `<div class="event__type-item">
    <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${checkedStatus}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${type[0].toUpperCase() + type.slice(1)}</label>
  </div>`;
};

const createDestinationOptionTemplate = (destination) => `<option value="${destination}"></option>`;

const createOfferTemplate = ({title, price}, isChecked = false, id, disabledStatus) => {
  const checkedStatus = (isChecked) ? 'checked' : '';
  return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title.split(' ').join('-')}-${id}" type="checkbox" name="event-offer-${title.split(' ').join('-')}" ${checkedStatus} ${disabledStatus}>
    <label class="event__offer-label" for="event-offer-${title.split(' ').join('-')}-${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`;
};

const createAllOffersTemplate = (offersOfType, offersOfData = [], id, disabledStatus) => offersOfType.map((offerOfType) => (
  offersOfData.some((offerOfData) => offerOfData.title === offerOfType.title)
    ? createOfferTemplate(offerOfType, true, id, disabledStatus)
    : createOfferTemplate(offerOfType, false, id, disabledStatus)
)).join('');

const createOffersTemplate = (offersOfType, offersOfData, id, disabledStatus) => {

  const offersTemplate = createAllOffersTemplate(offersOfType, offersOfData, id, disabledStatus);

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

const createEditFormTemplate = (data, destinationsInfo, offersForTypes, isEdit) => {
  const {
    id,
    type,
    destination,
    offers,
    timeStart,
    timeEnd,
    price,
    isDisabled,
    isSaving,
    isDeleting,
  } = data;

  const disabledStatus = isDisabled ? 'disabled' : '';
  const savingStatus = isSaving ? 'Saving...' : 'Save';
  const deletingStatus = isDeleting ? 'Deleting...' : 'Delete';


  const eventTypeFieldset = EVENT_TYPES.map((eventType) => createEventTypeInputTemplate(eventType, eventType === type)).join('');
  const offersOfType = offersForTypes.get(type).offers;
  const offersTemplate = (offersOfType && offersOfType.length) ? createOffersTemplate(offersOfType, offers, id, disabledStatus) : '';

  const destinationName = destination ? destination.name : '';
  const destinationDatalist = [...destinationsInfo.keys()].map((eventDestination) => createDestinationOptionTemplate(eventDestination)).join('');
  const information =  destinationsInfo.get(destinationName);
  const isDescription =  Boolean(information && information.description);
  const isPhotos =  Boolean(information && information.pictures && information.pictures.length);
  const informationTemplate = (isDescription || isPhotos) ? createDestinationInfoTemplate(information, isDescription, isPhotos) : '';

  const editButton = (isEdit) ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : '';
  const resetButton = (isEdit) ?`<button class="event__reset-btn" type="reset">${deletingStatus}</button>` : '<button class="event__reset-btn" type="reset">Cancel</button>';

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${disabledStatus}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${eventTypeFieldset}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destinationName}" list="destination-list-${id}" required ${disabledStatus}>
          <datalist id="destination-list-${id}">
            ${destinationDatalist}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${humanizeDateTime(timeStart)}" ${disabledStatus}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${humanizeDateTime(timeEnd)}" ${disabledStatus}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}" required ${disabledStatus}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${savingStatus}</button>
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
  constructor(event, destinationsInfo, offers, isEdit = false) {
    super();
    this._destinationsInfo = destinationsInfo;
    this._offers = offers;
    this._data = EditForm.parseEventToData(event, this._destinationsInfo);
    this._isEdit = isEdit;

    this._datepickerStart = null;
    this._datepickerEnd = null;

    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._changeTypeHandler = this._changeTypeHandler.bind(this);
    this._changeDestinationHandler = this._changeDestinationHandler.bind(this);
    this._changePriceHandler = this._changePriceHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._timeStartChangeHandler = this._timeStartChangeHandler.bind(this);
    this._timeEndChangeHandler = this._timeEndChangeHandler.bind(this);

    this._setInnerHandler();
    this._setDatepicker();
  }

  getTemplate() {
    return createEditFormTemplate(this._data, this._destinationsInfo, this._offers, this._isEdit);
  }

  reset(event) {
    this.updateData(EditForm.parseEventToData(event));
  }

  removeElement() {
    super.removeElement();
    this._resetDatepicker();
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._closeClickHandler);
  }

  setSubmitFormHandler(callback) {
    this._callback.submitForm = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._deleteClickHandler);
  }

  _setDatepicker() {
    const commonSettings = {
      dateFormat: 'd/m/Y H:i',
      enableTime: true,
    };

    this._datepickerStart = flatpickr(
      this.getElement().querySelector('[name="event-start-time"]'),
      Object.assign(
        commonSettings,
        {
          defaultDate: this._data.timeStart,
          onChange: this._timeStartChangeHandler,
        }),
    );

    this._datepickerEnd = flatpickr(
      this.getElement().querySelector('[name="event-end-time"]'),
      Object.assign(
        commonSettings,
        {
          defaultDate: this._data.timeEnd,
          onChange: this._timeEndChangeHandler,
        }),
    );
  }

  _resetDatepicker() {
    if (this._datepickerStart && this._datepickerEnd) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
      this._datepickerEnd.destroy();
      this._datepickerEnd = null;
    }
  }

  restoreHandlers() {
    this._setInnerHandler();
    this._setDatepicker();
    if (this._isEdit) {
      this.setCloseClickHandler(this._callback.closeClick);
    }
    this.setSubmitFormHandler(this._callback.submitForm);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setInnerHandler() {
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._changeDestinationHandler);
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._changeTypeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._changePriceHandler);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    const eventOffers = [];
    const eventOfferCheckboxes = this.getElement().querySelectorAll('.event__offer-checkbox');
    const eventOfferTitles = this.getElement().querySelectorAll('.event__offer-title');
    const offersOfType = this._offers.get(this._data.type).offers;

    for (let i = 0; i < eventOfferCheckboxes.length; i++) {
      if (eventOfferCheckboxes[i].checked) {
        eventOffers.push(offersOfType.find((offer) => offer.title === eventOfferTitles[i].textContent));
      }
    }

    this.updateData({
      offers: eventOffers,
    }, true);
    this._callback.submitForm(EditForm.parseDataToEvent(this._data));
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditForm.parseDataToEvent(this._data));
  }

  _changePriceHandler(evt) {
    evt.preventDefault();

    if (evt.currentTarget.value < 0) {
      evt.currentTarget.value = -evt.currentTarget.value;
    }
    this.updateData({
      price: Number(evt.currentTarget.value),
    }, true);
  }

  _changeDestinationHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: this._destinationsInfo.get(evt.currentTarget.value),
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

  _timeStartChangeHandler([userDate]) {
    if (this._data.timeEnd < userDate) {
      toast('End date cannot be earlier than start');
      this.updateData({
        timeStart: this._data.timeStart,
      });
    } else {
      this.updateData({
        timeStart: userDate,
      });
    }
  }

  _timeEndChangeHandler([userDate]) {
    if (this._data.timeStart > userDate) {
      toast('End date cannot be earlier than start');
      this.updateData({
        timeEnd: this._data.timeEnd,
      });
    } else {
      this.updateData({
        timeEnd: userDate,
      });
    }
  }

  static parseEventToData(event) {
    return Object.assign({},
      event,
      {
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}

