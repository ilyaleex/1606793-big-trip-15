import StatisticsView from '../view/statistics';
import {remove, render, RenderPosition} from '../utils/render';

export default class Statistics {
  constructor(statisticsContainer, eventsModel, eventTypes) {
    this._statisticsContainer = statisticsContainer;
    this._eventsModel = eventsModel;
    this._eventTypes = eventTypes;
    this._statisticsComponent = null;
  }

  init() {
    if (!this._statisticsComponent) {
      this._statisticsComponent = new StatisticsView(this._eventsModel.getEvents(), this._eventTypes);
    }

    render(this._statisticsContainer, this._statisticsComponent, RenderPosition.BEFOREEND);
  }

  destroy() {
    if (this._statisticsComponent) {
      remove(this._statisticsComponent);
      this._statisticsComponent = null;
    }
  }
}
