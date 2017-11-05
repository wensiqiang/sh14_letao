$(function () {
  //思路
  //1获取商品数据
  var currentPage = 1;
  var pageSize = 5;
  var imgArray=[];
  function render(){
    $.ajax({
      type:"get",
      url:"/product/queryProductDetailList",
      data:{
        page:currentPage,
        pageSize:pageSize,
      },
      success:function (data) {
        console.log(data);
        $("tbody").html(template("tpl",data));

        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: currentPage,
          totalPages: Math.ceil(data.total / pageSize),
          size: "small",
          onPageClicked(a, b, c, page) {
            currentPage = page;
            render();
          }
        })
      }
    })
  }
 render();

  //点击添加,显示模态框
  $(".btn_add").on("click",function () {
    $("#addModal").modal("show");

    //渲染二级分类列表
    $.ajax({
      type:"get",
      url:"/category/querySecondCategoryPaging",
      data:{
        page:1,
        pageSize:100
      },
      success:function (data) {
        $(".dropdown-menu").html(template("tpl2",data));
      }
    })
  })

   //给dropdown 下所有的a标签注册点击事件
   $(".dropdown-menu").on("click","a",function (data) {
     //1获取a标签的文本,设置给dropdown-text
     $(".dropdown-text").text($(this).text());
     //2获取到自定义属性data-id,设置给隐藏域
     $("#brandId").val($(this).data("id"));
     //3把brandId改成通过状态
     $form.data("bootstrapValidator").updateStatus("brandId","VALID");

   })


  //初始化产品图片上传
  $("#fileupload").fileupload({
    dataType:"json",
    done:function (e,data) {
      //上传成功,将图片添加到img_box中
      $(".img_box").append('<img src="'+data.result.picAddr+'" width="100" height="100">');
      //数组中存储了上传的所有图片
       imgArray.push(data.result);
    //判断数组的长度,如果长度是3了, 就可以修改productLogo的校验状态
      if(imgArray.length ===3){
        $form.data("bootstrapValidator").updateStatus("productLogo","VALID");
      }else {
        $form.data("bootstrapValidator").updateStatus("productLogo","INVALID");
      }

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
      brandId:{
        validators:{
          notEmpty:{
            message:"请输入二级分类"
          }
        }
      },
      proName:{
        validators:{
          notEmpty:{
            message:"请输入商品名称"
          }
        }
      },
      proDesc:{
        validators:{
          notEmpty:{
            message:"请输入商品描述"
          }
        }
      },
      num:{
        validators:{
          notEmpty:{
            message:"请输入商品库存"
          },
          regexp:{
            regexp:/^[1-9]\d*$/,
            message:"请输入0-9999的数字"
          },
        }
      },
      size:{
        validators:{
          notEmpty:{
            message:"请输入商品尺寸"
          },
          regexp:{
            regexp:/^\d{2}-\d{2}$/,
            message:"请输入尺码正确的尺码(30-50)"
          },
        }
      },
      proName:{
        validators:{
          notEmpty:{
            message:"请输入商品名称"
          }
        }
      },
      oldPrice:{
        validators:{
          notEmpty:{
            message:"请输入商品的原价"
          }
        }
      },
      price:{
        validators:{
          notEmpty:{
            message:"请输入商品的折扣价"
          }
        }
      },
      productLogo:{
        validators:{
          notEmpty:{
            message:"请上传3张图片"
          }
        }
      },
    }
  })

  $form.on("success.form.bv",function (e) {
     e.preventDefault();

     var param = $form.serialize();
  //还需要拼接3张图片的地址
    param +="&picName1"+imgArray[0].picName+"&picAddr1="+imgArray[0].picAddr;
    param +="&picName2"+imgArray[1].picName+"&picAddr2="+imgArray[1].picAddr;
    param +="&picName3"+imgArray[2].picName+"&picAddr3="+imgArray[2].picAddr;
    // console.log(param);
    //发送ajax请求
    $.ajax({
      type:"post",
      url:"/product/addProduct",
      data:param,
      success:function (data) {
        if(data.success){
          //关闭模态框
          $("#addModal").modal("hide");

          //渲染第一页
          currentPage = 1;
          render();

          //重置表单与样式
        $form[0].reset();
        $form.data("bootstrapValidator").resetForm();

        $(".dropdown-text").text("请选择二级分类");
        $(".img_box img").remove();
        imgArray = [];
        }
      }
    })




  })



})






































