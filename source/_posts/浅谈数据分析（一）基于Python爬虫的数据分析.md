---
title: 浅谈数据分析（一）基于Python爬虫的数据分析
date: 2024-12-31 17:12:34
tags:
  - Python 
  - 数据分析 
  - 爬虫
description: 从宏观视角系统性地介绍数据分析的步骤
category: 项目总结
---

{% tip cogs %}
本文将对数据分析流程做一个综述以及探讨下`Python`爬虫的使用
{% endtip %}

{% tip warning %}
对最近做的**Python**数据分析项目做一个记录，主要涉及技术实现部分，市场部分基本一笔带过，想要深入了解数据分析请参考专业教程
{% endtip %}

-------------------------------

# 前言
## 什么是数据分析
数据分析即从原始数据中提取有价值的信息，通过对收集的信息进行统计分类，市场比较，以及机器学习等手段，发现数据中潜在的规律、趋势以及模式，从而达到支持决策，优化过程，发掘市场潜力等目的

## 数据分析主要流程
数据分析的主要流程由如下部分构成：
>1. 市场需求分析：为什么做这个数据分析？有什么实际需求
2. 数据挖掘：通过`Python`爬虫等数据挖掘工具收集原始数据，原始数据是后续一切分析的基础
3. 数据清洗：包括处理缺失值，异常值，删除重复数据等
4. 数据处理：将数据格式化为可以被识别或处理的统一格式，如表格等
5. 数据可视化：将处理后的数据进行可视化操作，便于分析
6. 数据分析：基于数据模型对数据进行进一步详细分析

# 数据挖掘
在确定初步需求分析之后就可以进行原始数据挖掘了，如下面将演示使用`Python`爬虫挖掘豆瓣`top250`电影数据
{% note warning flat %}
爬虫只是进行数据挖掘最常见的方式之一，并不是说数据挖掘只有这一种方式
{% endnote %}

## 必要库安装
命令行输入：
```python
pip install requests beautifulsoup4 lxml
```
文件中引入：
```python
import requests
from bs4 import BeautifulSoup
import csv
```
{% note info flat %}
`request`库用于发送请求，`BeautifulSoup`库用来解析页面`html`，`csv`库用来导出数据
{% endnote %}

## 解析页面数据

设置请求`URL`地址和请求头
```python
url = 'https://movie.douban.com/top250'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
}
```
配置页面解析函数
```python
def parse_html(html, writer):
    soup = BeautifulSoup(html, 'lxml')
    movie_list = soup.find('ol', class_='grid_view').find_all('li')
    for movie in movie_list:
        title = movie.find('div', class_='hd').find('span', class_='title').get_text()
        rating_num = movie.find('div', class_='star').find('span', class_='rating_num').get_text()
        comment_num = movie.find('div', class_='star').find_all('span')[-1].get_text()
        info = movie.find('div',class_='bd').find('p').get_text().strip().split('\n')[-1]
        movie_year = info.split('/')[0].strip()
        movie_area = info.split('/')[1].strip()
        movie_type = info.split('/')[2].strip()
        writer.writerow([title, rating_num, comment_num,movie_year, movie_area, movie_type])
```
{% note orange 'fas fa-wand-magic' flat %}
解析页面`html`时对`DOM`元素的搜索和`css`选择器有些相似，不需要逐级查找，只需要确保从父级节点往下的顺序即可
{% endnote %}

## 页面数据保存
将数据导出到`.csv`表格中
```python
# 保存数据函数
def save_data():
    with open('./douban_movie_top100.csv', 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.writer(f)
        writer.writerow(['电影名称', '评分', '评价人数', '年份', '地区', '类型'])

        for i in range(4):  # 每页25条记录，配置查询页数
            try:
                response = requests.get(url + '?start=' + str(i*25) + '&filter=', headers=headers)
                response.raise_for_status()  # 检查请求是否成功
                parse_html(response.text, writer)
            except requests.exceptions.RequestException as e:
                print(f"Error fetching page {i}: {e}")
```
最后执行主程序:
```python
if __name__ == '__main__':
    save_data()
```
## 完整代码
{% folding blue, 查看完整代码与结果 %}
{% tabs top100-movie %}
<!-- tab 代码@icon -->
```python
import requests
from bs4 import BeautifulSoup
import csv

# 请求URL
url = 'https://movie.douban.com/top250'
# 请求头部
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
}

# 解析页面函数
def parse_html(html, writer):
    soup = BeautifulSoup(html, 'lxml')
    movie_list = soup.find('ol', class_='grid_view').find_all('li')
    for movie in movie_list:
        title = movie.find('div', class_='hd').find('span', class_='title').get_text()
        rating_num = movie.find('div', class_='star').find('span', class_='rating_num').get_text()
        comment_num = movie.find('div', class_='star').find_all('span')[-1].get_text()
        info = movie.find('div',class_='bd').find('p').get_text().strip().split('\n')[-1]
        movie_year = info.split('/')[0].strip()
        movie_area = info.split('/')[1].strip()
        movie_type = info.split('/')[2].strip()
        writer.writerow([title, rating_num, comment_num,movie_year, movie_area, movie_type])

# 保存数据函数
def save_data():
    with open('./douban_movie_top100.csv', 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.writer(f)
        writer.writerow(['电影名称', '评分', '评价人数', '年份', '地区', '类型'])

        for i in range(4):  # 确保抓取所有10页的电影数据
            try:
                response = requests.get(url + '?start=' + str(i*25) + '&filter=', headers=headers)
                response.raise_for_status()  # 检查请求是否成功
                parse_html(response.text, writer)
            except requests.exceptions.RequestException as e:
                print(f"Error fetching page {i}: {e}")
    
if __name__ == '__main__':
    save_data()

```
<!-- endtab -->
<!-- tab 结果查看@icon -->
|电影名称|评分|评价人数|年份|地区|类型|
|:----:|--|--|--|--|--|
|肖申克的救赎|9.7|3087928人评价|1994|美国|犯罪 剧情|
...
<!-- endtab -->
{% endtabs %}

