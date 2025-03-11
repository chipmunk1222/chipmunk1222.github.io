---
title: hexo博客系统相关指令
date: 2024-9-28 15:34:34
tags:
  - Hexo
  - Blog
category: 博客相关
---

# 本地初始化hexo博客系统
- npm install hexo-cli -g  //一键安装博客程序
- hexo init \<foldname>  //初始化
- cd \<foldname> //进入初始化文件夹
- npm install //安装依赖
- hexo clean  //清理缓存
- hexo generate(g)  //生成静态文件
- hexo serve(s)  //本地运行博客
- npm install hexo-browsersync --save  //动态更新网页的依赖

# 将静态文件部署到github上
- npm install hexo-deployer-git --save  //安装部署插件
- hexo deploy(d)  //将静态文件部署到github中

# github双分支结构：
- 注：使用hexo进行网站部署后，github page指定网页只会显示静态文件，故需要单独开一个分支用以存储源文件
- 在main分支外创建dev分支，用于存储源码
- main分支用以存放生成的静态网页
- dev分支用以存放网站的原始文件

# 代码提交：
- 源码提交到source分支
- 项目部署使用hexo clean，hexo g，hexo d，文件静态资源将自动部署到预先配置的github分支上