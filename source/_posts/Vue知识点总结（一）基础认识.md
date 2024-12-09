---
title: Vue知识点总结（一）基础认识
date: 2024-11-19 10:07:53
tags: Vue 学习笔记
description: 对Vue基础概念以及基本指令的使用进行系统化总结
---

{% tip cogs %}
该系列文章主要基于官方Vue教程，对Vue使用及特性等方面做一个较为系统的总结
{% endtip %}
{% tip bell %}
官方文档链接[Vue.js](https://cn.vuejs.org/guide/introduction)
{% endtip %}

-----------------------

# Vue概述
## 框架的作用

{% note info flat %}
vue是一套构建用户界面的javascript框架，基于html，css，javascript构建，提供一套声明式的，组件化的编程模型。
{% endnote %}
前端开发框架的本质作用是简化开发，其优势是提供了一系列模块化语法，只需遵守这些语法就可以涵盖大量日常开发的需求，使用开发框架具有如下特点：

- 组件化开发：将代码拆分为独立的、可复用的组件，总而便于管理
- 状态管理：提供强大的数据管理流，从而帮助开发者管理数据状态
- 虚拟`DOM`：使用虚拟`DOM`构建`DOM`树，能够减少实际对`DOM`的操作次数，从而提高开发效率
- 响应式数据绑定：提供一系列响应式数据绑定`api`，实现数据与视图的同步
- 单页应用(`SPA`)：使用框架非常适合构建单页应用，可以在不刷新页面的前提下实现页面更新


{% note orange 'fas fa-wand-magic' flat %}
vue是一个框架，也是一个生态，符合大部分前端开发需求。
{% endnote %}

## 渐进式框架
### 什么是渐进式框架？
{% tip sync %}
渐进式框架即在开发过程中可以被渐进集成的框架，这意味着`Vue`项目将不需要在开始就规划好所有功能，而是可以慢慢根据需求进行集成，这对于逐渐膨胀的前端开发而言是非常有利的
{% endtip %}
### 渐进式框架的特点
>1. 无需构建步骤，渐进式增强静态html
>2. 在任何页面中作为`web components`嵌入
>3. 单页应用（`SPA`）
>4. 全栈、服务端渲染（`SSR`）
>5. `jamestack`、静态站点生成（`SSG`）
>6. 开发桌面端、移动端、WebGL，甚至是命令行终端中的界面

{% note primary modern %}
使用`Vue`可以渐进式地集成上述功能 
{% endnote %} 

## Vue代码风格
选项式`api`与组合式`api`

两种风格的`api`可以实现相同的功能，但是语言风格不同

{% note blue 'fas fa-gear' flat %}
选项式`api`适合解决需要不断拓展的需求
{% endnote %}

{% note purple 'fas fa-sitemap' flat %}
组合式`api`更适合解决完整的单页开发
{% endnote %}

两种`api`底层系统相同，都能解决大部分问题。

但两种`api`都有一个共性，即`Vue`项目不关注`dom`是怎么变化的，而是关注数据，并将数据同步到视图中

# Vue实例创建
## 创建一个vue应用
{% note primary flat %}
主流有两种脚手架工具，分别是`vue-cli`与`vite`，相对来说`vite`的构建效率要大于`vue-cli`，不过开发中两者都很常见
{% endnote %}

>1. 构建`Vue`项目
使用`vue-cli`构建
```
vue create my-new-vue-project
```
使用`Vite`构建
```
npm create/init vue@latest
```
2. 安装依赖，启动服务器
```
npm install
npm run serve/dev
```
3. 发布到生产环境
```
npm run build
```

## 构建一个vue实例
{% note primary flat %}
如果直接使用`CDN`而不是`npm`创建`vue`实例，可以直接通过`url`引入`createApp`,这种方式一般用于对`html`做静态提升
{% endnote %}

{% note warning flat %}
在早期也有通过`new Vue`创建`Vue`实例的，但引入了`createApp`后更倾向于这种方式
{% endnote %}

>1. 准备一个根模板容器
```vue
<div id="app">
  <button @click="count++">{{ count }}</button>
</div>
```
2. 创建导入构造对象
```vue
import { createApp } from 'vue'

const app = createApp({
  data() {
    return {
      count: 0
    }
  }
})

```
3. 挂载构造对象
```vue
app.mount('#app')
```

{% note warning flat %}
一个页面可以创建多个`vue`实例，如果你正在使用`Vue`来增强服务端渲`HTML`，并且只想要`Vue`去控制一个大型页面中特殊的一小部分，应避免将一个单独`Vue`应用实例挂载到整个页面上，而是应该创建多个小的应用实例，将它们分别挂载到所需的元素上去。
{% endnote %}

# Vue核心概念
`Vue`构建网页的具体流程如下:
>1. 实例创建:通过`createApp`创建一个`Vue`实例
2. 选项注入:使用选项或组合式api注入数据和方法
3. 创建虚拟`DOM`:模板编译生成虚拟`DOM`树
4. 挂载:将虚拟`DOM`树挂载到真实`DOM`树上
5. 渲染:数据变化时,通过`DOM diff`算法更新真实`DOM`树

## 选项注入
创建`Vue`实例后,下一步便是对选项进行注入,`Vue2`的选项式`api`即将数据抽象为具体的如`data`,`computed`,`method`等选项或方法进行注入`Vue`实例中
在`Vue3`中则是将数据封装进`setup`方法中,通过`ref`,`reactive`等来定义响应式状态

## 虚拟DOM
`vue`模板并不是真实的`DOM`，而是虚拟`DOM`，虚拟`DOM`本质上是一个字符串，`vue`内部会根据虚拟`DOM`生成真实`DOM`（`vnode`树），这个过程被称为`vue`渲染，通过虚拟`DOM`节点的对比修改数据，从而提高效率，`vue`渲染使用`render()`函数的返回值生成`vnode`，从而创建真实`DOM`

{% note info flat %}
虽然`Vue2`和`Vue3`整体构建方法类似,但`Vue3`中通过算法的优化大大提升了构建效率
{% endnote %}

# Vue特性
## 插值表达式
最基本的数据绑定形式,响应式双大括号中的值
```vue
<span>Message: {{ msg }} </span>
```

## 样式作用域 scoped
通过`hash`映射对组件样式进行约束
```
<style scoped>
```
{% note warning flat %}
样式作用域不仅影响当前组件,还会影响子组件的根元素
{% endnote %}

## 深层选择器 :deep()
处于`scoped`样式中的选择器如果想要做更“深度”的选择，也即：影响到子组件，可以使用`:deep()`这个伪类：
```css
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

## 组件递归
一个单文件组件可以通过它的文件名被其自己所引用。例如：名为 `FooBar.vue` 的组件可以在其模板中用 `<FooBar/>` 引用它自己
```js
<!-- Comment.vue -->
<template>
  <div>
    <p>{{ comment.text }}</p>
    <div v-if="comment.replies">
      <Comment v-for="reply in comment.replies" :key="reply.id" :comment="reply" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Comment',
  props: {
    comment: {
      type: Object,
      required: true
    }
  }
};
</script>
```

## 动态参数
动态参数允许你在模板中动态绑定事件或者方法，使用动态参数可以做到动态修改属性名！(不是属性的值)，具体实现方式是使用`[]`来绑定属性名
```js
<!--
注意，参数表达式有一些约束，
参见下面“动态参数值的限制”与“动态参数语法的限制”章节的解释
-->
<a v-bind:[attributeName]="url"> ... </a>

