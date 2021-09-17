import AbstractView from './abstract.js';

const createFilterTemplate = (filter, currentFilterType, isDisabled) => {
  const {type, name, count} = filter;
  const checkedStatus = (type === currentFilterType) ? 'checked' : '';
  const disabledStatus = isDisabled || !count ? 'disabled' : '';

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${checkedStatus} ${disabledStatus}}>
      <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
    </div>`
  );
};

const createFiltersTemplate = (filters, currentFilterType, isDisabled) => {
  const filtersTemplate = filters.map((filter) => createFilterTemplate(filter, currentFilterType, isDisabled)).join('');
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filters extends AbstractView {
  constructor(filterItems, currentFilterType, isDisabled) {
    super();
    this._filterItems = filterItems;
    this.currentFilterType = currentFilterType;
    this._isDisabled = isDisabled;

    this._changeFilterTypeHandler = this._changeFilterTypeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filterItems, this.currentFilterType, this._isDisabled);
  }

  _changeFilterTypeHandler(evt) {
    evt.preventDefault();

    this._callback.changeFilterType(evt.target.value);
  }

  setChangeFilterTypeHandler(callback) {
    this._callback.changeFilterType = callback;
    this.getElement().addEventListener('change', this._changeFilterTypeHandler);
  }
}

