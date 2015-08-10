//var socket = io.connect("shma.jp:4040");

$(function(){
    $("#button").tap(function(){
	console.log('aaaa');
        k.find();
    });
});

function showFirst(){
    $("#content").animate(
        {left: "0%"},
        {duration: 500, easing: "ease-in-out"}
    );
}

function showConnecting(){
    $("#content").animate(
        {left: "-100%"},
        {duration: 500, easing: "ease-in-out"}
    );
}

function showMeter(){
    $("#content").animate(
        {left: "-200%"},
        {duration: 500, easing: "ease-in-out"}
    );
}

function changeMeter(value){
    $("#meter").animate(
        {height: (value)*10 + "%"},
        {duration: 500, easing: "ease-in-out"}
    );
//    socket.emit('voice', value);
    $.ajax({
      type: "GET",
      url: "http://192.168.1.74:3000/?id=1&vol="+value,
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
    }, 500);
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
