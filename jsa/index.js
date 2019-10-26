function postErrorChapter(chapterId, bookId) {
	/*if ($("#chaptercontent").html().indexOf("手打中") > 0 || $("#chaptercontent").html().indexOf("@@") > 0) {
		alert("本章节正在处理中，不需要举报！");
		return;
	};*/
        
    $.ajax({
        type: "get", url: Hiturl,
	data:{action: "error",chapterid: chapterId,bookid: bookId}, 
	success:function(data){
		var msg = "报送错误章节失败！";
		if (data == -1) {
			msg = "报送错误章节过于频繁，请休息30秒后再执行此操作！";
		} else if (data == 1) {
			msg = "报送错误章节成功，我们会在2分钟以前尽快处理！";
		}
		alert(msg);
	},
	error:function (XMLHttpRequest, textStatus, errorThrown) {
		//alert("error"+textStatus+errorThrown);
	}});
}

function clearCookies(id)
{
	var bookList= new Array(); 
	var strBookList=getCookie("booklist");
	if(strBookList!=null&&strBookList!=undefined&&strBookList.length>0){
		var arrBookList=strBookList.split(",");
		for(var i=0 ;i<arrBookList.length;i++){
			var bookItem=JSON.parse(unescape(arrBookList[i]));
			if(bookItem.BookId!=id){
				bookList[bookItem.BookId]=bookItem;
			}
		}
	}
	saveBookcase(bookList);
}

function setCookie(c_name,value)
{
    var exdate=new Date()
    exdate.setDate(exdate.getDate()+365)
    document.cookie=c_name+ "=" +escape(value)+";expires="+exdate.toGMTString()+";path=/";
}

function getCookie(c_name)
{
    if (document.cookie.length>0){
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1){ 
            c_start=c_start + c_name.length+1;
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        } 
    }
    return "";
}

function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    document.cookie= name + "=;expires="+exp.toGMTString();
}

function delBook(bookId){
   if(confirm("确认从书架中删除此书吗？"))
    {
        clearCookies(bookId);
        $("a[bookid='"+bookId+"']").parent().parent().remove();
    }
}

function delAllBook(bookId){
    delCookie("bookinfo");
    delCookie("bookid");
    delCookie("booklist");
    var chapterList= $("a[bookid]");
    if(chapterList==undefined||chapterList==null||chapterList.length==0) return;
    
    chapterList.each(function(){
        $(this).parent().parent().remove();
    });
}

function delBookFromBookcase(bookId){
if(confirm("确认从书架中删除此书吗？")){
    $.ajax({
		async:false,
		type:'POST',
		url:'/DoBookcase.html',
		data:"action=delete&bookid="+bookId,
		dataType:'json',
		success:function(rs) {
		    if(rs!=null&&typeof(rs.success) != 'undefined' && rs.success == 1) {
			     alert("已经成功将小说从书架删除！");
			     $("a[bookcaseid='"+bookId+"']").parent().parent().remove();
			     
			} else {
				alert("将小说从书架删除失败！");
			}
		}
	});
}
}

function addBookMarkByJs(chapterid,bookid,chaptername){
	var currentBook={BookId:bookid,
		ChapterId:chapterid,
		ChapterName:chaptername
	};
    var bookList=getBookcase();
	if(bookList!=null&&bookList!=undefined){
		var bookcount=getBookcaseCount(bookList);
		bookList[bookid]=currentBook;
		saveBookcase(bookList);
		if(bookcount>10){
			removeBookFromTop(bookcount-10);
		}
	}
}

function isLogin(){
    if(getCookie("m_uid").length>0){
        return true;
    }
    return false;
}

