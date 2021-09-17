import EventListView from '../view/trip-events-list';
import TripSortView from '../view/trip-sort';
import NoEventView from '../view/no-event';
import EventPresenter from './event';
import EventNewPresenter from './event-new';
import {RenderPosition, render, remove, replace} from '../utils/render';
import {FilterType, SortType, UserAction, UpdateType} from '../const';
import {compareTimeStart, compareDuration, comparePrice} from '../utils/dates';
import {filter} from '../utils/filter';

export default class Board {
  constructor(boardMainContainer, eventsModel, filtersModel, destinationsModel, offersModel) {
    this._boardMainContainer = boardMainContainer;
    this._eventsModel = eventsModel;
    this._filtersModel = filtersModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._eventPresenter = new Map();

    this._noEventComponent = null;

    this._tripSortComponent = new TripSortView();
    this._eventListComponent = new EventListView();
    this._filterType = FilterType.EVERYTHING;
    this._currentSortType = SortType.DAY;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleChangeSortType = this._handleChangeSortType.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventNewPresenter = new EventNewPresenter(this._eventListComponent, this._destinationsModel, this._offersModel, this._handleViewAction);
  }

  init() {
    this._renderBoard();

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearBoard({resetSortType: true});

    remove(this._eventListComponent);
    remove(this._eventSortComponent);

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

  _handleViewAction(actionType, updateType, update, {isDateStartEqual = true, isDurationEqual = true, isPriceEqual = true} = {}) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        updateType = ((this._currentSortType === SortType.DAY && !isDateStartEqual) ||
          (this._currentSortType === SortType.TIME && !isDurationEqual) ||
          (this._currentSortType === SortType.PRICE && !isPriceEqual)) ? UpdateType.MAJOR : updateType;
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
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
    }
  }

  _renderEventSort() {
    render(this._boardMainContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
    this._tripSortComponent.setChangeSortTypeHandler(this._handleChangeSortType);
  }

  _handleChangeSortType(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _renderEvents() {
    this._getEvents().forEach((event) => this._renderEvent(event));
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventListComponent, this._destinationsModel, this._offersModel, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter.set(event.id, eventPresenter);
  }

  _handleModeChange() {
    this._eventPresenter.forEach((eventPresenter) => eventPresenter.resetView());
  }

  _renderNoEvent() {
    this._noEventComponent = new NoEventView(this._filterType);
    render(this._boardMainContainer, this._noEventComponent, RenderPosition.BEFOREEND);
  }

  _clearBoard({resetSortType = false} = {}) {
    this._eventNewPresenter.destroy();
    this._eventPresenter.forEach((eventPresenter) => eventPresenter.destroy());
    this._eventPresenter.clear();

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

  _renderBoard() {
    render(this._boardMainContainer, this._eventListComponent, RenderPosition.BEFOREEND);
    this._renderEventSort();


    if (this._getEvents().length=== 0) {
      this._renderNoEvent();
      return;
    }

    this._renderEvents();
  }
}
