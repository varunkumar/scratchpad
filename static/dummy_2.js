// Label Cloud User Variables
var cloudMin = 2;
var maxFontSize = 25;
var maxColor = [0,0,255];
var minFontSize = 12;
var minColor = [0,0,0];
var lcShowCount = false;
// End of Label Cloud User Variables

// Header Panel  
function show(item) {
	var divTwitter = document.getElementById('divTwitter');
	var divAbout = document.getElementById('divAbout');
	var divContact = document.getElementById('divContact');
	var aTwitter = document.getElementById('aTwitter');
	var aAbout = document.getElementById('aAbout');
	var aContact = document.getElementById('aContact');
		
    if (item == null || item == "home") {
        aTwitter.setAttribute("class", "selected");
        aAbout.setAttribute("class", "");
        aContact.setAttribute("class", "");
        
        divTwitter.style.display = "block";
        divAbout.style.display = "none";
        divContact.style.display = "none";
    } else if (item == "about") {
        aTwitter.setAttribute("class", "");
        aAbout.setAttribute("class", "selected");
        aContact.setAttribute("class", "");
        
        divTwitter.style.display = "none";
        divAbout.style.display = "block";
        divContact.style.display = "none";
    } else if (item == "contact") {
        aTwitter.setAttribute("class", "");
        aAbout.setAttribute("class", "");
        aContact.setAttribute("class", "selected");
        
        divTwitter.style.display = "none";
        divAbout.style.display = "none";
        divContact.style.display = "block";
    }
}
// End of Header Panel


// Twitter panel
function twitterCallback2(twitters) {
  var statusHTML = [];
  for (var i=0; i<twitters.length; i++){
    var username = twitters[i].user.screen_name;
    var status = twitters[i].text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
      return '<a href="'+url+'">'+url+'</a>';
    }).replace(/\B@([_a-z0-9]+)/ig, function(reply) {
      return  reply.charAt(0)+'<a href="http://twitter.com/'+reply.substring(1)+'">'+reply.substring(1)+'</a>';
    });
    statusHTML.push('<li><span>'+status+'</span> <a style="font-size:85%" href="http://twitter.com/'+username+'/statuses/'+twitters[i].id+'">'+relative_time(twitters[i].created_at)+'</a></li>');
  }
  document.getElementById('twitter_update_list').innerHTML = statusHTML.join('');
}

function relative_time(time_value) {
  var values = time_value.split(" ");
  time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
  var parsed_date = Date.parse(time_value);
  var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
  var delta = parseInt((relative_to.getTime() - parsed_date) / 1000, 10);
  delta = delta + (relative_to.getTimezoneOffset() * 60);

  if (delta < 60) {
    return 'less than a minute ago';
  } else if(delta < 120) {
    return 'about a minute ago';
  } else if(delta < (60*60)) {
    return (parseInt(delta / 60, 0)).toString() + ' minutes ago';
  } else if(delta < (120*60)) {
    return 'about an hour ago';
  } else if(delta < (24*60*60)) {
    return 'about ' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
  } else if(delta < (48*60*60)) {
    return '1 day ago';
  } else {
    return (parseInt(delta / 86400, 10)).toString() + ' days ago';
  }
}
// End of Twitter panel

// Wishes
/*function changeImage() { var randomnumber=Math.floor(Math.random()*19) + 1; var imgId=11; if (randomnumber< 10) imgId = "0" + randomnumber; else imgId = randomnumber; document.getElementById('imgWishes').src="http://varun-store.appspot.com/images/xmas-" + imgId + ".png";setTimeout("changeImage()",1000 * 20);} changeImage();*/
// End of Wishes

// Label Cloud
function s(a,b,i,x){
      if(a>b){
          var m=(a-b)/Math.log(x),v=a-Math.floor(Math.log(i)*m)
             }
      else{
          var m=(b-a)/Math.log(x),v=Math.floor(Math.log(i)*m+a)
          }
      return v
   }


var c=[];
var labelCount = new Array();  
var ts = new Object;

for (var t in ts){
     if (!labelCount[ts[t]]){
           labelCount[ts[t]] = new Array(ts[t])
           }
        }
var ta=cloudMin-1;
tz = labelCount.length - cloudMin;
lc2 = document.getElementById('labelCloud');
ul = document.createElement('ul');
ul.className = 'label-cloud';
for(var t in ts){
    if(ts[t] < cloudMin){
       continue;
       }
    for (var i=0;3 > i;i++) {
             c[i]=s(minColor[i],maxColor[i],ts[t]-ta,tz)
              }      
         var fs = s(minFontSize,maxFontSize,ts[t]-ta,tz);
         li = document.createElement('li');
         li.style.fontSize = fs+'px';
         li.style.lineHeight = '1';
         a = document.createElement('a');
         if (ts[t] > 1) 
            a.title = ts[t]+' posts on '+t;
        else
            a.title = ts[t]+' post on '+t;
         //a.style.color = 'rgb('+c[0]+','+c[1]+','+c[2]+')';
         a.href = '/search/label/'+encodeURIComponent(t);
         if (lcShowCount){
             span = document.createElement('span');
             span.innerHTML = '('+ts[t]+') ';
             span.className = 'label-count';
             a.appendChild(document.createTextNode(t));
             li.appendChild(a);
             li.appendChild(span);
             }
          else {
             a.appendChild(document.createTextNode(t));
             li.appendChild(a);
             }
         ul.appendChild(li);
         abnk = document.createTextNode(' ');
         ul.appendChild(abnk);
    }
  lc2.appendChild(ul);
// End of Label Cloud