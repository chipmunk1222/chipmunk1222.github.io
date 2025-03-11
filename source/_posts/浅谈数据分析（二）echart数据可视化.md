---
title: 浅谈数据分析（二）echarts数据可视化
date: 2024-11-19 10:08:34
tags: 
  - 数据分析 
  - echarts 
  - 可视化大屏
description: 详解echarts的使用以及可视化大屏制作技巧
swiper_index: 3
---

{% tip cogs %}
本篇主要讲述使用echarts制作可视化大屏的一些技巧，同时将其用作数据分析中的数据可视化部分
{% endtip %}

# 简介
数据可视化的目的是将一串冰冷的数据用图形或图表的方式展示出来，以便更有效和直观地传达技术。通过数据可视化的方式，抽象离散的数据将更容易被解析识别

# 可视化适配方案
{% note info flat %}
大屏可视化像素适配一般使用分辨率自适应的方式，响应式的分辨率适配一般用于需要指定设备的需求
{% endnote %}
## 获取DPR（Device Pixel Ratio）
`DPR`即设备像素比率，具体指`css`像素与设备物理像素的比率，例如，`DPR`为`2`则表示一个`css`像素由`2*2`个物理像素构成。

获取`DPR`
```js
var dpr = window.devicePixelRatio || 1;
```
## 设置全局字体大小
监听窗口`DOM`加载完成后根据获取的`dpr`设置全局字体大小
```js
function setBodyFontSize() {
  if (document.body) {
    document.body.style.fontSize = 12 * dpr + "px";
  } else {
    document.addEventListener("DOMContentLoaded", setBodyFontSize);
  }
}
setBodyFontSize();
```
{% note primary flat %}
由于`css`像素一致而不同设备的物理像素不同，因此，将`css`像素转化为设备像素，从而使不同`dpr`设备上的用户有相同的使用体验
{% endnote %}
## 设置rem单位
比较`px`、`em`、`rem`
>`px`:绝对像素单位，由`css`本身决定的像素单位
`em`：相对于父元素字体大小的单位，一般用于相对计算，可以继承叠加，因此当嵌套层数变多后就会难以控制
`rem`：相对于`html`根元素字体大小的单位，容易计算和统一控制

由此可见，`rem`自然是最适合做可视化大屏的单位
```js
var docEl = document.documentElement;

function setRemUnit() {
  var rem = docEl.clientWidth / 24;
  docEl.style.fontSize = rem + "px";
}
setRemUnit();
```
首先将屏幕宽度分为`24`份用于容器布局，即`1rem`对应屏幕宽度的`1/24`，然后调整根节点字体大小，灵活适应不同分辨率的屏幕

## 监听屏幕大小的变化
监听`resize`事件，当屏幕大小变化时，实时重新计算`rem`大小
```python
window.addEventListener("resize", setRemUnit);
window.addEventListener("pageshow", function(e) {
  if (e.persisted) {
    setRemUnit();
  }
});
```
{% note info flat %}
`pageshow`表示页面打开时触发，`e.persisted`表示页面资源从缓存中加载时触发
{% endnote %}

## 检测0.5px支持
用于在高分辨率设备上使图表更加细致
```js
if (dpr >= 2) {
  var fakeBody = document.createElement("body");
  var testElement = document.createElement("div");
  testElement.style.border = ".5px solid transparent";
  fakeBody.appendChild(testElement);
  docEl.appendChild(fakeBody);
  if (testElement.offsetHeight === 1) {
    docEl.classList.add("hairlines");
  }
  docEl.removeChild(fakeBody);
}
```

