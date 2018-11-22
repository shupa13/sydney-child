

 var	clsStopwatch = function() {
 		// Private vars
 		var	startAt	= 0;	// Time of last start / resume. (0 if not running)
 		var	lapTime	= 0;	// Time on the clock when last stopped in milliseconds

 		var	now	= function() {
 				return (new Date()).getTime();
 			};

 		// Public methods
 		// Start or resume
 		this.start = function() {
 				startAt	= startAt ? startAt : now();
 			};

 		// Stop or pause
 		this.stop = function() {
 				// If running, update elapsed time otherwise keep it
 				lapTime	= startAt ? lapTime + now() - startAt : lapTime;
 				startAt	= 0; // Paused
 			};

 		// Reset
 		this.reset = function() {
 				lapTime = startAt = 0;
 			};

 		// Duration
 		this.time = function() {
 				return lapTime + (startAt ? now() - startAt : 0);
 			};
 	};
 var x = new clsStopwatch();
 var $time;
 var clocktimer;
 function pad(num, size) {
 	var s = "0000" + num;
 	return s.substr(s.length - size);
 }
 function formatTime(time) {
 	var h = m = s = ms = 0;
 	var newTime = '';

 	h = Math.floor( time / (60 * 60 * 1000) );
 	time = time % (60 * 60 * 1000);
 	m = Math.floor( time / (60 * 1000) );
 	time = time % (60 * 1000);
 	s = Math.floor( time / 1000 );
 	ms = time % 1000;

 	newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);
 	return newTime;
 }
 function show() {
 	$time = document.getElementById('time');
 	update();
 }
 function update() {
 	$time.innerHTML = formatTime(x.time());
 }

 function stop() {
 	x.stop();
 	clearInterval(clocktimer);
 }
 function reset() {
 	stop();
 	x.reset();
 	update();
 }

 // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ COMMON 공통 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

 function record_form(game, record){

   var form =
   `
    <form action = "http://localhost:81/wordpress/`+game+`_process" method = "POST">
      <input style = "margin-bottom: 5px" type = "text" name = "user" placeholder = "input name">
      <input style = "margin-bottom: 10px" type = "text" name = "nation" placeholder = "input country">
      <input type = "hidden" name = "record" value =`+record+`>
      <input type = "hidden" name = "team" value =`+selected_team[0]+`>
    <input type = "submit" value = "Submit my record">
   </form>`
   return form;
 }

 // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ Log in 로그인 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

 var checkLoginStatus = function(response){
   console.log(response);
   // statusChangeCallback(response);
   if(response.status == 'connected'){
     //document.querySelector('#authBtn').value = 'Logout';
     $('#authBtn').val('Logout');
     FB.api('/me', function(resp){
       $('.myname').html(resp.name);
     });
   }else {
     //document.querySelector('#authBtn').value = 'Login';
     $('#authBtn').val('Login');
     $('.myname').html("");
   }
 }

function facebook_log(status){
  if(status.value == 'Login'){
    FB.login(function(res){
      console.log('login =>', res)
      checkLoginStatus(res);
    });


  //  $('#authBtn').val('Logout');

  }else{
    FB.logout(function(res){
      console.log('logout =>', res)
      checkLoginStatus(res);
    });
//    $('#authBtn').val('Login');
  }
}

