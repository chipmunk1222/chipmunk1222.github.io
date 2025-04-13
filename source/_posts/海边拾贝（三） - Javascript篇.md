---
title: 海边拾贝（三）- Javascript篇
date: 2025-3-22 15:11:16
tags: 
  - 前端八股
  - Javascript
category: 海边拾贝 
description: 收集散落各处的知识碎片，并将这些碎片拼合起来，我将其视为那最终目的，将揭示某个事物本来的样貌
---

# js数据类型一览
{% folding blue , 点击查看详情 %}
首先明确一个概念：`js`的数据类型有两种，分别是原始数据类型和引用数据类型，其中，原始数据类型是有浏览器引擎自行创建的，而引用数据类型都是对象或者对象的变体，是通过函数原型以及原型链创建的，现在，我们再来区分一下这些数据类型
1. 原始数据类型包括：`String`、`Number`、`Boolean`、`null`、`undefined`、`Symbol(ES6)`、`bigInt(ES6)`
2. 引用数据类型为`Object`和其他（其他包括原始数据类型之外的类型，其本质都是`Object`对象的变体）
3. 区分两者的另一个方式是看其存储位置，其中，原始数据类型存储在栈中，直接访问；引用数据类型存储在堆中，通过地址引用访问
{% endfolding %}

# 数据类型检测方法
{% folding blue , 点击查看详情 %}
提供几种数据类型的检测方法
1. `typeof`：返回对象本身的数据类型
2. `instanceof`：返回`true or false`，用于判断对象原型是否在原型链上，只适用于引用类型
3. `Object.prototype.toString.call()`：返回对象类型
4. `constuctor`：返回对象构造函数原型
5. `isArray`、`isNaN`等：特定的静态方法
{% endfolding %}

# 深拷贝、浅拷贝及其使用场景
{% folding blue , 点击查看详情 %}
我们都知道，所谓的对象、数组、字典、集合等等“非原始类型”本质上都可以被称作“引用类型”，而引用类型相对于原始类型在于
- 原始类型直接存储值，且不可更改（直接存储在栈中，操作时操作数据本身）
- 引用类型则存储数据地址（数据地址被存储在栈中，而实际值被存储在堆中），这就导致了我们操作其本质上是操作其地址

由此引出了两种数据复制的方法：直接复制原始值还是复制地址
**浅拷贝：**
浅拷贝描述上述数据复制方法中的复制地址的拷贝方法，这种拷贝的优势在于直接复制复杂内容的地址从而实现资源优化
**深拷贝：**
深拷贝就是直接完全复制数据本身的方法，这将递归访问复杂数据的每一层直到完全重构出一个新数据

关于引用类型的拷贝方法总共就这两种，而从结果来看，绝大多数的拷贝都是浅拷贝，因为这才是性能最优方法，包括我们能够见到的几乎所有原型方法，下面列举几个深拷贝的方法：
1. `JSON.parse(JSON.stringify())`
2. 手动实现逐层递归
```js
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    const copy = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepClone(obj[key]);
        }
    }
    return copy;
}
```
3. 使用第三方库，如`lodash`：`const deepCopy = _.cloneDeep(obj)`

深拷贝一般用于处理一些需要完全独立的数据的场景，比如状态管理库中不能直接改变库中数据，就需要先深拷贝，从而防止数据污染

{% endfolding %}

# 作用域、作用域链、闭包
{% folding blue , 点击查看详情 %}
作用域的概念是指变量所在的区域，这决定了变量或函数的访问区域，作用域又分为全局作用域和局部作用域

当调用某个变量或函数时，浏览器首先在当前作用域中寻找，如果没找到，则按照作用域链向上寻找，直到找到其所在的定义位置，这就是作用域链，而内部变量访问外部变量的这一行为就被称作闭包
{% endfolding %}

