$(function () {
  var currenPage = 1;
  var pageSize = 5;
  function render() {
    $.ajax({
     type:"get",
     url:"/category/querySecondCategoryPaging",
      data:{
       page:currenPage,
       pageSize: pageSize,
      },
      success:function (data) {
        $("tbody").html(template("tpl",data));
        $("#paginator").bootstrapPaginator({
          bootstrapValidator:3,
          currentPage:currenPage,
          totalPage:currenPage,
          totalPage:Math.ceil(data.total/pageSize),
          size:"small",
          onPageClicked(a,b,c,paga){
           currenPage = paga;
           render();
          }
        })
      }
    })
  }
render();

//显示模态框
  $(".btn_add").on("click",function () {
    // console.log("hhe");
    $("#addModal").modal("show");


 //发送AJAX请求,获取一级分类的数据,渲染下拉框
$.ajax({
  type:"get",
  url:"/category/queryTopCategoryPaging",
  data:{
    page:1,
    pageSize:100,
  },
success:function (data) {
  console.log(data);
  $(".dropdown-menu").html( template("tpl2",data));
}
})
  })
  //点击下拉框,让某个选中
  $(".dropdown-menu").on("click","a",function (){
    // console.log("呵呵");
    $(".dropdown-text").text($(this).text());

    //修改隐藏域的value值
    $("#categoryId").val($(this).data("id"));

     //让categoryID的校验通过
    $form.data("bootstrapValidator").updateStatus("categoryId","VALID");
  })


  //初始化文件上传
  $("#fileupload").fileupload({
    dataType:"json",
    //当图片上传成功时,会执行这个回调函数
    done:function (e,data) {
      //获取文件上传结果
      /*console.log(data.result.picAddr);*/
      //给默认图片设置src
      $(".img_box img").attr("src",data.result.picAddr);
      $("#brandLogo").val(data.result.picAddr);

      $form.data("bootstrapValidator").updateStatus("brandLogo","VALID");
    }
  })

  //表单校验

  var $form = $("#form");
  $form.bootstrapValidator({
    excluded:[],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      categoryId:{
        validators:{
          notEmpty:{
            message:"请选择一级分类"
          }
        }
      },
      brandName:{
        validators:{
          notEmpty:{
            message:"请输入二级分类的名称"
          }
        }
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:"请上传图片"
          }
        }
      }
    }



  })

  $form.on("success.form.bv",function (e) {
    e.preventDefault();
    // console.log("呵呵");
  //发送ajax请求,把二级分类存起来
    $.ajax({
      type:"post",
      url:"/category/addSecondCategory",
      data:$form.serialize(),
      success:function (data) {
        if(data.success){
          //成功的操作
          //1关闭模态框
          $("#addModal").modal("hide");
          //2渲染表单
          currenPage =1;
          render();
          //3重置表单

          $form[0].reset();
          $form.data("bootstrapValidator").resetForm();

          //手动吧dropdown重置,把图片的地址重置
          $(".dropdown-text").text("请选择一级分类");
          $(".img_box img").attr("src", "images/none.png");
        }
      }
    })

  })

});