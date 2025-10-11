---
title: 前端DOM操作变革史
date: 2025-8-14 9:57:16
tags:
  - DOM
  - 前端框架
  - js
  - MVX
category: 前端技术
description: 随着框架技术的大量发展，关于前端如何进行DOM操作发生了了翻天覆地的变化，本文对其发展史做一个总体的梳理和总结
---

{% tip cogs %}
本文就前端`DOM`操作从命令式到声明式做一个简单的梳理和总结，同时提供一些直接`DOM`操作的方式
{% endtip %}

# 前言
纵观前端脚本的工作流程就不难发现，`DOM`操作几乎是一切前端脚本逻辑的输出终点，无论功能逻辑如何复杂，最后都需要通过`DOM`操作作用到具体的上下文中，这个功能才算真正成型。并且，`DOM`操作本身作为前端相当耗费性能的行为之一，对`DOM`的优化如何有时候能够很大程度上决定页面性能如何。而事实也正是，`DOM`操作在前端的发展中得到了史无前例的重视，每一代技术革新基本都伴随着一次`DOM`操作的变更，因此，本文就想基于这一现象，对前端`DOM`操作的变革做一个梳理和总结

# 从命令式到声明式
## 命令式VS声明式
如果要用一个最直观的点到点的变化整体概括前端`DOM`操作的总体变化的话，那一定是从命令式到声明式了：
- **命令式：**直接定位`DOM`元素，精确地一步一步告诉浏览器该怎么操作，首先获取`DOM`，然后修改它的样式属性，接着继续操作其它`DOM`...
- **声明式：**并不直接操作`DOM`，而是通过声明状态的方式，让浏览器自动修改`DOM`状态，也就是并不关心怎么做，而是声明式地描述状态，后续只要修改状态，`DOM`便会自动同步改变，例如`Vue`中便是通过`data`来描述状态，等到编译时再将数据注入到模板中，从而实现状态的同步

## 第一阶段：原生JS时代
该阶段是命令式`DOM`操作的代表时代，在这个时代的`DOM`操作具有诸多痛点，包括：
1. 冗长的操作`API`：`createElement/appendChild/setAttribute`等等，往往一个功能反复调用`DOM`语句，十分冗杂
2. 全局变量污染
3. 无组件化概念，代码复用困难
4. 直接操作`DOM`导致性能低下（频繁重排重绘）

下面是使用原生`JS`操作`DOM`的例子：
```javascript
// 典型DOM操作流程
const div = document.createElement('div');
div.id = 'myDiv';
div.className = 'box';
div.appendChild(document.createTextNode('Hello World'));
document.body.appendChild(div);

// 事件绑定
div.onclick = function() {
  this.style.color = 'red'; 
  // 兼容性问题：IE用attachEvent，其他用addEventListener
};
```

## 第二阶段：JQuery时代
`Jquery`的出现优化了原生`JS`操作`DOM`时冗长的代码调用问题，同时提供了一些内置的封装好的方法和函数，使得复用性大大提升，但`JQuery`的工作流程仍然是命令式的，只是封装了一些原本冗余的`JS`代码，在大量调用中仍会导致状态混乱等问题
```javascript
// 等效jQuery操作
// 用$()来直接获取DOM元素
$('body').append(
  $('<div>', {
    id: 'myDiv',
    'class': 'box',
    text: 'Hello World',
    click: function() {
      $(this).css('color', 'red');
    }
  })
);
```

## 第三阶段：现代框架时代
从`AngularJS`到`React`和`Vue.js`，这些现代框架提供了更简洁的语法，同时标志着前端的`DOM`操作开始真正进入声明式的时代。
在这一阶段，两种现在广为人知的前端架构模式开始流行，分别是：
- **MVC(Model-View-Controller)**:模型——视图——控制器，MVC模式将`DOM`操作从业务逻辑中分离出来，将`DOM`操作的职责交给视图层，而视图层则通过控制器来控制模型，控制器通过`DOM`操作来修改视图层的状态，同时控制器也通过`DOM`操作来监听视图层的状态变化，从而实现数据的双向绑定。这一模式以`React`为代表(`JSX`)。
- **MVVM(Model-View-ViewModel)**:模型——视图——视图模型，MVVM模式与MVC模式类似，也是将`DOM`操作从业务逻辑中分离出来，将`DOM`操作的职责交给视图层，而视图层则通过视图模型来控制模型，视图模型通过`DOM`操作来修改视图层的状态，同时视图模型也通过`DOM`操作来监听视图层的状态变化，从而实现数据的双向绑定。这一模式以`Vue.js`为代表。

