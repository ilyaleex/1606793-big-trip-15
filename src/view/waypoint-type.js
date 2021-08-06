export const createWaypointTypeTemplate = (id, value, iconStyle, labelText, isChecked) => (
  `<div class="event__type-item">
     <input id="${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${value}"
     ${isChecked ? 'checked' : ''}>
     <label class="event__type-label  ${iconStyle}" for="${id}">${labelText}</label>
  </div>`
);
