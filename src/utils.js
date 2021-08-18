import {v4 as uuidv4} from 'uuid';

export const getRandomInt = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayElement = (array) => array[getRandomInt(0, array.length - 1)];

export function getRandomArrayElements (array, count) {
  count = Math.min(array.length, count);
  const fullArray = array.slice();
  const currentArray = [];
  for (let ind = 0; ind < count; ind++) {
    currentArray.push(...fullArray.splice(getRandomInt(0, fullArray.length - 1), 1));
  }
  return currentArray;
}

export const getLeadingZero = (number) => (number < 10) ? `0${number}` : `${number}`;

export const getRandomId = () => uuidv4;
