/**
 * @file 递归
 * @author svon.me@gmail.com
 */


const _ = require('lodash');


const runPromise = function(data, callback) {
  const promises = _.map([].concat(data), function(value) {
    if(callback && _.isFunction(callback)) {
      return callback(value);
    }
  });
  return Promise.all(promises);
}

/**
 * 递归
 * @param {*} list          需要递归的数组数据
 * @param {*} Qps           每次处理多少个元素（默认每次递归处理一个元素，如果需要每次递归处理多个数据则会拆分数组）
 * @param {*} intervalTime  每次执行之间的间隔
 * @param {*} callback      回调函数
 */
const recursion = function(list, Qps, intervalTime, callback) {
  // 如果 Qps 是 Function
  if (_.isFunction(Qps)) {
    callback = Qps;
    Qps = 1;
    intervalTime = 0;
  } 
  // 如果 intervalTime 是 Function
  else if (_.isFunction(intervalTime)) {
    callback = intervalTime;
    intervalTime = 0;
  }
  const arr = _.chunk(list, Qps || 1);
  function app(index) {
    const item = arr[index];
    if (item) {
      return new Promise(function(resolve, reject) {
        runPromise(item, callback).then(function(result) {
          if (intervalTime) {
            return new Promise(function(resolveItem) {
              setTimeout(function() {
                resolveItem(Promise.all([result, app(index + 1)]));
              }, intervalTime);
            })
          } else {
            return Promise.all([result, app(index + 1)]);
          }
        }).then(function(result) {
          return _.flattenDeep(result);
        }).then(function(result){
          resolve(_.compact(result));
        }).catch(function(e) {
          reject(e);
        });
      });
    } else {
      return Promise.resolve(null);
    }
  }
  return app(0);
};

module.exports = recursion;