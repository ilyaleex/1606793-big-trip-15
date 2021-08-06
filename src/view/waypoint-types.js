import {createWaypointTypeTemplate} from './waypoint-type.js';
import * as constants from '../constants.js';

export const createWaypointTypesTemplate = (waypointTypes, waypoint) => {
  const isEmpty = !waypoint.typeId;

  return `<fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>
    ${waypointTypes.map((type, index) => {
    let isChecked = waypoint.typeId === type.id;
    if (index === 0 && isEmpty) {
      isChecked = true;
    }
    const iconStyle = constants.WAYPOINT_TYPE_ICON_STYLE_MAPPING[type.name];
    return createWaypointTypeTemplate(`event-type-${type.name}-1`, type.name.toLowerCase(), iconStyle, type.name, isChecked);
  }).join('')}
  </fieldset>`;
};