# new的实现原理
{% folding blue , 点击查看详情 %}
使用`new`操作符可以创建自定义的数据类型，其实现流程如下：
1. 创建一个空对象
2. 添加当前对象的`__proto__`为构造函数的`prototype`
3. 通过`this`绑定空对象和构造函数，使构造函数在空对象中创建初始化属性
4. 根据构造函数的返回值返回对应的数据
{% endfolding %}
# 原型和原型链
{% folding blue , 点击查看详情 %}
关于原型，首先明确两个概念，`prototype`和`__proto__`，其中，`prototype`是构造函数的原型，`__proto__`是实例承载的构造函数的原型，怎么理解？我们都知道，在`js`的引用数据类型中，基本类型都有一些默认的属性和方法，这本质上就是该数据类型的原型，那么这些原型是怎么生成的呢？在`new`一个实例时，`__proto__`绑定构造函数的`prototype`，这就是这些原型方法的传递过程，即`__proto__`作为原型方法的载体，承载了其原型的`prototype`

而关于原型链，基于上述的原型传递流程，这样由顶层对象一层层将原型方法传递下来的过程就被称为原型链
{% endfolding %}
# apply、call、bind的this指向绑定问题
{% folding blue , 点击查看详情 %}
`apply`、`call`和`bind`都是修改函数的`this`指向的方法，即修改函数上下文的方法，其差别在于：
1. `apply`：改变`this`指向，正常传入数据
2. `call`：改变`this`指向，将数据作为数组传入
3. `bind`：创建一个新表达式并自定义`this`指向

>以`new`的创建为例，使用`apply`改变`this`指向后，就可以通过`this.data = data`添加数据了
{% endfolding %}
# 箭头函数和普通函数的区别
{% folding blue , 点击查看详情 %}
1. `this`指向：箭头函数的`this`指向只取决于其定义的位置，普通函数的`this`指向取决于其被调用的位置
2. 箭头函数的`this`指向无法修改，普通函数可以使用`apply`等方法修改
3. 箭头函数没有构造函数，无法生成实例
4. 箭头函数没有`arguments`默认接收参数
{% endfolding %}
# js事件循环
{% folding blue , 点击查看详情 %}
`js`是一门单线程语言，而`js`事件循环是其异步的实现方式，决定了异步任务的优先级
事件循环的核心是其实现方式，本质在于`js`内部通过无限循环的方式执行任务，而异步任务则被放进相应队列中，从而决定执行顺序
`js`脚本任务分为4个优先级：
1. 同步任务，所有同步脚本
2. 微队列：`Promise`任务的载体
3. 宏队列（交互队列）：存储外部点击事件等交互任务
4. 回调队列：存储`setTimeout`等回调函数

任务没有优先级划分，只有不同队列存在优先级划分
{% endfolding %}
# 几种异步调用方法
{% folding blue , 点击查看详情 %}
1. 回调函数：通过在函数中传入回调函数实现异步
2. `Promise`期约：
  - 定义：`Promise`为一个对象，用来处理异步处理的结果
  - 语法：`function fn(){return new Promise((resolve,reject)=>{resolve('成功')})}`
  - 接收`fullfiled`状态：`fn.then((res)=>{console.log(res})`
  - 接收`rejected`状态：`fn.catch((error)=>{console.log(error)})`
  - 完成状态：`fn.finally(()=>{console.log('finished')})`
3. `async/await`方法：
  - 定义：本质是`promise`的语法糖
  - `async`声明接下来的函数返回`promise`结果
  - `await`表示指向阻塞，等待异步函数完成
4. 异步计时器：
  - 定时器：`setTineout(fn,during)`
  - 计时器：`setInterval(fn,interval)`
{% endfolding %}
# localstorage、sessionstorage和cookie的区别
{% folding blue , 点击查看详情 %}
1. `localstorage`是长期存储，适用于需要长期存储数据的地方
2. `sessionstorage`是会话存储，存储数据会随浏览器关闭而消失
3. `cookie`适合存储需要与服务器频繁交互的数据，后端可以直接读取`cookie`中的数据
{% endfolding %}
# ES6之后的新特性
{% folding blue , 点击查看详情 %}
1. 块级作用域：`let`和`const`的概念
2. 模板字符串：`${}`模板字符串
3. 箭头函数：~~箭头函数竟然是ES6后的特性~~
4. 解构赋值
5. 扩展运算符
6. `Promise`期约
7. `import`模块化
8. `Map`和`Set`
9. `Symbol`和`bigInt`数据类型
{% endfolding %}