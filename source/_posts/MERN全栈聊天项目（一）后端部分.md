---
title: MERN全栈聊天项目（一）后端部分
date: 2025-02-12 12:28:56
tags: 
  - node
  - 全栈
  - express
  - react
  - mongoDB
  - socket.io
  - cors
description: 来源于油管的全栈聊天项目，应用了如今全栈开发中非常流行了MERN架构，即，mongodb+express+react+nodejs，后端架构介绍
category: 项目总结
---


# 依赖引入
引入`node`后端所需要的依赖
```node
cd backend

npm i express mongoose dotenv jsonwentoken bcryptjs cookie-parser 
cloudinary socket.io  

npm i nodemon -D
```
下面将简单介绍下这些依赖在项目中的作用，后续将详细介绍如何在项目中使用它们

1. `express:`用于创建`node`服务器
2. `mongoose:`用于连接后端和`mongodb`数据库
3. `dotenv:`用于全局注入全局变量
4. `jsonwebtoken:`使用`JWT`进行权限验证，提供一套`JWT`密钥生成工具
5. `bcryptjs:`用于加密密码
6. `cookieparser:`解析`cookie`
7. `cloudinary:`一款图床工具
8. `sockie.io:`用于建立双端实时通信
9. `nodemon:``node`的热更新工具，只在开发环境中使用
10. `cors:`提供浏览器跨域问题的解决方案

# 搭建服务端框架
使用`node`+`express`搭建服务端应用，简单描述下后端视角下的数据流向，即：前端`request`->后端接收->数据处理与数据库交换->返回`respond`。知道这个数据流能帮我们更好地明确项目各部分架构。

## 使用express框架构建服务器
下面我们来介绍下`express`框架下服务端的三个模块，第一部分为主模块，存放入口程序；第二部分为中间件模块，提供一系列中间件`middleware`，提供一些额外功能，第三部分为主控路由模块，提供对外接口，包括每个接口的数据处理等

## express入口程序
`express`的入口程序也可称为整个`node`后端的入口程序

创建`index.js`

在这里主要实现的功能就三个，一是引入需要的`express`中间件，二是引入需要创建的接口，最后再设置监听的端口并连接数据库，代码如下
```js
import express from "express";
import authRoutes from "./routes/auth.route.js";

import "dotenv/config";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("listening on port:", PORT)
  connectDB();
});
```

其中，引入的中间件分别为`express.json`和`cookiePaeser`，其作用分别是自动解析`req`中的`json`数据以及解析`cookie`，然后再使用路由模块化的方式创建格局清晰的路由监听

## 路由模块化
**为什么需要模块化？**
路由模块化的作用是将分属不同功能的路由区分开来，各司其职，从而方便维护管理
通过`express.Router()`即可创建模块化路由，随后便可以在模块中创建单独的路由了
使用相同的`Express.use()`方式即可在主文件中注入模块

创建`route`文件夹，再在其中创建模块，比如用户模块就用`auth.route.js`命名，这样文件的结构就非常清晰了

```js
import express from "express";
import { signup, login, logout, updateProfile, checkAuth } from "../controllers/auth.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile",protectRoute, updateProfile);

router.get("/check", protectRoute,checkAuth);

export default router;
```

消息模块使用`message.route.js`命名
```js
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

import {
	getUsersForSidebar,
	getMessages,
	sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router;
```

## 单独接口定制
在单独接口定制中，我们则需要思考每一个具体接口所要实现的功能，如果需要，则通过连接并操作数据库从而得到结果

每一个接口处理方法都是一个函数，同时，对于某些接口的处理还可以设置多个方法，或者说添加“中间件”，如上述模块中最后两个接口都用到了中间件，用来做`jwt`验证，使用中间件后需要用`next()`来保证下一步跳转

`auth.route.js`中的具体代码如下，代码解析放到后续讲解

