---
title: 海边拾贝（二）- CSS篇
date: 2025-3-22 10:24:16
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
> 海边拾贝（一） - HTML篇  
> 海边拾贝（二） - CSS篇  <-你在这里

# CSS选择器及其优先级
{% folding blue, 点击查看详情 %}
1. `id`选择器：`#id`
2. 类选择器：`.class`
3. 属性选择器：`input[type='radio']`
4. 标签选择器：`div`
5. 伪类选择器：`li:hover`
6. 伪元素选择器：`li:before`
7. 相邻元素选择器：`li + div`
8. 子代选择器：`li>div`
9. 后代选择器：`li div`
10. 兄弟选择器：`li ~ div`
11. `not`选择器：`li:not()`
12. `has`选择器：`li:has()`

优先级排序：`!important`(10000) > 行内样式(1000) > `id`(100) > 类/伪类/属性(10) > 标签/伪元素(1) > 其他(0)

>注意事项:
1. 选择器按照优先级排序，`!important`默认最高优先级
2. 相同优先级取最后出现的样式
3. 同为兄弟选择器，`+`只能选择上下元素，`~`能选择上一个往下的所有元素

{% endfolding %}

# 隐藏元素的方法与区别
{% folding blue, 点击查看详情 %}
1. `display:none`：在`DOM`数中直接将其移除
2. `visible:hidden`：`DOM`中仍然保留，仍然占据空间，但无法响应事件
3. `opacity:0`：元素透明度设为0，仍可以响应事件
4. `z-index:-1`：将显示优先级丢到别的元素后边
5. `transform：scale(0)`：将元素缩放为0
6. `position:absolute`：将元素丢到视口外
{% endfolding %}

# 伪类和伪元素的区别
{% folding blue,点击查看详情 %}
1. 伪类：在已有元素上添加特定的处理事件，不会产生新元素
2. 伪元素：在目标元素前后插入新的元素，因其只在样式中显现，所以叫做伪元素

>常见的伪类和伪元素：
1. 伪类：`a:hover`、`input:focus`、`input:checked`、`li:nth-child()`、`li:nth-of-type()`
2. 伪元素：`a::before`、`a::after`

>反直觉的注意事项：`:nth-child()` 和 `nth-of-type()`是相对于父元素的选择，如果要选择子元素，对伪类用子代选择器
{% endfolding %}

# CSS3中的一些新特性
{% folding blue, 点击查看详情 %}
1. 新增多种选择器：例如属性选择器、`not`选择器、`has`选择器等
2. 圆角：`border-radius`
3. 动画和过渡：`animation`和`transition`
4. 阴影和反射：`box-shadow`、`text-shadow`、`filter:drop-shadow()`
5. 新的布局方式：`flex`和`gird`布局
6. 媒体查询：`@media`
7. 滤镜：`filter:blur()`等
8. 混合模式：`mix-blend-mode`
9. 伪类和伪元素
10. 渐变和遮罩：`gradient`、`mask`
{% endfolding %}

# 对于requestAnimationframes的理解
{% folding blue, 点击查看详情 %}
`requestAnimationFrame` 是一种用于实现高性能动画的 `Web API`，它能够根据屏幕刷新率来优化动画的渲染，传入一个回调函数，基于浏览器渲染频率，1秒60帧进行页面重绘刷新
{% endfolding %}

# 对CSS预处理器和后处理器的认识
{% folding blue , 点击查看详情 %}
1. `CSS`预处理器：如`Sass`、`Less`、`Stylus`是用来预编译`css`代码的，可以通过函数，循环以及混入等方法预编译`css`代码，从而像其他编程语言一样编译`css`
2. 后处理器：如`postCss`，用来给已经编译完的`css`代码进行规范化处理，如添加浏览器前缀，从而实现兼容性问题

{% endfolding %}

# 为什么要清除浮动？如何清除浮动？
{% folding blue , 点击查看详情 %}
浮动是一种常见的布局方式，用以将一系列元素统一排列或对其，但是，容器不设高度且子元素浮动时，容器高度不能被内容撑开。此时子元素就会被撑到容器外面，造成“高度塌陷”

清除浮动的方式：
1. 使用`clear`属性：`clear:both`清除浮动
2. 使用`overflow:hidden`：将超出部分隐藏
3. 使用伪元素：例如`::after`来设置清除浮动的块
{% endfolding %}