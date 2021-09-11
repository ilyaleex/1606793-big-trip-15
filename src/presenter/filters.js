import EventFiltersView from '../view/filters';
import {FilterType, UpdateType} from '../const';
import {render, remove, replace, RenderPosition} from '../utils/render';

export default class Filters {
  constructor(filterContainer, filterModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleChangeFilterType = this._handleChangeFilterType.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new EventFiltersView(filters, this._filterModel.getFilter());
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
    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything',
      },
      {
        type: FilterType.FUTURE,
        name: 'Future',
      },
      {
        type: FilterType.PAST,
        name: 'Past',
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