<!-- 简写 -->
<a :[attributeName]="url"> ... </a>
```
还可以绑定方法名
```js
<a v-on:[eventName]="doSomething"> ... </a>

<!-- 简写 -->
<a @[eventName]="doSomething"> ... </a>
```
{% note warning flat %}
使用动态参数时，需保证表达式的值为一个字符串且不支持`null`，此外，空格可引号都是不被允许的
{% endnote %}
# Vue基本指令
## v-html/v-text
{% tabs html-text %}
<!-- tab 详细信息@icon -->
- `v-text`用以动态设置元素文本内容
- `v-html`用以动态设置元素`innerhtml`,包括`DOM`元素
<!-- endtab -->
<!-- tab 语法参考@icon -->
```vue
<span v-text="msg"></span>
<!-- 等同于 -->
<span>{{msg}}</span>
```

```vue
<div v-html="html"></div>
```
<!-- endtab -->
{% endtabs %}
## v-show/v-if
{% tabs condition %}
<!-- tab 详细信息@icon -->
- 两者都用来控制元素的显示与隐藏
- `v-if`是真实地按条件渲染,即"真实地"控制元素的重建与销毁
- `v-show`则只是相当于控制元素的`display`属性为`none`,相当于从页面中移除,在`DOM`树中仍保有一席之地
- 因此,`v-show`用来控制需要经常变动的元素,而`v-if`处理变动较少的元素
<!-- endtab -->
<!-- tab 语法参考@icon -->
```vue
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

