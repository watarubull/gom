const title = $('#title');
const text = $('#text');
const list = $(".storage-list");
let keyList = [];

$(function(){

// 現在位置取得 成功時の処理
function successFunc(pos) {

  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  const time = new Date();
  const data = {
    title: title.val(),
    text: text.val(),
    lat: lat,
    lng: lng,
    time: time
  }
  list.append('<li class="item"><span class="key">'+ time + '</span>' + title.val() +'</li>');
  const jsonData = JSON.stringify(data);
  localStorage.setItem(time, jsonData);//現在の日時を使ってキーが重複しないようにする
}

// 現在位置取得 失敗時の処理
function errorFunc(error) {
  var errorMessage = {
    0: "現在位置を取得できませんでした。" ,
    1: "位置情報の使用が許可されていないので、現在位置を取得できませんでした。" ,
    2: "現在位置の取得に失敗しました。" ,
    3: "位置情報の取得に時間がかかったため、タイムアウトされました。" ,
  };
  alert(errorMessage[error.code]);
}

// 現在位置取得 オプション
let options = {
  enableHighAccuracy: true
}

//1.Save クリックイベント
//タイトルと本文に加えて現在位置の座標を登録したい
$('#save').on('click', function(){
  if($(".storage-list .on").length){
    const itemKey = $(".storage-list .on").find(".key").text();
    const jsonData = localStorage.getItem(itemKey);
    const data = JSON.parse(jsonData);
    const titleVol = title.val();
    const textVol = text.val();
    const latVol = data.lat;
    const lngVol = data.lng;
    const timeVol = itemKey;
    const save = {
      title: titleVol,
      text: textVol,
      lat: latVol,
      lng: lngVol,
      time: timeVol
    }
    const json = JSON.stringify(save);
    localStorage.setItem(timeVol, json);
    $(".storage-list .on").html('<span class="key">'+ timeVol + '</span>' + titleVol);
  }else if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition( successFunc , errorFunc , options ) ;
  } else { // 現在位置を取得できない場合の処理
    alert("ご使用中のブラウザは現在地検索に対応されておりません。");
  }
});

//2.allclear クリックイベント
$('#allclear').on('click', function () {
  localStorage.clear();
  title.val('');
  text.val('');
  list.html('');
});

//2-2.clear クリックイベント
$('#clear').on('click', function () {
  if($(".storage-list .on").length){
    const itemKey = $(".storage-list .on").find(".key").text();
    localStorage.removeItem(itemKey);
    title.val('');
    text.val('');
    $(".storage-list .on").remove();
  }
});

//3.ページ読み込み：保存データ取得表示
if (localStorage.length) {
  for(let i=0;i<localStorage.length;i++){
    keyList[i] = localStorage.key(i);
    const jsonData = localStorage.getItem(keyList[i]);
    const data = JSON.parse(jsonData);
    const titleVol = data.title;
    list.append('<li class="item"><span class="key">'+ keyList[i] + '</span>' + titleVol +'</li>');
  }
}

//4.アイテムを選択時
$(document).on("click",".item",function(){
  $(".storage-list li").removeClass("on");
  $(this).addClass("on");
  const itemKey = $(this).find(".key").text();
  const jsonData = localStorage.getItem(itemKey);
  const data = JSON.parse(jsonData);
  const titleVol = data.title;
  const textVol = data.text;
  const latVol = data.lat;
  const lngVol = data.lng;
  const timeVol = data.time;
  title.val(titleVol);
  text.val(textVol);
});

//5.地図を表示ボタンクリック
$("#map").on('click',function(){
  if($(".storage-list .on").length){
    const itemKey = $(".storage-list .on").find(".key").text();
    const jsonData = localStorage.getItem(itemKey);
    const data = JSON.parse(jsonData);
    const latVol = data.lat;
    const lngVol = data.lng;
    const url = 'https://www.google.com/maps?q='+latVol+','+lngVol;
    window.open(url, '_blank');
  }
});

});

