export const createSortTemplate = (id, value, labelText, isDisabled = false, isChecked = false) => (
  `<div class="trip-sort__item  trip-sort__item--day">
    <input id="${id}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${value}"
      ${isDisabled ? 'disabled' : ''} ${isChecked && !isDisabled ? 'checked' : ''}>
    <label class="trip-sort__btn" for="${id}">${labelText}</label>
  </div>`
);