function instagram_log(){

  var insta_set = {
    "clientID" : "dbfdc2aae60d47a083abb536c80fb10f",
    "clientSecret" : "5defbb18dd1d4e86a3a2221bba8109c1",
    "redirectURI" : "http://localhost:81/wordpress/"
  };
  location.href = "https://api.instagram.com/oauth/authorize/?client_id="+insta_set['clientID']+"&redirect_uri="+insta_set['redirectURI']+"&response_type=code";
}


 // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ REFLEX 리플렉스 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

 var reflex_list;
 var reflex_ran = [];
 var reflex_ans;
 var reflex_stage = 0;
 var reflex_record;
 var reflex_result;
 var reflexT;
 const src_reflex = "http://localhost:81/wordpress/wp-content/uploads/reflex/";
 const reflex_final = 10;

 function reflex_get_data(res){
   reflex_list = JSON.parse(res.value);
   reflex_record = [];
   reflex_set();
 }
 function reflex_set(){
   reflex_stage++;
   reflexT = 0;

   reflex_ran =[];
   for(var i=0; i<3; i++){
     var temp = reflex_list[Math.floor((Math.random()*20))];
     while(reflex_ran.includes(temp)){
       var temp = reflex_list[Math.floor((Math.random()*20))];
     }
     reflex_ran.push(temp);
   }
   reflex_ans = reflex_ran[Math.floor((Math.random()*2))];
   reflex_ready();
 }
 function reflex_ready(){
   var time_ready = 2;
   $('.game-container.reflex').css('display', 'inline');
   $('.game-container.reflex').html('<h1>'+time_ready+'</h1>');
   $('.stage_showing').html('stage : <font color="red">'+reflex_stage+'/'+reflex_final+'</font>');

//   document.querySelector('.game-container.reflex').style = "display: inline";
//   document.querySelector('.game-container.reflex').innerHTML = '<h1>'+time_ready+'</h1>';

   tid = setInterval(function(){
     time_ready = time_ready-1;
     $('.game-container.reflex').html('<h1>'+time_ready+'</h1>');
  //   document.querySelector('.game-container.reflex').innerHTML = '<h1>'+time_ready+'</h1>';
     if(time_ready == 0){
       clearInterval(tid);
       reflex_start();
     }
   }, 1000)
 }

 function reflex_start(){
   reflex_TimeStart();
   $('.game-container.reflex').css({
     'display' : 'grid',
     'grid-template-columns' : '1fr 1fr 1fr 1fr'
   });
//   document.querySelector('.game-container.reflex').style = "display: grid; grid-template-columns: 1fr 1fr 1fr 1fr";
   var msg =[];
   for(var i=0; i<reflex_ran.length; i++){
     var temp = '<img class = "img_cell reflex" onclick = \'check_reflex("'+reflex_ran[i]+'")\' src = "'+src_reflex+'answer/'+reflex_ran[i]+'.png">';
     msg.push(temp);
   }
   var temp = '<img class = "img_cell sellect"  src = "'+src_reflex+'hint/'+reflex_ans+'.png">';
   msg.push(temp);
   shuffle(msg);

   const reducer = (accumulator, currentValue) => accumulator + currentValue;
   $('.game-container.reflex').html(msg.reduce(reducer));
//   document.querySelector('.game-container.reflex').innerHTML = msg.reduce(reducer);
 }

 function check_reflex(res){
   clearInterval(tid);		// 타이머 해제

   var back_color;
   if(res == reflex_ans){
     // 정답
     back_color = '#51ff00'
   }else {
     // 오답
     back_color = 'red';
     reflexT = parseFloat(reflexT+1);
   }
   reflex_record.push(reflexT.toFixed(2));

   $('.game-box').css('backgroundColor', back_color);
//   document.querySelector('.game-box').style.backgroundColor = back_color;
   setTimeout(function(){
     $('.game-box').css('backgroundColor', '#efefef');
//     document.querySelector('.game-box').style.backgroundColor = '#efefef';
     if(reflex_stage == reflex_final){
       reflex_result=0;
       for(var i=0; i<reflex_record.length; i++){
         reflex_result = reflex_result + parseFloat(reflex_record[i]);
       }
       reflex_result = (reflex_result/10).toFixed(2);
       show_reflex_msg();
     }else {
       reflex_set();
     }
    }, 300);
 }
 function reflex_TimeStart(){
   tid=setInterval(function(){
     reflexT = parseFloat(reflexT+0.01);
     if (reflexT > 20) {			// 시간이 종료 되었으면..
       clearInterval(tid);}
     },10);
  }
  function show_reflex_msg(){
    var showing_msg;
    if(reflex_result<1){
      showing_msg = 'What are you doing here ? Go BayernMunich and have competition with ManuelNeuer !'
    }else if (reflex_result<2) {
      showing_msg = 'You have absolutely awesom reflex talent !'
    }else if (reflex_result<3) {
      showing_msg = 'Not bad but you can be better!'
    }else {
      showing_msg = 'You didn\'t Concentrate. right? try again !'
    }
    var msg =
        '<img class = "img_cell" src = "http://localhost:81/wordpress/wp-content/uploads/inner_thumbnail/reflex.jpg">'+
        '<div style = "padding: 0 20px"><h4>My result : <font color ="red">'+reflex_result+'</font></h4><h6>'+showing_msg+'</h6>'+record_form('reflex', reflex_record);

        $('.game-container.reflex').css({
          'display' : 'grid',
          'grid-template-columns' : '1fr 1fr'
        });
        $('.game-container.reflex').html(msg);
  }


// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ WHO AM EYE 후엠아이 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

var whoameye_arr = [];
var whoameye_ans = [];
var arr_shuffle;

var whoameye_stage = 0;
var whoameye_score = 0;

const src_whoameye = "http://localhost:81/wordpress/wp-content/uploads/whoameye/";
const whoameye_final = 10;
const set_time_whoameye = 10;


  // sql 데이터 수신
function whoameye_set(res){
  whoameye_arr = JSON.parse(res.value);
  answer_setting();
  whoameye_start();
}

function answer_setting(){
  for(var i=0; i<whoameye_final; i++){
    var temp = whoameye_arr[Math.floor((Math.random()*16))];
    while(whoameye_ans.includes(temp)){
      temp = whoameye_arr[Math.floor((Math.random()*16))];
    }
    whoameye_ans.push(temp);
  }
}
function whoameye_start(){
  SetTime = set_time_whoameye;
  whoameye_timerStart();
  whoameye_stage++;
  // 눈깔 입력
  arr_shuffle = shuffle(whoameye_arr);
  whoameye_answer = Math.floor((Math.random()*16));

  var inner_1 = inner_2 = [];
  for(var i=0; i<whoameye_arr.length/2; i++){
    inner_1 = inner_1 + load_eye(i);
    inner_2 = inner_2 + load_eye(i+whoameye_arr.length/2);
  }

  // 힌트입력

  var msg = '<h2 class="time_left"> TIME LEFT : '+SetTime+'</h2> <img width = "90%" src = "'+src_whoameye+'hint/'+whoameye_ans[whoameye_stage-1]+'.png">';
  $('.whoami-item.center').html(msg);
  $('.whoami-item.left').html(inner_1);
  $('.whoami-item.right').html(inner_2);

  // 스테이지 입력
  //  document.querySelector('.stage').innerHTML = "stage : "+whoameye_stage+"/10";
  $('.stage').html( "stage : "+whoameye_stage+"/10");

}
function whoameye_timerStart(){ tid=setInterval('whoameye_time()',10) }
function whoameye_time() {	// 1초씩 카운트

//  document.querySelector('.time_left').innerHTML = 'TIME LEFT : <font color="red">'+ SetTime+'</font>';
  $('.time_left').html('TIME LEFT : <font color="red">'+ SetTime+'</font>');
//  var msg = "<h4>TIME LEFT :  <font color='red'>" + SetTime + " s </font> 입니다.</h4>";

  //document.all.ViewTimer.innerHTML = msg;		// div 영역에 보여줌
  SetTime = parseFloat(SetTime-0.01).toFixed(2)
  if (SetTime < 0) {			// 시간이 종료 되었으면..
    clearInterval(tid);		// 타이머 해제
    whoameye_check(null);
  }
}

function load_eye(num){
  return '<img class = "img_eye" src= "'+src_whoameye+'eye/'+arr_shuffle[num]+'.png" onclick=\'whoameye_check("'+arr_shuffle[num]+'")\'>';
}
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function whoameye_check(res){
  clearInterval(tid);		// 타이머 해제
  var anwser_color;
  if(whoameye_ans[whoameye_stage-1] == res){
    whoameye_score++;
    anwser_color = '#51ff00';
  }else {
    anwser_color = 'red';
  }
  whoameye_result(anwser_color);
}

function whoameye_result(color){
  $('.game-box').css('backgroundColor', color);
//  document.querySelector('.game-box').style.backgroundColor = color;
  if(whoameye_stage<whoameye_final){
    setTimeout(function(){
      $('.game-box').css('backgroundColor', '#efefef');
      // document.querySelector('.game-box').style.backgroundColor = '#efefef';
       whoameye_start();
     }, 500);
  }else {
    $('.game-box').css('backgroundColor', '#00000000');
    var msg=`
    <div id="myProgress">
      <div id="myBar"></div>
    </div>
    <h5 style="text-align:center">Wait for seconds .... </h5>
    <form method = "POST" action = "http://localhost:81/wordpress/whoami_process" id="myscore">
      <input type = "hidden" name = "score" value =`+whoameye_score*whoameye_final+`>
    </form>
    `
    progress_move();

    $('.game-box').html(msg);
    $('.stage').css('display', 'none');
    $("#myscore").submit();
  }
}
function progress_move(){
    var elem = document.getElementById("myBar");
    var width = 1;
    var id = setInterval(frame, 10);
    var per;
    function frame() {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++;
            per = width+'%';
            $('#myBar').css('width',per);
//            elem.style.width = width + '%';
        }
    }
}

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ FAST FIND 패스트파인드  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■