一般将主控函数放到`xxx.controller.js`文件中，将中间件函数放到`xxx.middleware.js`文件中，从而使代码结构更加清晰
`auth.controller.js`中代码如下：
```javascript
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
	const { fullName, email, password } = req.body;
	try {
		if (!fullName || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}
		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: "Password must be at least 6 characters long" });
		}

		const user = await User.findOne({ email });
		if (user) return res.status(400).json({ message: "User already exists" });

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			fullName,
			email,
			password: hashedPassword,
		});

		if (newUser) {
			await newUser.save();
			generateToken(newUser._id, res);
			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				email: newUser.email,
				profilePic: newUser.profileImage,
			});
		} else {
			res.status(400).json({ message: "invalid user data" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server error" });
	}
};

export const login = async (req, res) => {
	const { password, email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: "invalid creditials" });

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) return res.status(400).json({ message: "invalid creditials" });

		generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profileImage,
    });
	} catch (error) {
		console.log(error);
    res.status(500).json({ message: "Server error" });
	}
};

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", {
			maxAge: 0
		})
		res.status(200).json({ message: "Logout successful" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server error" });
	}
};


export const updateProfile = async (req, res) => {
	try {
		const {profileImage} = req.body;
		if(!profileImage){
			return res.status(400).json({ message: "Profile image is required" });
		}

		const userId = req.user._id;
		const uploadResponse = await cloudinary.uploader.upload(profileImage);
		const updatedUser = await User.findByIdAndUpdate(userId, {profileImage:uploadResponse.secure_url}, {new: true});

		res.status(200).json(updatedUser);


	} catch (error) {
		console.log("error in update profile", error);
		res.status(500).json({ message: "Server error" });
	}
}

export const checkAuth = (req, res) => {
	try {
		res.status(200).json(req.user);
	} catch (error) {
		console.log(error);
    res.status(500).json({ message: "Server error" });
	}
}
```
`auth.middleware.js`中代码如下：
```javascript
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async (req, res, next) =>{
  try {
    const token = req.cookies.jwt

    if(!token){
      return res.status(401).json({ message: "Unauthorized - No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if(!decoded){
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password")
    if(!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user
    next()

  } catch (error) {
    console.log("route protect error", error)
    res.status(500).json({ message: "Server error" }) 
  }
}
```

`message.controllers.js`中代码如下：
```javascript
import Users from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedinUserId = req.user._id;
		const filterdUsers = await Users.find({
			_id: { $ne: loggedinUserId },
		}).select("-password");
		res.status(200).json(filterdUsers);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const messages = await Message.find({
			$or: [
				{ receiverID: userToChatId, senderID: senderId },
				{ senderID: userToChatId, receiverID: senderId },
			],
		});

		res.status(200).json(messages);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

export const sendMessage = async (req, res) => {
	try {
		const { text, image } = req.body;
		const senderId = req.user._id;
		const receiverId = req.params.id;

		let imageUrl;
		if (image) {
			const uploadResponse = await cloudinary.uploader.upload(image, {
				folder: "fullstack-chat-app/message",
			});
			imageUrl = uploadResponse.secure_url;
		}

		const newMessage = new Message({
			senderID: senderId,
			receiverID: receiverId,
			text,
			image: imageUrl,
		});

		await newMessage.save();

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("error in send message", error.message);
		res.status(500).json({ message: "Server error" });
	}
};
```




# 操作数据库
数据库相关操作与全栈项目数据流中的数据处理部分紧密联系，绝大多数服务端接口都要涉及与数据库的交互

该项目中使用`mongodb`数据库，使用`mongoose`来连接数据库和本地代码

## 数据库的连接
`mongoose`插件极大地简化了数据库连接的流程，整个过程中往往只需要项目集群的用户名、密码即可完成连接

顺带一提另一个插件`dotenv`，这是个极其方便的插件，用于以键值对的方式将一些变量注入到全局，只需要创建一个`.env`文件，再在入口文件中引入一次（`import 'dotenv/config'`），后续即可在全局使用`process.env.key`访问全局变量

