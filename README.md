# recursion

如果有一组数据需要并发处理, 但是处理服务无法支持这么打的 QPS, 则可以将数据拆分，依次处理

```
import recursion from "@fengqiaogang/recursion";

const list = [];
for(let i = 0; i < 100000; i++) {
  list.push(i + 1);
}
console.time('recursion');
let index = 0;
// 将数据拆分，每一秒处理300条数据
recursion(list, 300, 1000, function(value) {
  index += 1;
  console.log('Current content : %s', value);
  if (index === list.length) {
    console.log(index, list.length);
    console.timeEnd('recursion');
  }
});
```

**参数定义**

```
recursion(array, Qps, time, callback);
```

| 参数 | 是否必填 | 描述 |
| ------ | ------ | ------ |
| array | 是 | 一组数据 |
| Qps | 否 | 单次处理的并发量 |
| time | 否 | 每次数据处理间隔 |
| callback | 否 | 回调函数 |

**使用方法**

```
const list = new Array(1000);
recursion(list, 10, 500, (value) => {
  console.log(value);
})

每次并发处理10个数据，每次处理间隔时间为500毫秒
```

```
const list = new Array(1000);
recursion(list, 10, (value) => {
  console.log(value);
})

每次并发处理10个数据，无间隔时间
```

```
const list = new Array(1000);
recursion(list, (value) => {
  console.log(value);
})
并发处理所有数据, 与使用 for 功能类似，该形式无任何意义，建议使用 for 循环处理
```