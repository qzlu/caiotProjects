//获取图标列表
let fs = require('fs')
let cheerio = require('cheerio')
let data = fs.readFileSync('./src/assets/css-font/demo_index.html')
let html = data.toString()
let $ = cheerio.load(html)
let chapters = $('.content.font-class li.dib')
let arr = []
chapters.each(function(item,index) {
    let chapter = $(this)
    let icon = {name:chapter.children('.code-name').text().replace(/\./ig,'').trim()}
    arr.push(icon)
})
let json = arr.map(item => JSON.stringify(item))
fs.writeFileSync('./src/assets/css-font/iconfont.json',JSON.stringify(json))