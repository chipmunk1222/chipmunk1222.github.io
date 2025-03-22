---
title: 海边拾贝（一）- HTML篇
date: 2025-3-21 11:06:16
tags: 
  - 前端八股
  - Html
category: 海边拾贝 
description: 当你捡起一块知识碎片，并发现它和目前的体系相当契合后，会为此感到欣喜吗
---

>“海边拾贝”系列文章旨在对细碎的知识点进行整理和补遗，包括但不限于八股，因此，该系列文章建议有一定基础的前端人士用以巩固知识，不建议前端初学者食用
>
> **相应系列文章导航：**
> 海边拾贝（零）开篇
> 海边拾贝（一） - HTML篇  <-你在这里

# src和href的区别
{% folding blue, 点击查看详情 %}
1. `src`用于指定外部资源，或者说嵌入外部资源，比如图片，视频，脚本等，它的特点是会阻塞页面加载，所以像脚本等一般放在`html`文档最下部
2. `href`用以建立和某些资源之间的链接关系，它不会阻塞页面渲染

>常见的用`src`引入的有`img`、`script`、`video`、`iframe`等，而`href`指定有`a`和`link`标签等
{% endfolding %}

# 关于html语义化
{% folding blue, 点击查看详情 %}
`html`语义化是指将标签内容语义化以适应实际结构，它本身不会对文档渲染造成任何影响，但它有如下好处：
1. 标签语义化有助于浏览器的`SEO`机制，有利于浏览器解析各部分信息
2. 语义化另一个有点就是对开发友好，使得文档结构更易维护，有点类似于`XML`

常见的语义化标签有:
```html
<header></header>  头部
<nav></nav>  导航栏
<section></section>  区块（有语义化的div）
<main></main>  主要区域
<article></article>  主要内容
<aside></aside>  侧边栏
<footer></footer>  底部
```
{% endfolding %}

# script标签中async和defer的作用
{% folding blue, 点击查看详情 %}
两者都用于脚本的异步执行，区别在于：
1. `async`的异步是标准的异步，即当脚本加载完成后执行
2. `defer`的异步是等待整个`DOM`文件渲染完成后加载脚本，依赖`HTML`的解析，（`DOMContentLoaded`事件触发执行之前）

>因此不要将两者同时使用，因为其逻辑冲突
>如果同时使用，浏览器会默认执行`async`异步
{% endfolding %}

