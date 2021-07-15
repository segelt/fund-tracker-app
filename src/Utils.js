import {Dimensions, Platform, StatusBar} from 'react-native';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const {height, width} = Dimensions.get('window');

export const isIPhoneX = () =>
  Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
    ? (width === X_WIDTH && height === X_HEIGHT) ||
      (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
    : false;

export const StatusBarHeight = Platform.select({
  ios: isIPhoneX() ? 44 : 20,
  android: StatusBar.currentHeight,
  default: 0,
});

export function midAngle(d) {
  return d.startAngle + (d.endAngle - d.startAngle) / 2;
}

export function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

/**
 * Given the height of the svg graph, desired padding and number of lines,
 * returns an array of positions for each line
 * @param {*} svgHeight
 * @param {*} padding
 * @param {*} numberOfLines
 */
export function calculateHorizontalRulerYPositions(
  svgHeight,
  padding,
  numberOfLines,
  yScale,
) {
  var positions = [];

  for (var idx = 0; idx <= numberOfLines; idx++) {
    var newPos = padding + ((svgHeight - 2 * padding) * idx) / numberOfLines;
    var newPosInverted = yScale.invert(newPos);
    positions.push({position: newPos, data: newPosInverted});
  }

  return positions;
}

export function calculateHorizontalRulerXPositions(
  svgWidth,
  padding,
  numberOfLabels,
  xScale,
  tarihArr,
) {
  var positions = [];

  var dif = Math.floor(tarihArr.length / numberOfLabels);

  for (var idx = 0; idx < numberOfLabels; idx++) {
    var newIndex = idx * dif + padding;
    var invertedLabelPos = xScale(newIndex);
    positions.push({position: invertedLabelPos, data: tarihArr[newIndex]});
  }

  return positions;
}

export function validateAndFormatDate(inputDate) {
  var rgx = /^(0?[1-9]|[12][0-9]|3[01])[-](0?[1-9]|1[012])[-]\d{4}$/;
  if (rgx.test(inputDate)) {
    var splitted = inputDate.split('-');
    var out = '';

    var token = splitted[0];

    if (token.length == 1) {
      out = out.concat('0'.concat(token));
    } else out = out.concat(token);
    out = out.concat('-');

    var token = splitted[1];
    if (token.length == 1) {
      out = out.concat('0'.concat(token));
    } else out = out.concat(token);
    out = out.concat('-').concat(splitted[2]);

    return {
      status: true,
      formattedDate: out,
    };
  } else {
    return {
      status: false,
      formattedDate: '',
    };
  }
}

export function FormatDateInDDMMYYYY(inputDate) {
  const dateStr =
    inputDate.getDate() < 10
      ? `0${inputDate.getDate()}`
      : `${inputDate.getDate()}`;
  const monthStr =
    inputDate.getMonth() + 1 < 10
      ? `0${inputDate.getMonth() + 1}`
      : `${inputDate.getMonth() + 1}`;

  const FormattedDate = `${dateStr}-${monthStr}-${inputDate.getFullYear()}`;

  return FormattedDate;
}

export function isFloat(val) {
  var floatRegex = /^-?\d+(?:[.]\d*?)?$/;
  if (!floatRegex.test(val)) return false;

  val = parseFloat(val);
  if (isNaN(val)) return false;
  return true;
}

export function isInt(val) {
  var intRegex = /^-?\d+$/;
  if (!intRegex.test(val)) return false;

  var intVal = parseInt(val, 10);
  return parseFloat(val) == intVal && !isNaN(intVal);
}

export function SplitGroups(inputData) {
  var grouped = inputData.reduce(function (result, a) {
    result[a.fundCode] = result[a.fundCode] || {};

    if (!result[a.fundCode]) {
      result[a.fundCode] = {};
    }

    result[a.fundCode][a.dateAdded] = [a.priceBought, a.amountBought];
    return result;
  }, Object.create(null));

  return grouped;
}

export function ExtractFundCodesAndSetValues(fundData, intervalValue) {
  return fundData
    .map((item) => item.fundCode)
    .filter((value, index, self) => self.indexOf(value) === index)
    .reduce((result, filter) => {
      result[filter.toString()] = intervalValue;
      return result;
    }, {});
}

export function commaDelimitedNumber(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}

const interpolate = (xVal, xRange, yRange) => {
  let y1, y2, x1, x2;

  y1 = yRange[0];
  y2 = yRange[1];
  x1 = xRange[0];
  x2 = xRange[1];

  return y1 + ((xVal - x1) * (y2 - y1)) / (x2 - x1);
};
