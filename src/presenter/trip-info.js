import TripInfoView from '../view/trip-info';
import RouteInfoView from '../view/route-info';
import TripPriceView from '../view/trip-price';
import {render, replace, remove, RenderPosition} from '../utils/render';
import {UpdateType} from '../const';

export default class TripInfo {
  constructor(boardHeaderContainer, eventsModel) {
    this._boardHeaderContainer = boardHeaderContainer;
    this._eventsModel = eventsModel;

    this._tripInfoComponent = new TripInfoView();

    this._routeInfoComponent = null;
    this._tripPriceComponent = null;

    render(this._boardHeaderContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    if (this._eventsModel.getEvents().length === 0) {
      remove(this._routeInfoComponent);
      remove(this._tripPriceComponent);
      return;
    }

    if (!this._routeInfoComponent && !this._tripPriceComponent) {
      this._routeInfoComponent = new RouteInfoView(this._eventsModel.getEvents());
      this._tripPriceComponent = new TripPriceView(this._eventsModel.getEvents());
    }

    render(this._tripInfoComponent, this._routeInfoComponent, RenderPosition.BEFOREEND);
    render(this._tripInfoComponent, this._tripPriceComponent, RenderPosition.BEFOREEND);

    const prevRouteInfoComponent = this._routeInfoComponent;
    const prevPriceComponent = this._tripPriceComponent;

    this._routeInfoComponent = new RouteInfoView(this._eventsModel.getEvents());
    this._tripPriceComponent = new TripPriceView(this._eventsModel.getEvents());

    replace(this._routeInfoComponent, prevRouteInfoComponent);
    replace(this._tripPriceComponent, prevPriceComponent);

    prevRouteInfoComponent.removeElement();
    prevPriceComponent.removeElement();
  }

  _handleModelEvent(updateType) {
    if (updateType === UpdateType.MINOR
      || updateType === UpdateType.MAJOR
      || updateType === UpdateType.RESET
      || updateType === UpdateType.INIT) {
      this.init();
    }
  }
}
