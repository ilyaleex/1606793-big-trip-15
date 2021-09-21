import EditFormView from '../view/edit-form';
import EventView from '../view/event';
import {RenderPosition, render, replace, remove} from '../utils/render';
import {calculateDuration, isDatesEqual} from '../utils/dates';
import {UserAction, UpdateType} from '../const';
import {toast} from '../utils/toast';
import {isOnline} from '../utils/common';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class Event {
  constructor(eventListContainer, destinationsModel, offersModel, changeData, changeMode) {
    this._eventListContainer = eventListContainer;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._editFormComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleSubmitForm = this._handleSubmitForm.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEditFormComponent = this._editFormComponent;


    this._eventComponent = new EventView(event);
    this._editFormComponent = new EditFormView(event, this._destinationsModel.getDestinations(), this._offersModel.getOffers(), true);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editFormComponent.setCloseClickHandler(this._handleCloseClick);
    this._editFormComponent.setSubmitFormHandler(this._handleSubmitForm);
    this._editFormComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevEventComponent === null || prevEditFormComponent === null) {
      render(this._eventListContainer, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._eventListContainer.getElement().contains(prevEventComponent.getElement())) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._eventListContainer.getElement().contains(prevEditFormComponent.getElement())) {
      replace(this._editFormComponent, prevEditFormComponent);
    }

    remove(prevEventComponent);
    remove(prevEditFormComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._editFormComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._editFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._editFormComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._editFormComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._eventComponent.shake(resetFormState);
        this._editFormComponent.shake(resetFormState);
    }
  }

  _replaceEventToForm() {
    replace(this._editFormComponent, this._eventComponent);
    document.addEventListener('keydown', this._escKeydownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._editFormComponent);
    document.removeEventListener('keydown', this._escKeydownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleEditClick() {
    if (!isOnline()) {
      toast('You can\'t edit event offline');
      this._eventComponent.shake();
      return;
    }
    this._replaceEventToForm();
  }

  _handleCloseClick() {
    this._replaceFormToEvent();
  }

  _handleSubmitForm(event) {
    if (!isOnline()) {
      toast('You can\'t save event offline');
      this._editFormComponent.shake();
      return;
    }

    const isDateStartEqual = isDatesEqual(this._event.timeStart, event.timeStart);
    const isDurationEqual = calculateDuration(this._event) === calculateDuration(event);
    const isPriceEqual = this._event.price === event.price;
    const isOffersPriceEqual = this._event.offers.reduce((sum, offer) => sum + offer.price, 0) === event.offers.reduce((sum, offer) => sum + offer.price, 0);
    const isDestinationEqual = this._event.destination === event.destination;
    const isDateEndEqual = isDatesEqual(this._event.timeEnd, event.timeEnd);

    const isMinorUpdate = !isPriceEqual || !isOffersPriceEqual || !isDestinationEqual || !isDateEndEqual;

    this._changeData(UserAction.UPDATE_EVENT, isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH, event, {isDateStartEqual, isDurationEqual, isPriceEqual});
    this._replaceFormToEvent();
  }

  _handleDeleteClick(event) {
    if (!isOnline()) {
      toast('You can\'t delete event offline');
      this._editFormComponent.shake();
      return;
    }

    this._changeData(UserAction.DELETE_EVENT, UpdateType.MAJOR, event);
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._event,
        {
          isFavorite: !this._event.isFavorite,
        },
      ),
    );
  }

  _escKeydownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._editFormComponent.reset(this._event);
      this._replaceFormToEvent();
    }
  }
}
