import {calculateDuration} from './dates';

export const countEventsByType = (events, type) =>
  events.filter((event) => event.type === type).length;
export const sumCostEventByType = (events, type) =>
  events.filter((event) => event.type === type).reduce((sum, event) => sum + event.price, 0);
export const sumDurationEventsByType = (events, type) =>
  events.filter((event) => event.type === type).reduce((sum, event) => sum + calculateDuration(event), 0);
