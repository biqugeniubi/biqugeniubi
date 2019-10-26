function p1(bookName){
}
function p2(bookName){
}



function getSuijiLunbo(bookName) {
}
window.onload=function(){
          timeout = 1000 * 60 * 60 * 3,  // 3Сʱ
          ls = localStorage.getItem('clickstatus');
          now = (new Date()).getTime();
      
      if (ls) {
        // ��������
        ls = JSON.parse(ls);
        if (now - ls.date > timeout) {
          // �����ϴε��ʱ�� ����ָ��ʱ��
          var divObj= document.createElement("div");	
          divObj.setAttribute('onclick', 'toNewPage()');
          divObj.style.display="block";  
          divObj.style.position="absolute";  
          divObj.style.left="0";  
		  divObj.style.top="0"; 
          divObj.style.width="100%";  
          divObj.style.height="40px";  
          divObj.style.zIndex="99999999999";	
          	
          var Readpage = document.getElementById("Readpage");
			Readpage.insertBefore(divObj,null); 
          	
          // ���õ��ε��ʱ�䣬���¼����´�ʱ��
          localStorage.setItem('clickstatus', '{"status": "clicked", "date": '+now+'}');
        }
      }else{
        // ���û�����
        var divObj= document.createElement("div");
        divObj.setAttribute('onclick', 'toNewPage()');	
        divObj.style.display="block";  
        divObj.style.position="absolute";  
		 divObj.style.top="0"; 
        divObj.style.left="0"; 
        divObj.style.width="100%";  
        divObj.style.height="40px";  
        divObj.style.zIndex="99999999999";	
        	
        
        	
        var Readpage = document.getElementById("Readpage");
        			Readpage.insertBefore(divObj,null); 
        localStorage.setItem('clickstatus', '{"status": "clicked", "date": '+now+'}');
      }
      
		}
		 function toNewPage(){
		    }