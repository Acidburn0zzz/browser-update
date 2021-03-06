//(c)2017, MIT Style License <browser-update.org/LICENSE.txt>
//it is recommended to directly link to this file because we update the detection code
"use strict";

function $bu_getBrowser(ua_str) {
    var n,ua=ua_str||navigator.userAgent,donotnotify=false;
    var names={i:'Internet Explorer',e:"Edge",f:'Firefox',o:'Opera',s:'Safari',n:'Netscape',c:"Chrome",a:"Android Browser", y:"Yandex Browser",v:"Vivaldi",uc:"UC Browser",x:"Other"};
    function ignore(reason,pattern){if (new RegExp(pattern,"i").test(ua)) return reason;}
    var ig=ignore("bot","bot|spider|archiver|transcoder|crawl|checker|monitoring|screenshot|python-|php|uptime|validator|fetcher|facebook|slurp|google|yahoo|microsoft|node|mail.ru|github|cloudflare|addthis|thumb|proxy|feed|fetch|favicon|link|http|scrape|seo|page|search console|AOLBuild|Teoma|Gecko Expeditor")||
        ignore("discontinued browser","camino|flot|k-meleon|fennec|galeon|chromeframe|coolnovo") ||
        ignore("complicated device browser","SMART-TV|SmartTV") ||
        ignore("niche browser","Dorado|Whale|SamsungBrowser|MIDP|wii|Chromium|Puffin|Opera Mini|maxthon|maxton|dolfin|dolphin|seamonkey|opera mini|netfront|moblin|maemo|arora|kazehakase|epiphany|konqueror|rekonq|symbian|webos|PaleMoon|QupZilla|Otter|Midori|qutebrowser") ||
        ignore("mobile without upgrade path or landing page","kindle|silk|blackberry|bb10|RIM|PlayBook|meego|nokia|ucweb|ZuneWP7|537.85.10") ||
        ignore("android(chrome) web view","; wv");
    var mobile=(/iphone|ipod|ipad|android|mobile|phone|ios|iemobile/i.test(ua));
    if (ig) 
        return {n:"x",v:0,t:"other browser",donotnotify:ig};    

    var pats=[
        ["CriOS.VV","c"],
        ["FxiOS.VV","f"],
        ["Trident.*rv:VV","i"],
        ["Trident.VV","io"],
        ["UCBrowser.VV","uc"],
        ["MSIE.VV","i"],
        ["Edge.VV","e"],
        ["Vivaldi.VV","v"],
        ["OPR.VV","o"],
        ["YaBrowser.VV","y"],
        ["Chrome.VV","c"],
        ["Firefox.VV","f"],
        ["Version.VV.*Safari","s"],
        ["Safari.VV","so"],
        ["Opera.*Version.VV","o"],
        ["Opera.VV","o"]
    ];
    for (var i=0; i < pats.length; i++) {
        if (ua.match(new RegExp(pats[i][0].replace("VV","(\\d+\\.?\\d+)"),"i"))) {
            n=pats[i][1];
            break;
        }        
    }
    var semver=n==="v"||n==="y"||n==="uc";
    if (semver) {//zero pad semver for easy comparing
        var parts = (RegExp.$1).split('.');
        var v=(parts[0] + "." + ("00".substring(0, 2 - parts[1].length) + parts[1]));
    }
    else {
        var v=Math.round(parseFloat(RegExp.$1)*10)/10;
    }
    
    if (!n)
        return {n:"x",v:0,t:names[n],mobile:mobile};
    
    //do not notify old systems since there is no up-to-date browser available
    if (/windows.nt.5.0|windows.nt.4.0|windows.95|windows.98|os x 10.2|os x 10.3|os x 10.4|os x 10.5|os x 10.6|os x 10.7/i.test(ua)) 
        donotnotify="oldOS";
    
    //iOS
    if (/iphone|ipod|ipad|ios/i.test(ua)) {
        ua.replace("_",".").match(new RegExp("OS.(\\d+\\.?\\d?)","i"));//
        n="iOS";
        v=parseFloat(RegExp.$1); 
        var h = Math.max(window.screen.height, window.screen.width);
        if (h<=480 || window.devicePixelRatio<2) //iphone <5 and old iPads  // (h>568 -->iphone 6+)
              return {n:"s",v:v,t:"iOS "+v,donotnotify:"iOS without upgrade path",mobile:mobile};
        return {n:"s",v:v,t:"iOS "+v,donotnotify:false,mobile:mobile};//identify as safari
    }
    //check for android stock browser
    if (ua.indexOf('Android')>-1 && n==="s") {
        var ver=parseInt((/WebKit\/([0-9]+)/i.exec(ua) || 0)[1],10) || 2000;
        if (ver <= 534)
            return {n:"a",v:ver,t:names["a"],mob:true,donotnotify:donotnotify,mobile:mobile};
        //else
        //    return {n:n,v:v,t:names[n]+" "+v,donotnotify:"mobile on android",mobile:mobile};
    }

    //do not notify firefox ESR
    if (n==="f" && Math.round(v)===52)
        donotnotify="ESR";

    if (n==="so") {
        v=4.0;
        n="s";
    }
    if (n==="i" && v===7 && window.XDomainRequest) {
        v=8;
    }
    if (n==="io") {
        n="i";
        if (v>6) v=11;
        else if (v>5) v=10;
        else if (v>4) v=9;
        else if (v>3.1) v=8;
        else if (v>3) v=7;
        else v=9;
    }
    if (n==="e") {
        return {n:"i",v:v,t:names[n]+" "+v,donotnotify:donotnotify,mobile:mobile};
    }
    return {n:n,v:v,t:names[n]+" "+v,donotnotify:donotnotify,mobile:mobile};
}

