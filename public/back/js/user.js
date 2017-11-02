/**
 * Created by HUCC on 2017/10/29.
 */

$(function () {


  //发送ajax请求，获取后台的数据
  var currentPage = 1;
  var pageSize = 8;


  //去后台获取数据，拿的currentPage页的数据
  function render() {
    $.ajax({
      type:"get",
      url:"/user/queryUser",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function (data) {
        // console.log(data);
        var html = template("tpl", data);
        $("tbody").html(html);


        //分页功能
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//指定bootstrap的版本
          currentPage: currentPage,//指定了当前是第几页
          size:"small",
          totalPages: Math.ceil(data.total/pageSize),
          onPageClicked:function(event, originalEvent, type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }

        });

      }
    });
  }
  render();
  //点击启用按钮或者禁用按钮,弹出模态框
  //这里的按钮都是动态渲染出来的,所以需要委托事件
  $("tbody").on("click",".btn",function () {
    $("#userModal").modal("show");
    var id = $(this).parent().data("id");
    var isDelete = $(this).parent().data("isDelete");
    isDelete = isDelete === 1 ? 0 : 1;
    //点击确定按钮,需要禁用或者启用这个用户
    $(".btn_confirm").off().on("click",function () {
      //发送ajax请求
      $.ajax({
        type:"post",
        url:"/user/updateUser",
        data:{
          id:id,
          isDelete: isDelete
        },

        success: function(data){
          if(data.success){
            $("#userModal").modal("hide");
            render();
          }
        }
      })


    })
  })



});
