import {generateItems} from '../utils.js';
import * as constants from '../constants.js';

export const generateDestinations = () => generateItems(constants.DESTINATION_CITIES, 'destination');
