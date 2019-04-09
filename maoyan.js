
const superagent = require('superagent');
const cheerio = require('cheerio');

var phoneArray = ["13002562256", "15077825123"]

function intervalFunc() {
    superagent.get('https://maoyan.com/films?sortId=2').end((err, res) => {
        if (err) {
            console.log(` - ${err}`)
        } else {
            getFilms(res)
        }
    });
}

var timer = setInterval(intervalFunc, 10000);

let getFilms = (res) => {
    let $ = cheerio.load(res.text);
    var isOn = false
    $('.channel-detail').each((idx, ele) => {
        if ($(ele).text().indexOf("复仇") != -1) {
            isOn = true
        }
    });
    if (isOn) {
        for (const phone of phoneArray) {
            sendMessage(phone)
        }
        clearInterval(timer)
    } else {
        console.log("影片未上映....")
    }
};


function sendMessage(mobile) {
    var http = require('http');
    var username = "yueke";
    var secretkey = "2d4e42294fdd9f58399650e05298fd22";
    
    var path = "/sms_token?ddtkey=" + username + "&secretkey=" + secretkey
        + "&mobile=" + mobile + "&content=Go"

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