var fastfind_stage = 0;
var grid_size = 3;

var selected_team = [];
var answer;
var wrong;

const src_fastfind = "http://localhost:81/wordpress/wp-content/uploads/fastfind/";
const set_time_fastfind = 20;

// 팀선택

function team_select(res){
//  selected_team = JSON.parse(res.value);
//  document.querySelector('.btn_start').style.display = 'inline';
//  game_start();
  var target = '.fastfind_start.'+res;
  document.querySelector(target).click(); // Click on the checkbox
}

function team_setting(res){
  selected_team = JSON.parse(res.value);
  game_start();
}

// 패스트파인드 시작

function game_start(){
  SetTime = set_time_fastfind;
  grid_size = 3+Math.floor(fastfind_stage/2);
  fastfind_stage++;

  answer = selected_team[Math.floor((Math.random()*15)+1)];
  wrong = selected_team[Math.floor((Math.random()*15)+1)];

  var i=0;
  while(answer == wrong){
    wrong = selected_team[Math.floor((Math.random()*15)+1)];
  }
  var ans_position = Math.floor(Math.random()*grid_size*grid_size);

  var make_game = '<h2 class = "target_name" style= "text-align: center"></h2><div class = "game-container fastfind">';

  while(i<grid_size*grid_size){
    if(i == ans_position){
      make_game = make_game +
      '<img class = "img_cell" src="'+src_fastfind+selected_team[0]+'/'+answer+'.png" onclick=\'checkAnswer("'+answer+'")\'></img>';
    }else {
      make_game = make_game +
      '<img class = "img_cell" src="'+src_fastfind+selected_team[0]+'/'+wrong+'.png" onclick=\'checkAnswer("'+wrong+'")\'></img>';
    }
    i++;
  }
  make_game = make_game + '</div><h5 class = "stage_showing" style="text-align: right; margin: 20px"></h5>';

  //document.querySelector('.game-box.fastfind').innerHTML=make_game;
  $('.game-box.fastfind').html(make_game);
  $('.game-box.fastfind').css({
    'border-radius' : '5px',
    'background-color' : '#efefef',
    'margin' : '0 auto',
    'padding' : '20px'
  });
  $('.game-container.fastfind').css({
    'grid-template-columns' : 'repeat('+grid_size+', 1fr)',
    'max-width' : '450px'
  });
  $('.stage_showing').html('current stage  <font color = "red">'+fastfind_stage+'</font>');
  fastfind_timerStart();
}

function fastfind_timerStart(){ tid=setInterval('fastfind_time()',10) }
function fastfind_time() {	// 1초씩 카운트

  $('.target_name').html('TIME LEFT <font color="red"> '+SetTime+'</font>');
  //document.querySelector('.target_name').innerHTML = '<font color="red">'+SetTime+'</font>';
  //'TIME LEFT : <font color="red">'+ SetTime+'</font>';
  //  var msg = "<h4>TIME LEFT :  <font color='red'>" + SetTime + " s </font> 입니다.</h4>";

  //document.all.ViewTimer.innerHTML = msg;		// div 영역에 보여줌
  SetTime = parseFloat(SetTime-0.01).toFixed(2);
  if (SetTime < 0) {			// 시간이 종료 되었으면..
    clearInterval(tid);		// 타이머 해제
    fastfind_finish();
  }
}

function checkAnswer(res){

  if(res != answer){
  //  document.getElementById('fastfind_'+i).src = "http://localhost:81/wordpress/wp-content/uploads/icon/wrong.png";
    SetTime = parseFloat(SetTime-3).toFixed(2);
    $('.game-box.fastfind').css("backgroundColor", 'red');
    setTimeout(function(){
      $('.game-box.fastfind').css("backgroundColor", '#efefef');
    },300);

} else {
    clearInterval(tid);		// 타이머 해제
    //  document.getElementById('fastfind_'+i).src = "http://localhost:81/wordpress/wp-content/uploads/icon/right.png";
    $('.game-box.fastfind').css("backgroundColor", '#51ff00');
    setTimeout(function(){
      game_start();
      $('.game-box.fastfind').css("backgroundColor", '#efefef');
    },300);
  }
}