```vue
<h1 v-show="ok">Hello!</h1>
```
<!-- endtab -->
{% endtabs %}
{% note warning flat %}
还有一个老生常谈的问题了,就是`v-if`不能和`v-for`在一起使用,由于`v-if`比`v-for`的优先级更高。这意味着`v-if`的条件将无法访问到`v-for`作用域内遍历的值
{% endnote %}
## v-on
{% tabs on %}
<!-- tab 详细信息@icon -->
- 我们可以使用`v-on`指令 (简写为 @) 来监听`DOM`事件，并在事件触发时执行对应的 `JavaScript`
- `v-on`可以处理内联事件或方法事件
<!-- endtab -->
<!-- tab 语法参考@icon -->
```js
const count = ref(0)
<button @click="count++">Add 1</button>
<p>Count is: {{ count }}</p>
```

```js
const name = ref('Vue.js')

function greet(event) {
  alert(`Hello ${name.value}!`)
  // `event` 是 DOM 原生事件
  if (event) {
    alert(event.target.tagName)
  }
}

<button @click="greet">Greet</button>
```
<!-- endtab -->
<!-- tab 事件修饰符@icon -->
1. `.stop`:单击事件时停止传递
2. `.prevent`:提交表单时不会刷新页面,相当于`event.preventDefault()`
3. `.capture`:当事件涉及子组件穿透时优先处理父组件
4. `.self`:当事件的`event.target`指向自身(不来自子元素)时才触发
5. `.once`:点击事件最多触发一次
6. `.passive`:保证滚动事件的默认行为立即发生
   
{% note info flat %}
修饰符遵从链式调用原则
{% endnote %}

<!-- endtab -->
<!-- tab 按键修饰符@icon -->
1. `vue`为一些系统按键提供了别名,如`.enter`,`.delete`,`.space`,`.esc`,`.space`,`.up`,`.down`,`.left`,`.right`,`.ctrl`,`.alt`,`.shift`等
```js
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + 点击 -->
<div @click.ctrl="doSomething">Do something</div>
```
2. `.exact`修饰符:可使用`.exact`修饰符来指定当单独按键被按下时才触发事件
```js
<!-- 当按下 Ctrl 时，即使同时按下 Alt 或 Shift 也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 仅当按下 Ctrl 且未按任何其他键时才会触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 仅当没有按下任何系统按键时触发 -->
<button @click.exact="onClick">A</button>
```
3. 鼠标按键修饰符`.left`,`.right`,`.middle`
<!-- endtab -->
{% endtabs %}

## v-bind
{% tabs bind %}
<!-- tab 详细信息@icon -->
- `v-bind`,简写为`:`,在`vue`中用作数据绑定
- 常用作绑定类和内联样式或者对`vue`内置参数进行绑定,如`key`和`props`
- `v-bind`可以绑定数组,对象,支持一次绑定多个参数
<!-- endtab -->
<!-- tab 语法参考@icon -->
```js
const isActive = ref(true)
const hasError = ref(false)

<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>

//等同于

<div class="static active"></div>
```
```js
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```
<!-- endtab -->
{% endtabs %}

## v-for
{% tabs for %}
<!-- tab 详细信息@icon -->
- `v-for`用于基于数组来渲染一个列表
- 模板语法: `v-for = "(value,key?,index) in items"`
- 参数示意:`value`表示数组的值, `key`(可选)表示数组的键,`index`(可选)表示数组的索引
- 为`v-for`绑定一个唯一的`:key`来确保跟踪每个项
<!-- endtab -->
<!-- tab 语法参考@icon -->
```js
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})

<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```
<!-- endtab -->
{% endtabs %}

