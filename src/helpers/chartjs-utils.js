import { getColor, getRandomNumber } from './utils';

export const chartJsDefaultTooltip = () => ({
  backgroundColor: getColor('100'),
  borderColor: getColor('300'),
  borderWidth: 1,
  titleColor: getColor('black'),
  callbacks: {
    labelTextColor() {
      return getColor('black');
    }
  }
});

export const getBubbleDataset = (count, rmin, rmax, min, max) => {
  const arr = Array.from(Array(count).keys());
  return arr.map(() => ({
    x: getRandomNumber(min, max),
    y: getRandomNumber(min, max),
    r: getRandomNumber(rmin, rmax)
  }));
};