可以看到，两种模式都具有以下共性，即(`MV`)模型——视图，再通过(`C/VM`)控制器或视图模型来控制`DOM`，虽然控制方式略有差异，就如`React`用`JSX`控制`DOM`，而`Vue.js`则用`template`的双向绑定原理控制`DOM`，但两者都是典型的声明式`DOM`操作模式，有别于命令式的顺序执行`DOM`操作，不关注"如何做？",只关注"什么状态？"。
```javascript
// React 组件(MVC模式)
function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <Item key={item.id} item={item} />
      ))}
    </ul>
  );
}

// Vue 模板（MVVM模式）
<div v-for="item in items">
  {{ item.title }}
  <button @click="remove(item)">×</button>
</div>
```

> 另外值得提出的一点是，从`JQuery`到`React/Vue`的发展是存在一个过渡期的，该阶段诞生了大量框架，并且`MVC/MVVM`模式也是在框架的迭代中逐渐发展而成的

## 第四阶段：框架技术深度演进
即使现代框架的`DOM`操作已经远远优于开始使用原生`JS`的时代，但相关技术还在不断演进，同时源源不断有新的概念被提出，旨在持续优化`DOM`性能

### 虚拟DOM技术
虚拟`DOM`技术是`Vue`等现代框架的渲染模式，其核心是用一套数据结构来表示真实的`DOM`树，这个数据结构对象包括节点名称、节点属性、参数，子节点等，于是，后续的节点变更都直接体现在这个虚拟节点中，而不需要直接操作真实的`DOM`树，框架内部引擎会自动比较真实节点树和虚拟树，这个过程称作`diff`，从而高效地实现`DOM`的更新，之后再将虚拟`DOM`反映到真实的`DOM`树中，这个过程称作节点的“挂载”，而实现挂载操作的算法称为`patch`。
![虚拟DOM](https://cn.vuejs.org/assets/render-pipeline.CwxnH_lZ.png)

以下是`Vue`官方案例中一个虚拟节点的数据结构：
```js
const vnode = {
  type: 'div',
  props: {
    id: 'hello'
  },
  children: [
    /* 更多 vnode */
  ]
}
```
### diff算法

### 节点树patch

### tip:Vue中的异步DOM更新

### tip:Vue3.6引入Vapor概念

### tip:React的fiber架构下的时间切片


# 常见的直接DOM操作方法实例总结
## 原生js
原生`js`中提供最直观的`DOM`操作方法：
```js
let app = document.querySelector('#app')
app.classList.add('red')
app.classList.remove('red')
```

## Vue
声明式框架减少了直接的`DOM`操作，但仍然提供了一些直接操作`DOM`的方法，例如：
### extend构造器
通过`extend`构造器可以创建一个新的组件，然后通过`new`关键字实例化，最后通过`$mount`方法挂载到目标节点上
```js
const MyComponent = Vue.extend(Component);
const vm = new MyComponent();
vm.$mount('#app');
```
### Ref
通过`ref`接口可以获取到组件的`DOM`节点，从而实现对`DOM`节点的操作，一般适用于组件内部
```vue
<template>
  <input ref="inputRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue';

const inputRef = ref(null);

onMounted(() => {
  inputRef.value.focus();
});
</script>
```

## React
`React`中同样提供`Ref`钩子，用于获取组件的`DOM`节点
```jsx
import React, { createRef, useEffect } from 'react';

function App() {
  const boxRef = createRef();

  useEffect(() => {
    boxRef.current.style.color = 'green';
  }, []);

  return <div ref={boxRef}>Hello React</div>;
}

```
