---
title: MERN全栈聊天项目（二）前端部分
date: 2025-02-21 12:28:56
tags:
  - node
  - 全栈
  - express
  - react
  - mongoDB
  - tailwindCSS
  - daisyui
  - router
  - zustand
category: 项目总结
description: 来源于油管的全栈聊天项目，应用了如今全栈开发中的MERN架构，即，mongodb+express+react+nodejs，前端架构介绍
mathjax: true
swiper_index: 2
---

# 项目创建

`cd`前端文件夹，通过`vite`创建前端`react`项目

```
cd frontend
npm create vite@latest
```

根据需求选择创建`react`项目

## 依赖安装

安装如下依赖

```js
npm i react react-dom react-router-dom axios zustand lucide-react react-hot-toast daisyui tailwindcss postcss autoprefixer
```

## 依赖简介

1. `react/react-dom`：不用多说，用于使用`react`框架，`react-dom`进一步提供一些方法
2. `react-router-dom`：用于创建`react`路由
3. `axios`：封装发送前端请求，不用使用`fetch api`
4. `zustand`：`react`的状态管理库，用于集中处理一些方法
5. `lucide-react`：提供一系列即插即用的图标
6. `react-hot-toast`：用于创建弹窗式通知
7. `tailwindcss`：高度定制的`css`框架
8. `daisyui`:基于`tailwindcss`的组件库
9. `Postcss`：`css`代码转译器
10. `autoprefixer`：用于`css`兼容不同浏览器厂商

# 全局配置

## 样式库配置

### CSS样式库
所谓样式库，也就是在项目中导入`tailwind css`以及`daisyui`，在这里`daisyui`被作为`tailwindcss`的插件使用
配置过程如下:

1. 首先确保安装了`tailwind`和`daisyui`的依赖
2. 使用`npx tailwindcss init`命令初始化项目结构，此时项目中应该有`tailwind.config.js`配置文件
3. 修改配置文件如下，即顺便直接配置了`daisyui`
```js
/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [daisyui],
	daisyui: {
		// themes: ["light", "dark", "cupcake"], // 你可以在这里添加更多主题
		themes: true,
	},
};
```
4. 最后在`index.css`中添加如下引用并在`main.jsx`中导入即可全局使用`tailwindcss`以及`daisyui`
```js
@tailwind base;
@tailwind components;
@tailwind utilities;
```

