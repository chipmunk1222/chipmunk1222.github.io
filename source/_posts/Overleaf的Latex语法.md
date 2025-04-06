---
title: Overleaf的Latex语法使用手册
date: 2025-04-06 19:24:54
tags:
  - Latex
category: 技术教程
description: 快速上手Overleaf中的常用Latex语法，Overleaf中的Latex公式手册
---

{% tip bolt %}
`Overleaf`，一款免费的在线云编辑器，其使用`Latex`作为编辑语言，只要掌握一些基础的语法，就可以地创作出布局精良的论文，再也无须为论文排版而烦恼，下面就来介绍下其中的一些常用的语法格式
{% endtip %}

# 一键配置
复制以下代码来一键配置初始化论文文档
```latex
\documentclass{article}
%-- coding: UTF-8 --
\usepackage[UTF8]{ctex}
\usepackage{graphicx}
\usepackage{soul,color,xcolor}
\usepackage{titlesec}
\setcounter{secnumdepth}{4}
\setcounter{tocdepth}{4}

% Set page size and margins
% Replace `letterpaper' with `a4paper' for UK/EU standard size
\usepackage[letterpaper,top=2cm,bottom=2cm,left=3cm,right=3cm,marginparwidth=1.75cm]{geometry}

\usepackage{type1cm} 

\usepackage{float}
% 导入代码块
\usepackage{tocloft}

\usepackage{listings}
\usepackage{pdfpages}

\usepackage{amsmath}
\usepackage[colorlinks=true, allcolors=blue]{hyperref}

\usepackage[backend=biber]{biblatex} % 引入 biblatex 宏包
\addbibresource{references.bib} % 指定参考文献文件
% 自定义代码块样式
\lstset{
    breaklines=true, % 自动换行
    breakatwhitespace=true, % 在空白处换行
    numbers=left, % 显示行号
    numberstyle=\tiny, % 行号字体
    keywordstyle=\color{blue!70}, % 关键字颜色
    commentstyle=\color{red!50!green!50!blue!50}, % 注释颜色
    frame=shadowbox, % 为代码块添加阴影框
    rulesepcolor=\color{red!20!green!20!blue!20}, % 阴影框颜色
    escapeinside=``, % 允许在代码块中使用 LaTeX 命令
    xleftmargin=2em, xrightmargin=2em, aboveskip=1em, % 设置代码块的边距
    framexleftmargin=2em % 阴影框左边距
} 


\title{title}
\author{}
\date{}

\begin{document}

% \includepdf[page=1-2]{cover.pdf}
\maketitle

% \begin{abstract}
% Your abstract.
% \end{abstract}
\tableofcontents

正文内容...

\printbibliography % 显示参考文献列表
\end{document}
```

# 原生语法
## 基本结构
```latex
\documentclass{article} % 定义文档类型

\usepackage{graphicx}           % 在这里插入后续需要的宏包

\title{}        % 论文标题
\author{}       % 作者
\date{}         % 创作日期

\begin{document}        % 开始正文
\maketitle              % 标题位置

% \begin{abstract}      % 插入摘要
% Your abstract.
% \end{abstract}

Hello, world!           % 正文内容

\end{document}          % 结束正文

```

## 标题结构
```latex
\section{一级标题}
\subsection{二级标题}
\subsubsection{三级标题}
\paragraph{四级小标题}
\subparagraph{五级小标题}
```

## 行内样式
```latex
\textbf{加粗文本} % 加粗
\textit{斜体文本} % 斜体
\underline{下划线文本} % 下划线
```

## 列表
{% tabs lists %}
<!-- tab 有序列表@icon -->
```latex
\begin{enumerate}
    \item 项目 1
    \item 项目 2
\end{enumerate}
```
<!-- endtab -->
<!-- tab 无序列表@icon -->
```latex
\begin{itemize}
    \item 项目 1
    \item 项目 2
\end{itemize}
```
<!-- endtab -->
{% endtabs %}


## 数学公式
**行内公式：**这是一个行内公式：$E=mc^2$

**独立公式：**
```latex
\begin{equation}
    a^2 + b^2 = c^2
\end{equation}

```

# 宏包语法
## 文档语言
由于`Overleaf`原生不自带中文，所以需要使用宏包切换中文
```latex
\usepackage[UTF8]{ctex}
```
随后需要在左上角菜单将编译器改为`LuaLatex`则可使用中文

## 文档结构和版面布局
```latex
\setcounter{secnumdepth}{4}  % 决定显示几级标题编号
\setcounter{tocdepth}{4}    % 决定目录中显示的标题层次

