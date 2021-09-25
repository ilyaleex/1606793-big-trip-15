import AbstractObserver from '../utils/abstract-observer';
import {FilterType} from '../const';

class Filters extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FilterType.EVERYTHING;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}

export default Filters;
