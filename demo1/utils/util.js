/** 模拟vue实现watch方法 */
const defineReactive = (data, key, val, fn) => {
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get: function () {
      return val
    },
    set: function (newVal) {
      // if (newVal === val) return
      if (isObjectValueEqual(newVal, val)) return
      fn && fn(newVal)
      val = newVal
    },
  })
}

const watch = (ctx, obj) => {
  Object.keys(obj).forEach(key => {
    defineReactive(ctx.data, key, ctx.data[key], function (value) {
      obj[key].call(ctx, value)
    })
  })
}

/**判断两个对象[一层]的值是否相等,
 * 当set部分修改值和初始值相等时，不继续往下走
 */
function isObjectValueEqual(a, b) {
  if (a === null || b === null) {
    return false;
  }
  if (a instanceof Object && a instanceof Object) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    if (aProps.length != bProps.length) {
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];
      var propA = a[propName];
      var propB = b[propName];
      if (propA instanceof Object && propB instanceof Object) {
        isObjectValueEqual(propA, propB)
      } else {
        return false
      }
      if (propA !== propB) {
        return false;
      }
    }
    return true;
  }
  return a === b;
}

module.exports = {
  watch
}