function per(t, y) {
    setCookie("per", y);
    var ls = document.getElementsByName("set_per");
    for (var i = 0; i < ls.length; i++) {
        ls[i].style.color = "#000";
    }
    t.style.color = '#e70822';
}
function spd(t, s) {
    setCookie("spd", s);
    var ls = document.getElementsByName("set_spd");
    for (var i = 0; i < ls.length; i++) {
        ls[i].style.color = "#000";
    }
    t.style.color = '#e70822';
}
function bofang() {
    var arr = [];
    document.getElementById("audioBox").innerHTML = "";
    var str = document.getElementById("chaptercontent").innerHTML;

    function text_split(str) {
        str = str.replace(/<p\s+class=\"readinline\">[\s\S]+?<\/p>/g, "");
        str = str.replace(/<[^>]+>/g, "");
        str = str.replace(/&NBSP;/g, " ");
        str = str.replace(/&nbsp;/g, " ");
        str = str.replace(/[;\s]+/mg, "");
        str = str.replace(/@/g, "");
        str = str.replace(/%/g, "");
        str = str.replace(/\"/g, "");
        str = str.replace(/[\r\n]/g, "");
		str = str.replace(/<script>[\s\S]+?<\/script>/g, "");

        if (str.length < 1) return;
        tstr = 'http://tts.baidu.com/text2audio?tex=' + encodeURI(str);
        arr.unshift(tstr);
    }

    function geturl() {
        var url = arr.pop();
        var per = getCookie("per");
        var spd = getCookie("spd");
        if (per == null || per == undefined || per == "") {
            per = "1"
        }
        if (spd == null || spd == undefined || spd == "") {
            spd = "5"
        }
        return url + '&idx=1&cuid=baidu_speech_demo&cod=2&lan=zh&ctp=1&pdt=1&spd='
            + encodeURI(spd) + "&per=" + encodeURI(per) + '&vol=5&pit=5';
    }

    function s(str, separator) {
        var arr2 = str.split(separator);
        var i = 0;
        var mstr = "";
        while (i < arr2.length) {
            var s1 = arr2[i];

            if (mstr.length + s1.length < 300) {
                mstr += s1;
                if (i == arr2.length - 1) {
                    text_split(mstr);
                    mstr = "";
                }
            } else {
                text_split(mstr);
                mstr = "";
                if (s1.length > 300) {
                    s(s1, /[\s+|。|，]/);
                } else {
                    mstr = s1;
                }
            }

            i++;
        }
    }

    try {
        //document.getElementById("audioBoxffff").innerHTML = "";
        s(str, /\<br\>|\<br\/\>/);

        var myAudio = new Audio();
        myAudio.preload = true;
        myAudio.controls = true;
        myAudio.src = geturl();
        myAudio.addEventListener("ended", playEndedHandler, false);
        myAudio.play();
        document.getElementById("audioBox").appendChild(myAudio);
        myAudio.loop = false;
        function playEndedHandler() {
            myAudio.src = geturl();
            myAudio.play();
            console.log(arr.length);
            !arr.length && myAudio.removeEventListener("ended", playEndedHandler, false)
        }
    }
    catch (e)
    {
        alert(e.name + ":" + e.message);
    }
    
}