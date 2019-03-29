//var numberWidth = $(document).width() / 5;
var numberWidth = 100;
$('li').css('fontSize',numberWidth);
var jsSlot = [];
var slotInfo;
var slotFlag = true;

function randomRange(low, high) {
    var rand = Math.floor( Math.random() * (1 + 1*(high - low)) ) + low * 1;
    var result = rand % 5;
    var v = [55,21,26,66,75];
    return v[result];
    //return Math.floor( Math.random() * (1 + 1*(high - low)) ) + low * 1;
}

function padLeft(str,lenght){
    if(str.length >= lenght)
        return str;
    else
        return padLeft("0" +str,lenght);
} 

function updateResult(resultArr){
    var str = resultArr.join(",");
    $.cookie('result',str);
    appendResult(str);
}

function appendResult(resultStr){
    var arr = resultStr.split(",");
    var l = arr.length;
    $('#resultBox').html("");
    if ( l > 0) {
        for(var i=0;i<l;i++) {
            $('#resultBox').append('<div>'+arr[i]+'</div>');
        }
    }
}

function deleteResult() {
    $.removeCookie('result');
    location.reload();
}

//<span style="font-size:8px;color:#3c77de;">✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿✿</span>


$(document).ready(function(){
    
    // init
    var result = $.cookie('result') || '';
    var resultArr = result == '' ? [] : result.split(",");
    slotInfo = {
        randomStart : $.cookie('randomStart') || 1
        ,randomEnd : $.cookie('randomEnd') || 99
        ,unique : $.cookie('unique') || 1
        ,sec : $.cookie('sec') || 5
        ,backgroundColor : $.cookie('backgroundColor') || '#050566'
        ,textColor : $.cookie('textColor') || '#ffff33'
        ,textBackgroundColor : $.cookie('textBackgroundColor') || '#ffb094'   //#ffbba6  //#ffd6f8 //color:#827ea6; //#ffae91;
        ,result : resultArr
    };
    
    $('#randomStart').val(slotInfo.randomStart);
    $('#randomEnd').val(slotInfo.randomEnd);
    $('#unique').val(slotInfo.unique);
    $('input[type="radio"][name="unique"][value='+slotInfo.unique+"]").prop("checked", true);
    $("#sec").val(slotInfo.sec);
    $('#backgroundColor').val(slotInfo.backgroundColor);
    //$('#backgroundColor').css('backgroundColor');
    $('#textColor').val(slotInfo.textColor);
    $('#textBackgroundColor').val(slotInfo.textBackgroundColor);
    //$('#textBackgroundColor').css('background');
    $('li').css('color',slotInfo.textColor);
    //$('li').css('backgroundColor',slotInfo.textBackgroundColor);
    appendResult(result);
    $('#resultBox').css('color',slotInfo.textColor);

    // update setting
    $('#updateSetting').click(function(){
        var randomStart = 1,randomEnd = 99,unique = 0,sec = 5;
        var backgroundColor = '#050566';
        var textColor = '#ffff33';
        //var textBackgroundColor = '#000000';
        // number range
        if ($('#randomStart').val() > 0) {
            randomStart = parseInt($('#randomStart').val(),10);
        }
        if ($('#randomEnd').val() > 0) {
            randomEnd = parseInt($('#randomEnd').val(),10);
        }
        if (randomStart > randomEnd) {
            randomEnd = randomStart * 1 + 1;
        }
        randomEnd = (randomEnd > 99) ? 99 : randomEnd;
        
        // unique slots
        unique = $('input[type="radio"][name="unique"]:checked').val() == 0 ? 0 : 1;
        
        // slots time
        if (($("#sec").val()>=1 && $("#sec").val()<=10)) {
            sec = $("#sec").val();
        }
        
        // color
        if(/\#[a-fA-F0-9]{6}/.test($("#backgroundColor").val())) {
            backgroundColor = $("#backgroundColor").val();
        }
        if(/\#[a-fA-F0-9]{6}/.test($("#textColor").val())) {
            textColor = $("#textColor").val();
        }
        if(/\#[a-fA-F0-9]{6}/.test($("#textBackgroundColor").val())) {
            textBackgroundColor = $("#textBackgroundColor").val();
        }
        
        $.cookie('randomStart', randomStart);
        $.cookie('randomEnd', randomEnd);
        $.cookie('unique', unique);
        $.cookie('sec', sec);
        $.cookie('backgroundColor', backgroundColor);
        $.cookie('textColor', textColor);
        $.cookie('textBackgroundColor', textBackgroundColor);
        location.reload();
        
    });
    
    // switch page to slot
    $("#goToSlot").click(function(){
        $.fn.fullpage.moveTo(3);
    });

    // go slots
    $('#goBtn').click(function(){
        if (slotFlag) {
            var rand;
            if (slotInfo.unique == 1) {
                var number = 1*(slotInfo.randomEnd - slotInfo.randomStart) + 1;
                if (slotInfo.result.length >= number) {
                    alert('已無數字可選');
                    return false;
                }
                do {
                    if (slotInfo.result.length >= 5) {
                        alert('特別獎已開出5個號碼，開獎完畢！');
                        return false;
                    } else {
                        rand = randomRange(slotInfo.randomStart, slotInfo.randomEnd);
                    }
                } while (jQuery.inArray(rand.toString(), slotInfo.result) != -1);
            } else {
                rand = randomRange(slotInfo.randomStart, slotInfo.randomEnd);
            }
            slotInfo.result.push(rand.toString());
            updateResult(slotInfo.result);
            
            var numberLength = slotInfo.randomEnd.toString().length;
            var numberStr = padLeft(rand.toString(), numberLength);
            var numberStrToArr = numberStr.split("");
            var tempObj = {};
            for (var i=0;i<numberLength;i++) {
                tempObj[i] = numberStrToArr[i] == "0" ? 10 :numberStrToArr[i];
            }
            console.log(tempObj);
            jsSlot.options.result = tempObj;

            $('#gogogo').click();
        }

    });
    
    // delete result
    $('#delete').click(function(){
        if(confirm("確定要刪除所有結果嗎？")) {
            deleteResult();
        }
    });

    $('#fullpage').fullpage({
        sectionsColor: ['#000000', slotInfo.backgroundColor, slotInfo.textBackgroundColor ],
        anchors: ['setting', 'result', 'slots'],
        scrollingSpeed: 500
     });

    jsSlot = $('.slot').jSlotsPlus({
        number : slotInfo.randomEnd.toString().length,
        winnerNumber : 2,
        spinner : '#gogogo',
        spinEvent : 'click',
        onStart : function(){
            slotFlag = false;
        },
        onEnd : function(){
            slotFlag = true;
        },
        onWin : $.noop,
        easing : 'swing',
        time : slotInfo.sec * 1000,
        loops : 5,
        onInit: function() {
            $('.jSlots-wrapper').css('height',numberWidth * 1.4);
        },
        result: {0:2} // set first number to 2
    })[0];
});
