---
title: 为网站配置CDN性能优化
date: 2025-3-28 8:24:16
tags:
  - CDN
  - 性能优化
category: 博客相关
description: 通过配置CDN来实现博客的静态资源加速
---

{% tip cogs %}
本文提供一系列和`CDN`相关的网站性能优化方案，包括：

1. 全站`CDN`配置
2. 基于`npm`+`github`的图床方案，使用`CDN`加速
3. 修改`npm`依赖的`CDN`提供商
   {% endtip %}

{% folding blue, 参考教材和网站 %}
|作者|标题|链接|
|---|---|---|
|安知鱼|什么是`CDN`？它解决了什么难题？国内`CDN`加`Vercel`，无服务器使用办法|https://blog.anheyu.com/posts/136a.html|
|`Heo`洪哥|`Butterfly CDN`链接更改指南，替换`jsdelivr`提升访问速度|https://blog.zhheo.com/p/790087d9.html|
|店长`Akilar`|`npm`图床的使用技巧|https://akilar.top/posts/3e956346/|
|小枫网络|`jsdelivr npm` 国内加速`CDN`节点|https://www.xfabe.com/post/105.html|
|测速网站|ITDOG|https://www.itdog.cn/http/|

{% endfolding %}

# CDN 如何提高网站加载速度

`CDN`全称`Content Delivery Network`,指的是一组分布在各地的服务器。这些服务器存储着数据的副本，因此，服务器可以根据哪些服务器距离用户最近来动态提供数据，满足数据请求，因此，`CDN`就有以下优势来显著提高网站加载速度：

1. 静态资源缓存：`CDN`可以将静态资源缓存到全球分布的服务器节点上，用户可以从这些节点中获取资源，从而减少延迟
2. 负载均衡：`CDN`通过智能分配用户请求到不同节点，避免单一服务器的过载，从而提高响应速度
3. 动态优化内容：部分`CDN`支持动态内容加速，例如使用边缘计算将部分计算任务放置在靠近用户的位置，从而缩短响应时间
4. 提高数据可靠性：即使某个数据节点出现故障，`CDN`也能够通过其他节点继续提供服务，确保网站可用性

# 全站 CDN 加速

## 前言

全站`CDN`加速即通过一些国内的`CDN`服务提供商对整个网站域名进行`CDN`加速，从而有效提升各个地区对网站的访问速度
以下放上两张分别使用和未使用`CDN`加速的网站的测速的样例
![未CDN加速](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/CDN/未启用CDN.webp)

![CDN加速](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/CDN/启用.webp)

{% note warning flat %}
值得一提的是，因为一些众所周知的原因，国内几乎所有服务商，如要进行全站加速，则必须先对域名进行`ICP`备案，该过程会相对繁琐，需要足够的耐心
{% endnote %}
简单介绍下从网站静态部署到全站`CDN`加速的基本流程
![备案流程](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/CDN/备案流程.webp)

## 全站加速流程

这里默认已经完成了`ICP`备案，将详细讲述后续流程，这里用七牛云为例，其他服务商实际上也大差不差
首先登录七牛云，没有账号的先注册一个账号，可能需要身份认证什么的，随便搞一搞就行，个人域名没有那么严格的审查
完成后进入控制台界面，选择加速域名

进入该界面后，加速域名选择已备案的要加速的域名，比如`www.chipmunk.top`，通信协议选`https`(`http`国内会报错)，`SSL`证书申领看下文，使用场景选图片小文件，包括`css`、`js`和图片等静态文件
![加速域名](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/CDN/加速域名.webp)

源站即`CDN`加速过程中服务器资源分发的起点，由于七牛云不支持直接用加速域名作为源站域名，所以需要另外使用一个域名，比如`blog.chipmunk.top`(需确保该域名也被解析)，完成后随便输入一个地址，即可测试配置
![源站域名](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/CDN/源站配置.webp)

其他选项保持默认即可
完成加速域名配置后，进入配置完成界面，在该界面会出现加速域名的`CDN`记录，回到云服务提供商，比如阿里云，添加解析记录，记录类型选`CNAME`，记录值复制对应记录值，完成配置后等待一段时间即可配置成功了
![配置完成](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/CDN/配置完成.webp)

## SSL 证书的申请

进入`SSL`证书申请界面，里面有各种额度的`SSL`证书，不过它们大多是企业需求的方案，个人使用只需要最后的`DV`证书，是完全免费的，虽然一次只有 90 天，不过可以重复申领，所以不存在过期问题

申领完后需要你补全信息，按要求补全就行了，唯一值得说道的点就是需要一个公司座机号码，在网上随便找一个就行，但要和你的地区邮政编码匹配，还是那句话，个人网站不严格看重你的信息填写

# npm+github 自建图床方案