function fastfind_finish(){
  if(fastfind_stage>30){
    showing_msg = '<p>Your brain is simmilar to computer.</p>'
  }else if (fastfind_stage > 20) {
    showing_msg = '<p>You have eagle eye and very sharp sense !</p>'
  }else if (fastfind_stage > 15) {
    showing_msg = '<p>Great sense !</p>'
  }else if (fastfind_stage > 10) {
    showing_msg = '<p>Good job ! But you can be better ! try again</p>'
  }else if (fastfind_stage > 5) {
    showing_msg = '<p>Not bad ! But you need to be more sharp ! practice again</p>'
  }else {
    showing_msg = '<p>I think you didn\'t concentrated! </p>'
  }

  var msg =
      '<img class = "img_cell" src = "http://localhost:81/wordpress/wp-content/uploads/inner_thumbnail/fastfind_result.png">'+
      '<div style = "margin : 20px; border-top : 2px solid; padding-top: 10px"><h3>MY RESULT : <font color ="red">'
      +fastfind_stage+'</font></h3><h6>'
      +showing_msg+'</h6>'
      +record_form('fastfind', fastfind_stage);

  $('.target_name').css('display','none');
  $('.stage_showing').css('display','none');
  $('.game-box.fastfind').html(msg);
  $('.game-box.fastfind').css({
    'max-width' : '450px'
  });
//  document.querySelector('.game-container.fastfind').style = "display:inline-grid; align-items:center";
//  document.querySelector('.game-container.fastfind').innerHTML='<h3>My record : </h3>'+stage-2;
}

function locate_fastfind(){
  location.href = "http://localhost:81/wordpress/fastfind";
}
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ THREE TOP 쓰리톱  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

var tt_select={};
var selected = [];
var price = [];
var extra_money;

const threetop_budget = 10;

function threetop_select(res){
  var result = JSON.parse(res.value);
  tt_select = {
    "name" : result['name'],
    "cost" : result['cost']
  };
  mylist_set();
}
function mylist_set(){
  var target = '.img_cell.threetop.'+tt_select['name'];

  if(selected.includes(tt_select['name'])){
    // 이미 있으면 삭제
    remove_list(tt_select['name']);
    $(target).css({
      '-webkit-filter' : 'grayscale(1)',
      'filter' : 'gray',
      'opacity' : '0.75'
    });
  }else {
    // 아니면 추가
    if(selected.length>=3){
      // 3명 이성이면 선택불가
      alert('Only 3 players could be selected');
    }else {
      if(parseInt(tt_select['cost'])>extra_money){
        // 예산 범위 밖이면 선택불가
        alert('Over budget');
      }else {
        selected.push(tt_select['name']);
        price.push(tt_select['cost']);
        $(target).css({
          '-webkit-filter' : 'grayscale(0)',
          'filter' : 'none',
          'opacity' : '1'
        });
      }
    }
  }
  show_list();
}

function remove_list(item){
  for(var i in selected){
    if(selected[i] == item){
      selected.splice(i, 1);
      price.splice(i,1);
      break;
    }
  }
}

function show_list(){


  var money_use = 0;
  for(var i=0; i<price.length; i++){
    money_use = money_use + parseInt(price[i]);
  }
  extra_money = threetop_budget - money_use;

  $('.extra_money').html('Best Midfield Combination <font color="yellow">'+extra_money+'$</font>');
  document.getElementById('player_list').value = selected;
  // document.querySelector('.extra_money').innerHTML = 'MY BUDGET LEFT <font color="red">'+extra_money+'$</font>'
}

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ THREE TOP PROCESS 쓰리톱 프로세스  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

var arr_mid;
var participant;
var combi;

const show_size = 6;
const src_threemid = "http://localhost:81/wordpress/wp-content/uploads/threemid/";

function vote_category(res){
  vote_btn_css(res.id);
  arr_mid = JSON.parse(res.value);
  show_vote('personal');
}

function vote_combi(res){
  vote_btn_css(res.id);
  combi = JSON.parse(res.value);
  show_vote('combi');
}

function vote_btn_css(src){
  var target = '#'+src;
  $('.vote-menu > button').css({
    'backgroundColor' : '#343434',
    'color' : 'white'
  })
  $(target).css({
    'backgroundColor' : 'white',
    'color' : 'black'
  });
}

