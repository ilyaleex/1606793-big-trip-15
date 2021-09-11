import {FilterType} from '../const.js';

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => (event.timeEnd - Date.now()) >= 0),
  [FilterType.PAST]: (events) => events.filter((event) => (event.timeStart - Date.now()) < 0),
};