回到`mongoose`插件的介绍上，我们使用`dotenv`注入`mongoURI`的全局变量，随后即可创建连接
```env
MONGODB_URI = mongodb+srv://<username>:<password>@cluster0.8gafz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```
创建`lib/db.js`用于存放连接数据库的工具函数
```javascript
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected:" + conn.connection.host);
  } catch (error) {
    console.log(error);
  }
}
```
最后在入口文件中调用即可
```javascript
import { connectDB } from "./lib/db.js";

app.listen(PORT, () => {
  console.log("listening on port:", PORT)
  connectDB();
});
```

## 视图-模型创建
这里要先简单介绍一下`mongodb`这个数据库了，`mongodb`是一个典型的非关系型数据库，区别与关系型数据库，如`MYSQL`、`postgresql`等，`mongodb`使用文档而不是`Schema`视图进行结构化存储，这使得`mongodb`的数据结构可以灵活变化

但使用`mongoose`时仍要定义`Schema`视图，以确保数据的一致性、完整性，并且更加清晰地定义数据结构

在创建完数据库的连接之后，接下来就是要建立视图-模型的关系了
在`model/user.model.js`中创建关于`User`的视图和模型
```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		fullName: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		profileImage: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
```
随后，在需要用到该数据库的地方引入`User`模型，即可对数据库进行相应操作，具体操作还需查看[mongoose官方文档](https://mongoosejs.com/docs/api/model.html)

# 安全保障和身份验证
接下来详细介绍下有关用户登录注册的几个接口中的重要细节和知识点
## 密码的哈希加密
在需要创建用户登录验证的系统中，在账号创建时常常需要传递用户输入的信息，如账号、密码、邮件等，其中密码虽被称为"密"码，但仍存在安全风险，因此，系统还需对其进行`hash`加密，以此确保安全性

使用`bcrypt.js`实现使用盐（`salt`）实现对密码的`hash`加密
在注册时创建加密密码，具体过程代码如下：
```js
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

const newUser = new User({
  fullName,
  email,
  password: hashedPassword,
});
```
在登陆时对其进行比较，从而验证密码安全性
```js
const isPasswordCorrect = await bcrypt.compare(password, user.password);
if (!isPasswordCorrect) return res.status(400).json({ message: "invalid creditials" });
```
## jwt鉴权
上面介绍了使用`bcrypt.js`进行安全保障，接下来就讲讲使用`jwt`进行身份验证

简单介绍下`jwt`，`jwt(json web token)`是一种用户会话存储机制，用于保存和追踪用户的登录信息，确保用户的身份及来源合法
通过使用`jwt`可以防止未授权的访问风险和潜在的安全风险，理论上来说，用户每次向后端发送请求都应该包含`token`，而确保用户身份的最佳方式就是在用户注册或登录时创建`token`并将其存放在客户端中

于是，`jwt`的实现就应该分为两个部分，一是在用户登录或注册时刷新`token`并存储在本地（后端表现为返回`token`），二是在某些需要验证用户身份的接口中验证`token`

使用`jsonwebtoken`依赖来实现`jwt`的生成与验证
生成`token`时需要传入用户负载（`payload`）和密钥（`secretKey`）以及一些配置项，详见[官方配置项](https://jsonwebtoken.nodejs.cn/#install)
在`lib/utils.js`中创建`token`生成函数
```js
import jwt from "jsonwebtoken";

export const generateToken = (userId,res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token
}
```
验证`token`时，需要传入待验证的`token`，密钥以及配置项

这里还有一个细节，`express`并不能直接解析请求中的`cookie`，因此需要使用`cookie-parser`中间件来直接解析`cookie`

在`middleware/auth.middleware.js`中创建用于`token`验证的中间件
至于为什么要用中间件来验证`token`而在插件文件夹中创建`token`，这里面涉及到另一个细节，那就是验证完`token`后将除密码之外的部分传给下一个环节，代码如下
```js
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async (req, res, next) =>{
  try {
    const token = req.cookies.jwt

    if(!token){
      return res.status(401).json({ message: "Unauthorized - No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if(!decoded){
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password")
    if(!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user
    next()

  } catch (error) {
    console.log("route protect error", error)
    res.status(500).json({ message: "Server error" }) 
  }
}
```