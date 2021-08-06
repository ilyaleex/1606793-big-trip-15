import {generateItems} from '../utils.js';

export const generateOffers = (waypointTypes) => {
  const waypointTypeIds = waypointTypes.map((x) => x.id);
  return generateItems(waypointTypeIds, 'offers');
};
