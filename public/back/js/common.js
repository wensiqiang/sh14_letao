/**
 * Created by HUCC on 2017/10/29.
 */

//希望在ajax调用之前start
//在ajax调用结束后执行done

//校验用户是否登录的功能
//路径中，并没有login.html
if(location.href.indexOf("login.html") < 0 ){
  $.ajax({
    type:"get",
    url:"/employee/checkRootLogin",
    success:function (data) {
      if(data.error === 400){
        //说明用户没有登录，跳转到登录页面
        location.href = "login.html";
      }
    }
  });
}




$(document).ajaxStart(function () {
  //让进度条显示出来
  NProgress.start();
})


$(document).ajaxStop(function () {
  setTimeout(function () {
    //让进度条结束
    NProgress.done();
  }, 500);
});


//点击分类管理，显示或者隐藏二级分类
$(".child").prev().on("click", function () {
  $(this).next().slideToggle();
})


//点击icon_menu,隐藏或者显示侧边栏
$(".icon_menu").on("click", function () {
  //让侧边栏慢慢的出去
  $(".lt_aside").toggleClass("now");
  //慢慢的变长
  $(".lt_main").toggleClass("now");

 $(".icon_menu").toggleClass("now");
});

//共用的退出功能
$(".icon_logout").on("click", function () {
  $("#logoutModal").modal("show");
});

$(".btn_logout").on("click", function () {

  //发送一个ajax请求，告诉服务器我要退出了，服务器会清空你的session
  $.ajax({
    type:"get",
    url:"/employee/employeeLogout",
    success:function (data) {
      if(data.success){
        window.location.href = "login.html";
      }
    }
  })

});



