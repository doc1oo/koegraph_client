//var socket = io.connect("shma.jp:4040");
var threshold = 0;

$(function(){
    $("#button").tap(function(){
	console.log('aaaa');
        k.find();
    });
});

function showFirst(){
    $("#content").animate(
        {left: "0%"},
        {duration: 50, easing: "ease-in-out"}
    );
}

function showConnecting(){
    $("#content").animate(
        {left: "-100%"},
        {duration: 50, easing: "ease-in-out"}
    );
}

function showMeter(){
    $("#content").animate(
        {left: "-200%"},
        {duration: 50, easing: "ease-in-out"}
    );
}

function changeMeter(value){
    $("#meter").animate(
        {height: (value)*10 + "%"},
        {duration: 50, easing: "ease-in-out"}
    );
    
    $.ajax({
      type: "GET",
      url: "http://192.168.111.20:3000/?id=1&vol="+value+"&threshold="+threshold,
      dataType: "script"
    });
    $("#aionum").html(value);
}

/////////////////////////////////////
// konashi functions
/////////////////////////////////////



var intervalId;

k.ready(function(){
    showMeter();
    k.pinMode(k.PIO0, k.OUTPUT);
    //Interval
    intervalId = window.setInterval(function(){
        k.analogReadRequest(k.AIO0);
    }, 50);
});

k.on(k.KONASHI_EVENT_CONNECTED, function(){
    showConnecting();
});

k.updateAnalogValueAio0(function(data){
    // AIO0のアナログ値が取得できたら実行されます
    changeMeter(data);
    if(data>650){
        k.digitalWrite(k.PIO0, k.HIGH);
    }else{
        k.digitalWrite(k.PIO0, k.LOW);
    }

});

k.disconnected(function(data){
    window.clearInterval(intervalId);
    showFirst();
});

// JQEURY
$("#threshold").on('input', function() {
   $("#threshold_text").html($("#threshold").val());
   threshold = $("#threshold").val();
});
