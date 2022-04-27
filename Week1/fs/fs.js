// fs模块用于对系统文件及目录进行读写操作
const fs = require("fs");

// 阻塞和非阻塞 Start
// 阻塞代码实例
const data = fs.readFileSync('input.txt');// 同步执行

console.log('同步', data.toString());
console.log("程序执行结束!");

// 非阻塞代码实例
// 异步执行
fs.readFile('input.txt', function (err, data) {
    if (err) return console.error(err);
    console.log('异步', data.toString());
});

console.log("程序执行结束!");
// 阻塞和非阻塞 End


// 爬取数据 Start
// 请求模块
const request = require('request')
const cheerio = require('cheerio')
// 需要抓取的网站链接
let dataUrl = "https://www.lagou.com/";
// 示例
request(dataUrl, (err, response, html) => {
    if (!err && response.statusCode === 200) {
        const $ = cheerio.load(html);
        // 将我们需要的信息存储在一个数组中
        let result = [];
        const $menuBox = $('.menu_box');
        // 遍历
        $menuBox.each((i, el) => {
            const obj = {name: '', subName: []};
            obj.name = $(el).find("h2").text().trim();
            const $as = $(el).find("a");
            $as.each(function (index, item) {
                obj.subName.push($(item).text());
            });
            result.push(obj);
        })

        result = JSON.stringify(result);

        // 写入 json文件
        fs.writeFile('data.json', result, 'utf-8', (err) => {
            if (err) throw err;
            console.log('success');
        })
    }
})

// 我爬我自己公司的网站
dataUrl = 'https://www.qiumiwu.com/standings';
request(dataUrl, (err, response, html) => {
    if (!err && response.statusCode === 200) {
        const $ = cheerio.load(html);
        // 将我们需要的信息存储在一个数组中
        let result = [];
        const $standingList = $('.bottom-content-list');
        const $menuList = $('.team-right');
        let menuArr = [];
        $menuList.first().find('div').each((i, el) => {
            menuArr.push($(el).text().trim())
        })
        console.log(menuArr)
        // 遍历
        $standingList.each((i, el) => {
            const obj = {};
            obj.rank = parseInt($(el).find(".bottom-content-list-left__rank").text(), 10);
            obj.name = $(el).find(".bottom-content-list-left__team__name").text().trim();
            const $data = $(el).find(".bottom-content-list__right");
            $data.each(function (index, item) {
                const strArr = JSON.stringify($(item).text().replace(/ /g, '')).replace(/"/g, '').split('\\n');
                const filterArr = strArr.filter((i) => (i && i.trim()))
                filterArr.forEach((i, key) => {
                    obj[menuArr[key]] = i;
                })
                // obj.subName.push($(item).text());
            });
            result.push(obj);
        })

        result = JSON.stringify(result);
        console.log(result)
        // 写入 json文件
        fs.writeFile('qiumiwu.json', result, 'utf-8', (err) => {
            if (err) throw err;
            console.log('success');
        })
    }
})
