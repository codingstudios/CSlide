#! /usr/bin/env node
const slideFile = process.argv[2];
if (!slideFile) throw new Error('CSlide: [Error] Please provide a markdown filepath.');
const fs = require('fs');
if(!fs.existsSync(slideFile)) throw new Error("CSlide: [Error] Invalid File !");
const types = {
    ["#"]: "<h1>{value}</h1>",
    ["##"]: "<h2>{value}</h2>",
    ["-"]: "<li>{value}</li>",
};

console.log(`CSlide: [Watching] ${slideFile}`)
fs.watch(slideFile, { encoding: 'utf-8' }, (eventType) => {
if (eventType !== 'change') return;

const slide = fs.readFileSync(slideFile, 'utf-8');
const slides = slide.split('-----');
var html = ``;

slides.forEach((page) => {
        var div = `<div>`;
        var line = page.split('\n');
        line.forEach((text) => {
            var value = text.split(" ");
            if(types[value[0]]){
                var type = types[value[0]];
                value.shift();
                div += `${type.replace('{value}', value.join(" "))}\n`;
            }else {
               if(value.join(" ")) div += `<p>${value.join(" ")}</p>\n`;
            }
        });
        div += `</div>`;
        html += `${div}`;
})
    
const finalHTML = `<link rel="stylesheet" href="test.css"><body><div class="container">${html}</div></body>`;
    
fs.writeFileSync(`./slide.html`, finalHTML); 
console.log(`CSlide: [Merged] (${slideFile}) => ./slide.html`)
})
