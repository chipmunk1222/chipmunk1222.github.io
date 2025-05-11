---
title: Vercel静态页面部署与域名配置教程
date: 2025-03-09 12:28:56
tags:
  - Vercel
  - Domain
  - DNS
  - 域名
  - Blog
  - 教程
category: 技术教程
description: 使用vercel对hexo博客进行静态资源无服务器部署，并绑定阿里云的域名
---

{% tip bolt %}
本文将从头讲述使用vercel对静态资源进行部署的流程，以及从域名购买到绑定，让你拥有一个真正意义上的“名片网站”
{% endtip %}

{% tip cogs %}
如果要看如何使用服务器部署个人博客，见[阿里云服务器部署hexo博客](https://chipmunk.top/posts/阿里云服务器部署hexo博客)
{% endtip %}


# 为什么需要部署host？
简单讲讲为什么需要部署，因为部署代码的网站本身差别不大，以`vercel`为例，讲讲`web`静态资源部署的好处
1. **高性能**：最重要的一点，`Vercel`提供全球内容分发网络（`CDN`），确保项目可以快速加载并在全球范围内高效访问。其构建优化功能也能显著提高网站性能。
2. **自动化部署**：`Vercel`可以与`GitHub`、`GitLab`等代码仓库集成，实现自动化部署。每次推送代码更新时，`Vercel`会自动进行构建和部署，无需手动操作。
3. **内置分析工具**：`Vercel`提供内置的分析工具，可以监控网站性能、用户行为等，帮助优化和改进项目。

接下来就是具体的部署流程

# vercel部署项目
## vercel注册
首先进入官网注册一个`Vercel`，没有账号不能直接登录，需要先行注册

进入注册界面后，点击第一项为个人注册，填入用户名后直接通过`github`账号关联，也可以通过邮箱绑定
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_20-42-25_qbsqct.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_20-42-25_qbsqct.webp)
{% note warning flat %}
避坑：`vercel`并不支持`QQ`邮箱，建议使用谷歌邮箱注册
{% endnote %}

## 部署静态项目
注册完毕后，进入`vercel`主界面，导入`github`账号，随后导入要部署的仓库

![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_20-48-05_pv6dlz.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_20-48-05_pv6dlz.webp)
查看信息是否正确，点击部署
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_20-50-10_aggf8l.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_20-50-10_aggf8l.webp)

等待一段时间过后，项目就部署完毕了，此时`Vercel`会自动给你分配一个域名，只不过这个域名不是我们常识里的样子，而且国内可能会被墙，所以我们要将其绑定到“正常”的域名中

部署完后应该会弹出一个`DashBoard`，点击进入，或点击头像，选择`DashBoard`

进入后就是项目的工作台了，当状态栏显示`ready`就表示项目已经部署成功，点击右上角的`Domain`进入域名绑定页面
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_21-01-08_oo24oz.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_21-01-08_oo24oz.webp)

接下来进入域名购买环节

# 购买专属你的域名

## 选择域名
登录阿里云官网，选择左上角菜单，下滑直到找到"域名"栏，点击进入
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_21-13-29_jergg5.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_21-13-29_jergg5.webp)

在域名栏中即可查询你想要的域名
## 实名认证
点击进入购买域名界面，需要进行实名认证以及完善模板信息，点击右上角头像进行实名认证
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_21-14-25_u2bit6.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_21-14-25_u2bit6.webp)

进入购买界面后点击创建模板
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_21-17-04_umaqua.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_21-17-04_umaqua.webp)
{% note warning flat %}
实名认证后需要上传审核，审核时间随拥挤程度而定，可能需要一定时间才能审核完毕
{% endnote %}

最后点击左上角菜单，找到域名列表，找到你刚找到的域名，点击解析，进入解析界面后先放着
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_21-27-42_ym4kmb.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_21-27-42_ym4kmb.webp)

这样你就拥有了自己的专属域名了，最后一步就是绑定域名与`vercel`部署的资源了

# 绑定vercel与域名

## 进入域名解析
回到`veercel`中，在`Domain`中点击`Add`添加域名解析，输入你刚买的域名，也可以添加二级域名，比如`chipmunk.top`->`blog.chipmink.top`
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_21-35-49_dn19pa.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_21-35-49_dn19pa.webp)

## 绑定解析后的域名信息
添加完后查看列表中的域名信息
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_21-36-58_qrwnl6.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_21-36-58_qrwnl6.webp)
回到阿里云，在刚才打开的域名解析列表中点击添加记录，其中类型对应`CNAME`，主机记录对应二级域名，记录值为最后的`value`
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_21-36-35_uzijiy.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_21-36-35_uzijiy.webp)

配置完后等待一段时间，`vercel`就会自动绑定对应的域名了
{% note info flat %}
如果不使用二级域名，则会有两个解析信息，分别是带`www`的和不带`www`的，将两个分别按照上述方法绑定
{% endnote %}

到这里你就完成了`vercel`部署静态博客以及绑定阿里云购买的自定义域名了

# 踩坑总结
由于我的`vercel`是从`github page`上迁移过去的，而我`github page`是用的双分支模式，`source`为源码而`main`为部署分支，而`vercel`默认选择`main`分支，这就导致了部署错误，因为`vercel`会自动运行部署代码，因此需要部署源码，解决方法是在环境中将分支指定为`source`即可
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_23-41-54_iializ.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/vercel/Snipaste_2025-03-09_23-41-54_iializ.webp)
