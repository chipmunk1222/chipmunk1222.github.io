---
title: Vue知识点总结（四）路由实例
date: 2024-10-22 16:41:31
tags: Vue 学习笔记
description: Vue-router路由介绍
---

{% tip cogs %}
该系列文章主要基于官方Vue教程，对Vue使用及特性等方面做一个较为系统的总结
{% endtip %}
{% tip bell %}
Vue官方文档链接[Vue.js](https://cn.vuejs.org/guide/introduction)
VueRouter官方文档链接[VueRouter](https://router.vuejs.org/zh/introduction.html)
{% endtip %}

-----------------------

# 路由实例创建
一般使用脚手架工具创建`vue`实例的同时都会同步导入`VueRouter`的`npm`安装，如果需要单独导入，可使用`npm`导入：
```
npm install vue-router@4
```

这里同样提供`CDN`链接：`https://unpkg.com/vue-router@4.0.15/dist/vue-router.global.js`
{% note warning flat %}
`VueRouter`中`router4`对应`Vue3`，`router3`对应`Vue2`,故引包时需要格外看清`VueRouter`的版本，@后跟随的就是版本号
{% endnote %}

## 在Vue中创建路由实例(router)
接下来分别讲一下在`Vue2`和`Vue3`中创建路由实例的方法
{% tabs createrouter %}
<!-- tab Vue3@icon -->
在`Vue3`中使用`createRouter api`进行路由实例创建
>1. 引包：npm install vue-router@4
2. 引入：import {createRouter ，createMemoryHistory}  from ‘vue-router’
3. 安装注册并挂载：createAPP(App).use(router).mount('#app')
4. 创建路由对象：const router = createRoute（{ 
	  history：createMemoryHistory
    routes
  }）
<!-- endtab -->
<!-- tab 完整代码示例@icon -->
```js
import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './HomeView.vue'
import AboutView from './AboutView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

// 注册插件并挂载
createApp(App)
  .use(router)
  .mount('#app')
```
<!-- endtab -->
<!-- tab Vue2@icon -->
`Vue2`中多了一步注入的步骤
> 1. 引包：npm install vue-router@3.6.5(Vue2 为3.x Vue3为4.x)
 2. 引入：import VueRouter from 'vue-router'
 3. 安装注册：Vue.use(VueRouter)
 4. 创建路由对象： const router = new VueRouter（{ routes }）
 5. 注入：new Vue({
	    render: h=>h(app)
      router
    }).$mount('#app')
<!-- endtab -->
{% endtabs %}

{% note info flat %}
这里在介绍下用`use()`注册为路由插件后实际上干了啥，首先是引入了`RouterView`和`RouterLink`两个组件，用于基本跳转，以及在选项式`api`中加入了`$router`和`$route`实例，在组合式`api`中加入了`useRouter()`和`useRoute()`函数，最后在使用`mount()`将其挂载到`Vue`当中去
{% endnote %}

## 路由规则创建(router配置项)
上述小节讲述了如何在`Vue`中创建路由，这一小节讲讲如何创建匹配规则

可以看到在创建的`router`中是可以添加配置项的，配置项以对象的形式添加
### routes
`routes`是路由的核心配置项，添加了路由导航的详细信息，`routes`配置项是一个数组，每一个路由页面由一个对象组成，可以使用`children`配置嵌套路由
`routes`配置项一览：
>- `path`:定义路由路径
- `component`:路由对应的组件
- `name`:用来命名路由,传入名字对象添加参数属性来替代路径以做到命名路由  
- `redirect`:自定义重定向路径
- `alias`:路由别名,路由别名定义的路径等同于`path`中的路径
- `children`:定义嵌套路由，规则等同于顶级路由

示例：
```js
{ 
  path: '/home', 
  name: 'Home', 
  component: HomePage, 
  alias: ['/start', '/begin'], 
  meta: { requiresAuth: true } 
},
```
在`Vue2`中可以使用`this.$route`实例成员获取当前页面的路由信息，在`Vue3`中使用`useRoute()`函数获取路由信息
{% note warning flat %}
在最后配置`path: "*"`用来匹配`404`页面
{% endnote %}

### activeLinks
通过配置`linkActiveClass`和`linkExactActveClass`配置项来修改对应导航激活时的类名

### history模式
`history`配置项允许我们在不同的历史模式中进行选择
>1. `hash`模式：在具体路径前添加一个`#`，可以会对`SEO`造成一定影响，配置`createWebHashHistory()`
2. `Memory`模式：适合`node`环境和`SSR`，使用`createMemoryHistory()`创建
3. `Html5`模式：最"正常"的模式，配置`createWebHistory()`创建

# 路由匹配
在完成了路由的创建以及配置后，下一步就是如何在具体的页面中使用路由进行跳转，路由跳转的本质是往浏览器的历史记录中添加历史，然后通过在路由中`push`完成跳转操作，本节将围绕`push()`、`<router-link>`以及`<router-view>`展开
{% note info flat %}
`push()`是向浏览历史中添加一条记录，还有一种不添加记录的方式，就是`replace()`方法，方法如其名，直接替换，不添加历史
{% endnote %}
## 路由出入口配置(RouterLink、RouterView)
在`VueRouter`中使用`RouterLink`替代`html`中的`<a>`,从而更好地兼容`SPA`单页应用
{% note primary flat %}
在最初使用`use()`注册路由之后，`RouterLink`和`RouterView`两个组件就相当于被全局注册了
{% endnote %}
{% note orange 'fas fa-wand-magic' flat %}
在`Vue`模板中使用`RouterLink`大驼峰命名法和`router-link`短横杠命名法都是被允许的，但是在`html`的`DOM`中则只能使用短横杠命名法(大驼峰是`Vue3`后引入的规范，故对于早期版本也有可能会报错)
{% endnote %}
使用`<router-link>`设置跳转规则使用`<router-view>`定位路由出口，即跳转后页面的显示位置
```js
<router-link to="url"></router-link>
```
配置路由出口:`<router-view></router-view>`

## 路由匹配规则
路由`router`使用`push()`进行跳转，`push()`被注册到路由实例中，`Vue2`使用`this.$router`访问，`Vue3`中使用`useRouter()`访问
{% note warning flat %}
下文中都将使用`this.$router`和`this.$route`进行演示，这和那两个函数方法作用上是完全一致的
{% endnote %}
### 动态路由匹配
在路由中可以配置动态**路径参数**将具有相同模式的路由进行分组，从而将具有相同规则的`url`映射到同一个路由
路径参数为`:`
在使用`<router-link>`进行路由跳转时，可以根据路径参数精确匹配
>语法：
  - 配置路由：`/path/:参数名`
  - 跳转：`to="/path/:id"`
  - 获取：`this.$route.params`

### 查询参数匹配
使用查询参数可以为路由添加格外信息，相当于参数附加在基础路径上
>语法：
  - 跳转：`to="/url/?参数名1=值&参数名2=值"`
  - 获取：`this.$route.query.参数名`
  
### 其他匹配方式
在使用路由时还有别的路由匹配的方法，比如可以使用正则式定义匹配或者使用`hash`进行锚点匹配

`this.$route`实例中提供了`params`表示路径参数，`query`表示查询规则，`hash`表示`hash`值

在路由跳转时也可以以用这些参数，以便更精确定位
```js
router.push({
  name: 'NotFound',
  // 保留当前路径并删除第一个字符，以避免目标 URL 以 `//` 开头。
  params: { pathMatch: this.$route.path.substring(1).split('/') },
  // 保留现有的查询和 hash 值，如果有的话
  query: route.query,
  hash: route.hash,
})
```

## router-link属性
`<router-link>`组件中还可以添加一些属性，比如`to`就是配置跳转路径，其余一些属性还可以配置其他内容
>1. `exact`:配置精确匹配，在`<router-link>`中添加`exact`后只有当路由精确匹配路径时才会是激活状态
2. `router-link-active`:模糊匹配状态下，对应导航激活时的默认样式类名
3. `router-link-exact-active`：精确匹配状态下，对应导航激活时的默认样式类名

在`router`中可添加配置项`linkActiveClass`和`linkExactActiveClass`可以手动配置激活状态下的类名
# 路由守卫

