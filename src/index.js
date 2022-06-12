#! /usr/bin/env node
const slideFile = process.argv[2];
const slideHTMLFile = process.argv[3];

if (!slideFile) throw new Error('CSlide: [Error] Please provide a markdown filepath.');
if (!slideHTMLFile) throw new Error('CSlide: [Error] Please provide a HTML filename for this slide.');

const fs = require('fs');
if(!fs.existsSync(slideFile)) throw new Error("CSlide: [Error] Invalid File !");
const types = {
    ["#"]: "<h1>{value}</h1>",
    ["##"]: "<h2>{value}</h2>",
    ["-"]: "<li>{value}</li>",
};

console.log(`CSlide: [Watching] ${slideFile} - (Writing) ${slideHTMLFile}.html`);

fs.watch(slideFile, { encoding: 'utf-8' }, (eventType) => {
if (eventType !== 'change') return;

const slide = fs.readFileSync(slideFile, 'utf-8');
const slides = slide.split('-----');
var html = ``;

slides.forEach((page, index) => {
        var div = `<div id="${index}">`;
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
    
const finalHTML = `<link rel="stylesheet" href="slide.css"><body><div class="container" id="slide">${html}</div></body><script src="script.js"></script>`;
    
fs.writeFileSync(`./${slideHTMLFile}.html`, finalHTML); 
console.log(`CSlide: [Merged] (${slideFile}) => ./slide.html`)
})
