---
title: butterfly导航栏魔改
date: 2024-10-22 16:41:31
tags: Hexo 魔改记录
description: 基于butterfly v5.0.0做的导航栏魔改
# mathjax: true
---

{% tip cogs %}
导航栏样式主要参考Fomalhaut的博客，魔改教程主要参考安知鱼的文章
{% endtip %}

{% note warning flat %}
本篇文章记述`butterfly`导航栏的魔改过程,基于`butterfly v5.0.0`,主要解决了由于`butterfly`升级造成的新的兼容性问题~~新版本升级后不仅动了很多地方的代码，甚至连文件结构都有变化~~,改着改着发现很多地方代码结构都变了，所以很多地方直接动了核心逻辑~~造屎山~~，所以文中有大量修改主题文件的代码，参考需谨慎。
{% endnote %}

# 前言
{% folding blue , 写在最前 %}
>虽然有已经有很多大佬对导航栏的魔改出过了不少教程，但随着`butterfly`版本的更新，博客代码结构部分会有许多不一样的改动，使得魔改人们不能愉快地复刻某些好看的样式~~不能愉快地cv了~~~，于是，便想着写篇文章来记述自己的魔改经历，毕竟有句话说得好，代码写完两个月，之后就只有你的电脑知道你写的是什么了，所以趁还记得就趁早记录，方便后续回顾。
{% endfolding %}

