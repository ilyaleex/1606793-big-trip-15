import dayjs from 'dayjs';

export const dateConverter = (date, format = 'MMM D') => {
  const convertedDate = dayjs(date).format(format);
  return convertedDate;
};

export const getTripDatesLayout = (firstWaypoint, lastWaypoint) => {
  const dateFrom = dateConverter(firstWaypoint.dateFrom);
  const dateTo = dateConverter(lastWaypoint.dateTo);
  const dateLayout = `${dateFrom}&nbsp;&mdash;&nbsp;${dateTo}`;

  return dateLayout;
};