function addBookMarkByManual(chapterid,bookid,chaptername){
    if(isLogin()){
	    $.ajax({
		    async:false,
		    type:'POST',
		    url:'/DoBookcase.html',
		    data:"action=addbookmark&bookid="+bookid+"&chapterid="+chapterid+"&chaptername="+chaptername,
		    dataType:'json',
		    success:function(rs) {
		        if(rs!=null&&typeof(rs.success) != 'undefined') {
			        alert(rs.msg);
			    } else {
				    alert("将小说添加到书架失败！");
			    }
		    }
	    });
	}
	else{
	    alert("登录成功后才可以使用书架功能！");
	    location.href="/Login.html";
	}
}

function addHistoryBookByManual2(chapterid,bookid,chaptername){
	var currentBook={BookId:bookid,
		ChapterId:chapterid,
		ChapterName:chaptername
	};
        var bookList=getBookcase();
	if(bookList!=null&&bookList!=undefined){
		var bookcount=getBookcaseCount(bookList);
		bookList[bookid]=currentBook;
		saveBookcase(bookList);
		if(bookcount>10){
			removeBookFromTop(bookcount-10);
		}
	}
}

function convertBookData(){
	var bookInfoStr=getCookie("bookinfo");
	if(bookInfoStr!=null&&bookInfoStr!=undefined){
	    	var cookiesBookInfo=bookInfoStr.split("§§");
		if(cookiesBookInfo.length>0){
    			for (var i=0;i<cookiesBookInfo.length;i++){
        			var bookInfoItem=cookiesBookInfo[i].split("||");
       				if(bookInfoItem.length==3){
					addHistoryBookByManual2(bookInfoItem[1],bookInfoItem[0],bookInfoItem[2]);
				}
    			}
		}
		delCookie("bookinfo");
	}
}

function getBookcase(){
        var bookList= new Array(); 
	var strBookList=getCookie("booklist");
	if(strBookList!=null&&strBookList!=undefined&&strBookList.length>0){
		var arrBookList=strBookList.split(",");
		for(var i=0;i<arrBookList.length;i++){
			var bookItem=JSON.parse(unescape(arrBookList[i]));
			bookList[bookItem.BookId]=bookItem;
		}
	}
	return bookList;
}

function removeBookFromTop(num){
    var bookList= new Array(); 
	var strBookList=getCookie("booklist");
	if(strBookList!=null&&strBookList!=undefined&&strBookList.length>0){
		var arrBookList=strBookList.split(",");
		for(var i=num;i<arrBookList.length;i++){
			var bookItem=JSON.parse(unescape(arrBookList[i]));
			bookList[bookItem.BookId]=bookItem;
		}
	}
	saveBookcase(bookList);
}

function getBookcaseCount(bookList){
	var count=0;
	if(bookList!=null&&bookList!=undefined&&bookList.length>0){
		for(var bookIndex in bookList){
			count++;
		}
	}
	return count;
}

function saveBookcase(bookList){
	if(bookList!=null&&bookList!=undefined&&bookList.length>0){
		var strCookieBookId="";
		var strCookieBookList="";
		for(var bookIndex in bookList){
			strCookieBookId =strCookieBookId+","+bookIndex;
			strCookieBookList=strCookieBookList+","+escape(JSON.stringify(bookList[bookIndex]));
		}
		if(strCookieBookId.length>0){
			strCookieBookId=strCookieBookId.substring(1);
		}
		if(strCookieBookList.length>0){
			strCookieBookList=strCookieBookList.substring(1);
		}
		setCookie("bookid",strCookieBookId);
		setCookie("booklist",strCookieBookList);
	}
}

function beforeBookCase(t) {
    if (isLogin()) {
        return true;
    }
    else {
        alert("登录成功后才可以使用书架功能！");
        t.setAttribute("href", "/Login.html");
        return true;        
    }
}

if($(".cont")!=null&& $(".cont").html()!=null){
    $(".cont").html($(".cont").html().replace(/&amp;nbsp;/g,"<br />").replace(/\<br \/\>\s*(&nbsp;)+\<br \/\>/g,"<br />"));
}