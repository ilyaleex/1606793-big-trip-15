import {getLeadingZero} from './common';
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

export const calculateDuration = (event) => event.timeEnd - event.timeStart;

export const calculateTimeSpend = (timeDifference) => {
  const countOfDay = dayjs.duration(timeDifference, 'millisecond').days();
  const countOfHour = dayjs.duration(timeDifference, 'millisecond').hours() % 24;
  const countOfMinutes = dayjs.duration(timeDifference, 'millisecond').minutes() % 60;
  return {countOfDay, countOfHour, countOfMinutes};
};

export const humanizeTimeSpend = ({countOfDay, countOfHour, countOfMinutes}) => {
  if (countOfDay > 0) {
    return `${getLeadingZero(countOfDay)}D ${getLeadingZero(countOfHour)}H ${getLeadingZero(countOfMinutes)}M`;
  } else if (countOfHour > 0) {
    return `${getLeadingZero(countOfHour)}H ${getLeadingZero(countOfMinutes)}M`;
  }

  return `${getLeadingZero(countOfMinutes)}M`;
};

export const isDatesEqual = (dateA, dateB) =>  (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'D');

export const compareTimeStart = (pointA, pointB) => pointA.timeStart - pointB.timeStart;
export const compareDuration = (eventB, eventA) => calculateDuration(eventB) - calculateDuration(eventA);
export const comparePrice = (eventB, eventA) => eventB.price - eventA.price;
