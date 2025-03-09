---
title: Vue知识点总结（三）组合式api
date: 2024-10-22 16:41:31
tags: 
  - Vue 
  - 学习笔记
  - 组合式api
description: Vue选项式api专栏分析
mathjax: true
---


{% tip cogs %}
该系列文章主要基于官方Vue教程，对Vue使用及特性等方面做一个较为系统的总结
{% endtip %}
{% tip bell %}
官方文档链接[Vue.js](https://cn.vuejs.org/guide/introduction)
{% endtip %}

-----------------------

# 效率提升

{% note primary flat %}
写这篇文章时突然意识到一点，`Vue3`和`Vue2`只是版本号差别，然而我们常常会把`Vue2`和选项式`api`绑定，把`Vue3`绑定组合式`api`,这其实是一个单纯的误区，因为Vue3几乎仍然完全兼容选项式`api`，所以`Vue`版本和`api`的使用方式是两个完全独立的概念
{% endnote %}

{% tip success %}
澄清了版本并不决定api的使用方式，我们就可以继续本节话题了，Vue3的更新带来了许多构建效率上的提升，在这种提升下，Vue3的客户端构建效率相比Vue2提升了约1.3~2倍，SSR构建效率提升了2~3倍，下面将给出具体的效率提升方法
{% endtip %}

## 静态提升
先来回顾下`Vue`渲染的机制，我们都知道`Vue`渲染节点靠的是虚拟`DOM`，也就是构建`vnode`，当`render`函数运行时会遍历整个`DOM`树，并据此构建真实的`DOM`树，这个过程被称为"挂载"，而当某个节点发生变化，渲染器会比较虚拟`DOM`树并找出它们间的差别，这个过程被称为"更新"
{% folding blue , 点击查看模板渲染流程图 %}
![虚拟DOM渲染](/img/src/render.png "虚拟DOM渲染")
{% endfolding %}

下面来讲讲什么是静态提升方法，首先我们要知道什么是静态元素，所谓静态元素就是那些固定写死在模板中的元素，这些元素不会在页面中响应式地发生变化，因此，我们不需要实时监听这些元素，这样就能节省下比对这些节点的消耗
{% tabs static %}
<!-- tab 详情示例@icon -->
```js
<div>
  <div>foo</div> <!-- 需提升 -->
  <div>bar</div> <!-- 需提升 -->
  <div>{{ dynamic }}</div>
</div>
```

这段代码中`foo`和`bar`两个`div`都是完全静态的，因此没有必要在渲染时重新比对它们，`Vue`编辑器会自动将这两个`DOM`节点提取到`render`函数之外，从而避免重复比对
<!-- endtab -->
<!-- tab 源码分析@icon -->
```js
import { createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    _cache[0] || (_cache[0] = _createElementVNode("div", null, "foo", -1 /* HOISTED */)),
    _createCommentVNode(" hoisted "),
    _cache[1] || (_cache[1] = _createElementVNode("div", null, "bar", -1 /* HOISTED */)),
    _createCommentVNode(" hoisted "),
    _createElementVNode("div", null, _toDisplayString(_ctx.dynamic), 1 /* TEXT */)
  ]))
}

// Check the console for the AST
```
从`Vue`源码中我们可以看到`foo`和`bar`两个`div`节点被添加了格外参数`-1`用以表示其被提取到渲染函数之外，而动态节点`dynamic`则被标识为`1`表示其是文本类型
<!-- endtab -->
{% endtabs %}

## 动态标记更新（patch flag）
在静态提升中我们了解到了对于静态节点`Vue`编译器会将其提出到渲染函数之外，其实现方法是创建节点时添加一个参数，比如`-1`就标识静态提升

然而把参数仅用作判断节点是否为静态节点是否有些太浪费了呢，实际上这个参数的用途确实不止于此，参数可以标识更多信息，比如动态绑定的类、`Props`参数，甚至一个片段，根据检查这个参数，`Vue`编辑器就知道在生成渲染函数时要检查哪些而可以忽略哪些

最后这些动态标记方法是根据位运算赋予的参数，因为位运算可以最大化提升算法效率~~(这就是细节，蚊子腿也给你抠出来)~~
{% tabs patchflag %}
<!-- tab 示例详情@icon -->
```js
<!-- 仅含 class 绑定 -->
<div :class="{ active }"></div>

<!-- 仅含 id 和 value 绑定 -->
<input :id="id" :value="value">

<!-- 仅含文本子节点 -->
<div>{{ dynamic }}</div>
```
在这个例子中，分别有三种类型的动态绑定方法，第一个是`class`类，第二个是`Props`的参数，第三个则是动态插值，而它们也将对于不同的参数
<!-- endtab -->
<!-- tab 源码分析@icon -->
```js
import { normalizeClass as _normalizeClass, createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    _createElementVNode("div", {
      class: _normalizeClass({ active: _ctx.active })
    }, null, 2 /* CLASS */),
    _createElementVNode("input", {
      id: _ctx.id,
      value: _ctx.value
    }, null, 8 /* PROPS */, ["id", "value"]),
    _createElementVNode("div", null, _toDisplayString(_ctx.dynamic), 1 /* TEXT */)
  ], 64 /* STABLE_FRAGMENT */))
}

// Check the console for the AST
```
从`Vue`源码中我们可以看到，`class`对应的参数是`2`，`props`为`8`，而动态插值对应文本标识为`1`，此外还可以发现，最外层还有一个参数`64`,这表示多根节点代码段，这个参数说明这个代码段的结构将不会发生改变
<!-- endtab -->
<!-- tab 参数一览@icon -->
这里的参数表表示可以被识别的动态类型种类，详情见[patchflag参数表](https://github.com/vuejs/core/blob/main/packages/shared/src/patchFlags.ts#L130C3-L130C13)
```js
export const PatchFlagNames: Record<PatchFlags, string> = {
  [PatchFlags.TEXT]: `TEXT`,
  [PatchFlags.CLASS]: `CLASS`,
  [PatchFlags.STYLE]: `STYLE`,
  [PatchFlags.PROPS]: `PROPS`,
  [PatchFlags.FULL_PROPS]: `FULL_PROPS`,
  [PatchFlags.NEED_HYDRATION]: `NEED_HYDRATION`,
  [PatchFlags.STABLE_FRAGMENT]: `STABLE_FRAGMENT`,
  [PatchFlags.KEYED_FRAGMENT]: `KEYED_FRAGMENT`,
  [PatchFlags.UNKEYED_FRAGMENT]: `UNKEYED_FRAGMENT`,
  [PatchFlags.NEED_PATCH]: `NEED_PATCH`,
  [PatchFlags.DYNAMIC_SLOTS]: `DYNAMIC_SLOTS`,
  [PatchFlags.DEV_ROOT_FRAGMENT]: `DEV_ROOT_FRAGMENT`,
  [PatchFlags.CACHED]: `HOISTED`,
  [PatchFlags.BAIL]: `BAIL`,
}
```
<!-- endtab -->
{% endtabs %}

## 树结构打平（block tree）
从上述两个小点中我们可以看到返回虚拟代码实际上使用一个特殊的函数`createElementBlock`所创建的，这个创建规则其实就是“区块化”创建，使用了一遍该函数，则称这是一块“区块”，每一块“区块”都会跟踪其中的动态元素，返回的结果将是只包含一个动态元素的数组，渲染时只需要遍历这颗“打平”的树而非整颗虚拟`DOM`树，由此大大提高编译效率
{% tabs blocktree %}
<!-- tab 示例详情@icon -->
```js
<div> <!-- root block -->
  <div>...</div>         <!-- 不会追踪 -->
  <div :id="id"></div>   <!-- 要追踪 -->
  <div>                  <!-- 不会追踪 -->
    <div>{{ bar }}</div> <!-- 要追踪 -->
  </div>
</div>
```
以上是一个区块
<!-- endtab -->
<!-- tab 结果展示@icon -->
```js
div (block root)
- div 带有 :id 绑定
- div 带有 {{ bar }} 绑定
```
上述案例将与这个结果打平
<!-- endtab -->
{% endtabs %}
## 预字符串化
了解了`Vue`的渲染机制，我们知道`Vue`渲染`DOM`节点时封装的`vnode`最终会被转化为字符串，而预字符串化则是指当`Vue`编译器遇到大量连续的静态节点时会将这些节点打包成一个字符串，于是，这些字符串就相当于一个普通的节点，因此渲染效率就会相应提升

## 缓存事件处理函数
`Vue`中还有一个特性就是在事件处理函数，如`data`、`method`运行后会对这个函数进行缓存，下次运行时就能直接调用缓存，从而提高效率

# 组合式api核心
## setup配置项
{% note info flat %}
在大多数情况下，`setup()`配置项的作用是兼容选项式`api`，如果要结合单文件组件使用组合式`api`，始终更推荐`<script setup>`语法糖的写法
{% endnote %}
`setup()`配置项算得上组合式`api`的核心，其使用方式是返回一个对象，而对象中的属性和方法会被暴露给模板和组件实例，这里就体现了“组合式”`api`的含义了，即需求逻辑可以被组合在一个`setup()`配置项中，后续无论是属性还是方法都可以直接被调用，由于所有逻辑都写在一块，所以修改起来就要方便得多，所以说组合式是面向需求的`api`，在大型项目维护上也会更有优势

这里是一个使用`setup`配置项的例子
{% folding blue , 点击查看示例 %}
```js
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // 返回值会暴露给模板和其他的选项式 API 钩子
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```
{% endfolding %}

此外，`setup()`配置项还有一些默认的参数：
第一个参数是`props`，它用来接收由父组件传出的参数，使用`props.xxx`来调用
{% note warning flat %}
与`props`配置项一样，传入的参数是默认具有响应式的，但如果对其进行结构，参数就会丢失响应式，这时可以用`toRef()`工具函数来恢复响应式
{% endnote %}

第二个参数是`context`,暴露了其他一些组件实例，可以会在`setup`中调用，包括透传参数`attrs`、插槽`slots`、触发事件`emit`以及暴露选项`expose`，以下是样例：
```js
export default {
  setup(props, context) {
    // 透传 Attributes（非响应式的对象，等价于 $attrs）
    console.log(context.attrs)

    // 插槽（非响应式的对象，等价于 $slots）
    console.log(context.slots)

    // 触发事件（函数，等价于 $emit）
    console.log(context.emit)

    // 暴露公共属性（函数）
    console.log(context.expose)
  }
}
```
由于`context`不具备响应式，所以可以放心解构：
```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```
## `<script setup>`
从上节的`setup()`选项中我们已经了解到了`<script setup>`是使用组合式`api`时的语法糖，默认推荐使用该语法糖，因为它具有多种优势，包括
>1. 更少的模板内容和更简介的语法
2. 能使用纯`Typescript`声明`props`和自定义事件
3. 更好的运行性能(其模板会被编译成同一作用域内的渲染函数，避免了渲染上下文代理对象)
4. 更好的 IDE 类型推导性能 (减少了语言服务器从代码中抽取类型的工作)

下面是一些有关该语法模式的特性：
1. 启用`setup`语法只需要在`<script>`代码块中添加`setup`属性即可，在该模块中的代码会被自动编译成`setup()`配置项的内容
2. 任何在`<script setup>`中声明的顶层绑定都能直接在模板中使用，甚至`import`导入的内容也会被同样方式暴露，而不需要写在`methods`配置项里，在某种程度上这种模式和`mixins`配置项高度重合，甚至这种调用方式将更为简单易懂
3. 在模板中使用`ref`会自动解包
4. 支持组件的直接引用，无需注册`components`配置项，可以用此方法调用自身或组件命名空间(多个组件的入口)
5. 简化自定义指令，`vNameOfDirective`格式的属性会被自动识别为自定义指令，以`import`导入的可以通过别名改为自定义指令
```js
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // 在元素上做些操作
  }
}
</script>
<template>
  <h1 v-my-directive>This is a Heading</h1>
</template>
```

## 生命周期钩子
在`<setup>`中取消了选项式中生命周期的配置项，取而代之的是一系列生命周期函数
生命周期函数一览
>1. `onMounted()`：在组件被挂载时调用
2. `onUpdated()`：在组件更新时调用
3. `onUnmounted()`：在组件被卸载时调用
4. `onBeforeMount()`：在组件挂载前调用
5. `onBeforeUpdate()`：在组件更新前调用
6. `onBeforeUnmount()`：在组件卸载前调用
区别：相对于选项式`api`去除了`created()`相关的钩子，将`destroy()`选项改为了`onUnmount()`

{% note info flat %}
虽然表现形式不同，但选项式和组合式`api`对生命周期钩子的底层实现还是一样的，不必拘泥于这种差别
{% endnote %}
# 响应式api
响应式`api`是`Vue3`中另一个重大变化，在选项式中，无论是`data`还是`props`，编译器都给你自动配好了响应式，但组合式`api`中需要自己设定响应式，一方面是`Vue3`对响应式做了优化，另一方面是组合式`api`有多种不同类型的响应式需要自己区分

## ref()
{% tabs ref %}
<!-- tab 详情描述@icon -->
最基本的响应式设置方法，本质是接收一个参数，并返回一个参数的`ref`代理对象(数据被分装在`value`属性中)，在脚本中需要调用`.value`来获取数据，在模板中则会自动解包数据

如果将一个对象赋值给`ref`，那么这个对象内部实际上会通过`reactive`转化为深度响应式，如果想要避免这种转化，只应用浅层响应式，可以使用`shallowRef()`来代替
<!-- endtab -->
<!-- tab 类型源码@icon -->
```js
function ref<T>(value: T): Ref<UnwrapRef<T>>

interface Ref<T> {
  value: T
}
```
对数据使用`Ref`进行包装，包装进`value`属性中
<!-- endtab -->
<!-- tab 使用示例@icon -->
```js
const count = ref(0)
console.log(count.value) // 0

count.value = 1
console.log(count.value) // 1
```
<!-- endtab -->
{% endtabs %}

## computed()
{% tabs computed %}
<!-- tab 详情描述@icon -->
相当于选项式`api`中的`computed:`配置项，传入一个箭头函数，默认将返回值封装为一个只读的响应式`ref`对象

可以配置一个包含`get`和`set`的对象，用来自定义规则，具体结构见类型源码，示例看代码示例
<!-- endtab -->
<!-- tab 类型源码@icon -->
```js
// 只读
function computed<T>(
  getter: (oldValue: T | undefined) => T,
  // 查看下方的 "计算属性调试" 链接
  debuggerOptions?: DebuggerOptions
): Readonly<Ref<Readonly<T>>>

// 可写的
function computed<T>(
  options: {
    get: (oldValue: T | undefined) => T
    set: (value: T) => void
  },
  debuggerOptions?: DebuggerOptions
): Ref<T>
```
默认传入箭头函数参数，返回只读的`Ref`，自定义中传入一个对象，包含`get`和`set`配置项
<!-- endtab -->
<!-- tab 使用示例@icon -->
只读`computed`：
```js
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // 错误
```
自定义`computed`:
```js
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => {
    count.value = val - 1
  }
})

plusOne.value = 1
console.log(count.value) // 0
```
<!-- endtab -->
{% endtabs %}
## reactive()
{% tabs reactive %}
{% note primary flat %}
使用`reactive()`重复封装某一数据后，实际创建的对象将只有一层封装，即只会对基层数据进行封装，这适用于同类型代理，例如`reactive`和`readonly`,最终的响应行为将是一致的
{% endnote %}
<!-- tab 详情描述@icon -->
`reactive()`采用递归的方式将对象转化为响应式，其返回值本质为一个`reactive`代理对象

使用`reactive()`封装`ref`的对象时，会将其自动解包，无需再使用`value`调用，但对于原生数组和`map`则依然需要手动解包

该响应式是深层的，如果只想保留顶层响应式，可使用`shallowReactive()`替代
{% note warning flat %}
`reactive`不能直接封装原始数据类型（如数字、字符串），只能封装对象，且对对象解构后会丢失响应性
{% endnote %}
<!-- endtab -->
<!-- tab 类型源码@icon -->
```js
function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
```
<!-- endtab -->
<!-- tab 使用示例@icon -->
封装`ref`时自动解包
```js
const count = ref(1)
const obj = reactive({ count })

// ref 会被解包
console.log(obj.count === count.value) // true

// 会更新 `obj.count`
count.value++
console.log(count.value) // 2
console.log(obj.count) // 2

// 也会更新 `count` ref
obj.count++
console.log(obj.count) // 3
console.log(count.value) // 3
```

对`ref`封装的原生数组和`Map`类型不会自动解包
```js
const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```
<!-- endtab -->
{% endtabs %}
## readonly()
{% tabs readonly %}
<!-- tab 详情描述@icon -->
接收一个对象，将其变为只读数据，本质是封装为一个只读的`reactive`，所以解包原理等同于`reactive`

对于深层对象都会是只读的，如果要避免深层转化，使用`shallowReadonly()`替代
<!-- endtab -->
<!-- tab 类型源码@icon -->
```js
function readonly<T extends object>(
  target: T
): DeepReadonly<UnwrapNestedRefs<T>>
```
返回值对`reactive()`再进行了一层只读封装
<!-- endtab -->
<!-- tab 使用示例@icon -->
```js
const original = reactive({ count: 0 })

const copy = readonly(original)

watchEffect(() => {
  // 用来做响应性追踪
  console.log(copy.count)
})

// 更改源属性会触发其依赖的侦听器
original.count++

// 更改该只读副本将会失败，并会得到一个警告
copy.count++ // warning!
```
<!-- endtab -->
{% endtabs %}

## watchEffect()
从某种程度上来说，侦听器和响应式数据非常像，因为它们都是基于数据的变化做出响应式修改，这点在`watchEffect`上表现地淋漓尽致
{% tabs watchEffect %}
<!-- tab 详情描述@icon -->
`watchEffect`需要传入一个无返回值的函数，`api`会自动追踪其中的响应式数据并在每次数据更新后执行一遍该函数,可选第二个参数，用来调整变化的发生时机和调试手段

`watchEffect`设置参数后会立即执行一次该函数，相当于`watch`配置项的`immediate`,且`watchEffect`重复触发时会自动清理上一次未完成的副作用(侦听器封装了`onCleanup`参数，具体实现需要自己传入相应的执行函数)

默认`flush`为`pre`，即在数据更新前执行副作用，`post`表示数据更新后使用，同名`api`为`watchPostEffect`，`sync`表示响应变化(可能影响性能)，同名`api`为`watchSyncEffect`

{% note warning flat %}
`watchEffect`适合处理简单业务，例如对单个数据的即使副作用处理，如果要分别监听多个数据做不同操作，还是要用`watch()`
{% endnote %}
<!-- endtab -->
<!-- tab 类型源码@icon -->
```ts
function watchEffect(
  effect: (onCleanup: OnCleanup) => void,
  options?: WatchEffectOptions
): WatchHandle

type OnCleanup = (cleanupFn: () => void) => void

interface WatchEffectOptions {
  flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

interface WatchHandle {
  (): void // 可调用，与 `stop` 相同
  pause: () => void
  resume: () => void
  stop: () => void
}
```
可以看到，传入的第一个参数类型为无返回值的函数（该函数可以使用一个函数控制`onCleanup`清除时执行的操作），第二个参数为一个对象，其中的`flush`用来控制触发时机，后两个用于调试需求
函数返回值为一个接口对象，该对象完成了对`pause()`暂停、`resume()`恢复和`stop()`结束的封装，可以调用相应函数改变侦听器状态
<!-- endtab -->
<!-- tab 使用示例@icon -->
直接调用
```js
const count = ref(0)

watchEffect(() => console.log(count.value))
// -> 输出 0

count.value++
// -> 输出 1
```

自定义副作用清理
```js
watchEffect(async (onCleanup) => {
  const { response, cancel } = doAsyncWork(id.value)
  // `cancel` 会在 `id` 更改时调用
  // 以便取消之前
  // 未完成的请求
  onCleanup(cancel)
  data.value = await response
})
```

改变侦听器状态
```js
const { stop, pause, resume } = watchEffect(() => {})

// 暂停侦听器
pause()

// 稍后恢复
resume()

// 停止
stop()
```
第二参数改变侦听器触发时机
```js
watchEffect(() => {}, {
  flush: 'post',
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```
<!-- endtab -->
{% endtabs %}

## watch()
`watch()`可以说是`watchEffect()`的升级版，两者共享清除`onCleanup`机制和启动结束机制，但`watch`总的来说提供了更多的功能，适合应对更加复杂的场景
{% tabs watch %}
<!-- tab 详情描述@icon -->
`watch()`接收两个必选参数，第一个参数是监听的对象，第二个参数是回调函数，可选监听第三个参数，即`watch`的配置项

`watch()`监听对象包含一个`ref`、`有返回值的函数`或一个对象，回调函数接收三个值，分别是新值，旧值和`onCleanup`清理函数，选项为一个对象包含`deep`，`immediate`、`flush`、调试函数和`once`(表示只监听一次)

使用`watch`监听多个对象时，可在监听对象和回调函数参数部分传入数组，也可以写两个`watch`(这在`watchEffect`中是不支持的)
<!-- endtab -->
<!-- tab 类型源码@icon -->
```ts
// 侦听单个来源
function watch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  options?: WatchOptions
): WatchHandle

// 侦听多个来源
function watch<T>(
  sources: WatchSource<T>[],
  callback: WatchCallback<T[]>,
  options?: WatchOptions
): WatchHandle

type WatchCallback<T> = (
  value: T,
  oldValue: T,
  onCleanup: (cleanupFn: () => void) => void
) => void

type WatchSource<T> =
  | Ref<T> // ref
  | (() => T) // getter
  | T extends object
  ? T
  : never // 响应式对象

interface WatchOptions extends WatchEffectOptions {
  immediate?: boolean // 默认：false
  deep?: boolean | number // 默认：false
  flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
  once?: boolean // 默认：false (3.4+)
}

interface WatchHandle {
  (): void // 可调用，与 `stop` 相同
  pause: () => void
  resume: () => void
  stop: () => void
}
```
回调清理和暂停/恢复操作等同于`watchEffect()`

<!-- endtab -->
<!-- tab 代码示例@icon -->
基本使用
```js
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)
```
一个监听器监听多个来源
```js
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
})
```

<!-- endtab -->
{% endtabs %}

## 响应式api工具函数
通过`Vue`自带的工具函数，可以帮助我们鉴别某些响应式`api`
>- `isRef()`：判断某个值是否为`ref`类型
- `unref()`：如果某个值是`ref`,返回这个值的参数，否则返回这个值本身
- `toRef()`：将一个值规范化为`ref`类型
- `toValue()`：将一个对象规范化为它的参数值
- `toRefs()`：将一个对象内部的值都转化为`ref`类型（对象值一般会是`reactive`类型，解构时会失去响应式，`ref`则会保留响应式）
- `isProxy()`：检查一个对象是否是由 `reactive()`、`readonly()`、`shallowReactive()` 或 `shallowReadonly()` 创建的代理
- `isReactive()`：检查一个对象是否是由 `reactive()` 或 `shallowReactive()` 创建的代理。
- `isReadonly`：检查传入的值是否为只读对象。

# 组件参数传递
组合式`api`中区别于选项式的另一大区别是，在`setup()`配置项中，`props`、`emits`、`expose`等配置项是作为参数被放在`setup()`函数中的，然而在我们实际开发过程中，绝大多数情况下会使用`<script setup>`这个语法糖，那么函数参数的位置就不复存在了，所以我们就另外定义了一套标准(宏)来使用这些功能
使用宏来定义这些选项还有其他一些好处，比如上下文实例参数传递变得更加直观，又比如可以很好地兼容`Typescript`进行类型推断
## defineProps()
{% tabs defineprops %}
<!-- tab 详情描述@icon -->
由于使用`<script setup>`语法糖之后没有参数空间给`props`做引用了，所以在组合式`api`中引入了宏的概念，使用`defineProps()`宏来声明`props`选项，在没有使用`<script setup>`的组件中，`props`还是可以使用选项的方式来命名

和选项的差别基本只在于外层壳的不同，以及去除了`this`指针，调用时使用`propsname`宏名称作为前缀

是用`typescript`设置泛型类型之后就不需要预先传参了，且这种方式还能提供类型推断，因此更为推荐
{% note primary flat %}
即使语法格式不一样，它们底层用的都是`props`配置项，实现层面没有什么区别
{% endnote %}
<!-- endtab -->
<!-- tab 代码示例@icon -->
传参的方式，基本等同于`props`配置项
```js
// 使用 <script setup>
defineProps({
  title: String,
  likes: Number
})

// 等同于

// 非 <script setup>
export default {
  props: {
    title: String,
    likes: Number
  }
}
```
使用`ts`泛型做类型推断的方式
```ts
<script setup lang="ts">
defineProps<{
  title?: string
  likes?: number
}>()
</script>
```
<!-- endtab -->


{% endtabs %}
## defineEmits()
{% tabs defineEmits %}
<!-- tab 详情描述@icon -->
和`defineProps()`一样，`defineEmits()`是基于`emits`配置项的宏，且只能在`<script setup>`中使用，使用方式几乎和配置项没有区别

组合式`api`只取消了`this`指针，在模板中还是可以直接使用`$emit`进行事件传递

可以使用纯类型标注来使用`defineEmits()`
<!-- endtab -->
<!-- tab 代码示例@icon -->
直接使用
```js
<script setup>
  defineEmits(['inFocus', 'submit'])
</script>

//等同于

<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
```
增加校验
```js
<script setup>
const emit = defineEmits({
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
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```
使用`ts`进行类型标注(触发函数+参数)
```ts
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```
<!-- endtab -->
{% endtabs %}
## defineModel()
{% tabs defineModel %}
<!-- tab 详情描述@icon -->
`defineModel`是组件间`v-model`的宏，由于组件式`api`的数据响应式和选项式`api`有一定的区别，所以这个宏也有一定的差别，它返回的数据是使用`ref`包裹的

组合式`api`极大地简化了`v-model`的写法，原本在选项式`api`中需要在子组件中自己配置`props`和事件处理函数，有了`defineModel()`宏之后只需要用其包裹想要绑定的值即可，在父组件中就可以直接`v-model`绑定了

`defineModel()`宏还可以接收参数，用于多个`v-model`绑定，用`v-model:paramsName`指定绑定对象，此外还可传入第二个对象参数，用来处理`props`配置项
<!-- endtab -->
<!-- tab 拆解原型@icon -->
子组件
```js
<!-- Child.vue -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```
父组件
```js
<!-- Parent.vue -->
<Child
  :modelValue="foo"
  @update:modelValue="$event => (foo = $event)"
/>
```
<!-- endtab -->
<!-- tab 代码示例@icon -->
直接使用
```js
<!-- Child.vue -->
<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>

<template>
  <div>Parent bound v-model is: {{ model }}</div>
  <button @click="update">Increment</button>
</template>
//支持父组件绑定
<!-- Parent.vue -->
<Child v-model="countModel" />
```
多个`v-model`绑定
```js
// 父组件
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
// 子组件
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```
<!-- endtab -->
{% endtabs %}