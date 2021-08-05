import {createFilterTemplate} from './filter.js';
import * as filterSW from '../sw/filterSW.js';

export const createFiltersTemplate = (trip) => (
  `<form class="trip-filters" action="#" method="get">
     ${createFilterTemplate('filter-everything', 'everything', 'Everything', true, filterSW.isEverythingFilterDisabled(trip))}
     ${createFilterTemplate('filter-future', 'future', 'Future', false, filterSW.isFutureFilterDisabled(trip))}
     ${createFilterTemplate('filter-past', 'past', 'Past', false, filterSW.isPastFilterDisabled(trip))}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
);