{% note warning flat %}
以上配置方法仅使用与`tailwindcss@3`以及`daisyui@4`，自`2025-2`后`taiwind`也更新到了`@5`版本，配置方法也有所变化，需按照官方配置
{% endnote %}
[tailwindcss 官网](https://tailwindcss.com/docs/installation)
[daisyui 官网](https://v4.daisyui.com/docs/install/)


### 通知组件
通知组件即`react-hot-toast`
其作用是提供一种更加优美的通知框

用法为在全局中配置组件
在`APP.jsx`末尾加入`<Toaster />`组件

随后便可以使用`toast.xxx()`函数使用想要的通知了
在对失败及成功消息的提示方面，该组件效果相当不错，项目中就大量用到了其通知功能

## 全局路由配置

使用`react-router-dom`进行路由配置，需要注意的是使用`router`前需确保安装了`react`和`react-dom`依赖

1. 首先使用`<BrowserRouter></BrowserRouter>`确定路由类型，在`main.jsx`中包裹主体部分
```js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>
);
```
2. 创建路由实例以及配置路由页面
   创建如下所示的路由实例，将应用分为如下几个页面
```js
return (
	<div data-theme={theme}>
		<NavBar />

		<Routes>
			<Route
				path="/"
				element={authUser ? <HomePage /> : <Navigate to="/login" />}
			/>
			<Route
				path="/signup"
				element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
			/>
			<Route
				path="/login"
				element={!authUser ? <LoginPage /> : <Navigate to="/" />}
			/>
			<Route path="/settings" element={<SettingPage />} />
			<Route
				path="/profile"
				element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
			/>
			{/* <Route path="*" element={<Navigate to="/" />} /> */}
		</Routes>

		<Toaster />
	</div>
);
```
{% note primary flat %}
可以看到在上述样例中，通过对用户身份`authUser`的验证进行了路由跳转的重定向，而不是直接定向到对应界面，这使得路由跳转更加符合逻辑
{% endnote %}
3. 随后对`<NavBar>`中的导航添加点击事件，使用`<Link>`即可进行路由页面的跳转
`<NavBar>`组件内部结构如下，同样根据用户身份验证变化
```js
import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = () => {
	const { logout, authUser } = useAuthStore();

	return (
		<header
			className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
		>
			<div className="container mx-auto px-4 h-16">
				<div className="flex items-center justify-between h-full">
					<div className="flex items-center gap-8">
						<Link
							to="/"
							className="flex items-center gap-2.5 hover:opacity-80 transition-all"
						>
							<div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
								<MessageSquare className="w-5 h-5 text-primary" />
							</div>
							<h1 className="text-lg font-bold">Chatty</h1>
						</Link>
					</div>

					<div className="flex items-center gap-2">
						<Link
							to={"/settings"}
							className={`
              btn btn-sm gap-2 transition-colors
              
              `}
						>
							<Settings className="w-4 h-4" />
							<span className="hidden sm:inline">Settings</span>
						</Link>

						{authUser && (
							<>
								<Link to={"/profile"} className={`btn btn-sm gap-2`}>
									<User className="size-5" />
									<span className="hidden sm:inline">Profile</span>
								</Link>

								<button className="flex gap-2 items-center" onClick={logout}>
									<LogOut className="size-5" />
									<span className="hidden sm:inline">Logout</span>
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default NavBar;
```

## 外部工具配置

在`src/lib`文件夹中配置的工具
配置单独的`axios`请求库
创建`axios.js`文件，创建`axiosInstance`实例，进行如下基本配置

```js
import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: "http://localhost:5001/api/",
	withCredentials: true,
});
```

配置可能会用到的工具插件
创建`utils.js`，提供一个格式化时间的函数

```js
export function formatMessageTime(date) {
	return new Date(date).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}
```

## 全局状态管理库

该项目使用`zustand`进行状态管理[zustand 官方教程](https://awesomedevin.github.io/zustand-vue/docs/introduce/start/zustand)
项目的全局状态管理库用来提供一些跨组件共享的状态，从而避免反复使用`{props}`进行状态传递

通过全局状态库对不同类别的共享状态的存放，可以有效关系系统层次结构，比如，在该项目中，就区分出了用户层面和消息层面两个区块，分别创建`store/useAuthStore.js`和`store/useChatStore.js`两个文件夹进行关系，下面将依次介绍两者的功能

### 用户层面状态管理

用户层面的状态管理分别存储如下信息：

1. 登录用户身份
2. 用户操作状态，如（登陆中、注册中）等
3. 提供在线用户的状态
4. 提供管理状态，特别是用户身份的一系列方法

下面就对以上部分进行进行讲解
首先创建一个`zustand`状态管理库，以及调取所需的依赖

```js
import {create} from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
  ...
}))
```

然后添加一些用户层面的状态量，分别存储用户信息，操作状态和在线用户信息

```js
  authUser: null,

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  onlineUsers: [],
```

最后添加状态管理方法：

1. `checkAuth`：根据`jwt token`检验用户是否存在
2. `signup`：用户注册完后，设置用户状态
3. `login`：用户登陆后设置用户状态
4. `logout`：用户退出后清除用户状态
5. `updateProfile`：用户修改个人信息后更改用户状态
6. 通过用户操作，在异步请求过程中设置`ing`进行时，从而展示用户操作状态
   具体代码如下：

```js
 checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check')
      set({ authUser: response.data, isCheckingAuth: false })
      // console.log(response.data);
    } catch (error) {
      console.log("error in check auth", error);
      set({ authUser: null, isCheckingAuth: false })
    }
  },
  signup: async (data) => {
    set({isSigningUp:true})
    try {
      const res = await axiosInstance.post('/auth/signup',data)
      set({authUser: res.data})
      toast.success('Accound created successfully')
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error)
    } finally{
      set({isSigningUp:false})
    }
  },

  login: async (data) => {
    set({isLoggingIn:true})
    try {
      const res = await axiosInstance.post('/auth/login',data)
      set({authUser: res.data})
      toast.success('Logged in successfully')
    } catch (error) {
      toast.error(error.response.data.message)
      // console.log(error)
    } finally{
      set({isLoggingIn:false})
    }
  },

  logout: async (data) => {
    try {
      await axiosInstance.post('/auth/logout')
      set({authUser: null})
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error)
    }
  },

  updateProfile: async (data) =>{
    set({isUpdatingProfile:true})
    try {
      const res = await axiosInstance.put('/auth/update-profile',data)
      set({authUser: res.data})
      toast.success('Profile updated successfully')

    } catch (error) {
      toast.error(error.response?.data.message || 'upload error')
      console.log(error)
    }
    finally{
      set({isUpdatingProfile:false})
    }
  }
```

### 消息层面状态管理

消息层面状态管理存储信息如下：

1. 用户列表
2. 选定的聊天用户
3. 与选定用户的消息列表
4. 用户与消息的加载中状态
5. 提供更改上述状态的一系列方法

用相同的方法创建`zustand`状态管理库

```js
import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";


export const useChatStore = create((set, get) => ({
  ...
}))
```

{% note info flat %}
两个状态管理库存在细微差别，即第二个库中导入了`get`参数，以在库内部获取状态
{% endnote %}

其中维护的状态如下，分别存储用户列表，选定用户，沟通消息，异步加载状态

```js
	messages: [],
	users: [],
	selectedUser: null,

	isUserLoading: false,
	isMessageLoading: false,
```

最后添加消息层面的状态管理方法

1. `getUser`：根据登录用户信息获取用户列表
2. `getMessage`：根据对方的`id`作为参数获取与其沟通的消息，获取消息列表
3. `sendMessage`：根据选定用户的`id`发送消息并更新消息列表
4. `setSelectedUser`：更新选定用户信息

```js
getUser: async () => {
		set({ isUserLoading: true });
		try {
			const response = await axiosInstance.get("/message/users");
			set({ users: response.data });
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
		} finally {
			set({ isUserLoading: false });
		}
	},

	getMessages: async (userId) => {
		set({ isMessageLoading: true });
		try {
			const res = await axiosInstance.get(`/message/${userId}`);
      // console.log(res)
			set({ messages: res.data });
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
		} finally {
			set({ isMessageLoading: false });
		}
	},

	sendMessage: async (messageData) => {
		const { selectedUser, messages } = get();
		try {
			const res = await axiosInstance.post(
				`/message/send/${selectedUser._id}`,
				messageData
			);
			set({ messages: [...messages, res.data] });
		} catch (error) {
			toast.error(error.response.data.message);
		}
	},

	setSelectedUser: (user) => set({ selectedUser: user }),
```

# 页面逻辑

## 注册页 SignUpPage

该页面提供如下功能：

1. 维护一张用户信息表单，包含`fullName`、`email`、`password`
2. 提供密码显隐功能
3. 提供注册功能，异步处理注册时禁用按钮
4. 提供表单验证方法
5. 和登录页之间的跳转功能

页面局部状态，分别维护表单以及密码显示隐藏
```js
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
	});
```
页面局部方法，分别用作表单验证和表单提交
```js
	const { signup, isSigningUp } = useAuthStore();

	const validateForm = () => {
		if (!formData.fullName.trim()) {
			return toast.error("fullName is required");
		}
		if (!formData.email.trim()) {
			return toast.error("email is required");
		}
		if (!/\S+@\S+\.\S+/.test(formData.email))
			return toast.error("Invalid email format");
		if (!formData.password.trim()) {
			return toast.error("password is required");
		}
		if (formData.password.length < 6)
			return toast.error("Password must be at least 6 characters");

    return true 
	};

	const handleSubmit = (e) => {
		e.preventDefault();

    const success = validateForm()

    if (success === true) {
      signup(formData);
    }
	};
``` 

{% folding blue, 完整代码 %}
```js
import React, { useState } from "react";

import { useAuthStore } from "../store/useAuthStore.js";

import {
	Eye,
	EyeOff,
	Loader2,
	Lock,
	Mail,
	MessageSquare,
	User,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern.jsx";

import {toast} from "react-hot-toast";


const SignUpPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
	});

	const { signup, isSigningUp } = useAuthStore();

	const validateForm = () => {
		if (!formData.fullName.trim()) {
			return toast.error("fullName is required");
		}
		if (!formData.email.trim()) {
			return toast.error("email is required");
		}
		if (!/\S+@\S+\.\S+/.test(formData.email))
			return toast.error("Invalid email format");
		if (!formData.password.trim()) {
			return toast.error("password is required");
		}
		if (formData.password.length < 6)
			return toast.error("Password must be at least 6 characters");

    return true 
	};

	const handleSubmit = (e) => {
		e.preventDefault();

    const success = validateForm()

    if (success === true) {
      signup(formData);
    }
	};

	return (
		<div className="min-h-screen grid lg:grid-cols-2 pt-12">
			<div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-base-100">
				<div className="w-full max-w-full space-y-8">
					{/* logo */}
					<div className="text-center mb-8">
						<div className="flex flex-col items-center gap-2 group">
							<div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
								<MessageSquare className="size-6 text-primary" />
							</div>
							<h1 className="text-2xl font-bold mt-2">Create Your Account</h1>
							<p className="text-base-content/60">
								Get Start With Your Account{" "}
							</p>
						</div>
					</div>

					{/* form controller */}
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="form-control">
							<label className="label">
								<span className="label-text font-medium">Full Name</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<User className="size-5 text-base-content/40" />
								</div>
								<input
									type="text"
									className={`input input-bordered w-full pl-10`}
									placeholder="John Doe"
									value={formData.fullName}
									onChange={(e) =>
										setFormData({ ...formData, fullName: e.target.value })
									}
								/>
							</div>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text font-medium">Email</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="size-5 text-base-content/40" />
								</div>
								<input
									type="email"
									className={`input input-bordered w-full pl-10`}
									placeholder="you@example.com"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
								/>
							</div>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text font-medium">Password</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="size-5 text-base-content/40" />
								</div>
								<input
									type={showPassword ? "text" : "password"}
									className={`input input-bordered w-full pl-10`}
									placeholder="••••••••"
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="size-5 text-base-content/40" />
									) : (
										<Eye className="size-5 text-base-content/40" />
									)}
								</button>
							</div>
						</div>

						<button
							type="submit"
							className="btn btn-primary w-full"
							disabled={isSigningUp}
						>
							{isSigningUp ? (
								<>
									<Loader2 className="size-5 animate-spin" />
									Loading...
								</>
							) : (
								"Create Account"
							)}
						</button>
					</form>

					<div className="text-center">
						<p className="text-base-content/60">
							Already have an account?{" "}
							<Link to="/login" className="link link-primary">
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>

			<AuthImagePattern
				title="Join our community"
				subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
			/>
		</div>
	);
};

export default SignUpPage;
```
{% endfolding %}

## 登录页 LoginPage
登录页功能和注册页类似，分别提供如下功能
1. 维护登录表单
2. 控制密码显隐
3. 处理登录逻辑
4. 与注册页相互跳转

页面局部状态和方法
```js
	const { login, isLoggingIn } = useAuthStore();

	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		login(formData);
	};
```

{% folding blue, 完整代码 %}
```js
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const LoginPage = () => {
	const { login, isLoggingIn } = useAuthStore();

	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		login(formData);
	};

	return (
		<div className="h-screen grid lg:grid-cols-2 pt-12">
			{/* Left Side - Form */}
			<div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-base-100">
				<div className="w-full max-w-md space-y-8">
					{/* Logo */}
					<div className="text-center mb-8">
						<div className="flex flex-col items-center gap-2 group">
							<div
								className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
							>
								<MessageSquare className="w-6 h-6 text-primary" />
							</div>
							<h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
							<p className="text-base-content/60">Sign in to your account</p>
						</div>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="form-control">
							<label className="label">
								<span className="label-text font-medium">Email</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="h-5 w-5 text-base-content/40" />
								</div>
								<input
									type="email"
									className={`input input-bordered w-full pl-10`}
									placeholder="you@example.com"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
								/>
							</div>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text font-medium">Password</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-base-content/40" />
								</div>
								<input
									type={showPassword ? "text" : "password"}
									className={`input input-bordered w-full pl-10`}
									placeholder="••••••••"
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5 text-base-content/40" />
									) : (
										<Eye className="h-5 w-5 text-base-content/40" />
									)}
								</button>
							</div>
						</div>

						<button
							type="submit"
							className="btn btn-primary w-full"
							disabled={isLoggingIn}
						>
							{isLoggingIn ? (
								<>
									<Loader2 className="h-5 w-5 animate-spin" />
									Loading...
								</>
							) : (
								"Sign in"
							)}
						</button>
					</form>

					<div className="text-center">
						<p className="text-base-content/60">
							Don&apos;t have an account?{" "}
							<Link to="/signup" className="link link-primary">
								Create account
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* Right Side - Image/Pattern */}
			<AuthImagePattern
				title={"Welcome back!"}
				subtitle={
					"Sign in to continue your conversations and catch up with your messages."
				}
			/>
		</div>
	);
};

export default LoginPage;

```
{% endfolding %}

## 个人资料页 ProfilePage
该页面提供页面逻辑如下
1. 显示用户信息
2. 读取本地图片
3. 更新图片信息

首先显示用户个人信息部分，直接调用状态管理库中的用户数据即可
```js
	const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
```

读取本地图片即读取本地文件，需要用到`fileReader()`文件读取器
通过如下方式将图片读取为`DataURL`数据流，再作为参数传入`updateProfile()`方法中更改图片
```js
	const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result
      setSelectedImg(base64Image);
      await updateProfile({profileImage:base64Image});
    };

	};
```

{% folding blue , 完整代码 %}
```js
import React from "react";

import { useAuthStore } from "../store/useAuthStore.js";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
	const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  const [selectedImg, setSelectedImg] = React.useState(null);

	const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result
      setSelectedImg(base64Image);
      await updateProfile({profileImage:base64Image});
    };

	};
	return (
		<div className="h-full pt-20">
			<div className="max-w-2xl mx-auto p-4 py-8">
				<div className="bg-base-300 rounded-xl p-6 space-y-8">
					<div className="text-center">
						<h1 className="text-2xl font-semibold ">Profile</h1>
						<p className="mt-2">Your profile information</p>
					</div>

					{/* avatar upload section */}

					<div className="flex flex-col items-center gap-4">
						<div className="relative">
							<img
								src={selectedImg || authUser.profileImage || "/avatar.png"}
								alt="Profile"
								className="size-32 rounded-full object-cover border-4 "
							/>
							<label
								htmlFor="avatar-upload"
								className={`
                absolute bottom-0 right-0 
                bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer 
                transition-all duration-200
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
              `}
							>
								<Camera className="w-5 h-5 text-base-200" />
								<input
									type="file"
									id="avatar-upload"
									className="hidden"
									accept="image/*"
									onChange={handleImageUpload}
									disabled={isUpdatingProfile}
								/>
							</label>
						</div>
						<p className="text-sm text-zinc-400">
							{isUpdatingProfile
								? "Uploading..."
								: "Click the camera icon to update your photo"}
						</p>
					</div>

					<div className="space-y-6">
						<div className="space-y-1.5">
							<div className="text-sm text-zinc-400 flex items-center gap-2">
								<User className="w-4 h-4" />
								Full Name
							</div>
							<p className="px-4 py-2.5 bg-base-200 rounded-lg border">
								{authUser?.fullName}
							</p>
						</div>

						<div className="space-y-1.5">
							<div className="text-sm text-zinc-400 flex items-center gap-2">
								<Mail className="w-4 h-4" />
								Email Address
							</div>
							<p className="px-4 py-2.5 bg-base-200 rounded-lg border">
								{authUser?.email}
							</p>
						</div>
					</div>

					<div className="mt-6 bg-base-300 rounded-xl p-6">
						<h2 className="text-lg font-medium  mb-4">Account Information</h2>
						<div className="space-y-3 text-sm">
							<div className="flex items-center justify-between py-2 border-b border-zinc-700">
								<span>Member Since</span>
								<span>{authUser.createdAt?.split("T")[0]}</span>
							</div>
							<div className="flex items-center justify-between py-2">
								<span>Account Status</span>
								<span className="text-green-500">Active</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;

```
{% endfolding %}

## 设置页 SettingPage
设置页的工作即提供主题切换功能，包括:
1. 主题预览
2. 主题切换

项目中应用的主体功能为`daisyui`中提供的主题功能，其使用方法为在组件根元素中设置`data-theme = { themeName }`来修改`ui`主题，因此我们只需要在全局对主题进行动态配置，即引入一个全局状态`theme`即可
在`store/useThemeStore.js`中添加关于主题的状态仓库
```js
import { create } from "zustand";

export const useThemeStore = create((set) => ({
	theme: localStorage.getItem("chat-theme") || "coffee",
	setTheme: (theme) => {
		localStorage.setItem("chat-theme", theme);
		set({ theme });
	},
}));
```
其他部分就不必多说了，在外层组件调取`theme`并动态绑定即可

`Setting Page`中的主题预览功能则是通过循环渲染实现，其循环列表则作为常量被保存在常量文件夹中
{% folding blue , 详细代码 %}
```js
import React from "react";

import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
	{ id: 1, content: "Hey! How's it going?", isSent: false },
	{
		id: 2,
		content: "I'm doing great! Just working on some new features.",
		isSent: true,
	},
];

 const SettingPage = () => {
	const { theme, setTheme } = useThemeStore();

	return (
		<div className="space-y-6 pt-20 p-12">
			<div className="flex flex-col gap-1">
				<h2 className="text-lg font-semibold">Theme</h2>
				<p className="text-sm text-base-content/70">
					Choose a theme for your chat interface
				</p>
			</div>

			<div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
				{THEMES.map((t) => (
					<button
						key={t}
						className={`
            group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
            ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
          `}
						onClick={() => setTheme(t)}
					>
						<div
							className="relative h-8 w-full rounded-md overflow-hidden"
							data-theme={t}
						>
							<div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
								<div className="rounded bg-primary"></div>
								<div className="rounded bg-secondary"></div>
								<div className="rounded bg-accent"></div>
								<div className="rounded bg-neutral"></div>
							</div>
						</div>
						<span className="text-[11px] font-medium truncate w-full text-center">
							{t.charAt(0).toUpperCase() + t.slice(1)}
						</span>
					</button>
				))}
			</div>

			{/* Preview Section */}
			<h3 className="text-lg font-semibold mb-3">Preview</h3>
			<div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
				<div className="p-4 bg-base-200">
					<div className="max-w-lg mx-auto">
						{/* Mock Chat UI */}
						<div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
							{/* Chat Header */}
							<div className="px-4 py-3 border-b border-base-300 bg-base-100">
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
										J
									</div>
									<div>
										<h3 className="font-medium text-sm">John Doe</h3>
										<p className="text-xs text-base-content/70">Online</p>
									</div>
								</div>
							</div>

							{/* Chat Messages */}
							<div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
								{PREVIEW_MESSAGES.map((message) => (
									<div
										key={message.id}
										className={`flex ${
											message.isSent ? "justify-end" : "justify-start"
										}`}
									>
										<div
											className={`
                      max-w-[80%] rounded-xl p-3 shadow-sm
                      ${
												message.isSent
													? "bg-primary text-primary-content"
													: "bg-base-200"
											}
                    `}
										>
											<p className="text-sm">{message.content}</p>
											<p
												className={`
                        text-[10px] mt-1.5
                        ${
													message.isSent
														? "text-primary-content/70"
														: "text-base-content/70"
												}
                      `}
											>
												12:00 PM
											</p>
										</div>
									</div>
								))}
							</div>

							{/* Chat Input */}
							<div className="p-4 border-t border-base-300 bg-base-100">
								<div className="flex gap-2">
									<input
										type="text"
										className="input input-bordered flex-1 text-sm h-10"
										placeholder="Type a message..."
										value="This is a preview"
										readOnly
									/>
									<button className="btn btn-primary h-10 min-h-0">
										<Send size={18} />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingPage;

```
{% endfolding %}

## 主页 HomePage
主页可分为两个部分，分别是侧边栏`SideBar`和聊天区`ChatContainer`

其中，侧边栏部分实现的功能逻辑如下：
1. 设置用户列表
2. 设置选择用户
3. 设置是否只查看在线用户

局部状态和方法如下：
```js
	const { users, getUser, selectedUser, setSelectedUser, isUserLoading } =
		useChatStore();

	const [showOnlineOnly, setShowOnlineOnly] = useState(false);

	const { onlineUsers } = useAuthStore();

	const filteredUsers = showOnlineOnly
		? users.filter((user) => onlineUsers.includes(user._id))
		: users;

	useEffect(() => {
		getUser();
	}, [getUser]);
```
首先触发一次`getUser`函数获取用户列表，随后根据用户列表循环渲染，再通过点击选定用户设置选定用户
{% folding blue , 完整代码 %}
```js
import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/sidebarSkeleton";
import { Users } from "lucide-react";

const SideBar = () => {
	const { users, getUser, selectedUser, setSelectedUser, isUserLoading } =
		useChatStore();

	const [showOnlineOnly, setShowOnlineOnly] = useState(false);

	const { onlineUsers } = useAuthStore();

	const filteredUsers = showOnlineOnly
		? users.filter((user) => onlineUsers.includes(user._id))
		: users;

	useEffect(() => {
		getUser();
	}, [getUser]);

	if (isUserLoading) return <SidebarSkeleton />;
	return (
		<aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
			<div className="border-b border-base-300 w-full p-5">
				<div className="flex items-center gap-2">
					<Users className="size-6" />
					<span className="font-medium hidden lg:block">Contacts</span>
				</div>
				{/* TODO: Online filter toggle */}
				<div className="mt-3 hidden lg:flex items-center gap-2">
					<label className="cursor-pointer flex items-center gap-2">
						<input
							type="checkbox"
							checked={showOnlineOnly}
							onChange={(e) => setShowOnlineOnly(e.target.checked)}
							className="checkbox checkbox-sm"
						/>
						<span className="text-sm">Show online only</span>
					</label>
					<span className="text-xs text-zinc-500">
						({onlineUsers.length - 1} online)
					</span>
				</div>
			</div>

			<div className="overflow-y-auto w-full py-3">
				{filteredUsers.map((user) => (
					<button
						key={user._id}
						onClick={() => setSelectedUser(user)}
						className={`
            w-full p-3 flex items-center gap-3
            hover:bg-base-300 transition-colors
            ${
							selectedUser?._id === user._id
								? "bg-base-300 ring-1 ring-base-300"
								: ""
						}
          `}
					>
						<div className="relative mx-auto lg:mx-0">
							<img
								src={user.profileImage || "/avatar.png"}
								alt={user.name}
								className="size-12 object-cover rounded-full"
							/>
							{onlineUsers.includes(user._id) && (
								<span
									className="absolute bottom-0 right-0 size-3 bg-green-500 
                rounded-full ring-2 ring-zinc-900"
								/>
							)}
						</div>
						{/* User info - only visible on larger screens */}
						<div className="hidden lg:block text-left min-w-0">
							<div className="font-medium truncate">{user.fullName}</div>
							<div className="text-sm text-zinc-400">
								{onlineUsers.includes(user._id) ? "Online" : "Offline"}
							</div>
						</div>
					</button>
				))}

				{filteredUsers.length === 0 && (
					<div className="text-center text-zinc-500 py-4">No online users</div>
				)}
			</div>
		</aside>
	);
};

export default SideBar;
```

{% endfolding %}

聊天区的主要功能逻辑还可分为两部分，分别是消息列表以及消息发送部分
其中，消息列表的功能逻辑如下：
1. 根据选定用户的切换获取不同的消息列表
2. 根据发送者和接收者在两边展示消息

消息列表根据选定用户变化的功能通过`useEffect`钩子监听发送对象完成
```js
	useEffect(() => {
		 getMessages(selectedUser._id);
	}, [getMessages, selectedUser._id]);
```
确定发送者还是接收者则由`authUser`和`senderID`的对比完成，`ui`使用`daisyui`的对话框组件
```js
className={`chat ${message.senderID === authUser._id ? "chat-end" : "chat-start"}`}
```

{% folding blue , 完整代码 %}
```js
import React, { useEffect } from "react";

import { useChatStore } from "../store/useChatStore";

import MessageSkeleton from "./skeletons/MessageSkeleton";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";

import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
	const { messages, getMessages, isMessageLoading, selectedUser } =
		useChatStore();
	const { authUser } = useAuthStore();

	useEffect(() => {
		 getMessages(selectedUser._id);
	}, [getMessages, selectedUser._id]);


	if (isMessageLoading)
		return (
			<div className="flex-1 flex flex-col overflow-auto">
				<ChatHeader />
				<MessageSkeleton />
				<MessageInput />
			</div>
		);

	return (
		<div className="flex-1 flex flex-col overflow-auto">
			<ChatHeader />

			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.map((message) => (
					<div
						key={message._id}
            className={`chat ${message.senderID === authUser._id ? "chat-end" : "chat-start"}`}
					>
						<div className="chat-image avatar">
							<div className="size-10 rounded-full border">
								<img
									src={
										message.senderID === authUser._id
											? authUser.profileImage || "/avatar.png"
											: selectedUser.profileImage || "/avatar.png"
									}
									alt="profile pic"
								/>
							</div>
						</div>

						<div className="chat-header mb-1">
							<time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
							</time>
						</div>

						<div className="chat-bubble flex flex-col">
							{message.image && (
								<img
									src={message.image}
									alt="Attachment"
									className="sm:max-w-[200px] rounded-md mb-2"
								/>
							)}
							{message.text && <p>{message.text}</p>}
						</div>
					</div>
				))}
			</div>

			<MessageInput />
		</div>
	);
};

export default ChatContainer;

```
{% endfolding %}

消息发送部分则需要完成
1. 普通消息发送
2. 如果有图片需要发送图片

其对于图片的发送和`profile`中图片的修改类似，都是设置`FileReader`
```js
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file.type.startsWith("image/")) {
			toast.error("Please select an image file");
			return;
		}

		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onload = () => {
			setImagePreview(reader.result);
		};
	};
```
发送消息时根据文字和图片状态，有其一便调取`api`
```js
	const handleSendMessage = async (e) => {
    e.preventDefault();
    if(!text.trim() && !imagePreview) return

    try {
      await sendMessage({text:text.trim(), image:imagePreview})
      setText("")
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      };
    } catch (error) {
      console.log("fail to send message", error);
      toast.error("fail to send message")
    }
  };
```

{% folding blue , 完整代码 %}
```js
import React from "react";
import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { Send, Image, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
	const [text, setText] = useState("");
	const [imagePreview, setImagePreview] = useState(null);
	const fileInputRef = useRef(null);
	const { sendMessage } = useChatStore();

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file.type.startsWith("image/")) {
			toast.error("Please select an image file");
			return;
		}

		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onload = () => {
			setImagePreview(reader.result);
		};
	};

	const removeImage = () => {
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		};
	};
	const handleSendMessage = async (e) => {
    e.preventDefault();
    if(!text.trim() && !imagePreview) return

    try {
      await sendMessage({text:text.trim(), image:imagePreview})
      setText("")
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      };
    } catch (error) {
      console.log("fail to send message", error);
      toast.error("fail to send message")
    }
  };

	return (
		<div className="p-4 w-full">
			{imagePreview && (
				<div className="mb-3 flex items-center gap-2">
					<div className="relative">
						<img
							src={imagePreview}
							alt="Preview"
							className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
						/>
						<button
							onClick={removeImage}
							className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
							type="button"
						>
							<X className="size-3" />
						</button>
					</div>
				</div>
			)}

			<form onSubmit={handleSendMessage} className="flex items-center gap-2">
				<div className="flex-1 flex gap-2">
					<input
						type="text"
						className="w-full input input-bordered rounded-lg input-sm sm:input-md"
						placeholder="Type a message..."
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					<input
						type="file"
						accept="image/*"
						className="hidden"
						ref={fileInputRef}
						onChange={handleImageChange}
					/>

					<button
						type="button"
						className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
						onClick={() => fileInputRef.current?.click()}
					>
						<Image size={20} />
					</button>
				</div>
				<button
					type="submit"
					className="btn btn-sm btn-circle"
					disabled={!text.trim() && !imagePreview}
				>
					<Send size={22} />
				</button>
			</form>
		</div>
	);
};
export default MessageInput;

```
{% endfolding %}