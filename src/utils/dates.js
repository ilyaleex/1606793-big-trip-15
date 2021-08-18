import {getLeadingZero} from '../utils';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const convertDateToISO = (date, isWithTime = true) => {
  if (isWithTime) {
    return dayjs(date).format('YYYY-MM-DD[T]HH:mm[:00]');
  }

  return dayjs(date).format('YYYY-MM-DD');
};
export const humanizeDateTime = (date) => dayjs(date).format('DD/MM/YY HH:mm');
export const humanizeDateMonthDay = (date) => dayjs(date).format('MMM D').toUpperCase();
export const humanizeDateDayMonth = (date) => dayjs(date).format('D MMM').toUpperCase();
export const humanizeTime = (date) => dayjs(date).format('HH:mm');

export const calculateTimeDifference = (dateA, dateB) => {
  const difference = dateA - dateB;
  const countOfDay = dayjs.duration(difference, 'millisecond').days();
  const countOfHour = dayjs.duration(difference, 'millisecond').hours() % 24;
  const countOfMinutes = dayjs.duration(difference, 'millisecond').minutes() % 60;

  if (countOfDay > 0) {
    return `${getLeadingZero(countOfDay)}D ${getLeadingZero(countOfHour)}H ${getLeadingZero(countOfMinutes)}M`;
  } else if (countOfHour > 0) {
    return `${getLeadingZero(countOfHour)}H ${getLeadingZero(countOfMinutes)}M`;
  }

  return `${getLeadingZero(countOfMinutes)}M`;
};

export const compareTimeStart = (pointA, pointB) => pointA.timeStart - pointB.timeStart;
