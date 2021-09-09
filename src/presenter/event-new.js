import {EVENT_TYPES} from '../const';
import {DESTINATIONS} from '../mock/waypoint-mocks';
import EditFormView from '../view/edit-form';
import {UpdateType, UserAction} from '../const';
import {render, remove, RenderPosition} from '../utils/render';
import {nanoid} from 'nanoid';
import dayjs from 'dayjs';

const BLANK_EVENT = {
  type: EVENT_TYPES[0],
  destination: DESTINATIONS[0],
  offers: [],
  timeStart: dayjs().toDate(),
  timeEnd: dayjs().toDate(),
  price: '',
};

export default class EventNew {
  constructor(eventListContainer, changeData, destinationsModel, offersModel) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._editFormComponent = null;

    this._handleSubmitForm = this._handleSubmitForm.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleChangeDestination = this._handleChangeDestination.bind(this);
    this._handleChangeType = this._handleChangeType.bind(this);
  }

  init() {
    if (this._editFormComponent !== null) {
      return;
    }

    const destinationInfo = this._destinationsModel.getDestination(DESTINATIONS[0]);
    const currentOffersOfType = this._offersModel.getOffers(EVENT_TYPES[0]);

    this._editFormComponent = new EditFormView(BLANK_EVENT, destinationInfo, currentOffersOfType);
    this._editFormComponent.setSubmitFormHandler(this._handleSubmitForm);
    this._editFormComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._editFormComponent.setChangeDestinationHandler(this._handleChangeDestination);
    this._editFormComponent.setChangeTypeHandler(this._handleChangeType);

    render(this._eventListContainer, this._editFormComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._editFormComponent === null) {
      return;
    }

    remove(this._editFormComponent);
    this._editFormComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleChangeDestination(newDestination) {
    return this._destinationsModel.getDestination(newDestination);
  }

  _handleChangeType(newType) {
    return this._offersModel.getOffers(newType);
  }

  _handleSubmitForm(event) {
    this._changeData(UserAction.ADD_EVENT, UpdateType.MAJOR, Object.assign({id: nanoid()}, event));
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