{% folding blue , 参考教程 %}
|作者|教程原帖|
|:----:|:---------:|
|安知鱼|[butterfly导航栏修改方案](https://blog.anheyu.com/posts/8e53.html)|
|Fomalhaut|[博客魔改教程(五)](https://www.fomal.cc/posts/d1927166.html)|
{% endfolding %}

# 功能点一览
{% folding cyan open, 基于原生butterfly主题，做了如下功能点改动: %}

>导航栏状态：
  1. 鼠标滚轮下滑时，显示导航栏列表
  2. 鼠标滚轮上滑时，根据页面显示不同内容，主页显示预设内容，文章页显示文章标题
  3. 滚动到文章顶部时，使导航栏与背景融合

>导航栏样式：
  1. 将导航栏位置移动至中心，将子栏变为横向显示
  2. 添加过渡效果，为变化添加一定动画效果

>行为逻辑：
  1. 点击主页图标回到主页
  2. 显示文章标题时，点击回到文章顶部

{% endfolding %}

# 导航栏横向居中
在`/source/css/`中添加文件`nav_menu.css`，将下列代码复制进文件中，并在主题文件中注入
```CSS
/* 导航栏魔改 */
/* 一级菜单居中 */
#nav .menus_items {
  position: absolute !important;
  width: max-content !important;
  left: 50% !important;
  /* transform: translate(-50%) !important; */
}
/* 子菜单横向展示 */
#nav .menus_items .menus_item:hover .menus_item_child { 
  display: flex !important;
}
/* 这里的2是代表导航栏的第2个元素，即有子菜单的元素，可以按自己需求修改 */
.menus_items .menus_item:nth-child(2) .menus_item_child {
  left: -135px;
}
.menus_items .menus_item:nth-child(3) .menus_item_child {
  left: -38px;
}
.menus_items .menus_item:nth-child(4) .menus_item_child {
  left: -23px;
}

```

# 导航栏结构修改
修改`/themes/butterfly/layout/includes/header`,修改下列代码
```DIFF
nav#nav
  span#blog-info
    a.nav-site-title(href=url_for('/'))
      if theme.nav.logo
        img.site-icon(src=url_for(theme.nav.logo) alt='Logo')
      if theme.nav.display_title
+        span,green i.fa-solid.fa-house  //首页鼠标悬浮时home图标  
        span.site-name=config.title
    if is_post()
      a.nav-page-title(href=url_for('/'))
        span.site-name=(page.title || config.title)
+
+ //鼠标下滑时的文章标题显示
+  div.mask-name-container
+    center(id="name-container")
+      a(id="page-name" href="javascript:btf.scrollToDest(0, 500)") PAGE_NAME
+
  #menus
    if theme.search.use
      #search-button
        span.site-page.social-icon.search
          i.fas.fa-search.fa-fw
          span= ' ' + _p('search.title')
    if theme.menu
      != partial('includes/header/menu_item', {}, {cache: true})

      #toggle-menu
        span.site-page
          i.fas.fa-bars.fa-fw 
```

修改`/themes/butterfly/layout/includes/header/menu_item.pug`,直接替换为如下代码

```pug
if theme.menu
  .menus_items
    each value, label in theme.menu
      if typeof value !== 'object'
        .menus_item
          - const valueArray = value.split('||')
          a.site-page.faa-parent.animated-hover(href=url_for(trim(value.split('||')[0])))
            if valueArray[1]
              i.fa-fw(class=trim(valueArray[1]))
              - var icon_value = trim(value.split('||')[1])
              - var anima_value = value.split('||')[2] ? trim(value.split('||')[2]) : 'faa-tada'
              if icon_value.substring(0,2)=="fa"      
                i.fa-fw(class=icon_value + ' ' + anima_value)
              else if icon_value.substring(0,4)=="icon"          
                svg.icon(aria-hidden="true" class=anima_value)
                  use(xlink:href=`#`+ icon_value)
            span=' '+label
      else
        .menus_item
          - const labelArray = label.split('||')
          - const hideClass = labelArray[3] && trim(labelArray[3]) === 'hide' ? 'hide' : ''
          a.site-page.group.faa-parent.animated-hover(class=`${hideClass}` href='javascript:void(0);')
            if labelArray[1]
              - var icon_label = trim(label.split('||')[1])
              - var anima_label = label.split('||')[2] ? trim(label.split('||')[2]) : 'faa-tada'
              if icon_label.substring(0,2)=="fa"      
                i.fa-fw(class=icon_label + ' ' + anima_label)
              else if icon_label.substring(0,4)=="icon"    
                svg.icon(aria-hidden="true" class=anima_label)
                  use(xlink:href=`#`+ icon_label)
            span=' '+ trim(labelArray[0])
            i.fas.fa-chevron-down
          ul.menus_item_child
            each val,lab in value 
              - const valArray = val.split('||')
              li
                a.site-page.child.faa-parent.animated-hover(href=url_for(trim(val.split('||')[0])))
                  if valArray[1]
                    - var icon_val = trim(val.split('||')[1])
                    - var anima_val = val.split('||')[2] ? trim(val.split('||')[2]) : 'faa-tada'
                    if icon_val.substring(0,2)=="fa"      
                      i.fa-fw(class=icon_val + ' ' + anima_val)
                    else if icon_val.substring(0,4)=="icon"
                      svg.icon(aria-hidden="true" class=anima_val)
                        use(xlink:href=`#`+ icon_val)                    
                  span=' '+ lab
```

# 导航栏触发逻辑修改
修改`/themes/butterfly/layout/includes/header/index.pug`,主要修改不同情况下的状态，主要通过类的增减
```diff
-
  const returnTopImg = img => img !== false ? img || theme.default_top_img : false
  const isFixedClass = theme.nav.fixed ? ' fixed' : ''
  var top_img = false
  let headerClassName = 'not-top-img'
-  //- let headerClassName = 'full-page'
  var bg_img = ''

if !theme.disable_top_img && page.top_img !== false
  if is_post()
    - top_img = page.top_img || page.cover || theme.default_top_img
  else if is_page()
    - top_img = page.top_img || theme.default_top_img
  else if is_tag()
    - top_img = theme.tag_per_img && theme.tag_per_img[page.tag]
    - top_img = top_img || returnTopImg(theme.tag_img)
  else if is_category()
    - top_img = theme.category_per_img && theme.category_per_img[page.category]
    - top_img = top_img || returnTopImg(theme.category_img)
  else if is_home()
    - top_img = returnTopImg(theme.index_img)
  else if is_archive()
    - top_img = returnTopImg(theme.archive_img)
  else
    - top_img = page.top_img || theme.default_top_img

  if top_img !== false
    - bg_img = getBgPath(top_img)
    - headerClassName = is_home() ? 'full_page' : is_post() ? 'post-bg' : 'not-home-page'
-    //- - headerClassName = is_home() ? 'full_page' : is_post() ? 'post-bg' : 'full_page'

+header#page-header(class=`${headerClassName + isFixedClass} nav-visible` style=bg_img)
  include ./nav.pug
  if top_img !== false
    if is_post()
      include ./post-info.pug
      section.main-hero-waves-area.waves-area
        svg.waves-svg(xmlns='http://www.w3.org/2000/svg', xlink='http://www.w3.org/1999/xlink', viewBox='0 24 150 28', preserveAspectRatio='none', shape-rendering='auto')
          defs
            path#gentle-wave(d='M -160 44 c 30 0 58 -18 88 -18 s 58 18 88 18 s 58 -18 88 -18 s 58 18 88 18 v 44 h -352 Z')
          g.parallax
            use(href='#gentle-wave', x='48', y='0')
            use(href='#gentle-wave', x='48', y='3')
            use(href='#gentle-wave', x='48', y='5')
            use(href='#gentle-wave', x='48', y='7')
    else if is_home()
      #site-info
        h1#site-title=config.title
        if theme.subtitle.enable
          - var loadSubJs = true
          #site-subtitle
            span#subtitle
        if theme.social
          #site_social_icons
            !=partial('includes/header/social', {}, {cache: true})
      #scroll-down
        i.fas.fa-angle-down.scroll-down-effects
    else
      #page-site-info
        h1#site-title=page.title || page.tag || page.category
  else
    //- improvement seo
    if !is_post()
      h1.title-seo=page.title || page.tag || page.category || config.title
```

修改`/themes/butterfly/source/js/main.js`
```diff
  const scrollTask = btf.throttle(() => {
      const currentTop = window.scrollY || document.documentElement.scrollTop
      const isDown = scrollDirection(currentTop)
      if (currentTop > 56) {
        if (flag === '') {
          $header.classList.add('nav-fixed')
-          // $header.classList.add('nav-visible')
          $rightside.classList.add('rightside-show')
        }

        if (isDown) {
          if (flag !== 'down') {
            $header.classList.remove('nav-visible')
            isChatBtn && window.chatBtn.hide()
            flag = 'down'
          }
        } else {
          if (flag !== 'up') {
            $header.classList.add('nav-visible')
            isChatBtn && window.chatBtn.show()
            flag = 'up'
          }
        }
      } else {
        flag = ''
        if (currentTop === 0) {
+          $header.classList.remove('nav-fixed')
+          $header.classList.add('nav-visible')
        }
        $rightside.classList.remove('rightside-show')
      }

      isShowPercent && rightsideScrollPercent(currentTop)
      checkDocumentHeight()
    }, 300)

    btf.addEventListenerPjax(window, 'scroll', scrollTask, { passive: true })
  }
```

# 样式修改
{% note primary flat %}
导航栏修改的大头，改动太多了，直接看代码吧
{% endnote %}
修改`/themes/butterfly/source/css/_layout/head.styl`
```
 #post-info

  &.not-top-img
    margin-bottom: 10px
    height: 60px
    background: 0

    .title-seo
      display: none

    #nav
      background: rgba(255, 255, 255, .4)
      box-shadow: 0 5px 6px -5px rgba(133, 133, 133, .6)

      a,
      span.site-page,
      .site-name
        color: var(--font-color)
        text-shadow: none

  &.nav-fixed
    #nav
      position: fixed
      top: -60px
      z-index: 91
      background: rgba(255, 255, 255, .8)
      box-shadow: 0 5px 6px -5px alpha($grey, .6)
      transition: transform .2s ease-in-out, opacity .2s ease-in-out
      will-change: transform

      #blog-info
        display: flex
        color: var(--font-color)
        // display: block
        &:hover
          color: $light-blue
      
      .nav-site-title
        display: flex
        justify-content: center
        align-items: center
        border-radius: 15px
        padding: 0 4px
        transition: all .3s 
        transform: translate(5px)
        i
          position: absolute
          opacity: 0
          transform: scale(1.35)
          transition: all .3s ease

        &:hover
          background: $light-blue
          box-shadow:0 0 2px $light-blue
          transform: translate(5px) scale(1.03)

        &:hover .site-name
          opacity: 0
          color: var(--font-color)

        &:hover i 
          opacity: 1
          transform: scale(1.01)
          color: white

        .site-name
          text-shadow: none
          font-size: .9em
          // transition: all .3s ease-in-out

        & > a:first-child
          display: none

        & > a:last-child
          display: inline

      a,
      span.site-page,
      #toggle-menu
        color: var(--font-color)
        text-shadow: none

        &:hover
          color: $light-blue

    &.fixed
      #nav
        top: 0
        transition: all .5s
  // &.nav-visible:not(.fixed)
  // &.nav-visible
  //   #nav
  //     transition: all .5s
  //     transform: translate3d(0, -100%, 0)

  //   & + .layout
  //     & > .aside-content > .sticky_layout
  //       top: 70px
  //       transition: top .5s

  &.fixed
    #nav
      position: fixed
      #blog-info
        display: flex
        color: var(--font-color)
        // display: block
        &:hover
          color: $light-blue
      .nav-site-title
        display: flex
        justify-content: center
        align-items: center
        border-radius: 15px
        padding: 0 4px
        transition: all .1s 
        i
          position: absolute
          opacity: 0
          transform: scale(1.35)
          transition: all .3s ease
        &:hover
          background: $light-blue
          box-shadow:0 0 2px $light-blue

        &:hover .site-name
          opacity: 0
          color: var(--font-color)

        &:hover i 
          opacity: 1
          transform: scale(1.01)
          color: white

        .site-name
          text-shadow: none
          font-size: .9em
          // transition: all .3s ease-in-out

      .mask-name-container
        max-width: 1200px
        width: 50%
        height: 100%
        position: absolute
        overflow: hidden
        left: 50%
        transform: translateX(-50%)
        display: flex
        justify-content: center
        align-items: center
      @media screen and (max-width: 992px) {
        .mask-name-container {
          width: 65%;
        }
      }
      @media screen and (max-width: 768px) {
        .mask-name-container {
          display: none;
        }
      }

      @media screen and (max-width: 900px) {
        .mask-name-container {
          display: none;
        }
      }
  
    &.nav-visible #name-container 
      transition: 0.3s;
      transform: translate(-50%, 60px);
    
    &.nav-visible #menus .menus_items 
      transform: translate(-50%)
      transition: 0.3s

    #page-name::before {
      font-size: 18px;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 15px;
      color: white !important;
      top: 0;
      left: 0;
      content: "回到顶部";
      background-color: $light-blue;
      transition: all 0.3s;
      -webkit-transition: all 0.3s;
      -moz-transition: all 0.3s;
      -ms-transition: all 0.3s;
      -o-transition: all 0.3s;
      opacity: 0;
      box-shadow: 0 0 2px $light-blue;
      line-height: 50px; /*如果垂直位置不居中可以微调此值，也可以删了*/
    }
    #page-name:hover:before {
      opacity: 1;
    }
    #name-container {
      transition: all 0.3s;
      -webkit-transition: all 0.3s;
      -moz-transition: all 0.3s;
      -ms-transition: all 0.3s;
      -o-transition: all 0.3s;
    }
    #name-container:hover {
      transform: translateX(-50%) scale(1.03);
    }
    #page-name {
      position: relative;
      padding: 10px 30px;
      -webkit-animation-timing-function: ease-out;
      // font-family: 'Arial';
      font-weight: bold;
      font-size: .9em;
    }

    center#name-container {
      position: absolute;
      width: 100%;
      left: 50%;
      transform: translateX(-50%);
      // font-family: "ZhuZiAYuanJWD";
    }
    #menus .menus_items {
      transform: translate(-50%, -60px);
      transition: 0.3s;
    }
    #name-container {
      transition: 0.3s;
    }
  //   & + .layout
  //     & > .aside-content > .sticky_layout
  //       top: 70px
  //       transition: top .5s

  //     #card-toc
  //       .toc-content
  //         max-height: calc(100vh - 170px)
```