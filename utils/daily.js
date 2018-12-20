import { getToday, isPromise } from './util'

const Daily = (storageKey, promiseFunc) => {
  // 判断是否是今日首次
  let storageDate = ''
  try {
    storageDate = wx.getStorageSync(storageKey)
  } catch (e) {
    storageDate = ''
  }
  let todayDate = getToday()
  if (!storageDate || storageDate != todayDate) {
    let promise = promiseFunc();
    if (isPromise(promise)) {
      promise.then(res => {
        try {
          wx.setStorageSync(storageKey, todayDate)
        } catch (e) { }
      })
    } else {
      try {
        wx.setStorageSync(storageKey, todayDate)
      } catch (e) { }
    }
  }
}

export {
  Daily
}