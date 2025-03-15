// // 返回顶部 显示网页阅读进度
// window.onscroll = percent; // 执行函数
// // 页面百分比
// function percent() {
//   let a = document.documentElement.scrollTop || window.pageYOffset, // 卷去高度
//     b =
//       Math.max(
//         document.body.scrollHeight,
//         document.documentElement.scrollHeight,
//         document.body.offsetHeight,
//         document.documentElement.offsetHeight,
//         document.body.clientHeight,
//         document.documentElement.clientHeight
//       ) - document.documentElement.clientHeight, // 整个网页高度 减去 可视高度
//     result = Math.round((a / b) * 100), // 计算百分比
//     btn = document.querySelector("#percent"); // 获取图标

//   result <= 99 || (result = 99), (btn.innerHTML = result);
// }

// document.getElementById("page-name").innerText = document.title.split(" | chipmunk")[0] === "chipmunk" ? "chipmunk - 人间烟火气 最抚凡人心" : document.title.split(" | chipmunk")[0];

document.addEventListener('pjax:complete', function() {
    document.getElementById("page-name").innerText = document.title.split(" | chipmunk")[0] === "chipmunk" ? "chipmunk - 人间烟火气 最抚凡人心" : document.title.split(" | chipmunk")[0];
});

// 初始化页面时也需要执行一次
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("page-name").innerText = document.title.split(" | chipmunk")[0] === "chipmunk" ? "chipmunk - 人间烟火气 最抚凡人心" : document.title.split(" | chipmunk")[0];
});

