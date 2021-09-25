import {EVENT_TYPES} from '../const';
import EditFormView from '../view/edit-form';
import {UpdateType, UserAction} from '../const';
import {render, remove, RenderPosition} from '../utils/render';
import dayjs from 'dayjs';

const BLANK_EVENT = {
  type: EVENT_TYPES[0],
  destination: '',
  offers: [],
  timeStart: dayjs().toDate(),
  timeEnd: dayjs().toDate(),
  price: '',
};

class EventNew {
  constructor(eventListContainer, destinationsModel, offersModel, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._editFormComponent = null;
    this._destroyCallback - null;

    this._handleSubmitForm = this._handleSubmitForm.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._editFormComponent !== null) {
      return;
    }

    this._editFormComponent = new EditFormView(BLANK_EVENT, this._destinationsModel.getDestinations(), this._offersModel.getOffers());
    this._editFormComponent.setSubmitFormHandler(this._handleSubmitForm);
    this._editFormComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._eventListContainer, this._editFormComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._editFormComponent === null) {
      return;
    }
    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._editFormComponent);
    this._editFormComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._editFormComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._editFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._editFormComponent.shake(resetFormState);
  }

  _handleSubmitForm(event) {
    this._changeData(UserAction.ADD_EVENT, UpdateType.MAJOR, Object.assign({isFavorite: false}, event));
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

export default EventNew;

