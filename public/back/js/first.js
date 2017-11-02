$(function () {
  var currentPage = 1;
  var pageSize = 5;
  //渲染一级分页功能
  function render() {
    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize,
      },
      success:function(data){
        // console.log(data);
        $("tbody").html(template("tpl",data));

        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:currentPage,
          totalPages:Math.ceil(data.total/pageSize),
          size:"small",
          onPageClicked(a,b,c,page){
            currentPage = page;
            render();
          }
        })
      }
    })
  }
  render();

//显示添加模态框
$(".btn_add").on("click",function(){
  $("#addModal").modal("show");
  });

//给表单做校验
  var $form= $("#form");
  $form.bootstrapValidator({
    //校验时使用的图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphi con glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {

      //name属性
      categoryName: {
        validators: {
          notEmpty: {
            message: "一级分类名称不能为空"
          }
        }
      }
    }
  });
   $form.on("success.form.bv",function (e) {
     e.preventDefault();
     //要发送ajax请求
     $.ajax({
       type:"post",
       data:$form.serialize(),
       url:"/category/addTopCategory",
       success:function (data) {
         console.log(categoryName);
         if(data.success){
           //成功了,需要干什么
           //1.关闭模态框
           $("#addModal").modal("hide");
           //2.重新渲染第一页
           currentPage = 1;
           render();
           //3.重置表单
           $form.data("bootstrapValidator").resetForm();
           //表单有一个reset方法，会把表单中所有的值都清空,js对象的方法
           $form[0].reset();
         }
       }
     })

   })
})