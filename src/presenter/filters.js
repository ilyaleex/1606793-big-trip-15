import EventFiltersView from '../view/filters';
import {FilterType, UpdateType} from '../const';
import {render, remove, replace, RenderPosition} from '../utils/render';
import {filter} from '../utils/filter';

class Filters {
  constructor(filterContainer, filterModel, eventsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleChangeFilterType = this._handleChangeFilterType.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init(isDisabled = false) {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new EventFiltersView(filters, this._filterModel.getFilter(), isDisabled);
    this._filterComponent.setChangeFilterTypeHandler(this._handleChangeFilterType);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _getFilters() {
    const tasks = this._eventsModel.getEvents();

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything',
        count: filter[FilterType.EVERYTHING](tasks).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'Future',
        count: filter[FilterType.FUTURE](tasks).length,
      },
      {
        type: FilterType.PAST,
        name: 'Past',
        count: filter[FilterType.PAST](tasks).length,
      },
    ];
  }

  _handleChangeFilterType(type) {
    if (this._filterModel.getFilter() === type) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, type);
  }
}

export default Filters;
