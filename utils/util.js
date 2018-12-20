import { apiDomain } from './config'

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()

  return [ month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const getCurrentDate = (count = 0) => {
  let date = new Date();
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const targetDay = date.setDate(date.getDate() + count)
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('/')
}
const parseSceneParam = (urlParam) => {
  let result = {};
  urlParam.split("&").forEach(function (part) {
    let item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}
const getToday = () => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  today = yyyy + '-' + mm + '-' + dd;
  return today
}

const getCurrentPagePath = () => {
  let pages = getCurrentPages();
  let currentPage = pages[pages.length - 1];
  return currentPage.route
}

const getCurrentPageInstance = () => {
  return getCurrentPages()[getCurrentPages().length - 1]
}

const getCurrentPathWithOptions = () => {
  let currentPage = getCurrentPageInstance();
  return `${currentPage['route']}${isEmptyObject(currentPage['options']) ? '' : `?${serialize(currentPage['options'])}`}`
}

const isEmptyObject = obj => {
  return Object.keys(obj).length === 0
}

const serialize = (obj) => {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

const padStart = (originString, targetLength, padString) => {
  originString = String(originString);
  targetLength = targetLength >> 0;
  padString = String((typeof padString !== 'undefined' ? padString : ' '));
  if (originString.length > targetLength) {
    return String(originString);
  }
  else {
    targetLength = targetLength - originString.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length);
    }
    return padString.slice(0, targetLength) + String(originString);
  }
}

const shuffle = (arr) => {
  let n = arr.length, random;
  while (0 != n) {
    random = (Math.random() * n--) >>> 0;
    [arr[n], arr[random]] = [arr[random], arr[n]]
  }
  return arr;
}

const isPromise = (object) => {
  return Promise.resolve(object) == object;
}

const prefixURL = (url) => {
  return /^https?\:\/\//i.test(url) ? url : `https://${url}`;
}

const getAPIDomain = () => apiDomain

module.exports = {
  formatTime,
  getCurrentDate,
  getToday,
  getCurrentPagePath,
  getCurrentPageInstance,
  getCurrentPathWithOptions,
  isEmptyObject,
  serialize,
  padStart,
  shuffle,
  isPromise,
  prefixURL,
  getAPIDomain,
  parseSceneParam
}