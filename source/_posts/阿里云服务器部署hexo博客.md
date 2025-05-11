---
title: 阿里云服务器部署hexo博客
date: 2025-05-11 19:14:32
tags:
  - 服务器
  - Nginx
  - Hexo
  - Git
  - Blog
  - 教程
category: 技术教程
description: 本文将介绍如何使用阿里云服务器部署你的Hexo博客
---

{% tip cogs %}
`Vercel`部署静态网页以及域名解析相关教程见[Vercel静态页面部署与域名配置教程](https://chipmunk.top/posts/Vercel静态页面部署与域名配置教程)
{% endtip %}

{% folding blue , 章前哔哔 %}
在开始这篇文章之前，我想先来探讨下为什么要用服务器来部署博客这个问题。首先，我们要让自己的博客被别人看到，就必须用某种方式进行部署，然后用户才能用域名在浏览器中查看我们的网站，关于`Hexo`博客的部署方案常见的有三种，分别是：
1. `github page`：即用`github`自带的个人首页来进行部署，这种部署的优点是非常方便，但是依靠`github`那国内的访问质量，注定不能长久；
2. 静态网页部署：使用`Vercel`之类的静态网页部署平台进行博客部署，但和上一点一样，`Vercel`虽然自带`CDN`加速，但这类平台在国内的访问依然不稳定；
3. 国内服务器部署：这也是最常规的方法了，除了静态网页，还能部署其他服务，只是相对于前面几种方法来说显得没有那么“宝宝巴士”，需要自己琢磨一些知识点和流程，但理解了全部过程之后，我相信也是最能感到受益匪浅的
{% endfolding %}

# 环境准备
1. 一台服务器
2. 域名
3. 域名备案
4. `node、npm`
5. `git`
6. 本地能跑通的`hexo`博客

# 整体流程介绍
简化版的使用服务器部署`hexo`博客的整体流程介绍：
1. 配置安全组，允许浏览器端口访问
2. 首先确保服务器中安装了相应的环境，`git`、`node`、`npm`等
3. 在服务器中建立一个裸仓库作为远程仓库，通过`ssh`免密连接建立本地与服务器的`git`连接，用以推送文件
4. 在服务器中创建一个文件进行根目录资源托管，使用`git`钩子文件建立仓库和资源文件的连接
5. 使用`nginx`进行部署，监听浏览器默认端口并指定源码路径到根目录资源文件 
6. 一键申请`ssl`证书，确保域名正常访问

# 环境安装
在服务器中安装相应环境，比如`ubuntu`、`debian`发行版按照以下命令安装，不同操作系统可以会有略微区别，不过基本大差不差
```sh
apt update && apt install git node npm 
```
使用以下命令检查安装是否成功：
```sh
node -v && npm -v && git -v
```
如果返回相应版本号，则说明安装成功

# 用SSH建立git远程连接
本节的目标是在服务端创建一个`git`用户，并用`git`用户建立本地与服务器的`ssh`连接，从而方便后续推送文件
## 创建git用户
在服务器端创建`git`用户，并用其控制仓库文件
1. 添加`git`用户
```sh
sudo adduser git
```
2. 修改`git`用户权限
```sh
chmod 740 /etc/sudoers  
vim /etc/sudoers
```
在相应位置添加以下语句：
```sh
git ALL=(ALL) ALL
```
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/server_deploy/git.jpg](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/server_deploy/git.jpg)
完成后改回文件权限：
```sh
chmod 400 /etc/sudoers
```
3. 设置`git`用户密码
```sh
sudo passwd git
```

## ssh免密登录
**什么是SSH：**`SSH`全称`Secure Shell`，是一种用于远程登录服务器的安全传输协议。通过配置`SSH`公钥和私钥来实现`git`的本地仓库和远程仓库之间的通信，最常见的例子就是`github`的文件推送，只不过现在把远程服务器从`github`转移到了自己的服务器上

