import {getLeadingZero} from './common';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const convertDateToISO = (date, isWithTime = true) => {
  if (isWithTime) {
    return dayjs(date).format('YYYY-MM-DD[T]HH:mm[:00]');
  }

  return dayjs(date).format('YYYY-MM-DD');
};
const humanizeDateTime = (date) => dayjs(date).format('DD/MM/YY HH:mm');
const humanizeDateMonthDay = (date) => dayjs(date).format('MMM D').toUpperCase();
const humanizeDateDayMonth = (date) => dayjs(date).format('D MMM').toUpperCase();
const humanizeTime = (date) => dayjs(date).format('HH:mm');

const calculateDuration = (event) => event.timeEnd - event.timeStart;

const calculateTimeSpend = (timeDifference) => {
  const countOfDay = dayjs.duration(timeDifference, 'millisecond').days();
  const countOfHour = dayjs.duration(timeDifference, 'millisecond').hours() % 24;
  const countOfMinutes = dayjs.duration(timeDifference, 'millisecond').minutes() % 60;
  return {countOfDay, countOfHour, countOfMinutes};
};

const humanizeTimeSpend = ({countOfDay, countOfHour, countOfMinutes}) => {
  if (countOfDay > 0) {
    return `${getLeadingZero(countOfDay)}D ${getLeadingZero(countOfHour)}H ${getLeadingZero(countOfMinutes)}M`;
  } else if (countOfHour > 0) {
    return `${getLeadingZero(countOfHour)}H ${getLeadingZero(countOfMinutes)}M`;
  }

  return `${getLeadingZero(countOfMinutes)}M`;
};

const isDatesEqual = (dateA, dateB) =>  (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'D');

const compareTimeStart = (pointA, pointB) => pointA.timeStart - pointB.timeStart;
const compareDuration = (eventB, eventA) => calculateDuration(eventB) - calculateDuration(eventA);
const comparePrice = (eventB, eventA) => eventB.price - eventA.price;

export {
  convertDateToISO,
  humanizeDateTime,
  humanizeDateMonthDay,
  humanizeDateDayMonth,
  humanizeTime,
  calculateDuration,
  calculateTimeSpend,
  humanizeTimeSpend,
  isDatesEqual,
  compareTimeStart,
  compareDuration,
  comparePrice
};
