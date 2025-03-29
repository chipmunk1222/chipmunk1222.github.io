---
title: MERN全栈聊天项目（三）项目部署
date: 2025-03-01 09:13:43
tags:
  - node
  - 全栈
  - express
  - react
  - mongoDB
  - replit
  - UptimeRobot
  - 项目部署
category: 项目总结
description: 来源于油管的全栈聊天项目，应用了如今全栈开发中非常流行了MERN架构，对于使用replit进行项目部署的教程
---

# 安装配置文件
创建`package.json`
```js
npm init -y
```

在配置文件中，使用"`build`"配置打包命令
```js
"build": "npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend",
```
运行`npm run build`，项目自定引入前端后端的资源包并将前端资源打包成`dist`文件

使用`start`配置启动命令，用于服务端的启动
```js
"start": "npm run start --prefix backend"
```

# 前后端资源合并

## 后端合并前端资源
运行`npm run build`打包前端资源，而后将前端资源包合并到后端
以`node`为例
```js
import path from 'path'

const __dirname = path.resolve();

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend','dist','index.html'));
  })
}
```
如果项目环境为生产环境，则`node`会通过`express.static`访问前端资源包，两者在一个域中，即可上传服务器
后一段代码则表示无论访问什么路径，最后都被重定向到`index.html`中

## 前端根据环境改变请求方式
配置所有`BASE_URL`，例如`axios`请求，如果环境为开发环境，用`loaclhost`，如果环境为生产环境，用`/api`的相对路径
```js
export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? "http://localhost:5001/api/" : "/api",
  withCredentials: true

})
```
# 使用replit部署服务器
完成前后端资源整合后下一步就是将资源上传到服务器上了，使用`replit`进行服务器部署
>在这之前尝试过别的部署方式，现在一一说说它们的问题
>`render`：免费服务且配置过程非常友好，但致命的缺点——现在必须绑定国外信用卡
>`glitch`：免费服务，但硬盘只有`200M`，笑死，依赖都装不完
>国内服务器：基本都要付费，然后租来晾着

>`replit`并非没有缺点，且缺点还挺明显的，就是免费配置下必须一直开着才能提供服务，且一段时间不看它会自动休眠，如果要长期使用，还是只能购买服务器或绑定信用卡

下面讲讲具体配置流程：
1. 创建项目，从`github`中引入项目
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/MERN_deploy/Snipaste_2025-03-08_11-41-53_nsombb.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/MERN_deploy/Snipaste_2025-03-08_11-41-53_nsombb.webp)

2. 添加`.env`环境变量（可以使用网站自带的`secret`添加，也可以直接在对应文件夹新建文件）
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/MERN_deploy/Snipaste_2025-03-08_11-46-47_nogubl.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/MERN_deploy/Snipaste_2025-03-08_11-46-47_nogubl.webp)
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/MERN_deploy/Snipaste_2025-03-08_11-47-45_dxbsso.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/MERN_deploy/Snipaste_2025-03-08_11-47-45_dxbsso.webp)

3. 检查项目结构，启动项目，由于`replit`本身提供在线编辑，所以像在本地一样完善项目结构即可，然后`run`项目，当`webview`中跑通项目就证明成功了
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/MERN_deploy/Snipaste_2025-03-08_15-10-36_d4k01q.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/MERN_deploy/Snipaste_2025-03-08_15-10-36_d4k01q.webp)

4. 虽然此时项目跑通了，但还没有结束，`replit`的免费计划并不能长期部署，也就是说当网站关闭后还是不能提供服务，因此需要`UptimeRobot`每隔一段时间向其发送请求，来保持其运行
>注册`UptimeRobot`需要建议使用`google`浏览器，否则验证可能通不过

5. 进入`UptimeRobot`后点击创建`monitor`
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/MERN_deploy/Snipaste_2025-03-08_15-18-45_lhxmzs.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/MERN_deploy/Snipaste_2025-03-08_15-18-45_lhxmzs.webp)
监控项目的`URL`，这下就真的大功告成了
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/MERN_deploy/Snipaste_2025-03-08_15-20-07_xvjggl.webp](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/MERN_deploy/Snipaste_2025-03-08_15-20-07_xvjggl.webp)
