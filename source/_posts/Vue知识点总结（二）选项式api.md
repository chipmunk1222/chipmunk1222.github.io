---
title: Vue知识点总结（二）选项式api
date: 2024-10-22 16:41:31
tags: Vue 学习笔记
description: Vue选项式api专栏分析
---

{% tip cogs %}
该系列文章主要基于官方Vue教程，对Vue使用及特性等方面做一个较为系统的总结
{% endtip %}
{% tip bell %}
官方文档链接[Vue.js](https://cn.vuejs.org/guide/introduction)
{% endtip %}

-----------------------

# 选项式api简述
{% note primary flat %}
`Vue`是一门面向数据的框架，这点在选项式`api`中尤为明显
{% endnote %}
选项式`api`是`Vue2`中定义组件的一种方法，它采用对象语法，将组件的各项功能划分为不同的选项，如`data`,`computed`,`methods`等，使开发者用配置对象来定义组件的状态，行为和属性
>选项式的优点：直观易懂，数据、方法等选项清晰分离，易于维护和管理
选项式的缺点：随着组件复杂度的增加，选项式api会逐步变得难以维护

# 选项式api配置项
{% tip sync %}
配置项是选项式api的核心，通过将配置项注入组件实例，数据才能在组件中被顺利执行
{% endtip %}
## el
{% tabs el %}
<!-- tab 详细描述@icon -->
`el`配置项用来指定`Vue`实例要挂载的`DOM`元素，可以使用`$el`实例成员访问挂载的根元素

{% note info flat %}
一般在局部创建`Vue`实例的时候使用，效果等同于使用`mount()`绑定根元素
{% endnote %}
{% note warning flat %}
`mount()`用于在`Vue3`中`createApp()`创建的`Vue`实例挂载，在`Vue2`中使用`$mount()`进行挂载，`$mount()`在`Vue3`中已被废弃
{% endnote %}
<!-- endtab -->
<!-- tab 示例代码@icon -->
```js
el:'#app'
```
<!-- endtab -->

{% endtabs %}

## data()
{% tabs data %}
<!-- tab 详细描述@icon -->
在`Vue`中使用使用`data()`配置项创建成员属性，`data()`本身是个函数，需要`return`返回一个普通`js`对象
{% note primary flat %}
`data`中的数据本身应使用`$data`实例成员访问属性，但由于配置项中默认给了一个代理，因此可以直接访问具有响应式的数据
{% endnote %}
<!-- endtab -->
<!-- tab 实例代码@icon -->
```js
export default {
  data() {
    return { a: 1 }
  },
  created() {
    console.log(this.a) // 1
    console.log(this.$data) // { a: 1 }
  }
}
```
<!-- endtab -->
{% endtabs %}

## computed
{% tabs computed %}
<!-- tab 详细描述@icon -->
- `computed`配置项用来保存一些需要依赖其他属性做响应式修改的属性
- `computed`创建属性的方法和函数类似，只不过可以在属性中使用`get()`和`set()`自定义修改方式

{% note orange 'fas fa-wand-magic' flat %}
`computed`vs`methods`:由`computed`配置项定义的属性只有在原始数据进行修改时才会被重复调用，这在面对一些需要重复使用的数据时能够极大地节约性能
{% endnote %}

<!-- endtab -->
<!-- tab 示例代码@icon -->
```js
 computed: {
    // 一个计算属性的 getter
    publishedBooksMessage() {
      // `this` 指向当前组件实例
      return this.author.books.length > 0 ? 'Yes' : 'No'
    }
  }
```
<!-- endtab -->
{% endtabs %}
## methods
{% tabs methods %}
<!-- tab 详细描述@icon -->
- `methods`用于创建`vue`实例上的事件处理函数，使用方式和`computed`类似，使用`v-on`事件调用
- 在`methods`中使用`this`指针访问实例属性，使用`$event`示例成员调用事件自身，使用默认的`event`参数访问实例方法，`event.target`则表示选中的`dom`元素本身
<!-- endtab -->
<!-- tab 代码示例@icon -->
```js
data() {
  return {
    name: 'Vue.js'
  }
},
methods: {
  greet(event) {
    // 方法中的 `this` 指向当前活跃的组件实例
    alert(`Hello ${this.name}!`)
    // `event` 是 DOM 原生事件
    if (event) {
      alert(event.target.tagName)
    }
  }
}

<button @click="greet">Greet</button>
```
<!-- endtab -->
{% endtabs %}
## 生命周期钩子
{% tabs mounted %}
<!-- tab 详细描述@icon -->
生命周期钩子是一系列钩子函数，用于处理在页面创建不同执行阶段的相关操作
{% folding blue, 点击查看生命周期执行图示 %}
![生命周期图示](/img/src/lifecycle.png "生命周期图示")
{% endfolding %}
<!-- endtab -->
<!-- tab 生命周期api一览@icon -->
1. `beforeCreate`：在组件实例初始化完成后调用，只解析了`props`传入的数据和`setup()`钩子
2. `created`：处理完数据部分，如`data`、`computed`、`methods`、`watch`，但为挂载，因此还不可调用`$el`
3. `beforeMount`：组件完成响应式的设置，但还没有创建`DOM`节点
4. `mounted`：组件被挂载后调用
5. `beforeUpdata`：在`DOM`节点更新之前调用
6. `updated`:任何`DOM`节点更新后调用，可使用`nextTick()`记录首次更新的结果
7. `beforeUnmount`:组件被卸载前调用，调用时组件还具有所有功能
8. `unmounted`：组件实例被卸载后调用，可在这个钩子中清理如计时器或事件监听器造成的影响
<!-- endtab -->
<!-- tab 示例代码@icon -->
```js
export default {
  mounted() {
    console.log(`the component is now mounted.`)
  }
}
```
<!-- endtab -->
{% endtabs %}

## watch侦听器
{% tabs watch %}
<!-- tab 详细描述@icon -->
- `watch`侦听器用于监听数据变化，当监听的数据变化时，执行一个特定的函数
- `watch`支持简化写法，即写一个监听属性的同名方法，方法中默认传入`old`和`new`两个参数用来描述数据变化前后的两个状态
- `watch`完整写法需要提供一个同名对象，其中可添加一些配置项执行格外操作
- 需要侦听嵌套对象内的属性时，简写写法`["obj.a"](new,old)`，完整写法`"obj.a:{}"`
- 可使用`this.$watch(value,(new,old)=>{})`创建一个即时监听器，参数配置和定时器类型
<!-- endtab -->
<!-- tab 配置项@icon -->

>`handler(new,old)`：完整写法中的触发函数
`deep`：表示深度监听，如果属性嵌套很深，则使用深度监听会损耗性能
`immediate`：表示侦听器创建时立即执行1次函数
`once`：表示变化只执行一次
<!-- endtab -->
<!-- tab 代码示例@icon -->
```js
export default {
  data() {
    return {
      message: 'Hello, Vue!',
      count: 0
    };
  },
  watch: {
    message(newVal, oldVal) {
      console.log(`message changed from ${oldVal} to ${newVal}`);
    },
    count: {
      handler(newVal, oldVal) {
        console.log(`count changed from ${oldVal} to ${newVal}`);
      },
      immediate: true,
      deep: true
    }
  }
};
```
<!-- endtab -->
{% endtabs %}

## mixins混入
{% tabs mixins %}
<!-- tab 详细描述@icon -->
- `mixins`用于在代码中抽离一些公共部分，来实现组件间的共享逻辑，从而优化工程结构
- 需要一个外部组件导出一个需要混合的公共项，在内部组件中调用`mixins`配置项，传递的部分需要一个对象，可以直接传递对象，或者使用函数`return`一个对象(这种方式可以传递指定参数)

{% note warning flat %}
`mixins`覆盖顺序取决于配置项在实例中的位置，`Vue3`中虽然保留了`mixins`的调用，但由于`Vue3`中可以手动抽离逻辑体，故在`Vue3`中这个配置项已经相当少见
{% endnote %}
<!-- endtab -->
<!-- tab 示例代码@icon -->
{% folding blue, Mixin文件 %}
```js
// myMixin.js
export const myMixin = {
  data() {
    return {
      sharedData: 'This is shared data'
    };
  },
  created() {
    console.log('Mixin created hook called');
  },
  methods: {
    sharedMethod() {
      console.log('This is a shared method');
    }
  }
};
```
{% endfolding %}
{% folding blue, 调取文件 %}
```js
<!-- ComponentA.vue -->
<template>
  <div>
    <h1>Component A</h1>
    <p>{{ sharedData }}</p>
    <button @click="sharedMethod">Call Shared Method</button>
  </div>
</template>

<script>
import { myMixin } from './myMixin';

export default {
  mixins: [myMixin],
  data() {
    return {
      componentAData: 'Data specific to Component A'
    };
  },
  created() {
    console.log('Component A created hook called');
  },
  methods: {
    componentAMethod() {
      console.log('Method specific to Component A');
    }
  }
};
</script>
```
{% endfolding %}

<!-- endtab -->
{% endtabs %}

# 选项式api的组件化与参数传递
在`vue`中是以一个个组件构成的整个项目，组件以其功能的区别进行划分，而不同功能之间往往需要进行数据交互，因此组件间的参数传递就必不可少，这节主要描述组件间参数传递的多种方式
## 组件注册
{% tabs components %}
<!-- tab 详细描述@icon -->
- 一个`Vue`组件在使用前必须先被“注册”，这样`Vue`才能在渲染时找到对应实现
- 在选项式`api`中组件注册需要使用`components`配置项，分为局部注册和全局注册两种
- 全局注册支持链式注册，但全局注册后，没被使用的组件不会被`tree shinking` 

{% note info flat %}
组件建议使用大驼峰命名法，也可以使用短横线命名法，两者会互相转化
{% endnote %}
{% note orange 'fas fa-wand-magic' flat %}
使用`name`配置项可以为组件自身命名，组件自身可以用名字调用自身
{% endnote %}
<!-- endtab -->
<!-- tab 代码示例@icon -->
{% folding blue, 全局注册 %}
```js
import MyComponent from './App.vue'

app.component('MyComponent', MyComponent)
```
{% endfolding %}
{% folding blue, 局部注册 %}
```js
<script>
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
}
</script>

<template>
  <ComponentA />
</template>
```
{% endfolding %}
<!-- endtab -->
{% endtabs %}
## Props配置项
{% tabs props %}
<!-- tab 详细描述@icon -->
- `props`是组件间通信的最常见的方式，使用时需要在子组件中显示声明它所需要接收的`props`，在父组件中以参数的方式进行传递
- `props`显示声明参数时可以使用字符串数组或对象的形式，并且可以配置校检参数对传递的数据进行校检
- 建议使用小驼峰命名法，小驼峰和短横线命名法会相互转化

{% note info flat %}
参数传递支持动态绑定与直接传递，一般动态绑定传递会比较常见
{% endnote %}
{% note danger flat %}
props使用单向数据流进行数据传递，因此需要避免在子组件中修改传递的数据的情况
{% endnote %}
<!-- endtab -->
<!-- tab 校检参数@icon -->
- `type`:表示确定数据类型
- `required`:指定数据是否必须
- `default`:为数据指定默认值
- `validator`:自定义函数校验，具有默认参数`value`，以`return`结果判断校验是否通过
<!-- endtab -->
<!-- tab 代码示例@icon -->
```js
// 简写
export default {
  props: ['foo'],
}

// 详细写法
export default {
  props: {
    title: String,
    likes: Number
  }
}

// 添加校验项
propD: {
  type: [String, null],
  required: true
},
```
<!-- endtab -->
{% endtabs %}
## $emit事件
{% tabs emit %}
<!-- tab 详细描述@icon -->
通过上一节`props`的介绍中，我们了解`props`配置项符合单向数据流，那么如果子组件要传递信息给父组件要怎么做呢，`$emit`正是为解决子向父传递数据的问题
- 子组件使用`$emit`抛出事件，父组件中使用`v-on`监听事件触发对应函数
- 抛出事件第一个参数为事件名(必填)，第二个参数可以设置传递的参数
- 组件内部可以声明`emits`配置项来显示声明将要抛出的事件,配置项指出数组字符串或对象语法，在完整的对象语法中可以进行事件校验

{% note warning flat %}
在`html`模板中可直接使用`$emit`抛出事件，在选项方法中需要使用`this.$emit`
{% endnote %}
{% note orange 'fas fa-wand-magic' flat %}
在参数中可传入函数，这个函数可以当作回调函数触发
{% endnote %}
<!-- endtab -->
<!-- tab 代码示例@icon -->
```js
// 模板中使用
<button @click="$emit('someEvent')">Click Me</button>
// 配置项中使用
export default {
  methods: {
    submit() {
      this.$emit('someEvent')
    }
  }
}
```


{% folding blue , 配置项写法示例 %}
```js
// 简化写法
export default {
  emits: ['inFocus', 'submit']
}

// 完整写法加校验
export default {
  emits: {
    // 没有校验
    click: null,

    // 校验 submit 事件
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
}
```
{% endfolding %}

<!-- endtab -->
{% endtabs %}
## 组件间的v-model
{% tabs vmodel %}
<!-- tab 详细描述@icon -->
在上两小节中我们了解了从父组件向子组件单向传递的`props`以及由子组件向父组件单向抛出的`$emit`事件，那么有没有将数据双向绑定的方式呢？有，答案就是`v-model`

`v-model`的本质是在父组件中动态绑定子组件的某个传递参数，这意味着在子组件中仍需定义`props`配置项和`$emit`事件处理函数来接收和发送数据，`v-model`只是在父组件中对两者合并的简写
{% note info flat %}
在组合式`api`中引入了`defineModel`宏，可以在子组件中也简化写法
{% endnote %}

在基础认识篇我们了解了`v-model`对表单元素的双向绑定，这种绑定同时也可以使用在组件上，而两者拆解后格式也差不多
- `v-model`是一个语法糖，是对传递数据以及修改后动态改变数据的合并
- `v-model`绑定的数据也支持修饰符
<!-- endtab -->
<!-- tab 原型拆解@icon -->
首先，回顾下原生元素中`v-model`的用法
```js
<input v-model="searchText" />
// 等同于
<input
  :value="searchText"
  @input="searchText = $event.target.value"
/>
```
在组件中的拆解
```js
<CustomInput
  :model-value="searchText"
  @update:model-value="newValue => searchText = newValue"
/>
```
`:model-value`为动态绑定的`props`,`update:model-value`是抛出的方法名，数据由父组件中的`searchText`动态控制
{% note info flat %}
其中，`model-value`只是绑定的参数名，可以修改为任意值，比如`v-model:first-name="first"`则表示双向绑定`first-name`，用次方式可以同时绑定多个值
{% endnote %}
{% note orange 'fas fa-wand-magic' flat %}
当然，在组件中修改相应的抛出事件可以修改绑定规则，但一般不建议这么做
{% endnote %}
<!-- endtab -->
<!-- tab 代码示例@icon -->
```js
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>

<script>
export default {
  props: {
    firstName: String,
    lastName: String
  },
  emits: ['update:firstName', 'update:lastName']
}
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```
<!-- endtab -->
{% endtabs %}
## slot插槽
{% tabs slot %}
<!-- tab 详细描述@icon -->
在调用组件时，我们常常能发现一个问题，即组件中的所有内容都是写死的，如果我仅仅需要修改组件的一部分将变得相当困难，于是，便有了插槽`slot`，插槽的作用是方便我们自定义组件内部内容，从而增加组件的可延展性
- 插槽分为基本插槽、具名插槽、作用域插槽
- 插槽中可填入默认内容，插槽添加name参数变为具名插槽，嵌入时，没有用`<template>`指定名称则进入默认的`default`插槽中
- `$slots`实例成员中存放所有定义的插槽

{% note warning flat %}
在父组件中使用插槽时，无法访问子组件的作用域，为此可以使用作用域插槽进行数据传递
{% endnote %}
<!-- endtab -->
<!-- tab 详解插槽@icon -->
1. 基本插槽：在子组件中使用`<slot></slot>`指定插槽位置，在父组件中嵌入`html`语句以填充
{% folding blue , 基本插槽语法 %}
```js
// 子组件
<template>
  <div>
    <h1>我是子组件</h1>
    <slot></slot> <!-- 这里是插槽 -->
  </div>
</template>

<script>
export default {
  name: 'MyComponent'
};
</script>
// 父组件
<template>
  <div>
    <MyComponent>
      <p>这段文本将被插入到子组件的插槽中</p>
    </MyComponent>
  </div>
</template>

<script>
import MyComponent from './MyComponent.vue';

export default {
  components: {
    MyComponent
  }
};
</script>
```
{% endfolding %}

2. 具名插槽：用于区分多个插槽而诞生，用`v-slot:`绑定名称，简写为`#`，没有绑定则默认绑定`default`插槽
{% folding blue , 具名插槽语法 %}
```js
// 子组件
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>

// 父组件
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```
{% endfolding %}
3. 条件插槽：`$slots`示例成员中存放所有定义的插槽，可根据`$slots`配合`v-if`来判断插槽存在与否并追加渲染内容
{% folding blue , 条件插槽语法 %}
```js
<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <div v-if="$slots.default" class="card-content">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```
{% endfolding %}
4. 动态插槽：可以绑定动态参数以动态渲染插槽
{% folding blue , 动态插槽语法 %}
```js
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- 缩写为 -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```
{% endfolding %}
5. 作用域插槽：用来解决子组件向父组件传递数据的问题，在子组件中像`props`一样传递数据，在父组件中就可以通过一个参数接收数据
{% folding blue , 作用域插槽语法 %}
```js
// 子组件
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
// 父组件
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```
{% endfolding %}
<!-- endtab -->
{% endtabs %}
## 跨层级消息传递
{% tabs provide %}
<!-- tab 详细描述@icon -->
在上文我们了解了父子组件传递数据时会使用`props`,但是`props`只支持父组件向子组件传递数据，如果组件树层次很复杂，那么使用`props`的逐级传递会非常麻烦，因此引入了`provide`和`inject`用于解决数据的深层次传输问题
- 父级组件使用`provide`配置项提供数据，提供一个对象或者使用函数方式返回一个对象
- 后代组件使用`inject`配置项接收数据，使用方式等同于`props`，且注入的数据在`data()`渲染完之前就会获取
- 可以自定义注入的本地名称或者指定获取依赖的来源
- 在应用层可使用`app.provide(name,value)`提供全局依赖

{% note warning flat %}
provide提供的依赖默认不是响应式的，若需将其变成响应式，需要使用computed()api
{% endnote %}
{% note danger flat %}
在`vue2`中还有使用事件总线`$on`、`$bus`事件总线的方式进行跨层级消息传输的，但在`vue3`中这种方式已被废弃
{% endnote %}
<!-- endtab -->
<!-- tab 代码示例@icon -->
`provide`提供数据的两种方式
{% folding blue , 使用provide提供依赖 %}
```js
// 使用对象提供
export default {
  provide: {
    message: 'hello!'
  }
}

// 使用函数提供
export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    // 使用函数的形式，可以访问到 `this`
    return {
      message: this.message
    }
  }
}
```
{% endfolding %}

`inject`注入的简写和完整写法
{% folding blue , 使用inject获取依赖 %}
```js
// 简写
export default {
  inject: ['message'],
  data() {
    return {
      // 基于注入值的初始数据
      fullMessage: this.message
    }
  }
}

// 完整写法
export default {
  // 当声明注入的默认值时
  // 必须使用对象形式
  inject: {
    message: {
      from: 'message', // 当与原注入名同名时，这个属性是可选的
      default: 'default value'
    },
    user: {
      // 对于非基础类型数据，如果创建开销比较大，或是需要确保每个组件实例
      // 需要独立数据的，请使用工厂函数
      default: () => ({ name: 'John' })
    }
  }
}
```
{% endfolding %}

响应式依赖`provide`
{% folding blue , 完整代码 %}
```js
import { computed } from 'vue'

export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    return {
      // 显式提供一个计算属性
      message: computed(() => this.message)
    }
  }
}
```
{% endfolding %}
<!-- endtab -->
{% endtabs %}
## Attribute透传  
{% tabs attribute %}
<!-- tab 详细描述@icon -->
透传指的是一种特性，即当在组件上的属性没有被声明为`props`或`emits`时，这个属性会自动加到组件内部的根节点上，比如写入`class`，这个`class`找不到对应的`props`用于接收，那它就会在组件内部加上这个`class`类,`v-on`的事件也是同理
- `$attrs`实例对象用以接收所有透传的属性
- 可在组件内部用`v-bind='$attrs'`指定绑定透传的元素
- 如果组件内部有多个根节点，则必须指定绑定透传对象，否则将会报错
<!-- endtab -->
<!-- tab 代码示例@icon -->
```js
// 单根节点绑定
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">Click Me</button>
</div>

// 多根节点绑定
<CustomLayout id="custom-layout" @click="changeValue" />

<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```
<!-- endtab -->
{% endtabs %}
## ref组件实例获取
{% tabs ref %}
<!-- tab 详细说明@icon -->
`ref`是一个特殊的属性，它允许在一个`DOM`元素或子组件实例被挂载后直接获取它的引用，`$ref`中存储着所有`ref`绑定的值，通过`ref`调用后，我们可以直接访问组件实例，并执行相应行为，例如在父组件中控制子组件的函数，`ref`还有如下特性
- `ref`绑定`v-for`时，相应引用中包含的是一个数组，但值得注意的是`ref`并不保证数组顺序相同，故尽量不要使用
- 通过子组件的`expose`选项可以显示声明可以被暴露到父组件的方法或属性，由此确保安全性
<!-- endtab -->
<!-- tab 代码示例@icon -->
```js
// 父组件调用ref
<script>
import Child from './Child.vue'

export default {
  components: {
    Child
  },
  mounted() {
    // this.$refs.child 是 <Child /> 组件的实例
  }
}
</script>

<template>
  <Child ref="child" />
</template>


// 子组件确认暴露对象
export default {
  expose: ['publicData', 'publicMethod'],
  data() {
    return {
      publicData: 'foo',
      privateData: 'bar'
    }
  },
  methods: {
    publicMethod() {
      /* ... */
    },
    privateMethod() {
      /* ... */
    }
  }
}
```
<!-- endtab -->
{% endtabs %}

# 总结
本文以选项式`api`的核心**配置项**为标准详细描述了日常中使用选项式`api`会遇到的绝大部分场景，其中主要包括三部分内容，分别是基础选项、组件选项、参数传递选项，其中，基础选项中包括`el`、`data()`、`computed`、`methods`、生命周期钩子、侦听器`watch`以及混入`mixins`，组件选项中包括`components`注册组件，组件透传`attribute`的特性以及`slot`插槽对组件化的完善，另外还有通过`ref`进行组件调用，引入了`expose`配置项声明暴露的属性。最后的参数传递选项，包括`props`和`emits`两个最基本的单向数据传递选项，介绍了组件中的`v-model`语法糖，此外，还有`provide`和`inject`两个选项，完善了组件数据传递的场景