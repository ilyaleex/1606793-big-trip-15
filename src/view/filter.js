export const createFilterTemplate = (id, value, labelText, isChecked, isDisabled) => (
  `<div class="trip-filters__filter">
    <input id="${id}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${value}"
      ${isChecked && !isDisabled ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="${id}">${labelText}</label>
    </div>
  </div>`
);