\usepackage[letterpaper,top=2cm,bottom=2cm,left=3cm,right=3cm,marginparwidth=1.75cm]{geometry}  % 设置页面尺寸和边距
```

## 标题样式和文本格式
```latex
\usepackage{titlesec}   % 自定义标题的样式
\usepackage{soul,color,xcolor}   % soul 支持文本高亮、下划线和删除线。color 和 xcolor 提供颜色支持，用于设置文本颜色或背景色。
```
**使用方法：**
```latex
\hl{高亮内容}  % 高亮文本
\textcolor{blue}{蓝色文本}   % 改变颜色
```

## 插入图片
```latex
\usepackage{graphicx}  % 插入图片

\includegraphics[width=\textwidth]{image.png}   % 插入图片并改变大小
```

## 浮动体图片
```latex
\usepackage{graphicx} 
\usepackage{float}       % 控制浮动

\begin{figure}[H]       % 上下文浮动
    \centering          % 表示居中
    \includegraphics[width=0.75\linewidth]{login.jpg}  % 插入图片，指定宽度
    \caption{Login Page}        % 图标文字
    \label{fig:Login Page}      % 图片标签
\end{figure}

```
浮动体同时还可应用于表格

## 目录
```latex  
\usepackage{tocloft}    % 自动生成目录

\begin{document}

\maketitle

\tableofcontents      % 生成文档目录

\end{document}
```

## 代码块
```latex
\usepackage{listings}   % 插入代码块

% 自定义代码块样式
\lstset{
    breaklines=true, % 自动换行
    breakatwhitespace=true, % 在空白处换行
    numbers=left, % 显示行号
    numberstyle=\tiny, % 行号字体
    keywordstyle=\color{blue!70}, % 关键字颜色
    commentstyle=\color{red!50!green!50!blue!50}, % 注释颜色
    frame=shadowbox, % 为代码块添加阴影框
    rulesepcolor=\color{red!20!green!20!blue!20}, % 阴影框颜色
    escapeinside=``, % 允许在代码块中使用 LaTeX 命令
    xleftmargin=2em, xrightmargin=2em, aboveskip=1em, % 设置代码块的边距
    framexleftmargin=2em % 阴影框左边距
} 

```

## 插入PDF文件
```latex
\usepackage{pdfpages}     % 插入PDF文件

\includepdf[pages=1-2]{document.pdf}    % 指定插入文件页数
```

## 更高级的数学公式
```latex
\usepackage{amsmath}

\begin{align}         % 支持矩阵等跟更高级的数学公式
    a + b &= c \\
    d - e &= f
\end{align}

```

## 超链接
```latex
\usepackage[colorlinks=true, allcolors=blue]{hyperref}    % 插入超链接

\href{http://example.com}{点击这里访问网站}     % 使用超链接
```

## 参考文献
1. 引入必要的宏包
```latex
\usepackage[backend=biber]{biblatex} % 使用 biblatex 管理参考文献

\addbibresource{references.bib} % 指定参考文献的 .bib 文件
```
2. 创建 `.bib` 文件：在 `Overleaf` 的项目中，新建一个名为 `references.bib` 的文件。
```latex
@book{lamport1994,
  author    = {Leslie Lamport},
  title     = {LaTeX: A Document Preparation System},
  publisher = {Addison-Wesley},
  year      = {1994},
  edition   = {2nd},
}

@article{einstein1905,
  author    = {Albert Einstein},
  title     = {Zur Elektrodynamik bewegter K{\"o}rper},
  journal   = {Annalen der Physik},
  volume    = {322},
  number    = {10},
  pages     = {891--921},
  year      = {1905},
  publisher = {Wiley-VCH},
}
```
3. 在正文中引用文献，使用 `\cite{引用标签} `在正文中插入参考文献。例如
```latex
爱因斯坦的广义相对论首次出现在 \cite{einstein1905}。
```
4. 显示参考文献列表
```latex
\printbibliography % 自动生成参考文献列表
```
5. 完整代码示例
```latex
\documentclass{article}
\usepackage[utf8]{ctex}
\usepackage[backend=biber]{biblatex} % 引入 biblatex 宏包
\addbibresource{references.bib} % 指定参考文献文件

\begin{document}
这是参考文献的引用示例 \cite{lamport1994} 和 \cite{einstein1905}。

\printbibliography % 显示参考文献列表
\end{document}
```