import EventListView from '../view/trip-events-list';
import TripSortView from '../view/trip-sort';
import NoEventView from '../view/no-event';
import LoadingView from '../view/loading';
import EventPresenter, {State as EventPresenterViewState} from './event';
import EventNewPresenter from './event-new';
import {RenderPosition, render, remove, replace} from '../utils/render';
import {FilterType, SortType, UserAction, UpdateType} from '../const';
import {compareTimeStart, compareDuration, comparePrice} from '../utils/dates';
import {filter} from '../utils/filter';

class Board {
  constructor(boardMainContainer, eventsModel, filtersModel, destinationsModel, offersModel, api) {
    this._boardMainContainer = boardMainContainer;
    this._eventsModel = eventsModel;
    this._filtersModel = filtersModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._eventPresenter = new Map();
    this._isLoading = true;
    this._api = api;

    this._noEventComponent = null;

    this._tripSortComponent = new TripSortView();
    this._eventListComponent = new EventListView();
    this._loadingComponent = new LoadingView();

    this._filterType = FilterType.EVERYTHING;
    this._currentSortType = SortType.DAY;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleChangeSortType = this._handleChangeSortType.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventNewPresenter = new EventNewPresenter(this._eventListComponent, this._destinationsModel, this._offersModel, this._handleViewAction);
  }

  init() {
    this._renderEventSort();
    this._renderBoard();

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearBoard({resetSortType: true});

    remove(this._eventListComponent);
    remove(this._tripSortComponent);

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filtersModel.removeObserver(this._handleModelEvent);
  }

  createEvent(callback) {
    this._eventNewPresenter.init(callback);
  }

  _getEvents() {
    this._filterType = this._filtersModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[this._filterType](events);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredEvents.sort(compareTimeStart);
      case SortType.TIME:
        return filteredEvents.sort(compareDuration);
      case SortType.PRICE:
        return filteredEvents.sort(comparePrice);
    }
  }

  _renderLoading() {
    render(this._boardMainContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderEventSort() {
    render(this._boardMainContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
    this._tripSortComponent.setChangeSortTypeHandler(this._handleChangeSortType);
  }

  _renderEvents() {
    this._getEvents().forEach((event) => this._renderEvent(event));
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventListComponent, this._destinationsModel, this._offersModel, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter.set(event.id, eventPresenter);
  }

  _renderNoEvent() {
    this._noEventComponent = new NoEventView(this._filterType);
    render(this._boardMainContainer, this._noEventComponent, RenderPosition.BEFOREEND);
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    render(this._boardMainContainer, this._eventListComponent, RenderPosition.BEFOREEND);

    if (this._getEvents().length === 0) {
      this._renderNoEvent();
      return;
    }

    this._renderEvents();
  }

  _clearBoard({resetSortType = false} = {}) {
    this._eventNewPresenter.destroy();
    this._eventPresenter.forEach((eventPresenter) => eventPresenter.destroy());
    this._eventPresenter.clear();

    remove(this._loadingComponent);

    if(this._noEventComponent) {
      remove(this._noEventComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
      const prevSortComponent = this._tripSortComponent;
      this._tripSortComponent = new TripSortView();
      replace(this._tripSortComponent, prevSortComponent);
      remove(prevSortComponent);
    }
  }

  _handleViewAction(actionType, updateType, update, {isDateStartEqual = true, isDurationEqual = true, isPriceEqual = true} = {}) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        updateType = ((this._currentSortType === SortType.DAY && !isDateStartEqual) ||
          (this._currentSortType === SortType.TIME && !isDurationEqual) ||
          (this._currentSortType === SortType.PRICE && !isPriceEqual)) ? UpdateType.MAJOR : updateType;
        this._eventPresenter.get(update.id).setViewState(EventPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._eventsModel.updateEvent(updateType, response);
          })
          .catch(() => {
            this._eventPresenter.get(update.id).setViewState(EventPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT:
        this._eventNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._eventsModel.addEvent(updateType, response);
          })
          .catch(() => {
            this._eventNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenter.get(update.id).setViewState(EventPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._eventsModel.deleteEvent(updateType, update);
          })
          .catch(() => {
            this._eventPresenter.get(update.id).setViewState(EventPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, update) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter.get(update.id).init(update);
        break;
      case UpdateType.MINOR:
        this._eventPresenter.get(update.id).init(update);
        break;
      case UpdateType.MAJOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.RESET:
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _handleChangeSortType(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    this._eventPresenter.forEach((eventPresenter) => eventPresenter.resetView());
  }
}

export default Board;