var $buo = function(op,test) {
var jsv=24;
var n = window.navigator,b,vsmin;
op = window._buorgres=op||{};
var ll = op.l||(n.languages ? n.languages[0] : null) || n.language || n.browserLanguage || n.userLanguage||document.documentElement.getAttribute("lang")||"en";
op.ll=ll=ll.replace("_","-").toLowerCase().substr(0,2);
op.apiver=op.api||op.c||-1;
var vsakt = {i:15,f:55,o:47,s:11,c:61,y:17.09,v:1.11,uc:11.4};
var vsdefault = {i:-5,f:-4,o:-4,s:-1.7,c:-4,a:534,y:-0.02,v:-0.02,uc:-0.03};
if (op.apiver<4)
    vsmin={i:9,f:10,o:20,s:7};
else
    vsmin={i:8,f:5,o:12.5,s:6.2};
var vs =op.notify||op.vs||vsdefault;
var releases_per_month={'f':7/12,'c':8/12,'o':8/12,'i':1/12,'s':1/12,'v':1/12}
for (b in vsdefault) {
    if (!vs[b])
        vs[b]=vsdefault[b]
    if (vsakt[b]) {
        if (/m/.test(vs[b]))
            vs[b]=vsakt[b]+vs[b].replace('m','')*releases_per_month[b]
        if (vs[b]>=vsakt[b])
            vs[b]=vsakt[b]-0.2
        else if (vs[b]<0)
            vs[b]=vsakt[b]+vs[b]
    }
    if (vsmin[b] && vs[b]<vsmin[b])
        vs[b]=vsmin[b];    
}
op.vsf=vs;
if (op.reminder<0.1 || op.reminder===0)
    op.reminder=0;
else
    op.reminder=op.reminder||24;
op.reminderClosed=op.reminderClosed||(24*7);
op.onshow = op.onshow||function(o){};
op.onclick = op.onclick||function(o){};
op.onclose = op.onclose||function(o){};
op.pageurl = op.pageurl || location.hostname || "x";
op.newwindow=(op.newwindow!==false);

op.test=test||op.test||(location.hash==="#test-bu")||(location.hash==="#test-bu-beta")||false;

var bb=$bu_getBrowser();
if (!op.test) {
    if (!bb || !bb.n || bb.n==="x" || bb.donotnotify!==false || (document.cookie.indexOf("browserupdateorg=pause")>-1 && op.reminder>0))
        return;
    if (bb.v>vs[bb.n] || (bb.mobile&&op.mobile===false) )    
        return;
}

op.setCookie=function(hours) {
    document.cookie = 'browserupdateorg=pause; expires='+(new Date(new Date().getTime()+3600000*hours)).toGMTString()+'; path=/';
};
if (op.reminder>0)
    op.setCookie(op.reminder);

if (op.nomessage) {
    op.onshow(op);
    return;
}

var e=document.createElement("script");
e.src = op.jsshowurl||(/file:/.test(location.href) && "http://browser-update.org/update.show.min.js") || "//browser-update.org/update.show.min.js";
document.body.appendChild(e);

};

$buo(window.$buoop);