# DOCTYPE和meta标签
{% folding blue, 点击查看详情 %}
`DOCTYPE`是一种文档类型声明，用来告诉浏览器用什么来解析文档（`html`、`xhtml`）等
`meta`用以提供文档的"元数据",它们可以为网页提供了一些格外的信息或提高`SEO`能力，元数据的作用包括：
1. 字符集声明
```html
<meta charset="UTF-8">
```
2. 设置视口宽度和缩放比例
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
3. 设置关键词优化`SEO`机制
```html
<meta name="description" content="这里是网页的描述">
<meta name="keywords" content="关键词1, 关键词2, ...">
```
4. 设置浏览器缓存
```html
<meta http-equiv="cache-control" content="no-cache">
```
5. 声明网页类型
```html
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
```
6. 设置作者和版权信息等
```html
<meta name="author" content="作者姓名">
<meta name="copyright" content="版权声明">
```
7. 刷新和重定向
```html
<meta http-equiv="refresh" content="5; url=http://www.example.com">
```
8. 网页内容安全策略（`CSP`）
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://trustedscripts.com; img-src 'self' data:; style-src 'self' 'unsafe-inline';">
```
9.  页面主题颜色
```html
<meta name="theme-color" content="#4285f4">
```
10. 浏览器兼容性设置
```html
<meta http-equiv="X-UA-Compatible" content="IE=edge">
``` 
{% endfolding %}

# label标签的作用
{% folding blue, 点击查看详情 %}
`label`标签可以用来关联某些表单控件，通过`label`关联表单后即可实现用`label`样式控制表单，比如：
```html
<label for="password">请输入密码:</label>
<input type="password" id="password" name="password">
```
在`for`管理`input`标签的`id`后可以将`input`的`display`设为`none`，并通过`label`来设置`input`样式，从而使`input`只需要关注逻辑实现，从而实现一些神奇的样例
[https://codepen.io/munk-chip/pen/wvVyJBq](https://codepen.io/munk-chip/pen/wvVyJBq)
{% endfolding %}

# svg和canvas的区别
{% folding blue, 点击查看详情 %}
1. `svg`是一种矢量图形，即根据点线面等定义来绘制图形，因此不会出现缩放失真等情况，`svg`依赖`XML`实现，适合定义交互和动画等
2. `canvas`是一种位图，根据像素点来绘制图像，通过`js`画布生成图像，适用于静态或复杂结构的场景，可保存为`png`或`jpg`等格式
{% endfolding %}

# 渐进增强和优雅降级的区别
{% folding blue, 点击查看详情 %}
1. 渐进增强：指针对低版本浏览器进行页面重构，在适应低版本浏览器功能的基础上追加功能，从而提升用户体验
2. 优雅降级：先在高版本浏览器中完善功能，然后慢慢兼容低版本浏览器
{% endfolding %}

# 块级元素、行内元素和行内块
{% folding blue, 点击查看详情 %}
1. 块级元素：
  - 每个块级元素占据一整行
  - 宽高可控
  - 可以包含块级元素和行内元素（嵌套元素）
2. 行内元素：
  - 和其他同级元素在同一行
  - 宽高以及上下边距不可自定义
  - 不能包含块级元素
  - 可以调节左右`padding`和`margin`
  - 宽高依赖自身内部图形撑起的空间
3. 行内块
  - 既包含行内元素的同行特性，又具备块级元素自定义宽高边距的能力

>常见的三种元素：
1. 块级元素：
```html
<p>：用于表示段落。
<h1> - <h6>：用于表示标题，h1 是最高级别的标题。
<ul>、<ol>、<li>：用于创建无序列表和有序列表。
<div>：用于分组和布局页面元素。
<table>、<tr>、<td>等：用于创建表格。
<hr>：用于创建水平线。
<pre>：用于展示预格式化的文本，其中的空格、回车等会保留在输出结果中。
```
2. 行内元素：
```html
<a>：用于创建超链接。
<span>：用于包含文本和其他行内元素，可以用于实现文本的样式和布局效果。
<b>、<i>、<u>、<strong>、<em>、<small>、<sup>、<sub>等：用于对文本进行修饰和强调。
<br>：用于强制换行。
<code>、<var>、<kbd>等：用于表示计算机代码和用户输入。
<q>、<cite>、<blockquote>等：用于表示引用和短文本块。
```
3. 行内块：
```html
<img>：用于插入图片，可以通过设置其宽度和高度来控制图片的大小，但是在默认情况下，它是一个行内块级元素。
<button>：用于创建按钮。
<input>：用于创建输入框和表单元素。
<select>：用于创建下拉菜单。
<textarea>：用于创建多行文本输入框。
<label>：用于创建表单标签。
```
{% endfolding %}

# html5的新特性
{% folding blue, 点击查看详情 %}
1. 语义化标签：语义化的新标签，这些标签使得网页更加语义化，利于维护以及搜索引擎的`SEO`机制
2. 媒体标签：`audio`、`video`音频视频
3. 表单增强：基于`input`和`form`标签新引入了许多属性和方法，使其更精确地控制表单输入
4. `canvas`标签：`HTML5`引入了`Canvas`标签，可以用于在网页中绘制图形和动画
5. `Web`存储：引入了`localstorage`和`sessionstorage`两种浏览器存储方式
6. `DOM`查询：基于`DOM`实现元素查询，`querySelector()`方法
7. 拖拽方法：引入了拖拽的特性
{% endfolding %}