//首页的iscroll
FastClick.attach(document.body);

new IScroll(".home");
var Dates = null;
var arr = ['yunqian','yunzhong','chanqian','chanhou','chengzhang','fangzhi'];
var brr = ['孕前准备','孕中知识','产前知识','分娩产后','分娩产后','幼儿成长指标'];

var ls = localStorage;
if(!ls.getItem('favNames')){
	ls.setItem('favNames','[]');
}


var favBrr = JSON.parse(ls.getItem("favNames"));
$.each(favBrr,function(index,value){

	$("#favorite").append("<div>"+index+"-"+value+"</div>")

})


function bindEvent(){

	$.ajax({
		url:"data/data.json",
		type:"get",
		dataType:"json",
		success:function(data){
			Dates=data;
		}
	})

	$(".container").on("click",'a',function(e){
		e.preventDefault();

		var that = $(this).attr("href");
		var id = $(this).attr("id");

		$(that).css({
			"transition":"all .5s",
			"transform":"translate3d(0,0,0)"
		}).siblings().css({
			"transform":"translate3d(100%,0,0)"
		})

		if(e.target.parentNode.nodeName=="NAV" || e.target.parentNode.parentNode.nodeName=="NAV"){

			var index = $(this).index();

			$("mark").animate({

				left:index*25+"%"

			})

		}

		into($(this));

		if(that=='#list'){
			//确定进入列表页
			getId(id);
		}else if(that=='#article'){
			//确定进入到详情页
			getRender($(this))
		}

	})

	$(".header-right").click(function(){
		
		var strTitle = $(this).attr("title");
		var favArr = JSON.parse(ls.getItem("favNames"))
		
		if($.inArray(strTitle,favArr) > -1){
			alert("已经收藏过了")
		}else{
			addFav(strTitle);
		}

	})


}
bindEvent();


function addFav(strTitle){
	//添加本地存储数据(value)
	var favArr = JSON.parse(ls.getItem("favNames"));
	favArr.push(strTitle);
	ls.setItem('favNames',JSON.stringify(favArr))

}

function getRender(el){
	//详情页的数据渲染

	var strContent = '';
	var strTitle = '';

	var crr = el.data("content").split("_");

	strContent=Dates[crr[0]]['fenlei'][crr[1]].content;
	strTitle=Dates[crr[0]]['fenlei'][crr[1]].title;

	$(".article-content").html(strContent);
	$(".header-title").html(strTitle);

	new IScroll(".article");


}

function getId(id){

	if($.inArray(id,arr) > -1){
		getLoad(id);
	}	

}

function getLoad(id){

	var fenlei = Dates[id]['fenlei']
	var str = "";

	$.each(fenlei,function(index,val){
		str+='<a href="#article" data-content="'+id+'_'+index+'"><img src="img/tu/'+val.img+'" alt=""><p>'+val.title+'</p></a>';
	})

	$("#listIscroll").html(str);
	new IScroll(".list");
}



function into(that){
//进入页面	

	var href = that.attr('href');
	var title = that.attr("title");


	var fav = $(".header-right");
	//收藏
	var returns = $("#return");

	if(href=='#list'){
		//进入了列表页
		$(".header-title").html(title);
		returns.show();	
		returns.attr("href",'#home');
		fav.hide();

	}else if(href=='#home'){
		//进入首页
		$(".header-title").html("孕育宝典");
		returns.hide();

	}else if(href=='#article'){

		fav.show();
		returns.attr("href",'#list');

		var splits = that.data("content").split("_")[0];
		var idx = $.inArray(splits,arr);
		returns.attr("title",brr[idx]);

		$(".header-right").attr('title',that.find("p").text())
	}


}