{% endfolding %}

# 数据清洗与处理
在数据挖掘的过程中，难免会遇到数据缺失，数据重复、数据异常等问题，数据清洗就是做这类工作，如处理缺失值、重复数据、异常值等。

在简单地对数据进行初步筛检后，下一步就是对数据格式化规范化处理，变成能识别的数据格式。

{% tip sync %}
从某种程度上来说，数据处理和后端的工作逻辑很相似，因为都是面向数据？
{% endtip %}

基于上述`top100`电影数据的案例做以下处理：
{% folding blue, 查看完整代码 %}
{% tabs data %}
<!-- tab 评分@icon -->
从`csv`表格中提取数据并导出评分与数量关系
```python
import pandas as pd

# 读取 CSV 文件
df = pd.read_csv('douban_movie_top100.csv')

# 统计每个评分对应的数量
rating_counts = df['评分'].value_counts().reset_index()
rating_counts.columns = ['评分', '数量']

# 显示统计结果
print(rating_counts)

# 将统计结果导出为 CSV 文件
rating_counts.to_csv('rating_counts.csv', index=False)

```
<!-- endtab -->
<!-- tab 类型@icon -->
导出类型关系
```python
import pandas as pd

# 读取 CSV 文件
df = pd.read_csv('douban_movie_top100.csv')

# 将类型列拆分成多个类型
df['类型'] = df['类型'].str.split(' ')

# 展开类型列
df_exploded = df.explode('类型')

# 统计每种类型出现的数量
type_counts = df_exploded['类型'].value_counts().reset_index()
type_counts.columns = ['类型', '数量']

# 显示统计结果
print(type_counts)

# 将统计结果导出为 CSV 文件
type_counts.to_csv('type_counts.csv', index=False)

```
<!-- endtab -->
<!-- tab 发布地区@icon -->
导出电影发布地区与权重
```python
import pandas as pd

# 读取 CSV 文件
df = pd.read_csv('douban_movie_top100.csv')

# 将地区列拆分成多个地区
df['地区'] = df['地区'].str.split(' ')

# 展开地区列
df_exploded = df.explode('地区')

region_translation = {
    '中国大陆': 'China',
    '中国香港': 'China',
    '美国': 'United States',
    '日本': 'Japan',
    '意大利': 'Italy',
    '法国': 'France',
    '墨西哥': 'Mexico',
    '英国': 'United Kingdom',
    '加拿大': 'Canada',
    '德国': 'Germany',
    '瑞士': 'Switzerland',
    '黎巴嫩': 'Lebanon',
    '塞浦路斯': 'Cyprus',
    '卡塔尔': 'Qatar',
    '韩国': 'South Korea',
    '印度': 'India',
    '中国台湾': 'Taiwan',
    '新西兰': 'New Zealand',
    '波兰': 'Poland',
    '西班牙': 'Spain',
    '丹麦': 'Denmark',
    '瑞典': 'Sweden'
}

# 翻译地区名称
df_exploded['地区'] = df_exploded['地区'].map(region_translation).fillna(df_exploded['地区'])

# 统计每个地区出现的数量
region_counts = df_exploded['地区'].value_counts().reset_index()
region_counts.columns = ['地区', '数量']

# 显示统计结果
print(region_counts)

# 将统计结果导出为 CSV 文件
region_counts.to_csv('region_counts.csv', index=False)

```

<!-- endtab -->
<!-- tab 发布时间@icon -->
导出电影发布年份与数量关系
```python
import pandas as pd

# 读取 CSV 文件
df = pd.read_csv('douban_movie_top100.csv')

# 统计每个年份出现的数量
year_counts = df['年份'].value_counts().reset_index()
year_counts.columns = ['年份', '数量']

# 显示统计结果
print(year_counts)

# 将统计结果导出为 CSV 文件
year_counts.to_csv('year_counts.csv', index=False)

```
<!-- endtab -->
{% endtabs %}
{% endfolding %}

# 数据可视化
对处理完成的数据进行可视化处理，方便后续数据分析，详见[浅谈数据分析（二）]()

# 数据分析
从某种意义上说，对原始数据的分析是整个数据分析流程中做重要的一个环节~~名字都叫数据分析了，不重要才怪~~，上述所有步骤最终都是数据分析的基石，但具体数据分析要根据实际需求来制定，要符合市场期望，因此根本没有统一的方法论，这里就一笔带过了...