function show_vote(res){
  participant = $('#total_participants').val();
  var msg ="";
  if(res == 'personal'){
    $('.mid_category').css("grid-template-columns", "1fr 7fr");
    for(var i=0; i<show_size; i++){
      var percent = ((arr_mid[i]['vote']/participant)*100).toFixed(2)+"%";
      msg = msg +
      `<img src = "`+src_threemid+arr_mid[i]['name']+`.png">
       <div>
         <h5>`+arr_mid[i]['name']+`   <font color = "#E57373">   `+percent+`</font></h5>
         <div id="myVote"><div id="myVote_gauge" style = "width : `+percent+`"></div></div>
      </div>`
    }
  }
  else {
    $('.mid_category').css("grid-template-columns", "1fr 1fr 1fr 5fr");
    for(var i=0; i<show_size; i++){
      var percent = ((combi[i]['vote']/participant)*100).toFixed(2)+"%";
      for(var j=0; j<combi[i]['combi'].length; j++){
        msg = msg + `<div style = "display: grid"><img src = "`+src_threemid+combi[i]['combi'][j]+`.png"><h6>`+combi[i]['combi'][j]+`</h6></div>`;
      }
      msg = msg +
       `<div>
         <h5><font color = "#E57373">   `+percent+`</font></h5>
         <div id="myVote"><div id="myVote_gauge" style = "width : `+percent+`"></div></div>
      </div>`
    }
  }

   $('.mid_category').html(msg);
}

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ MY HERO 마이 히어로  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

const src_myhero = "http://localhost:81/wordpress/wp-content/uploads/myhero/";
var hero_tal = {
  'Technic' : 512,
  'Strength' : 256,
  'Shooting' : 128,
  'Tackle' : 64,
  'Passing' : 32,
  'Leadership' : 16,
  'Stamina' : 8,
  'Speed' : 4,
  'Heading' : 2,
  'Dribble' : 1
};
var selected_talent = [];
var talent_list = [];

var hero_code;
var hero_progress;

function myhero_initiailizing(){
  hero_code = 0;
  hero_progress = 0;
  myhero_set();
}

function myhero_set(){
  switch (hero_progress) {
    case 0:
      get_talent_vs('Technic', 'Strength');
      break;
    case 1:
      get_talent_vs('Shooting', 'Tackle');
      break;
    case 2:
      get_talent_group(['Passing', 'Leadership', 'Stamina', 'Speed', 'Heading', 'Dribble']);
      break;
  }
  $('.game-container.myhero').css({
    'grid-template-columns' : '1fr 1fr 1fr',
    'display' : 'grid'
  });
}
function get_talent_vs(a,b){
  var msg = get_hero_src(a)+'<h1 style = "margin: auto">VS</h1>'+get_hero_src(b);
  $('.game-container.myhero').html(msg);
}

function get_hero_src(tal){
  var hero_src = '<img class = "img_cell" src = "'+src_myhero+'talent/'+tal+'.png" onclick = "add_talent(\''+tal+'\')">';
  return hero_src;
}

function add_talent(res){
  talent_list.push(res);
  hero_code = hero_code + hero_tal[res];
  hero_progress++;
  myhero_set();
}

function get_talent_group(list){
  var msg = '<h5 style = "text-align: center; margin: 2rem">SELECT <font color = "red">3 TALENTS </font> YOU WANT</h5><div class = "game-container myhero">' ;
  for(var i=0; i<list.length; i++){
    msg = msg + '<img class = "img_cell hero" value = "'+list[i]+'" src = "'+src_myhero+'talent/'+list[i]+'.png" onclick = "add_talent_group(this,\''+list[i]+'\')">';
  }
  msg = msg + '</div>'+
    `<form method = "POST" action = "http://localhost:81/wordpress/myhero_process">
      <input class = "sending_tal" name = "talent" type = "hidden">
      <input class = "mycode" name = "code" type = "hidden">
      <input style = "margin: 10px" type = "submit" value = "submit">
    </form>
    `;
  $('.game-box').html(msg);
  $('.game-container.myhero').css({
    'grid-template-columns' : '1fr 1fr 1fr',
    'display' : 'grid'
  });
}

