import Taro from '@tarojs/taro';
import { getStore } from '@/utils/weapp';
import { USER_INFO } from '@/utils/constant';
import { nrNavigateTo } from './router';

export function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

export function throttle(fn, delay) {
  let previous = 0;
  return (...args) => {
    const now = +new Date();
    if (now - previous > delay) {
      fn.apply(this, args);
      previous = now;
    }
  };
}

// const checkPoint = (price: string | number) => {
//   return String(price).indexOf('.') > 0;
// };
export const formatThousands = (money, decimalDigits = 0) => {
  return parseFloat(money)
    .toFixed(decimalDigits)
    .toString()
    .split('')
    .reverse()
    .join('')
    .replace(/(\d{3})/g, '$1,')
    .replace(/\,$/, '')
    .split('')
    .reverse()
    .join('');
};

export function formatDate(date, fmt) {
  if (/(y+)(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substring(4 - RegExp.$1.length)
    );
  }
  const oarr = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'D+': date.getDate(),
    'h+': date.getHours(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  for (const k in oarr) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = oarr[k] + '';
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : ('00' + str).substring(str.length)
      );
    }
  }
  return fmt;
}

export function hidePhone(phone) {
  if (!phone) return;
  return phone.toString().replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

export function hideIdCard(phone) {
  return phone.toString().replace(/(\d{10})\d{4}(\d{4})/, '$1****$2');
}

export function copyText(val) {
  Taro.setClipboardData({
    data: val,
    success: () => {
      Taro.showToast({
        title: '复制成功',
        icon: 'none',
      });
    },
  });
}

export function makePhoneCall(phone: any) {
  if (!phone) {
    Taro.showToast({
      title: '手机号有误',
      icon: 'none',
    });
    return;
  }
  Taro.showModal({
    title: '提示',
    content: `确定拨打电话：${phone}?`,
    success: function (res) {
      if (res.confirm) {
        Taro.makePhoneCall({
          phoneNumber: phone,
        });
      }
    },
  });
}

export function getUserInfo(): Promise<any> {
  return new Promise((resolve, reject) => {
    Taro.getUserInfo({
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      },
    });
  });
}

export function regArrKey(arr: any[], fromKey, toKey) {
  const newArr: any[] = [];
  arr.forEach((item) => {
    if (item.children) {
      item.children = regArrKey(item.children, fromKey, toKey);
    }
    newArr.push({
      ...item,
      [toKey]: item[fromKey],
    });
  });
  return newArr;
}

export function regScore(score: number) {
  let str;
  if (score < 4.5) {
    str = ' 分';
  } else if (score == 4.5) {
    str = ' 不错';
  } else if (score == 4.6) {
    str = ' 好';
  } else if (score == 4.7) {
    str = ' 很好';
  } else if (score == 4.8) {
    str = ' 棒';
  } else if (score >= 4.9) {
    str = ' 超棒';
  }
  return str;
}
export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export const weekDay = function (time) {
  const weekNum = new Date(time).getDay();
  let week = '';
  switch (weekNum) {
    case 0:
      week = '星期天';
      break;
    case 1:
      week = '星期一';
      break;
    case 2:
      week = '星期二';
      break;
    case 3:
      week = '星期三';
      break;
    case 4:
      week = '星期四';
      break;
    case 5:
      week = '星期五';
      break;
    case 6:
      week = '星期六';
      break;
  }
  return week;
};

let prefixKey = 0;
export function repairListForFlexWrap(data: any[], wrapLen: number) {
  const dataLen = data.length;
  if (dataLen % wrapLen === 0) return data;

  const rest = wrapLen - (dataLen % wrapLen);
  let newArr: any[] = [];
  newArr = [...data];

  for (let i = 0; i < rest; i++) {
    prefixKey += 1;
    newArr.push({
      hidden: true,
      text: prefixKey,
    });
  }

  return newArr;
}
export function valiteEmail(val) {
  return /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(val);
}
export const customValidatorPhone = (val) => {
  return /^[1][3,4,5,7,8][0-9]{9}$/.test(val);
};
export function nullText(val) {
  const nullLish = [null, '', undefined, 'null', 0, '0', NaN, 'NaN'];
  if (nullLish.includes(val)) return '--';
  return val;
}

export function needToLogin() {
  if (getStore(USER_INFO)) return false;
  nrNavigateTo('login');
  return true;
}
export function pageHasMore(pages, pageNum) {
  return Number(pages) !== Number(pageNum) && Number(pages) !== 0;
}
export function noop() {
  //
}
export function is_contained(lon, short) {
  if (!(lon instanceof Array) || !(short instanceof Array)) return false;
  if (lon.length < short.length) return false;
  const aStr = lon.toString();
  for (let i = 0, len = short.length; i < len; i++) {
    if (aStr?.indexOf(short[i]) == -1) return false;
  }
  return true;
}