我们都知道，`npm`和`github`都有自己自带的`CDN`加速服务，我们可以利用这一点，在其上面搭建图床，来进行静态资源的`CDN`分发
详细教程可见店长的方案：
{% link npm图床的使用技巧, https://akilar.top/posts/3e956346/, https://npm.elemecdn.com/akiblog@1.0.2/img/siteicon/favicon.png %}

下面简单介绍下大致流程：

1. 创建一个`github`仓库用作`npm`仓库
2. 在本地新建一个文件夹，`clone`创建的`github`仓库，而这个文件夹将来就是图床的文件夹
3. 在该文件夹中打开终端，分别执行下列命令，初始化`npm`

```bash
#切换npm原生源
npm config set registry https://registry.npmjs.org
# 仅第一次使用需要添加用户，之后会提示你输入你的npm账号密码以及注册邮箱
npm adduser
# 非第一次使用直接登录即可，之后会提示你输入你的npm账号密码以及注册邮箱
npm login
```

4. 完成登录后，使用`npm`将整个仓库打包
   执行`npm init`打包仓库，随后会跳出仓库配置项，主要注意下仓库名就好，其余配置项可填可不填，随自己喜欢

```bash
npm init
```

5. 最后发布`npm`仓库

```bash
# 输入指令，将npm包发布到官网上
npm publish
```

6. 资源调用
   完成上述流程后，我们就有了一个存储静态资源的`github`仓库和一个`npm`仓库，两者都可使用`CDN`加速服务，通过链接能直接服务相应的静态资源

```bash
# jsDelivr+github链接
https://cdn.jsdelivr.net/gh/[GithubUserName]/[AssetsRepo]/img/index.png
# jsDelivr+npm链接
https://cdn.jsdelivr.net/[NpmPackageName]/img/index.png
```

下面提供一张`npm`节点的表格，数据来自于小枫网络
{% link jsdelivr npm 国内加速CDN节点, https://www.xfabe.com/post/105.html, https://www.xfabe.com/favicon.ico %}
![npm节点](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/CDN/npm节点.webp)

> 值得注意的是，`npm`每次更新都需要手动更新版本，并且需要`npm publish`来上传资源，如果需要可以使用店长的`github action`方案来简化部署
> 此外，一个`npm`包大小最高只有`100MB`左右，而`github`仓库也有`1G`的限制，所以还是要尽可能地压缩资源大小

```bash
# 将更改提交
git add .
git commit -m "npm publish"
# 更新package版本号
npm version patch
# 推送至github触发action(配置了github action)
git push
# 若没有配置GitHub action
npm publish
```

# butterfly 主题下配置 npm 的 CDN 链接配置

自从`jsdelivr`炸了之后，在`npm`提供商的选择方面还真是增加了不小的工作量，本站`CDN`服务主要参考洪哥的方案，即优先字节，如果没有找到则再去别的站点，如`bootCDN`等
{% link Butterfly CDN链接更改指南，替换jsdelivr提升访问速度, https://cdn.bytedance.com/?query=react-instantsearch-theme-algolia&version=4.5.2, imgUrl(option) %}

## algolia_search

```
https://cdn.bootcdn.net/ajax/libs/algoliasearch/4.24.0/algoliasearch-lite.umd.min.js
```

## aplayer

```
aplayer_css: https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/aplayer/1.10.1/APlayer.min.css
aplayer_js: https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/aplayer/1.10.1/APlayer.min.js
meting_js: https://npm.elemecdn.com/hexo-anzhiyu-music@1.0.1/assets/js/Meting2.min.js
```

## disqusjs

```
disqusjs: https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/disqusjs/1.3.0/disqus.js
disqusjs_css: https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/disqusjs/1.3.0/disqusjs.css
```

## fontawesome

```
https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/font-awesome/6.0.0/css/all.min.css
```

## instantpage

```
instantpage: https://cdn.bootcdn.net/ajax/libs/instant.page/5.2.0/instantpage.min.js
instantsearch: https://cdn.bootcdn.net/ajax/libs/instantsearch.js/4.77.0/instantsearch.production.min.js
```

## lazyload

```
https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/vanilla-lazyload/17.3.1/lazyload.iife.min.js
```

## pjax

```
https://lib.baomitu.com/pjax/0.2.8/pjax.min.js
```

## sharejs

```
sharejs: https://lib.baomitu.com/social-share.js/1.0.16/js/social-share.min.js
sharejs_css: https://lib.baomitu.com/social-share.js/1.0.16/css/share.min.css
```

## snackbar

```
snackbar: https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/node-snackbar/0.1.16/snackbar.min.js
snackbar_css: https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/node-snackbar/0.1.16/snackbar.min.css
```

## valine

```
https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/valine/1.4.16/Valine.min.js
```

## vue

```
https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/valine/1.4.16/Valine.min.js
```

## element-ui

```
css:https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/element-ui/2.15.6/theme-chalk/index.css
js:https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/element-ui/2.15.6/index.js
```

## Jquery

```
https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
```

## winbox

```
https://testingcf.jsdelivr.net/gh/nextapps-de/winbox/dist/winbox.bundle.min.js
```
