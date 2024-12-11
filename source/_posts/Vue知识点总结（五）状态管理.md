---
title: Vue知识点总结（五）状态管理
date: 2024-10-22 16:41:31
tags: Vue 学习笔记
description: Vue中状态管理库如pinia、Vuex的介绍
---

{% tip cogs %}
该系列文章主要基于官方Vue教程，对Vue使用及特性等方面做一个较为系统的总结
{% endtip %}
{% tip bell %}
Vue官方文档链接[Vue.js](https://cn.vuejs.org/guide/introduction)
Pinia官方文档链接[Pinia](https://pinia.vuejs.org/zh/getting-started.html)
{% endtip %}

-----------------------

# pinia实例创建
安装依赖：
```js
yarn add pinia
# 或者使用 npm
npm install pinia
```

创建一个`pinia`实例并将其注入`Vue`当中
```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

使用`Vue2`时，还需要格外引入一个插件`PiniaVuePlugin`
{% folding blue , Vue2引入pinia %}
```js
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  el: '#app',
  // 其他配置...
  // ...
  // 请注意，同一个`pinia'实例
  // 可以在同一个页面的多个 Vue 应用中使用。
  pinia,
})
```
{% endfolding %}


# store数据仓库
## Store是什么
`Store`（数据仓库）是一个保存业务状态和逻辑的实体，它并不存在于组件树中，而是一个独立存在的实体部分。换句话说，它承载着全局状态，存储在`store`中的数据面向每一个组件，即每一个组件都能够读取它，（就像全局注入`provide`），但它提供的功能要比注入更加丰富。

`Store`中有三个概念`state`、`getter`和`action`相当于选项式中的配置项`data`、`computed`和`methods`
## Store使用工作流
在全局将`pinia`注册为插件后，`pinia`就像`Vue`一样全局提供了一些`api`，使用`defineStore()`创建一个仓库，代码示例如下：
```js
import { defineStore } from 'pinia'

// 你可以任意命名 `defineStore()` 的返回值，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。
// (比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useAlertsStore = defineStore('alerts', {
  // 其他配置...
})
```
随后在要使用该仓库的组件中导入这个仓库，随后便可以在任意位置访问仓库了
```js
<script setup>
import { useCounterStore } from '@/stores/counter'
// 可以在组件中的任意位置访问 `store` 变量 ✨
const store = useCounterStore()
</script>
```
{% note warning flat %}
每个仓库需要一个独一无二的`id`，可以将其作为第一个参数传入，也可以写作配置项的形式，第二个参数接受两个值，`option`对象或`setup`函数
{% endnote %}
{% note orange 'fas fa-wand-magic' flat %}
仓库返回函数命名建议使用`useXXXStore`的形式，以便产生习惯性的用法
{% endnote %}
## Option Store
与`Vue`的选项式`api`类似，我们可以传入一个带有`state`、`getter`和`action`的`Option`对象，代码示例：
```js
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0, name: 'Eduardo' }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```
这种方式与`Vuex`非常相似，适合做仓库间的迁移，同时`option api`也更加简单直观

## Setup Store
`Store`中也支持使用`setup`创建组合式`api`的形式，使用这种方式需要传入一个函数，并返回一个我们想暴露的对象
```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```
>- `ref()`就是`state`属性（`state`自带响应式，一般情况下都需要响应式数据）
- `computed()`就是 `getter`
- `function`就是`actions`

{% note info flat %}
在仓库中也可以使用全局提供的属性，比如用`useRoute()`调取页面路由，用`infect`获取注入的数据
{% endnote %}

## storeToRefs
可以直接对仓库中的数据进行解构，但一旦解构后数据就会失去响应性，故需要使用`storeToRefs()`为其赋予响应性
```js
<script setup>
import { storeToRefs } from 'pinia'
const store = useCounterStore()
// `name` 和 `doubleCount` 是响应式的 ref
// 同时通过插件添加的属性也会被提取为 ref
// 并且会跳过所有的 action 或非响应式 (不是 ref 或 reactive) 的属性
const { name, doubleCount } = storeToRefs(store)
// 作为 action 的 increment 可以直接解构
const { increment } = store
</script>
```

# store配置项
## 仓库ID
不要忘记每个仓库的必备标识符
```js
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  // 其他配置项...
});
```
## State
`state`是每个仓库的核心，在`state`中预定义能代表整个仓库的数据
```js
import { defineStore } from 'pinia'

const useStore = defineStore('storeId', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断出它们的类型
      count: 0,
      name: 'Eduardo',
      isAdmin: true,
      items: [],
      hasChanged: true,
    }
  },
})
```
## getter
`getter`用于存储计算属性的状态，往往依赖于`state`中的值
```js
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  // 其他配置项...
}); 
```
{% note warning flat %}
`store`中的`this`指针指向整个`store`实例，故可以通过`this`来访问仓库中的其他数据
{% endnote %}
## actions
相当于仓库中的方法
{% note info flat %}
`pinia`中的`actions`中定义的方法可以自然处理异步函数
{% endnote %}
```js
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++;
    },
  },
  // 其他配置项...
});
```

# 辅助函数
`pinia`中还提供了一系列的辅助函数用来帮你完成一些任务
## mapState
`mapState`是用于映射仓库状态(`state`)的方法，使得组件能够直接访问仓库的状态
```js
import { mapState } from 'pinia';
import { useCounterStore } from '../stores/counter';

export default {
  setup() {
    const counterStore = useCounterStore();

    // 使用 mapState 映射状态
    const { count } = mapState(counterStore, ['count']);

    return { count };
  },
};
```
## mapGetter
`mapGetter`用于映射计算属性
```js
import { mapGetters } from 'pinia';
import { useCounterStore } from '../stores/counter';

export default {
  setup() {
    const counterStore = useCounterStore();

    // 使用 mapGetters 映射计算属性
    const { doubleCount } = mapGetters(counterStore, ['doubleCount']);

    return { doubleCount };
  },
};
```
## mapActions
同理，`mapActions`用于映射方法
```js
import { mapActions } from 'pinia';
import { useCounterStore } from '../stores/counter';

export default {
  setup() {
    const counterStore = useCounterStore();

    // 使用 mapActions 映射动作
    const { increment } = mapActions(counterStore, ['increment']);

    return { increment };
  },
};
```