接下来讲讲如何配置`ssh`密钥：
1. 客户端生成`ssh`密钥
在本地电脑的`CMD`命令行工具中输入`ssh-keygen -t rsa`生成密钥，结果默认存储在本地`C://User/用户名/.ssh`文件夹中
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/server_deploy/ssh-key.jpg](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/server_deploy/ssh-key.jpg)
其中`id_rsa`为私钥，`id_rsa.pub`为公钥，接下来就是在远程配置公钥
2. 服务端配置公钥
首先切换到`git`用户
```sh
su git
```
看是否有`.ssh`文件夹，没有则创建并修改权限
```sh
mkdir -p ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```
将本地公钥`id_rsa.pub`中的内容复制到`authorized_keys`中的末尾
```sh
vim ~/.ssh/authorized_keys
```
>`vim`模式下用`'i'`进入编辑模式，右键或`ctrl+shift+C`复制，完成后`esc`回到正常模式，输入`:wq`保存并退出
3. 完成后在本地终端检查连接是否成功
```sh
ssh -T git@<域名或服务器公网IP>
```
如果返回`Welcome to Alibaba Cloud Elastic Compute Service !`则说明`ssh`配置成功，即可以实现在本地控制远程服务器或文件传输了

# 创建git仓库以及指定资源目录
本节的目标是创建`git`远程仓库，并指定部署后的资源根目录
- `git`仓库：相当于`github`扮演的角色，只不过把仓库放到了自己服务器上
- 资源目录：远程仓库中实际指定的目录，同时也是后续部署的源码目录

## 创建远程git仓库
1. 创建空白仓库
首先切回`root`管理员并创建仓库文件
```sh
su -
mkdir /var/repo
```
赋予权限
```sh
chown -R git:git /var/repo  
chmod -R 755 /var/repo
```
接下来创建一个空白的`git`裸仓库
```sh
cd /var/repo  
git init --bare hexo.git
```
>裸仓库即为远程仓库，不能使用`git status`查看仓库状态，但可以直接查看仓库里面有没有文件判断创建成功与否
2. 创建钩子文件
在`/var/repo/hexo.git`下，有一个自动生成的`hooks`文件夹。我们需要在里边新建一个新的钩子文件`post-receive`
```sh
vim /var/repo/hexo.git/hooks/post-receive
```
指定钩子
```sh
#!/bin/bash  
git --work-tree=/home/www/hexo --git-dir=/var/repo/hexo.git checkout -f
```
其中，`--work-tree`指定资源目录，也就是我们即将存储资源的实际路径，`--git-dir`就是`git`仓库目录

最后再赋予文件权限
```sh
chown -R git:git /var/repo/hexo.git/hooks/post-receive  
chmod +x /var/repo/hexo.git/hooks/post-receive
```
## 创建资源目录
在`git`钩子中我们指定了实际的根目录资源位置，即博客的资源目录
创建博客根目录
```sh
mkdir -p /home/www/hexo 
```

# 配置nginx路由
在上述步骤中，我们已经成功建立了博客的根目录资源文件，并能通过`git`进行资源推送了，接下来，我们要配置`nginx`路由来监听服务器以及端口，以此通过`IP`地址或者域名来访问博客

