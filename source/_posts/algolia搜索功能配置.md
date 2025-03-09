---
title: algolia搜索功能配置
date: 2025-02-21 12:28:56
tags:
  - search
  - algolia
  - 博客
  - blog
  - hexo
descriptions: 为博客配置在线搜索功能，algolia_search的配置方法
---

{% tip cogs %}
关于配置博客搜索功能时菜的坑的总结，介绍下algolia搜索功能的完整配置流程
{% endtip %}

# 本地引入algolia
在`hexo`中可供选择的有`algolia`和`algolia_search`两个插件，但`algolia`插件索引功能不如`algolia_search`，所以后续都讲解对象都为后者

## 安装
`npm`安装插件依赖
```js
npm install hexo-algoliasearch --save
```
在`package.json`中找到`hexo-algoliasearch`即为安装成功

## 配置主题_config
在`_config.yml`中添加配置项
```js
algolia:
  appId: "Your Application Card"
  apiKey: "Your SearchAPI KEY"
  adminApiKey: "Your aminAPI KEY"
  chunkSize: 5000
  indexName: "Your Index"
  fields:
    - content:strip:truncate,0,500
    - excerpt:strip
    - gallery
    - permalink
    - photos
    - slug
    - tags
    - title
```
上述字符串中的内容为需要从`algolia`官网获取的`apiKey`和索引名称
其余配置项默认即可，如果要修改可看插件的说明[hexo-algoliasearch](https://github.com/LouisBarranqueiro/hexo-algoliasearch)

# 获取Algolia账号API
注册并登录`algolia`官网
## 跳过引导
新版本注册`algolia`后应该会先进入一个引导页面，不用管它，直接跳过
![https://res.cloudinary.com/dobligy9s/image/upload/v1741512555/Snipaste_2025-03-09_17-24-34_htxp2k.png](https://res.cloudinary.com/dobligy9s/image/upload/v1741512555/Snipaste_2025-03-09_17-24-34_htxp2k.png)
>不得不说这个跳过按钮设置的很隐蔽，我最开始以为要在这里直接匹配网页，折腾了好久才发现只是个教程，可以直接跳过

## 创建索引
进入数据库图标的导航页，输入名称创建项目索引，之后它将用来记录网页的搜索匹配信息
![https://res.cloudinary.com/dobligy9s/image/upload/v1741512555/Snipaste_2025-03-09_17-26-12_xoy3d5.png](https://res.cloudinary.com/dobligy9s/image/upload/v1741512555/Snipaste_2025-03-09_17-26-12_xoy3d5.png)

## 获取API
进入设置页面并进入`Api Keys`页面
![https://res.cloudinary.com/dobligy9s/image/upload/v1741512555/Snipaste_2025-03-09_17-27-14_reylc3.png](https://res.cloudinary.com/dobligy9s/image/upload/v1741512555/Snipaste_2025-03-09_17-27-14_reylc3.png)
获取`hexo-algoliasearch`需要的`api`,后回到`_config.yml`配置文件中
![https://res.cloudinary.com/dobligy9s/image/upload/v1741512555/Snipaste_2025-03-09_17-28-39_kqsgtp.png](https://res.cloudinary.com/dobligy9s/image/upload/v1741512555/Snipaste_2025-03-09_17-28-39_kqsgtp.png)

# algolia配置项修改
对`algolia`空缺的配置项分别填入上面获取的项，分别是：
- appId
- apiKey
- adminapikey
- indexname

前三项为`api`页面的账号`api`,`indexname`为上面创建的索引名
注意`adminapikey`不是`writeapikey`

## 修改butterfly主题下的search配置项

```js
search:
  # Choose: algolia_search / local_search / docsearch
  # leave it empty if you don't need search
  use: algolia_search
  placeholder: "搜索"
```

## 关联索引
执行`hexo algolia`以关联索引，到此就配置完成了，理论上就可以在项目中使用`algolia`的搜索功能了

后续博客更新后重新执行`hexo algolia`以重新关联索引
