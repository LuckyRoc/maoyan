
const superagent = require('superagent');
const cheerio = require('cheerio');
const utf8 = require('utf8');

var phoneArray = []

function intervalFunc() {
    superagent.get('https://maoyan.com/films?showType=1&sortId=2').end((err, res) => {
        if (err) {
            console.log(` - ${err}`)
        } else {
            getFilms(res)
        }
    });
}

// var timer = setInterval(intervalFunc, 10000);

let getFilms = (res) => {
    let $ = cheerio.load(res.text);
    var isOn = false
    $('.channel-detail').each((idx, ele) => {
        if ($(ele).text().indexOf("复仇者联盟") != -1) {
            console.log($(ele).text())
            isOn = true
        }
    });
    if (isOn) {
        // 发送短信和微信消息 二选一 就可以了 ~ 
        
        // 发送短信
        // for (const phone of phoneArray) {
        //     sendMessage(phone)
        // }

        // 发送微信消息
        sendWx()

        clearInterval(timer)
    } else {
        console.log(new Date().getTime() + "：影片未上映....")
    }
};


function sendWx() {
    var http = require('http');
    
    // 这里的key需要进行更换
    var key = 'SCU48466Tf3f96d026cbcd4d4ab8f05fa7d04ee2c5cada058e0522'
    var path =  '.send?text='
    var text = '复仇者联盟4电影票已经开售啦，快去购票吧！'

    http.get('http://sc.ftqq.com/' + key + path + text,function(data){
        var str="";
        data.on("data",function(chunk){
            str+=chunk;
        })
        data.on("end",function(){
            console.log("推送发送成功")
        })
    })
}

function sendMessage(mobile) {
    var http = require('http');
    var username = "";
    var secretkey = "";
    var content = utf8.encode("复仇者联盟4电影票已经开售啦，快去购票吧！退订回T")
    var path = "/sms_token?ddtkey=" + username + "&secretkey=" + secretkey
        + "&mobile=" + mobile + "&content=" + content

    var options = {
        host: '112.124.17.46',
        port: 7001,
        path: path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    http.get(options, function (res) {
        var resData = "";
        res.on("data", function (data) {
            resData += data;
        });
        res.on("end", function () {
            console.log("影片已经上映，短信通知成功")
        });
    })
}