1. 安装`nginx`
```sh
sudo apt update && sudo apt install nginx -y
```
2. 指定`nginx`配置项
安装完`nginx`后，会有一个`/etc/nginx`文件，里面的`nginx/conf`即为`nginx`的默认配置文件，我们接下来要添加`server`配置项来进行网页监听，但我们不在当前文件夹直接修改，而是新建一个`vhost`文件夹来存储网站的具体配置
```sh
cd /etc/nginx
mkdir -p vhost/blog.conf
cd vhost
vim blog.conf
```
在`blog.conf`中添加如下配置
```sh
server  
{  
    listen 80;  # 这是监听的端口号
    # server_name填写你自己的域名，没有的话填ip  
    server_name chipmunk.top;   
    # 这里root填写自己的网站根目录，修改为/home/www/hexo  
    root /home/www/hexo;
	location /{
	}
}
```
再回到`nginx.conf`中引入上述配置
```sh
cd /etc/nginx
vim nginx.conf
```
使用`include`语句引入
```sh
include /etc/nginx/vhost/*.conf
```
![https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/server_deploy/nginx.jpg](https://testingcf.jsdelivr.net/npm/chipmunk-assets/img/blog/server_deploy/nginx.jpg)

3. 启动`nginx`
```sh
nginx -t
sudo systemctl start nginx
```
检查配置项并启动`nginx`，此时`nginx`配置就完成了，此时输入`IP`地址或域名应该就能访问`nginx`托管的文件了，但由于还没有推送内容，所以网页应该还为空

# 配置本地hexo
回到本地的`hexo`文件中，配置`_config.yml`的`deploy`项
```yml
deploy:
  type: git
  repo: git@你的网站域名或服务器IP:/var/repo/hexo.git  
  branch: master
```
终端执行
```sh
hexo clean
hexo d -g
```
这样就能将本地文件打包并推送到服务器的仓库中了
来到服务器的`/home/www/hexo`文件夹中，应该能看到静态资源目录
```sh
cd /home/www/hexo
ls
```

# 配置SSL证书
一般来说，完成上述配置基本上就能访问网站了，但现代某些浏览器可能会自动重定向协议到`https`，这样没有配置`SSL`就会导致无法访问，所以我们来一键配置下`SSL`证书
1. 检查现有的`SSL`证书
```bash
ls -l /etc/nginx/ssl/
```
2. 签发证书
如果证书文件不存在，可以使用 `Let's Encrypt` 重新签发
```sh
sudo certbot certonly --nginx -d <你的域名>
```
如果你希望自动配置`nginx`
```sh
sudo certbot --nginx -d <你的域名>
```
3. 安装`certbot`
如果服务器中没有`certbot`需要安装
```sh
sudo apt update
sudo apt install certbot python3-certbot-nginx
certbot --version
```
返回版本号则为安装成功
4. 证书自动续期
一般证书默认有效期为90天，但可以设置自动续期
```sh
sudo certbot renew --dry-run
```
5. 配置`nginx`配置项
在`/etc/nginx/vhost/blog.conf`中添加对`443`端口的监听
```sh
server {
    listen 443 ssl;
    server_name chipmunk.top;   #改为你自己的域名   
	root /home/www/hexo;

    ssl_certificate /etc/letsencrypt/live/chipmunk.top/fullchain.pem;   # 路径中改为你自己的域名
    ssl_certificate_key /etc/letsencrypt/live/chipmunk.top/privkey.pem;  # 路径中改为你自己的域名

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```
其中：
```sh
fullchain.pem    → 公钥证书（含完整的证书链）
privkey.pem      → 服务器私钥
```
6. 最后重启`nginx`
```sh
sudo systemctl restart nginx
```

到这里就真正完成在服务器中部署你的个人博客了

# 踩坑总结
## ssh连接正常，但本地hexo文件部署到服务器为空
终端能建立与服务器的`ssh`连接，也设置了对应的`repo`路径，但部署后服务器没有内容，报错：
```bash
remote: fatal: You are on a branch yet to be born
```
原因是分支错误，如果没有在远程仓库做一些额外操作，`branch`的名称也会产生影响，比如我用`master`就能正常推送，但用`main`就会报错失败
```sh
deploy:
  type: git
  repo: git@chipmunk.top:/var/repo/hexo.git
  branch: master
```
## 公网IP能访问，但用域名没法访问
可能是上文中提到的没有配置`SSL`证书的问题，按照上文教程配置对于`443`端口的监听就能解决
也有可以是域名解析失败的问题，按照下面的方法排查
1. 检查域名是否失效
```sh
nslookup yourdomain.com
```
看返回的域名`IP`是不是服务器的`IP`地址，或者直接`Ping`你的域名看返回值
2. 检查防火墙有没有墙掉`80`和`443`端口
```
sudo ufw status
```
看相应端口是否开放
## 报错显示80端口被占用

检查服务器端口号有没有被占用
```sh
sudo lsof -i :80
```
如果被其他进程占用可以会影响监听
使用`kill`命令杀死其他进程后重新启动`nginx`
```sh
kill -9 pid
```
重新启动`nginx`
```sh
sudo systemctl restart nginx
```

## 一点心得
总的来说，在理解了全过程后，在服务器上部署网站还是比较清晰的，但每一步涉及的知识点加起来还是比较多的，我也是花了不少时间踩了好多坑才部署完成，我主要的体会是在配置每一步的时候还是要了解这些步骤都是干什么的，然后再针对性地排坑，对症下药，在确保每一步正确后再持续推进，直到完成，最后祝大家也能成功部署自己的网站