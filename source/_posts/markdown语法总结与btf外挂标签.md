---
title: Markdown语法总结与butterfly外挂标签
top_img: transparent
date: 2024-10-31
description: Markdown基本语法以及butterfly常用外挂标签介绍
tags: Butterfly Markdown
---

{% tip cogs %}本文主要记述Markdown的基本语法以及店长的butterfly外挂标签插件中常用部分的基本使用和演示，用于熟悉博客文章的撰写{% endtip %}

# 前言
{% folding blue,章前哔哔%}
>不知道你有没有经历过这样一段心路历程，废了好大的劲终于把博客的基本配置做完了，兴致冲冲地准备动手写博客了，回过头来却发现，博客的语法要怎么写来着？
由于先前一直有用`obsidian`做学习笔记的习惯，我自以为已经具备了写博客的前提条件，但实际上手才发现其中的差别还是相当大的，一个是用`obsidian`做笔记只要面向自己就可以了，不用在意格式规划啥的，一切只需要自己能看懂就好，这和博客的需求是完全不同的，更不用说`butterfly`要写出优雅的博客还要关注各种外挂标签啥的。
因此打算自己写一篇作为对`markdown`以及`butterfly`外观标签的总结，也就当熟悉博客的写法了。

{% note warning flat %}
注：本文仅供熟悉博客文章使用，故外挂标签部分介绍并不全面，仅给出部分比较常用的部分，如有具体需求，建议参考原文，具体教程链接均在文前给出
{% endnote %}

{% endfolding %}

{% folding blue, 点击查看参考教程 %}

