import {generateItems} from '../utils.js';
import * as constants from '../constants.js';

export const generateWaypointTypes = () => generateItems(constants.WAYPOINT_TYPE_NAMES, 'waypoint');