export function diff_arr(lon, short) {
  return lon.filter((v) => !short.includes(v));
}

export function is_same_arr(a1, a2) {
  if (!(a1 instanceof Array) || !(a2 instanceof Array)) return false;
  if (a1.length != a2.length) return false;
  for (let i = 0, len = a1.length; i < len; i++) {
    if (!a2.includes(a1[i])) return false;
  }
  return true;
}

export function deep_clone(target) {
  // WeakMap作为记录对象Hash表（用于防止循环引用）
  const map = new WeakMap();

  // 判断是否为object类型的辅助函数，减少重复代码
  function isObject(target) {
    return (
      (typeof target === 'object' && target) || typeof target === 'function'
    );
  }

  function clone(data) {
    // 基础类型直接返回值
    if (!isObject(data)) {
      return data;
    }

    // 日期或者正则对象则直接构造一个新的对象返回
    if ([Date, RegExp].includes(data.constructor)) {
      return new data.constructor(data);
    }

    // 处理函数对象
    if (typeof data === 'function') {
      return new Function('return ' + data.toString())();
    }

    // 如果该对象已存在，则直接返回该对象
    const exist = map.get(data);
    if (exist) {
      return exist;
    }

    // 处理Map对象
    if (data instanceof Map) {
      const result = new Map();
      map.set(data, result);
      data.forEach((val, key) => {
        // 注意：map中的值为object的话也得深拷贝
        if (isObject(val)) {
          result.set(key, clone(val));
        } else {
          result.set(key, val);
        }
      });
      return result;
    }

    // 处理Set对象
    if (data instanceof Set) {
      const result = new Set();
      map.set(data, result);
      data.forEach((val) => {
        // 注意：set中的值为object的话也得深拷贝
        if (isObject(val)) {
          result.add(clone(val));
        } else {
          result.add(val);
        }
      });
      return result;
    }

    // 收集键名（考虑了以Symbol作为key以及不可枚举的属性）
    const keys = Reflect.ownKeys(data);
    // 利用 Object 的 getOwnPropertyDescriptors 方法可以获得对象的所有属性以及对应的属性描述
    const allDesc = Object.getOwnPropertyDescriptors(data);
    // 结合 Object 的 create 方法创建一个新对象，并继承传入原对象的原型链， 这里得到的result是对data的浅拷贝
    const result = Object.create(Object.getPrototypeOf(data), allDesc);

    // 新对象加入到map中，进行记录
    map.set(data, result);

    // Object.create()是浅拷贝，所以要判断并递归执行深拷贝
    keys.forEach((key) => {
      const val = data[key];
      if (isObject(val)) {
        // 属性值为 对象类型 或 函数对象 的话也需要进行深拷贝
        result[key] = clone(val);
      } else {
        result[key] = val;
      }
    });
    return result;
  }

  return clone(target);
}
export const Base64 = {
  // base64的组成元素
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  // 对外暴露的加密方法
  encode: function (input) {
    let output = '';
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;
    input = Base64._utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output =
        output +
        this._keyStr.charAt(enc1) +
        this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) +
        this._keyStr.charAt(enc4);
    }

    return output;
  },

  // 对外暴露的解密方法
  decode: function (input) {
    let output = '';
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

    while (i < input.length) {
      enc1 = this._keyStr?.indexOf(input.charAt(i++));
      enc2 = this._keyStr?.indexOf(input.charAt(i++));
      enc3 = this._keyStr?.indexOf(input.charAt(i++));
      enc4 = this._keyStr?.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }

    output = Base64._utf8_decode(output);

    return output;
  },

  //  UTF-8格式加密
  _utf8_encode: function (string) {
    string = string.replace(/\r\n/g, '\n');
    let utftext = '';

    for (let n = 0; n < string.length; n++) {
      const c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  },

  // UTF-8格式解密
  _utf8_decode: function (utftext) {
    let string = '';
    let i = 0;
    let c = 0;
    let c2 = 0;
    let c3;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(
          ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        );
        i += 3;
      }
    }
    return string;
  },
};
export function _debounce(func, wait = 1000, immediate = true) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) func.apply(this, args);
    } else {
      timer = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    }
  };
}
export function isCH(s) {
  const patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
  if (!patrn.exec(s)) {
    return false;
  } else {
    return true;
  }
}