function add_talent_group(res,talent){
  if(selected_talent.includes(talent)){
    hero_code = hero_code - hero_tal[talent];
    remove_hero(talent);
    $(res).css({
      'filter' : 'gray',
      'opacity' : '0.75',
      '-webkit-filter' : 'grayscale(1)'
    });
  }else {
    if(selected_talent.length<3){
      hero_code = hero_code + hero_tal[talent];
      selected_talent.push(talent);
      $(res).css({
        'filter' : 'none',
        'opacity' : '1',
        '-webkit-filter' : 'grayscale(0)'
      });
    }else {
      alert('Only 3 talent !')
    }
  }

  $('.mycode').val(hero_code);
  $('.sending_tal').val(talent_list.concat(selected_talent));
}

function remove_hero(item){
  for(var i in selected_talent){
    if(selected_talent[i] == item){
      selected_talent.splice(i, 1);
      break;
    }
  }
}

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ DREAM CLUB 드림클럽  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

var selected_dream = [];
var src_dreamclub = 'http://localhost:81/wordpress/wp-content/uploads/dreamclub/';

function select_dream(res){
  selected_dream.push(res);

  switch (selected_dream.length) {
    case 1:
      set_dream("compact", "big", "CAR");
      break;
    case 2:
      set_dream("maker", "handmade", "SHOES");
      break;
    case 3:
      set_vacation("athens", "newyork", "dubai", "bangkok","VACATION");
      break;
    case 4:
      show_dream();
      break;
  }
}

function set_dream(a,b,c){
  var msg = `
    <img class="img_cell dream" src ="`+src_dreamclub+a+`.png" onclick = "select_dream('`+a+`')">
    <img class="img_cell dream" src ="`+src_dreamclub+b+`.png" onclick = "select_dream('`+b+`')">
  `;
  $('.game-container.dreamclub').html(msg);
  $('.dream_category').html(c);
}
function set_vacation(a,b,c,d,e){
  var msg = `
    <img class="img_cell dream" src ="`+src_dreamclub+a+`.png" onclick = "select_dream('`+a+`')">
    <img class="img_cell dream" src ="`+src_dreamclub+b+`.png" onclick = "select_dream('`+b+`')">
    <img class="img_cell dream" src ="`+src_dreamclub+c+`.png" onclick = "select_dream('`+c+`')">
    <img class="img_cell dream" src ="`+src_dreamclub+d+`.png" onclick = "select_dream('`+d+`')">
  `;
  $('.dream_category').html(e);
  $('.game-container.dreamclub').html(msg);
  $('.game-container.dreamclub').css({
    'grid-template-columns' : '1fr 1fr 1fr 1fr'
  });
}

function show_dream(){

  var msg=`
  <div id="myProgress">
    <div id="myBar"></div>
  </div>
  <h5 style="text-align:center">Wait for seconds .... </h5>
  <form method = "POST" action = "http://localhost:81/wordpress/dreamclub_process" id="mydream">
    <input type = "hidden" name = "dream" value =`+selected_dream+`>
  </form>
  `
  progress_move();
  $('.game-container.dreamclub').html(msg);
  $("#mydream").submit();
}


// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ RANDOM BOX 랜덤 박스  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

var random_list;
var arr_ran = [];

const src_randombox = 'http://localhost:81/wordpress/wp-content/uploads/randombox/';

function randombox(list){
  random_list = JSON.parse(list.value);
  arr_ran = [];
  select_random();
}

function select_random(){
  for(var i=0; i<3; i++){
    var temp = Math.floor((Math.random()*random_list.length));
    while (arr_ran.includes(random_list[temp])) {
      var temp = Math.floor((Math.random()*random_list.length));
    }
    arr_ran.push(random_list[temp]);
  }

  randombox_showing();
}

function randombox_showing(){
  var msg = '<h1 class = "h1_design">MY RANDOM 3 TOP</h1><div class="game-container random">';
  for(var i in arr_ran){
    msg = msg + '<img class = "random-item" src = "'+src_randombox+arr_ran[i]+'.png">';
  }
  msg = msg+'</div><input type="button" value = "REGAME" onclick="reset_random();">'
  // document.querySelector('.game-box.threetop').innerHTML = msg;
  $('.game-box.threetop').html(msg);
}

function reset_random(){
  arr_ran = [];
  var msg = '<h1 class ="h1_design">MY RANDOM 3 TOP</h1><div class="game-container normal"><input class="game-item random"type="image"  src="http://localhost:81/wordpress/wp-content/uploads/icon/push_button.png" onclick="select_random();"><h4 style="margin: auto">Click button and get your player !</h4></div>';
  $('.game-box.threetop').html(msg);
}