## v-model
{% tabs model %}
<!-- tab 详细信息@icon -->
- `v-model`本质是一个语法糖,用于简化将表单内容同步到`Javascript`中的相应变量这一步骤
- `v-model`会绑定文本类型,如`<input>`,`<textarea>`的`value`属性,并监听`input`事件
- `v-model`会根据文本类型自动调整绑定方式,例如,对`ckeckbox`可以绑定一个数组,用以存储所有多选的值
<!-- endtab -->
<!-- tab 原型拆解@icon -->
```js
<input
  :value="text"
  @input="event => text = event.target.value">

//将等同于

<input v-model="text">
```
<!-- endtab -->
<!-- tab 语法参考@icon -->
```js
const checkedNames = ref([])

<div>Checked names: {{ checkedNames }}</div>

<input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
<label for="jack">Jack</label>

<input type="checkbox" id="john" value="John" v-model="checkedNames" />
<label for="john">John</label>

<input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
<label for="mike">Mike</label>
```
<!-- endtab -->
<!-- tab 修饰符参数@icon -->
1. `.lazy`:`v-model`会在每次`change`事件触发后(文本框失去焦点,多选框选择等)更新数据
2. `.number`:把输入自动转化为数字,会在输入框有`type=number`时自动启用
3. `.trim`:自动去除用户输入两端的空格
<!-- endtab -->
{% endtabs %}

## 自定义指令
{% tabs self %}
<!-- tab 详细信息@icon -->
- 除了`Vue`内置的一系列指令外,`Vue`还允许你注册自定义的指令
- 在`<script setup>`语法糖中，任何以`v`开头的驼峰式命名的变量都可以被用作一个自定义指令,如`vFocus`即可以在模板中以 `v-focus`的形式使用
- 在没有`<script setup>`中，可以配置`derective`配置项定义自定义指令
- 可以使用`app.derective()`全局定义指令
- 自定义指令由一个包含生命周期钩子对象组成，预定义的钩子函数触发，根据内含的参数创建方法
<!-- endtab -->
<!-- tab 语法参考@icon -->
{% folding blue, 方法一(script setup) %}
```js
<script setup>
// 在模板中启用 v-focus
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```
{% endfolding %}
{% folding blue, 方法二（配置项） %}
```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // 在模板中启用 v-focus
    focus: {
      /* ... */
    }
  }
}
```
{% endfolding %}
{% folding blue, 方法三（全局注册） %}
```js
const app = createApp({})

// 使 v-focus 在所有组件中都可用
app.directive('focus', {
  /* ... */
})
```
{% endfolding %}
<!-- endtab -->
<!-- tab 指令钩子@icon -->
{% note warning flat %}
在`vue2`中会使用`insert()`表示绑定，用`update()`表示更新,这些在`vue3`中被替换成了生命周期钩子，便于记忆
{% endnote %}
```js
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode) {}
}
```
{% note primary flat %}
为简化自定义指令，由于大部分情况下自定义指令由`mounted`和`updated`触发,故简化形式可直接传入一个函数表示这两种情况
{% endnote %}
```js
app.directive('color', (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value
})
```
<!-- endtab -->
<!-- tab 钩子参数@icon -->
- `el`：指令绑定到的元素。这可以用于直接操作`DOM`。
- `binding`：一个对象，包含以下属性。
  - `value`：传递给指令的值。例如在`v-my-directive`="1 + 1" 中，值是 2。
  - `oldValue`：之前的值，仅在 `beforeUpdate` 和 `updated` 中可用。无论值是否更改，它都可用。
  - `arg`：传递给指令的参数 (如果有的话)。例如在 `v-my-directive:foo` 中，参数是 `"foo"`。
  - `modifiers`：一个包含修饰符的对象 (如果有的话)。例如在 `v-my-directive.foo.bar` 中，修饰符对象是 `{ foo: true, bar: true }`。
  - `instance`：使用该指令的组件实例。
  - `dir`：指令的定义对象。
- `vnode`：代表绑定元素的底层 VNode。

- `prevVnode`：代表之前的渲染中指令所绑定元素的`VNode`。仅在 `beforeUpdate` 和 `updated` 钩子中可用。
```js
<div v-example:foo.bar="baz">
//对于上述指令，binding参数为如下对象
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* `baz` 的值 */,
  oldValue: /* 上一次更新时 `baz` 的值 */
}
```
<!-- endtab -->
{% endtabs %}