## flexible.js完整代码
{% folding blue, 点击查看完整代码 %}
```js
// 来自 https://github.com/amfe/lib-flexible/blob/2.0/index.js
(function flexible(window, document) {
  var docEl = document.documentElement;
  // 获取当前显示设备的物理像素分辨率与CSS像素分辨率之比;
  var dpr = window.devicePixelRatio || 1;

  //根据分辨率调整全局字体大小
  function setBodyFontSize() {
    // html已完成加载，则立即调整字体大小，否则等待html加载完成再调整字体大小
    if (document.body) {
      document.body.style.fontSize = 12 * dpr + "px";
    } else {
      // 监听DOMContentLoaded 事件——当初始的 HTML 文档被完全加载和解析完成之后触发，无需等待样式表
      document.addEventListener("DOMContentLoaded", setBodyFontSize);
    }
  }
  setBodyFontSize();

  // 根据屏幕宽度，重置1rem的长度为当前屏幕宽度的1/10
  function setRemUnit() {
    var rem = docEl.clientWidth / 24;
    // 1rem的值永远为根元素的字体大小，所以此处通过调整全局字体大小来重置rem
    docEl.style.fontSize = rem + "px";
  }

  setRemUnit();

  // 监听resize事件——屏幕大小发生变化时触发
  window.addEventListener("resize", setRemUnit);
  // 监听pageshow事件——显示页面时触发
  window.addEventListener("pageshow", function(e) {
    // 若是浏览器中点击后退时显示页面，则重置rem
    if (e.persisted) {
      setRemUnit();
    }
  });

  // 检测是否支持0.5px
  if (dpr >= 2) {
    var fakeBody = document.createElement("body");
    var testElement = document.createElement("div");
    testElement.style.border = ".5px solid transparent";
    fakeBody.appendChild(testElement);
    docEl.appendChild(fakeBody);
    if (testElement.offsetHeight === 1) {
      docEl.classList.add("hairlines");
    }
    docEl.removeChild(fakeBody);
  }
})(window, document);
```
{% endfolding %}
# echarts使用技巧
`echarts`官方说明文档[echarts](https://echarts.apache.org/handbook/zh/get-started)
## 引入echarts
通过`CDN`或`npm`引入`echarts`资源包
```js
<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js"></script>
```
或使用`npm`
```js
npm install echarts --save

//在项目中
import * as echarts from 'echarts'; 

//在原生html文件中
<script src="/dist/echarts.min.js"></script>  //本地资源包地址
```
{% note warning flat %}
使用`echarts`时需要调用生成函数，在原生`html`中可以使用立即执行函数调用，在`vue`中可以在`mounted()`生命周期钩子中调用初始化函数
{% endnote %}

## 初始化echarts表格
准备好一个`dom`元素，并初始化一个`echarts`实例
{% note info flat %}
在框架如`vue`中可以使用`ref`获取`dom`实例
{% endnote %}
```js
var myChart = echarts.init(document.getElementById('main'));
```
{% note warning flat %}
图表绑定的`dom`元素需要给一个确定的宽高
{% endnote %}

## 设置表格配置项
为`echarts`表格添加配置项，使其符合使用需求
```js
  var option = {
      // backgroundColor: '#000',
      tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}'
      },
      visualMap: {
          min: 0,
          max: 70,
          left: 'left',
          top: 'bottom',
          text: ['High','Low'],           // 文本，默认为数值文本
          calculable: true,
          textStyle: {
            color: '#fff',
          },
    
          inRange: {
              color: ['#F9FC91', '#FFBF3F', '#F62929']
          }
      },
      geo: {
          map: 'world',
          roam: true,
          zoom: 1.2,
          label: {
              emphasis: {
                  show: false
              }
          },
          itemStyle: {
              normal: {
                  areaColor: '#e6f4f1',
                  borderColor: '#404a59'
              },
              emphasis: {
                  areaColor: '#2a333d'
              }
          },
          light: { main: { intensity: 1, shadow: true, shadowQuality: 'high' } }
      },
      series: [
          {
              type: 'map',
              map: 'world',
              geoIndex: 0,
              data: [{"name":"United States","value":62},{"name":"China","value":21},{"name":"United Kingdom","value":16},{"name":"Japan","value":8},{"name":"France","value":7},{"name":"Italy","value":6},{"name":"Germany","value":5},{"name":"South Korea","value":5},{"name":"Canada","value":4},{"name":"New Zealand","value":3},{"name":"Taiwan","value":3},{"name":"India","value":2},{"name":"Switzerland","value":2},{"name":"Mexico","value":1},{"name":"Lebanon","value":1},{"name":"Cyprus","value":1},{"name":"Qatar","value":1},{"name":"Poland","value":1},{"name":"Spain","value":1},{"name":"Iran","value":1},{"name":"Denmark","value":1},{"name":"Sweden","value":1}]
          }
      ]
  };

  myChart.setOption(option);
```

## echarts常见配置项一览
{% tip cogs %}
详情参照`echarts`官方配置项文档[echarts配置项](https://echarts.apache.org/zh/option.html)
{% endtip %}
### 标题（title）
标题可以设置主标题、副标题、标题的位置、文本样式等
```js
title: {
    text: '主标题',            // 主标题文本
    subtext: '副标题',         // 副标题文本
    left: 'center',            // 标题的位置，可选值：'left', 'center', 'right'
    textStyle: {               // 主标题文本样式
        color: '#333',
        fontSize: 18
    },
    subtextStyle: {            // 副标题文本样式
        color: '#aaa',
        fontSize: 14
    }
}
```
### 提示框（tooltip）
提示框用于鼠标悬停时设置数据点展示信息
```js
tooltip: {
    trigger: 'axis',           // 触发类型，可选值：'item', 'axis', 'none'
    axisPointer: {             // 坐标轴指示器配置项
        type: 'shadow'         // 指示器类型，可选值：'line', 'shadow', 'none'
    },
    formatter: '{a} <br/>{b}: {c} ({d}%)'  // 提示框格式化文本
}
```
### 图例（legend）
图例用于显示图表数据系列的标示
```js 
legend: {
    orient: 'vertical',        // 布局方向，可选值：'horizontal', 'vertical'
    left: 'left',              // 图例位置
    data: ['销量']             // 图例数据项
}
```
### 网格（grid）
设置表格的内边距以及布局
```js 
grid: {
    left: '3%',                // 网格左边距
    right: '4%',               // 网格右边距
    bottom: '3%',              // 网格下边距
    containLabel: true         // 是否包含坐标轴的刻度标签
}
```
### 坐标轴（xAxis和yAxis）
设置图表的 X 轴和 Y 轴，包含类型、数据、轴线样式等
```js
xAxis: {
    type: 'category',          // 坐标轴类型，可选值：'category', 'value', 'time', 'log'
    boundaryGap: false,        // 坐标轴两边留白策略
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],  // 坐标轴数据
    axisLine: {                // 坐标轴轴线配置
        lineStyle: {
            color: '#333'
        }
    }
},
yAxis: {
    type: 'value',             // 坐标轴类型
    axisLine: {                // 坐标轴轴线配置
        lineStyle: {
            color: '#333'
        }
    }
}
```
### 数据系列（series）
图表配置核心，配置具体的数据和图表类型
```js
series: [{
    name: '销量',              // 系列名称
    type: 'bar',               // 图表类型，可选值：'line', 'bar', 'pie', 'scatter', 等
    data: [5, 20, 36, 10, 10, 20],  // 系列数据
    itemStyle: {               // 数据点样式
        color: '#3398DB'
    }
}]
```
### 视觉映射（visualMap）
数据范围映射关系
```js
visualMap: {
    min: 0,
    max: 100,
    left: 'left',
    top: 'bottom',
    text: ['高', '低'],        // 文本，默认为数值文本
    calculable: true,
    inRange: {
        color: ['#50a3ba', '#eac763', '#d94e5d']  // 映射颜色范围
    }
}
```
### 工具栏（toolbox）
提供数据视图、下载图片、动态类型切换等多种附加功能
```js
toolbox: {
    feature: {
        saveAsImage: {         // 保存为图片
            title: '保存'
        },
        dataView: {            // 数据视图
            title: '数据视图',
            readOnly: false
        },
        magicType: {           // 动态类型切换
            type: ['line', 'bar']
        },
        restore: {             // 还原
            title: '还原'
        },
        dataZoom: {            // 数据区域缩放
            title: {
                zoom: '区域缩放',
                back: '缩放还原'
            }
        }
    }
}
```
## 动态修改图表大小
配置完表格后的最后一步就是监听屏幕分辨率变化，动态设置表格大小
在配置函数最后加上这么一段代码
```js
  window.addEventListener("resize", function () {
    myChart.resize();
  });
```
## 示例结果展示
基于`Python`爬虫数据，使用`echarts`制作的豆瓣`top100`电影票房分析可视化大屏

![code](/img/src/echarts.png "top100电影")
