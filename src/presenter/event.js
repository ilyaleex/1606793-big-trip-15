import EditFormView from '../view/editing-form';
import EventView from '../view/event';
import {RenderPosition, render, replace, remove} from '../utils/render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Event {
  constructor(eventListContainer, changeData, changeMode) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._editFormComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleSubmitForm = this._handleSubmitForm.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEditFormComponent = this._editFormComponent;

    this._eventComponent = new EventView(event);
    this._editFormComponent = new EditFormView(event, true);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editFormComponent.setCloseClickHandler(this._handleCloseClick);
    this._editFormComponent.setSubmitFormHandler(this._handleSubmitForm);

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

  _escKeydownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._editFormComponent.reset(this._event);
      this._replaceFormToEvent();
      document.removeEventListener('keydown', this._escKeydownHandler);
    }
  }

  _handleEditClick() {
    this._replaceEventToForm();
  }

  _handleCloseClick() {
    this._replaceFormToEvent();
  }

  _handleSubmitForm(task) {
    this._changeData(task);
    this._replaceFormToEvent();
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._event,
        {
          isFavorite: !this._event.isFavorite,
        },
      ),
    );
  }
}
