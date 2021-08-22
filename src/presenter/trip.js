import FiltersView from '../view/filters';
import EventListView from '../view/trip-events-list';
import TripSortView from '../view/trip-sort';
import RouteInfoView from '../view/route-info';
import MenuView from '../view/menu';
import TripPriceView from '../view/trip-price';
import TripInfoView from '../view/trip-info';
import NoEventView from '../view/no-event';
import {RenderPosition, render} from '../utils/render';
import {updateItem} from '../utils';
import {FILTERS, SortType} from '../mock/waypoint-mocks';
import {compareTimeStart, compareDuration, comparePrice} from '../utils/dates';

import EventPresenter from './event.js';

export default class Trip {
  constructor(tripHeaderContainer, tripMainContainer) {
    this._tripHeaderContainer = tripHeaderContainer;
    this._tripMainContainer = tripMainContainer;
    this._eventPresenter = new Map();

    this._menuComponent = new MenuView();
    this._filtersComponent = new FiltersView();
    this._tripInfoComponent = new TripInfoView();
    this._sortComponent = new TripSortView();
    this._eventListComponent = new EventListView();
    this._noEventComponent = new NoEventView(FILTERS[0]);
    this._currentSortType = SortType.DAY;

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleChangeSortType = this._handleChangeSortType.bind(this);
  }

  init(events) {
    this._events = events.slice();

    this._routeInfoComponent = new RouteInfoView(this._events);
    this._tripPriceComponent = new TripPriceView(this._events);

    this._renderTrip();
  }

  _renderTrip() {
    this._renderMenu();
    this._renderEventFilters();

    if (!this._events || this._events.length === 0) {
      this._renderNoEvent();
      return;
    }

    this._renderTripInfo();
    this._renderTripSort();
    this._renderEventList();
    this._renderEvents();
  }

  _renderMenu() {
    const MenuElement = this._tripHeaderContainer.querySelector('.trip-controls__navigation');
    render(MenuElement, this._menuComponent, RenderPosition.BEFOREEND);
  }

  _renderEventFilters() {
    const eventFilterElement = this._tripHeaderContainer.querySelector('.trip-controls__filters');
    render(eventFilterElement, this._filtersComponent, RenderPosition.BEFOREEND);
  }

  _renderTripInfo() {
    render(this._tripHeaderContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);

    this._renderRouteInfo();
    this._renderTripPrice();
  }

  _renderRouteInfo() {
    render(this._tripInfoComponent, this._routeInfoComponent, RenderPosition.BEFOREEND);
  }

  _renderTripPrice() {
    render(this._tripInfoComponent, this._tripPriceComponent, RenderPosition.BEFOREEND);
  }

  _renderTripSort() {
    render(this._tripMainContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setChangeSortTypeHandler(this._handleChangeSortType);
  }

  _renderEventList() {
    render(this._tripMainContainer, this._eventListComponent, RenderPosition.BEFOREEND);
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this._events.sort(compareTimeStart);
        break;
      case SortType.TIME:
        this._events.sort(compareDuration);
        break;
      case SortType.PRICE:
        this._events.sort(comparePrice);
        break;
    }

    this._currentSortType = sortType;
  }

  _handleChangeSortType(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortEvents(sortType);
    this._clearEventList();
    this._renderEvents();
  }

  _renderEvents() {
    this._events.forEach((event) => this._renderEvent(event));
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventListComponent, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter.set(event.id, eventPresenter);
  }

  _clearEventList() {
    this._eventPresenter.forEach((eventPresenter) => eventPresenter.destroy());
    this._eventPresenter.clear();
  }

  _renderNoEvent() {
    render(this._tripMainContainer, this._noEventComponent, RenderPosition.BEFOREEND);
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._eventPresenter.get(updatedEvent.id).init(updatedEvent);
  }

  _handleModeChange() {
    this._eventPresenter.forEach((eventPresenter) => eventPresenter.resetView());
  }
}