|作者 |教程原帖 |
| :---: | :---: |
| Fomalhaut | [Markdown语法与外挂标签写法汇总](https://www.fomal.cc/posts/2013454d.html) |
| 店长Akilar | [Tag Plugins Plus](https://akilar.top/posts/615e2dec/) | 
| Jerry | [Butterfly 文档(四) 标签外挂](https://butterfly.js.org/posts/ceeb73f/?highlight=note) |

{% endfolding %}

--------------

# Markdown基本语法
{% tip cogs %}`Markdown`为`hexo`集成的标记语言，可以直接使用，`butterfly`外挂标签则为`butterfly`插件，需要手动导入{% endtip %}
{% note warning flat %}
当然，`butterfly`的外挂标签插件只能供`butterfly`主题使用，别的主题还需使用专门的插件
{% endnote %}

{% note purple 'fas fa-bullhorn' flat %}
注意：在原生`Markdown`（如表格）中使用某些外挂标签可能存在兼容性问题，例如显示闭合标签等问题，仍需要自己调整
{% endnote %}

## 标题
{% tabs title %}
<!-- tab 标签语法@icon -->
```
# h1
## h2
### h3
#### h4
##### h5
```
<!-- endtab -->
<!-- tab 渲染结果@icon -->
见文章标题
<!-- endtab -->
{% endtabs %}

## 段落
{% note info flat %}
没什么好多讲的，唯一值得注意的地方就是不要随便缩进
{% endnote %}
{% tabs paragraph %}
<!-- tab 标签语法@icon -->
```
I really like using Markdown.

I think I'll use it to format all of my documents from now on.

> 我是引用语法，我引用了我自己
```
<!-- endtab -->
<!-- tab 渲染结果@icon -->
I really like using Markdown.

I think I'll use it to format all of my documents from now on.

> 我是引用语法，我引用了我自己
<!-- endtab -->
<!-- tab 要点注意@icon -->
- 1、段落保持顶格缩进，不要在段前使用space空格和tab换行符进行缩进
- 2、换行相当于使用html中的<\br>标签进行渲染，避免在结尾使用\符号
- 3、Markdown支持两个或多个空格进行换行
- 4、引用语法支持嵌套使用
<!-- endtab -->
{% endtabs %}

## 代码块
{% tip key %}
善用不同形式的代码块来标识用途
{% endtip %}
{% tabs code %}
<!-- tab 标签语法@icon -->
``` 
- 旧代码行
+ 新代码行 
未更改的代码行
! 修改的代码行
```
<!-- endtab -->
<!-- tab 配置参数@icon -->
1. 使用diff来标识区分代码块，+标识添加，-标识删除，！标识修改
2. 使用编程语言来表示对应编程语言代码块
<!-- endtab -->
<!-- tab 渲染结果@icon -->
```diff
- 旧代码行
+ 新代码行 
未更改的代码行
! 修改的代码行
```
<!-- endtab -->
{% endtabs %}

## 文字强调
{% note warning flat %}
行内文字在外挂标签中有更优的写法，反正不到万不得已不要用html嵌入
{% endnote %}
{% tabs text %}
<!-- tab 标签语法@icon -->
```
<u>下划线演示</u>

文字**加粗**演示

文字*斜体*演示

文本`高亮`演示

文本~~删除~~线演示

// 使用html标签实现特定字体设置
<font size = 5>5号字</font>
<font face="黑体">黑体</font>
<font color=blue>蓝色</font>

<table><tr><td bgcolor=MistyRose>这里的背景色是：MistyRosen，此处输入任意想输入的内容</td></tr></table>
```
<!-- endtab -->
<!-- tab 渲染结果@icon -->
<u>下划线演示</u>

文字**加粗**演示

文字*斜体*演示

文本`高亮`演示

文本~~删除~~线演示

<font size = 5>5号字</font>
<font face="黑体">黑体</font>
<font color=blue>蓝色</font>

<table><tr><td bgcolor=MistyRose>这里的背景色是：MistyRosen，此处输入任意想输入的内容</td></tr></table>
<!-- endtab -->
<!-- tab 要点注意@icon -->
- 1、使用星号*或下划线_均可实现加粗或斜体
- 2、如要同时使用加粗和斜体，使用三个标识符
<!-- endtab -->
{% endtabs %}

## 列表

### 有序列表
{% tabs li-list %}
<!-- tab 标签语法@icon -->
```
1. First item
2. Second item
3. Third item
    1. Indented item
    2. Indented item
4. Fourth item
```
<!-- endtab -->
<!-- tab 渲染结果@icon -->
1. First item
2. Second item
3. Third item
    1. Indented item
    2. Indented item
4. Fourth item
<!-- endtab -->
{% endtabs %}

### 无序列表
{% tabs ol-list %}
<!-- tab 标签语法@icon -->
```
- First item
- Second item
- Third item
    - Indented item
    - Indented item
- Fourth item
```
<!-- endtab -->
<!-- tab 渲染结果@icon -->
- First item
- Second item
- Third item
    - Indented item
    - Indented item
- Fourth item
<!-- endtab -->
<!-- tab 要点注意@icon -->
- 1、使用+*-均可实现无序列表
- 2、若要在列表中插入非列表段落，缩进4个空格或一个制表符，否则将被当作列表
<!-- endtab -->
{% endtabs %}

## 分割线
{% tabs parting-line %}
<!-- tab 标签示例@icon -->
```
----

****

------------
```
<!-- endtab -->
<!-- tab 渲染结果@icon -->

----

****

------------

<!-- endtab -->
<!-- tab 要点注意@icon -->
- 1、为兼容性考虑，在分割线前后加一段空白段落
<!-- endtab -->

{% endtabs %}

## 链接语法
{% tabs link %}
<!-- tab 标签示例@icon -->
```
这是一个链接 [Markdown语法](https://markdown.com.cn)。
```
<!-- endtab -->
<!-- tab 渲染结果@icon -->
这是一个链接 [Markdown语法](https://markdown.com.cn)。
<!-- endtab -->
<!-- tab 要点注意@icon -->
- 在链接URL后面增加title可实现鼠标悬浮时出现提示词
- 链接文本可使用文本增强符强调
<!-- endtab -->
{% endtabs %}

## 图片
{% tabs picture %}
<!-- tab 标签示例@icon -->
```
![这是图片](/img/bg4.jpg "Magic Gardens")

[![这是带链接的图片](/img/bg4.jpg "Magic Gardens")](https://markdown.com.cn)
```
<!-- endtab -->
<!-- tab 渲染结果@icon -->
![这是图片](/img/bg4.jpg "Magic Gardens")

[![这是带链接的图片](/img/bg4.jpg "Magic Gardens")](https://markdown.com.cn)
<!-- endtab -->
{% endtabs %}

## 表格
{% tabs table %}
<!-- tab 标签示例@icon -->
```
#默认表格
| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |

#自定义对齐表格
| Syntax(right) | Description(center) |
| --------: | :-----------: |
| Header      | Title       |
| Paragraph   | Text        |
```
<!-- endtab -->
<!-- tab 渲染结果@icon -->

| Syntax      | Description |
| ------- | ------- |
| Header      | Title       |
| Paragraph   | Text        |

| Syntax(right) | Description(center) |
| --------: | :-------: |
| Header      | Title       |
| Paragraph   | Text        |
<!-- endtab -->
{% endtabs %}

# butterfly外挂标签

{% note info flat %}
引自店长的外挂标签插件，标签`npm`引入和配置详情见店长[Tag Plugins Plus](https://akilar.top/posts/615e2dec/)
{% endnote %}

## 行内文本样式 text

{% tabs btf-text %}
<!-- tab 标签语法@icon -->
```
{% u 文本内容 %}
{% emp 文本内容 %}
{% wavy 文本内容 %}
{% del 文本内容 %}
{% kbd 文本内容 %}
{% psw 文本内容 %}
```
<!-- endtab -->
<!-- tab 样式预览@icon -->
1. 带 {% u 下划线 %} 的文本
2. 带 {% emp 着重号 %} 的文本
3. 带 {% wavy 波浪线 %} 的文本
4. 带 {% del 删除线 %} 的文本
5. 键盘样式的文本 {% kbd command %} + {% kbd D %}
6. 密码样式的文本：{% psw 这里没有验证码 %}
<!-- endtab -->
<!-- tab 示例源码@icon -->
```
1. 带 {% u 下划线 %} 的文本
2. 带 {% emp 着重号 %} 的文本
3. 带 {% wavy 波浪线 %} 的文本
4. 带 {% del 删除线 %} 的文本
5. 键盘样式的文本 {% kbd command %} + {% kbd D %}
6. 密码样式的文本：{% psw 这里没有验证码 %}
```
<!-- endtab -->
{% endtabs %}

## 行内文本 span

{% tip sync %}
对Markdown行内样式的补充，可以更简洁地修改行内样式
{% endtip %}
{% note info flat %}
基本使用技巧就是注意字体、颜色、大小和对齐方式四个属性
{% endnote %}
{% tabs btf-span %}
<!-- tab 标签语法@icon -->
```
{% span 样式参数(参数以空格划分), 文本内容 %}
```
<!-- endtab -->
<!-- tab 参数配置@icon -->
1. 字体：logo，code
2. 颜色：{% span red, 红色 %}、{% span yellow, 黄色 %}、{% span green, 绿色 %}、{% span cyan, 青色 %}、{% span blue, 蓝色 %}、{% span gray, 灰色 %}
3. 大小：small, h4, h3, h2, h1, large, huge, ultra
4. 对齐：left, center, right
<!-- endtab -->
<!-- tab 样式预览@icon -->
- 彩色文字
在一段话中方便插入各种颜色的标签，包括：{% span red, 红色 %}、{% span yellow, 黄色 %}、{% span green, 绿色 %}、{% span cyan, 青色 %}、{% span blue, 蓝色 %}、{% span gray, 灰色 %}。
- 超大号文字
文档「开始」页面中的标题部分就是超大号文字。
{% span center logo large, Volantis %}
{% span center small, A Wonderful Theme for Hexo %}

<!-- endtab -->
<!-- tab 示例源码@icon -->
```
- 彩色文字
在一段话中方便插入各种颜色的标签，包括：{% span red, 红色 %}、{% span yellow, 黄色 %}、{% span green, 绿色 %}、{% span cyan, 青色 %}、{% span blue, 蓝色 %}、{% span gray, 灰色 %}。
- 超大号文字
文档「开始」页面中的标题部分就是超大号文字。
{% span center logo large, Volantis %}
{% span center small, A Wonderful Theme for Hexo %}
```
<!-- endtab -->
{% endtabs %}

## 段落文本 p

{% note success flat %}
对段落文本的扩展，使用方式和场景基本等同于行内文本
{% endnote %}
{% tabs btf-p %}
<!-- tab 标签语法@icon -->
```
{% p 样式参数(参数以空格划分), 文本内容 %}
```
<!-- endtab -->
<!-- tab 样式预览@icon -->
- 彩色文字
在一段话中方便插入各种颜色的标签，包括：{% p red, 红色 %}、{% p yellow, 黄色 %}、{% p green, 绿色 %}、{% p cyan, 青色 %}、{% p blue, 蓝色 %}、{% p gray, 灰色 %}。
- 超大号文字
文档「开始」页面中的标题部分就是超大号文字。
{% p center logo large, Volantis %}
{% p center small, A Wonderful Theme for Hexo %}
<!-- endtab -->
<!-- tab 示例源码@icon -->
```
- 彩色文字
在一段话中方便插入各种颜色的标签，包括：{% p red, 红色 %}、{% p yellow, 黄色 %}、{% p green, 绿色 %}、{% p cyan, 青色 %}、{% p blue, 蓝色 %}、{% p gray, 灰色 %}。
- 超大号文字
文档「开始」页面中的标题部分就是超大号文字。
{% p center logo large, Volantis %}
{% p center small, A Wonderful Theme for Hexo %}
```
<!-- endtab -->
{% endtabs %}

## 引用 note

{% note info flat %}
在外挂标签中，`note`算得上是最常用的模块之一了，插件提供了两种`note`的配置语法，第一种为butterfly自带语法，可基于主题配置文件进行配置，第二种为外部引入图标方式，支持自定义引入`font-awesome V5`图标
{% endnote %}
{% tabs btf-note %}
<!-- tab 通用配置@icon -->

{% note primary modern %}
通用配置用以修改默认参数，不过使用时建议还是对每个引用框都手动进行配置
{% endnote %}

修改主题配置文件
```
note:
  # Note tag style values:
  #  - simple    bs-callout old alert style. Default.
  #  - modern    bs-callout new (v2-v3) alert style.
  #  - flat      flat callout style with background, like on Mozilla or StackOverflow.
  #  - disabled  disable all CSS styles import of note tag.
  style: simple
  icons: false
  border_radius: 3
  # Offset lighter of background in % for modern and flat styles (modern: -12 | 12; flat: -18 | 6).
  # Offset also applied to label tag variables. This option can work with disabled note tag.
  light_bg_offset: 0
```
<!-- endtab -->
<!-- tab 语法格式@icon -->

{% folding blue, 方式一 %}
```
{% note [class] [no-icon] [style] %}
Any content (support inline tags too.io).
{% endnote %}
```
{% endfolding %}

{% folding blue, 方式二 %}
```
{% note [color] [icon] [style] %}
Any content (support inline tags too.io).
{% endnote %}
```
{% endfolding %}
<!-- endtab -->
<!-- tab 参数配置@icon -->
{% folding blue, 方式一 %}

|参数|用法|
|---|-----------|
|class|【可选】标识，不同的标识有不同的配色
（ default / primary / success / info / warning / danger ）|
|no-icon|【可选】不显示 icon|
|style|【可选】可以覆盖配置中的 style
（simple/modern/flat/disabled）|

{% endfolding %}

{% folding blue, 方式二 %}

|参数|用法|
|---|-----------|
|class|【可选】标识，不同的标识有不同的配色
（ default / blue / pink / red / purple / orange / green ）|
|no-icon|【可选】可配置自定义 icon (只支持 fontawesome 图标, 也可以配置 no-icon )|
|style|【可选】可以覆盖配置中的 style
（simple/modern/flat/disabled）|

{% endfolding %}
<!-- endtab -->
<!-- tab 样式预览@icon -->

{% folding blue, 方法一 %}
1. `simple`样式

   {% note simple %}默认 提示块标签{% endnote %}

   {% note default simple %}default 提示块标签{% endnote %}

   {% note primary simple %}primary 提示块标签{% endnote %}

   {% note success simple %}success 提示块标签{% endnote %}

   {% note info simple %}info 提示块标签{% endnote %}

   {% note warning simple %}warning 提示块标签{% endnote %}

   {% note danger simple %}danger 提示块标签{% endnote %}

2. `modern`样式

   {% note modern %}默认 提示块标签{% endnote %}

   {% note default modern %}default 提示块标签{% endnote %}

   {% note primary modern %}primary 提示块标签{% endnote %}

   {% note success modern %}success 提示块标签{% endnote %}

   {% note info modern %}info 提示块标签{% endnote %}

   {% note warning modern %}warning 提示块标签{% endnote %}

   {% note danger modern %}danger 提示块标签{% endnote %}

3. `flat`样式

   {% note flat %}默认 提示块标签{% endnote %}

   {% note default flat %}default 提示块标签{% endnote %}

   {% note primary flat %}primary 提示块标签{% endnote %}

   {% note success flat %}success 提示块标签{% endnote %}

   {% note info flat %}info 提示块标签{% endnote %}

   {% note warning flat %}warning 提示块标签{% endnote %}

   {% note danger flat %}danger 提示块标签{% endnote %}

4. `disabled`样式

   {% note disabled %}默认 提示块标签{% endnote %}

   {% note default disabled %}default 提示块标签{% endnote %}

   {% note primary disabled %}primary 提示块标签{% endnote %}

   {% note success disabled %}success 提示块标签{% endnote %}

   {% note info disabled %}info 提示块标签{% endnote %}

   {% note warning disabled %}warning 提示块标签{% endnote %}

   {% note danger disabled %}danger 提示块标签{% endnote %}

5. `no-icon`样式

   {% note no-icon %}默认 提示块标签{% endnote %}

   {% note default no-icon %}default 提示块标签{% endnote %}

   {% note primary no-icon %}primary 提示块标签{% endnote %}

   {% note success no-icon %}success 提示块标签{% endnote %}

   {% note info no-icon %}info 提示块标签{% endnote %}

   {% note warning no-icon %}warning 提示块标签{% endnote %}

   {% note danger no-icon %}danger 提示块标签{% endnote %}

{% endfolding %}

{% folding blue, 方法二 %}

1. `simple`样式

    {% note 'fab fa-cc-visa' simple %}你是刷 Visa 还是 UnionPay{% endnote %}

    {% note blue 'fas fa-bullhorn' simple %}2021年快到了....{% endnote %}

    {% note pink 'fas fa-car-crash' simple %}小心开车 安全至上{% endnote %}

    {% note red 'fas fa-fan' simple%}这是三片呢？还是四片？{% endnote %}

    {% note orange 'fas fa-battery-half' simple %}你是刷 Visa 还是 UnionPay{% endnote %}

    {% note purple 'far fa-hand-scissors' simple %}剪刀石头布{% endnote %}

    {% note green 'fab fa-internet-explorer' simple %}前端最讨厌的浏览器{% endnote %}

2. `modern`样式

   {% note 'fab fa-cc-visa' modern %}你是刷 Visa 还是 UnionPay{% endnote %}

   {% note blue 'fas fa-bullhorn' modern %}2021年快到了....{% endnote %}

   {% note pink 'fas fa-car-crash' modern %}小心开车 安全至上{% endnote %}

   {% note red 'fas fa-fan' modern%}这是三片呢？还是四片？{% endnote %}

   {% note orange 'fas fa-battery-half' modern %}你是刷 Visa 还是 UnionPay{% endnote %}

   {% note purple 'far fa-hand-scissors' modern %}剪刀石头布{% endnote %}

   {% note green 'fab fa-internet-explorer' modern %}前端最讨厌的浏览器{% endnote %}

3. `flat`样式

   {% note 'fab fa-cc-visa' flat %}你是刷 Visa 还是 UnionPay{% endnote %}

   {% note blue 'fas fa-bullhorn' flat %}2021年快到了....{% endnote %}

   {% note pink 'fas fa-car-crash' flat %}小心开车 安全至上{% endnote %}

   {% note red 'fas fa-fan' flat%}这是三片呢？还是四片？{% endnote %}

   {% note orange 'fas fa-battery-half' flat %}你是刷 Visa 还是 UnionPay{% endnote %}

   {% note purple 'far fa-hand-scissors' flat %}剪刀石头布{% endnote %}

   {% note green 'fab fa-internet-explorer' flat %}前端最讨厌的浏览器{% endnote %}

4. `disabled`样式

   {% note 'fab fa-cc-visa' disabled %}你是刷 Visa 还是 UnionPay{% endnote %}

   {% note blue 'fas fa-bullhorn' disabled %}2021年快到了....{% endnote %}

   {% note pink 'fas fa-car-crash' disabled %}小心开车 安全至上{% endnote %}

   {% note red 'fas fa-fan' disabled %}这是三片呢？还是四片？{% endnote %}

   {% note orange 'fas fa-battery-half' disabled %}你是刷 Visa 还是 UnionPay{% endnote %}

   {% note purple 'far fa-hand-scissors' disabled %}剪刀石头布{% endnote %}

   {% note green 'fab fa-internet-explorer' disabled %}前端最讨厌的浏览器{% endnote %}

5. `no-icon`样式

   {% note no-icon %}你是刷 Visa 还是 UnionPay{% endnote %}

   {% note blue no-icon %}2021年快到了....{% endnote %}

   {% note pink no-icon %}小心开车 安全至上{% endnote %}

   {% note red no-icon %}这是三片呢？还是四片？{% endnote %}

   {% note orange no-icon %}你是刷 Visa 还是 UnionPay{% endnote %}

   {% note purple no-icon %}剪刀石头布{% endnote %}

   {% note green no-icon %}前端最讨厌的浏览器{% endnote %}

{% endfolding %}

<!-- endtab -->
<!-- tab 示例源码@icon -->
{% folding blue, 方法一 %}
1. `simple`样式
```
{% note simple %}默认 提示块标签{% endnote %}

{% note default simple %}default 提示块标签{% endnote %}

{% note primary simple %}primary 提示块标签{% endnote %}

{% note success simple %}success 提示块标签{% endnote %}

{% note info simple %}info 提示块标签{% endnote %}

{% note warning simple %}warning 提示块标签{% endnote %}

{% note danger simple %}danger 提示块标签{% endnote %}
```
2. `modern`样式
```
{% note modern %}默认 提示块标签{% endnote %}

{% note default modern %}default 提示块标签{% endnote %}

{% note primary modern %}primary 提示块标签{% endnote %}

{% note success modern %}success 提示块标签{% endnote %}

{% note info modern %}info 提示块标签{% endnote %}

{% note warning modern %}warning 提示块标签{% endnote %}

{% note danger modern %}danger 提示块标签{% endnote %}
```
3. `flat`样式
```
{% note flat %}默认 提示块标签{% endnote %}

{% note default flat %}default 提示块标签{% endnote %}

{% note primary flat %}primary 提示块标签{% endnote %}

{% note success flat %}success 提示块标签{% endnote %}

{% note info flat %}info 提示块标签{% endnote %}

{% note warning flat %}warning 提示块标签{% endnote %}

{% note danger flat %}danger 提示块标签{% endnote %}
```
4. `disabled`样式
```
{% note disabled %}默认 提示块标签{% endnote %}

{% note default disabled %}default 提示块标签{% endnote %}

{% note primary disabled %}primary 提示块标签{% endnote %}

{% note success disabled %}success 提示块标签{% endnote %}

{% note info disabled %}info 提示块标签{% endnote %}

{% note warning disabled %}warning 提示块标签{% endnote %}

{% note danger disabled %}danger 提示块标签{% endnote %}
```
5. `no-icon`样式
```
{% note no-icon %}默认 提示块标签{% endnote %}

{% note default no-icon %}default 提示块标签{% endnote %}

{% note primary no-icon %}primary 提示块标签{% endnote %}

{% note success no-icon %}success 提示块标签{% endnote %}

{% note info no-icon %}info 提示块标签{% endnote %}

{% note warning no-icon %}warning 提示块标签{% endnote %}

{% note danger no-icon %}danger 提示块标签{% endnote %}
```
{% endfolding %}

{% folding blue, 方法二 %}
1. `simple`样式
```
{% note 'fab fa-cc-visa' simple %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note blue 'fas fa-bullhorn' simple %}2021年快到了....{% endnote %}

{% note pink 'fas fa-car-crash' simple %}小心开车 安全至上{% endnote %}

{% note red 'fas fa-fan' simple%}这是三片呢？还是四片？{% endnote %}

{% note orange 'fas fa-battery-half' simple %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note purple 'far fa-hand-scissors' simple %}剪刀石头布{% endnote %}

{% note green 'fab fa-internet-explorer' simple %}前端最讨厌的浏览器{% endnote %}
```
2. `modern`样式
```
{% note 'fab fa-cc-visa' modern %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note blue 'fas fa-bullhorn' modern %}2021年快到了....{% endnote %}

{% note pink 'fas fa-car-crash' modern %}小心开车 安全至上{% endnote %}

{% note red 'fas fa-fan' modern%}这是三片呢？还是四片？{% endnote %}

{% note orange 'fas fa-battery-half' modern %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note purple 'far fa-hand-scissors' modern %}剪刀石头布{% endnote %}

{% note green 'fab fa-internet-explorer' modern %}前端最讨厌的浏览器{% endnote %}
```
3. `flat`样式
```
{% note 'fab fa-cc-visa' flat %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note blue 'fas fa-bullhorn' flat %}2021年快到了....{% endnote %}

{% note pink 'fas fa-car-crash' flat %}小心开车 安全至上{% endnote %}

{% note red 'fas fa-fan' flat%}这是三片呢？还是四片？{% endnote %}

{% note orange 'fas fa-battery-half' flat %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note purple 'far fa-hand-scissors' flat %}剪刀石头布{% endnote %}

{% note green 'fab fa-internet-explorer' flat %}前端最讨厌的浏览器{% endnote %}
```
4. `disabled`样式
```
{% note 'fab fa-cc-visa' disabled %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note blue 'fas fa-bullhorn' disabled %}2021年快到了....{% endnote %}

{% note pink 'fas fa-car-crash' disabled %}小心开车 安全至上{% endnote %}

{% note red 'fas fa-fan' disabled %}这是三片呢？还是四片？{% endnote %}

{% note orange 'fas fa-battery-half' disabled %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note purple 'far fa-hand-scissors' disabled %}剪刀石头布{% endnote %}

{% note green 'fab fa-internet-explorer' disabled %}前端最讨厌的浏览器{% endnote %}
```
5. `no-icon`样式
```
{% note no-icon %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note blue no-icon %}2021年快到了....{% endnote %}

{% note pink no-icon %}小心开车 安全至上{% endnote %}

{% note red no-icon %}这是三片呢？还是四片？{% endnote %}

{% note orange no-icon %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note purple no-icon %}剪刀石头布{% endnote %}

{% note green no-icon %}前端最讨厌的浏览器{% endnote %}
```
{% endfolding %}
<!-- endtab -->
{% endtabs %}
 
## 上标标签 tip

{% tip cogs %}
在大多数情况下上标标签和引用`note`的功能相似，两者基本可以无缝切换
{% endtip %}
{% note warning flat %}
另外值得注意的一点是`note`引用自定义图标是直接引入，需要加引号；而上标标签`tip`则是控制类型，因此无需加引号
{% endnote %}

{% tabs btf-tip %}
<!-- tab 标签语法@icon -->
```
{% tip [参数，可选] %}文本内容{% endtip %}
```
<!-- endtab -->
<!-- tab 参数配置@icon -->
1. 样式: success,error,warning,bolt,ban,home,sync,cogs,key,bell
2. 自定义图标：支持fontawesome
<!-- endtab -->
<!-- tab 样式预览@icon -->
{% tip %}default{% endtip %}
{% tip info %}info{% endtip %}
{% tip success %}success{% endtip %}
{% tip error %}error{% endtip %}
{% tip warning %}warning{% endtip %}
{% tip bolt %}bolt{% endtip %}
{% tip ban %}ban{% endtip %}
{% tip home %}home{% endtip %}
{% tip sync %}sync{% endtip %}
{% tip cogs %}cogs{% endtip %}
{% tip key %}key{% endtip %}
{% tip bell %}bell{% endtip %}
{% tip fa-atom %}自定义font awesome图标{% endtip %}
<!-- endtab -->
<!-- tab 示例源码@icon -->
```
{% tip %}default{% endtip %}
{% tip info %}info{% endtip %}
{% tip success %}success{% endtip %}
{% tip error %}error{% endtip %}
{% tip warning %}warning{% endtip %}
{% tip bolt %}bolt{% endtip %}
{% tip ban %}ban{% endtip %}
{% tip home %}home{% endtip %}
{% tip sync %}sync{% endtip %}
{% tip cogs %}cogs{% endtip %}
{% tip key %}key{% endtip %}
{% tip bell %}bell{% endtip %}
{% tip fa-atom %}自定义font awesome图标{% endtip %}
```
<!-- endtab -->
{% endtabs %}

## 链接卡片 link

{% tabs btf-link %}
<!-- tab 标签语法@icon -->
```
{% link 标题, 链接, 图片链接（可选） %}
```
<!-- endtab -->
<!-- tab 样式预览@icon -->
{% link 糖果屋教程贴, https://akilar.top/posts/615e2dec/, /img/siteicon/favicon.ico %}
<!-- endtab -->
<!-- tab 示例源码@icon -->
```
{% link 糖果屋教程贴, https://akilar.top/posts/615e2dec/, /img/siteicon/favicon.ico %}
```
<!-- endtab -->
{% endtabs %}

## 时间线 TimeLine
{% note warning flat %}
为避免原生butterfly与外挂标签插件的冲突，本时间线引用的是原生butterfly的教程[TimeLine](https://butterfly.js.org/posts/ceeb73f/?highlight=note#Timeline)
{% endnote %}
{% tabs btf-timeline %}
<!-- tab 标签语法@icon -->
```
{% timeline title,color %}

<!-- timeline title -->

xxxxx

<!-- endtimeline -->
<!-- timeline title -->

xxxxx

<!-- endtimeline -->

{% endtimeline %}

```
<!-- endtab -->
<!-- tab 参数配置@icon -->
1. title：标题
2. color：时间线颜色
<!-- endtab -->
<!-- tab 样式预览@icon -->
{% timeline 2022,pink %}

<!-- timeline 01-02 -->

这是测试页面

<!-- endtimeline -->

{% endtimeline %}
<!-- endtab -->
<!-- tab 示例源码@icon -->
```
{% timeline 2022,pink %}

<!-- timeline 01-02 -->

这是测试页面

<!-- endtimeline -->

{% endtimeline %}
```
<!-- endtab -->
{% endtabs %}

## 网站卡片 sites

{% tabs btf-sites %}
<!-- tab 标签语法@icon -->
```
{% sitegroup %}
{% site 标题, url=链接, screenshot=截图链接, avatar=头像链接（可选）, description=描述（可选） %}
{% site 标题, url=链接, screenshot=截图链接, avatar=头像链接（可选）, description=描述（可选） %}
{% endsitegroup %}
```
<!-- endtab -->
<!-- tab 样式预览@icon -->
{% sitegroup %}
{% site xaoxuu, url=https://xaoxuu.com, screenshot=https://i.loli.net/2020/08/21/VuSwWZ1xAeUHEBC.jpg, avatar=https://cdn.jsdelivr.net/gh/xaoxuu/cdn-assets/avatar/avatar.png, description=简约风格 %}
{% site inkss, url=https://inkss.cn, screenshot=https://i.loli.net/2020/08/21/Vzbu3i8fXs6Nh5Y.jpg, avatar=https://cdn.jsdelivr.net/gh/inkss/common@master/static/web/avatar.jpg, description=这是一段关于这个网站的描述文字 %}
{% site MHuiG, url=https://blog.mhuig.top, screenshot=https://i.loli.net/2020/08/22/d24zpPlhLYWX6D1.png, avatar=https://cdn.jsdelivr.net/gh/MHuiG/imgbed@master/data/p.png, description=这是一段关于这个网站的描述文字 %}
{% site Colsrch, url=https://colsrch.top, screenshot=https://i.loli.net/2020/08/22/dFRWXm52OVu8qfK.png, avatar=https://cdn.jsdelivr.net/gh/Colsrch/images/Colsrch/avatar.jpg, description=这是一段关于这个网站的描述文字 %}
{% site Linhk1606, url=https://linhk1606.github.io, screenshot=https://i.loli.net/2020/08/21/3PmGLCKicnfow1x.png, avatar=https://i.loli.net/2020/02/09/PN7I5RJfFtA93r2.png, description=这是一段关于这个网站的描述文字 %}
{% endsitegroup %}
<!-- endtab -->
<!-- tab 示例源码@icon -->
```
{% sitegroup %}
{% site xaoxuu, url=https://xaoxuu.com, screenshot=https://i.loli.net/2020/08/21/VuSwWZ1xAeUHEBC.jpg, avatar=https://cdn.jsdelivr.net/gh/xaoxuu/cdn-assets/avatar/avatar.png, description=简约风格 %}
{% site inkss, url=https://inkss.cn, screenshot=https://i.loli.net/2020/08/21/Vzbu3i8fXs6Nh5Y.jpg, avatar=https://cdn.jsdelivr.net/gh/inkss/common@master/static/web/avatar.jpg, description=这是一段关于这个网站的描述文字 %}
{% site MHuiG, url=https://blog.mhuig.top, screenshot=https://i.loli.net/2020/08/22/d24zpPlhLYWX6D1.png, avatar=https://cdn.jsdelivr.net/gh/MHuiG/imgbed@master/data/p.png, description=这是一段关于这个网站的描述文字 %}
{% site Colsrch, url=https://colsrch.top, screenshot=https://i.loli.net/2020/08/22/dFRWXm52OVu8qfK.png, avatar=https://cdn.jsdelivr.net/gh/Colsrch/images/Colsrch/avatar.jpg, description=这是一段关于这个网站的描述文字 %}
{% site Linhk1606, url=https://linhk1606.github.io, screenshot=https://i.loli.net/2020/08/21/3PmGLCKicnfow1x.png, avatar=https://i.loli.net/2020/02/09/PN7I5RJfFtA93r2.png, description=这是一段关于这个网站的描述文字 %}
{% endsitegroup %}
```
<!-- endtab -->
{% endtabs %}


## 音频 audio

{% tabs btf-audio %}
<!-- tab 标签语法@icon -->
```
{% audio 音频链接 %}
```
<!-- endtab -->
<!-- tab 样式预览@icon -->
{% audio https://github.com/volantis-x/volantis-docs/releases/download/assets/Lumia1020.mp3 %}
<!-- endtab -->
<!-- tab 示例源码@icon -->
```
{% audio https://github.com/volantis-x/volantis-docs/releases/download/assets/Lumia1020.mp3 %}
```
<!-- endtab -->
{% endtabs %}


## 视频 video

{% tabs btf-video %}
<!-- tab 标签语法@icon -->
```
{% video 视频链接 %}
```
<!-- endtab -->
<!-- tab 样式预览@icon -->
1. 100%宽度
   {% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
2. 50%宽度
   {% videos, 2 %}
   {% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
   {% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
   {% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
   {% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
   {% endvideos %}
3. 25%宽度
   {% videos, 4 %}
   {% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
   {% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
   {% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
   {% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
   {% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
   {% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
   {% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
   {% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
   {% endvideos %}

<!-- endtab -->
<!-- tab 示例源码@icon -->
1. 100%宽度
```
{% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
```
1. 50%宽度
```
{% videos, 2 %}
{% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
{% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
{% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
{% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
{% endvideos %}
```
1. 25%宽度
```
{% videos, 4 %}
{% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
{% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
{% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
{% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
{% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
{% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
{% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
{% video https://github.com/volantis-x/volantis-docs/releases/download/assets/IMG_0341.mov %}
{% endvideos %}
```
<!-- endtab -->
{% endtabs %}


## 折叠框 folding

{% tabs btf-folding %}
<!-- tab 标签语法@icon -->
```
{% folding 参数（可选）, 标题 %}
![](https://cdn.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/41F215B9-261F-48B4-80B5-4E86E165259E.jpeg)
{% endfolding %}
```
<!-- endtab -->
<!-- tab 配置参数@icon -->
1. 颜色：blue, cyan, green, yellow, red
2. 状态：open表示默认打开
<!-- endtab -->
<!-- tab 样式预览@icon -->
{% folding 查看图片测试 %}

![](https://cdn.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/41F215B9-261F-48B4-80B5-4E86E165259E.jpeg)

{% endfolding %}

{% folding cyan open, 查看默认打开的折叠框 %}

这是一个默认打开的折叠框。

{% endfolding %}

{% folding green, 查看代码测试 %}
假装这里有代码块（代码块没法嵌套代码块）
{% endfolding %}

{% folding yellow, 查看列表测试 %}

- haha
- hehe

{% endfolding %}

{% folding red, 查看嵌套测试 %}

{% folding blue, 查看嵌套测试2 %}

{% folding 查看嵌套测试3 %}

hahaha <span><img src='https://cdn.jsdelivr.net/gh/volantis-x/cdn-emoji/tieba/%E6%BB%91%E7%A8%BD.png' style='height:24px'></span>

{% endfolding %}

{% endfolding %}

{% endfolding %}
<!-- endtab -->
<!-- tab 示例源码@icon -->
```
{% folding 查看图片测试 %}

![](https://cdn.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/41F215B9-261F-48B4-80B5-4E86E165259E.jpeg)

{% endfolding %}

{% folding cyan open, 查看默认打开的折叠框 %}

这是一个默认打开的折叠框。

{% endfolding %}

{% folding green, 查看代码测试 %}
假装这里有代码块（代码块没法嵌套代码块）
{% endfolding %}

{% folding yellow, 查看列表测试 %}

- haha
- hehe

{% endfolding %}

{% folding red, 查看嵌套测试 %}

{% folding blue, 查看嵌套测试2 %}

{% folding 查看嵌套测试3 %}

hahaha <span><img src='https://cdn.jsdelivr.net/gh/volantis-x/cdn-emoji/tieba/%E6%BB%91%E7%A8%BD.png' style='height:24px'></span>

{% endfolding %}

{% endfolding %}

{% endfolding %}
```
<!-- endtab -->
{% endtabs %}


## 分栏 tab

{% tabs btf-tab %}
<!-- tab 标签语法@icon -->
```
{% tabs Unique name, [index] %}
<!-- tab [Tab caption] [@icon] -->
Any content (support inline tags too).
<!-- endtab -->
{% endtabs %}


```
<!-- endtab -->
<!-- tab 参数配置@icon -->
1. Unique name :
选项卡块标签的唯一名称，不带逗号。
将在#id中用作每个标签及其索引号的前缀。
如果名称中包含空格，则对于生成#id，所有空格将由破折号代替。
仅当前帖子/页面的URL必须是唯一的！
2. [index]:
活动选项卡的索引号。
如果未指定，将选择第一个标签（1）。
如果index为-1，则不会选择任何选项卡。
可选参数。
3. [Tab caption]:
当前选项卡的标题。
如果未指定标题，则带有制表符索引后缀的唯一名称将用作制表符的标题。
如果未指定标题，但指定了图标，则标题将为空。
可选参数。
4. [@icon]:
FontAwesome图标名称（全名，看起来像“ fas fa-font”）
可以指定带空格或不带空格；
例如’Tab caption @icon’ 和 ‘Tab caption@icon’.
可选参数。
<!-- endtab -->
<!-- tab 样式预览@icon -->
{% tabs test1 %}
<!-- tab -->
**This is Tab 1.**
<!-- endtab -->

<!-- tab -->
**This is Tab 2.**
<!-- endtab -->

<!-- tab -->
**This is Tab 3.**
<!-- endtab -->
{% endtabs %}
<!-- endtab -->
<!-- tab 示例源码@icon -->
```
{% tabs test1 %}
<!-- tab -->
**This is Tab 1.**
<!-- endtab -->

<!-- tab -->
**This is Tab 2.**
<!-- endtab -->

<!-- tab -->
**This is Tab 3.**
<!-- endtab -->
{% endtabs %}
```
<!-- endtab -->
{% endtabs %}


## 数据图标 icon

{% tabs btf-icon %}
<!-- tab 标签语法@icon -->
```
{% icon [icon-xxxx],[font-size] %}
```
<!-- endtab -->
<!-- tab 参数配置@icon -->
1. `icon-xxxx`：表示图标`font-class`,可以在自己的阿里矢量图标库项目的`font-class`引用方案内查询并复制。
2. `font-size`：表示图标大小，直接填写数字即可，单位为`em`。图标大小默认值为`1em`。
<!-- endtab -->
<!-- tab 样式预览@icon -->
{% icon icon-rat_zi %}{% icon icon-rat,2 %}

{% icon icon-ox_chou,3 %}{% icon icon-ox,4 %}

{% icon icon-tiger_yin,5 %}{% icon icon-tiger,6 %}

{% icon icon-rabbit_mao,1 %}{% icon icon-rabbit,2 %}

{% icon icon-dragon_chen,3 %}{% icon icon-dragon,4 %}

{% icon icon-snake_si,5 %}{% icon icon-snake,6 %}

{% icon icon-horse_wu %}{% icon icon-horse,2 %}

{% icon icon-goat_wei,3 %}{% icon icon-goat,4 %}

{% icon icon-monkey_shen,5 %}{% icon icon-monkey,6 %}

{% icon icon-rooster_you %}{% icon icon-rooster,2 %}

{% icon icon-dog_xu,3 %}{% icon icon-dog,4 %}

{% icon icon-boar_hai,5 %}{% icon icon-boar,6 %}
<!-- endtab -->
<!-- tab 示例源码@icon -->
```
{% icon icon-rat_zi %}{% icon icon-rat,2 %}

{% icon icon-ox_chou,3 %}{% icon icon-ox,4 %}

{% icon icon-tiger_yin,5 %}{% icon icon-tiger,6 %}

{% icon icon-rabbit_mao,1 %}{% icon icon-rabbit,2 %}

{% icon icon-dragon_chen,3 %}{% icon icon-dragon,4 %}

{% icon icon-snake_si,5 %}{% icon icon-snake,6 %}

{% icon icon-horse_wu %}{% icon icon-horse,2 %}

{% icon icon-goat_wei,3 %}{% icon icon-goat,4 %}

{% icon icon-monkey_shen,5 %}{% icon icon-monkey,6 %}

{% icon icon-rooster_you %}{% icon icon-rooster,2 %}

{% icon icon-dog_xu,3 %}{% icon icon-dog,4 %}

{% icon icon-boar_hai,5 %}{% icon icon-boar,6 %}
```
<!-- endtab -->
{% endtabs %}
