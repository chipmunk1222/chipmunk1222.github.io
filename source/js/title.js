// 保存原始标题
var originalTitle = document.title;
var titleTimer;

document.addEventListener('visibilitychange', function () {
  if (document.hidden) {
    // 用户离开页面时显示的标题
    document.title = 'Σ(っ °Д °;)っ 喂！别溜走啊～';
    clearTimeout(titleTimer);
  } else {
    // 用户回到页面时显示的标题
    document.title = '*/(≧▽≦)/* 欢迎肥来！';
    // 两秒后恢复原始标题
    titleTimer = setTimeout(function () {
      document.title = originalTitle;
    }, 2000);
  }
});
