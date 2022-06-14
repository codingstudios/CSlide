#! /usr/bin/env node
const slideFile = process.argv[2];
const slideHTMLFile = process.argv[3];
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

if (!slideFile) throw new Error('CSlide: [Error] Please provide a markdown filepath.');
if (!slideHTMLFile) throw new Error('CSlide: [Error] Please provide a HTML filename for this slide.');

import fs from 'fs';
if(!fs.existsSync(slideFile)) throw new Error("CSlide: [Error] Invalid File !");
const types = {
    ["#"]: "<h1>{value}</h1>",
    ["##"]: "<h2>{value}</h2>",
    ["###"]: "<h3>{value}</h3>",
    ["[img]"]: "<img src='{value}'>",
    ["-"]: "<li>{value}</li>",
    ["[html]"]: "{value}"
};

console.log(`CSlide: [Watching] ${slideFile} - (Writing) ${slideHTMLFile}.html`);

fs.watch(slideFile, { encoding: 'utf-8' }, (eventType) => {
if (eventType !== 'change') return;

const slide = fs.readFileSync(slideFile, 'utf-8');
const slides = slide.split('-----');
var html = ``;

slides.forEach((page, index) => {
        var scriptRegex = /<\/script.*?>.*?(<\/script.*?>)?/gi;
        var numberOfLines = 0;
        var div = `<div id="${index}">`;
        var line = page.split('\n');
        line.forEach((text) => {
            var value = text.split(" ");
            console.log(value.join(" "), scriptRegex.test(value.join(" ")))
            if(scriptRegex.test(value.join(" "))) value = [];
            if(types[value[0]]){
                var type = types[value[0]];
                value.shift();
                div += `${type.replace('{value}', value.join(" "))}\n`;
                numberOfLines += 2;
            }else {
               if(value.join(" ")) div += `<p>${value.join(" ")}</p>\n`;
               numberOfLines++;
            }
            if(numberOfLines > 20) throw Error(`CSlide: [Error] Slide ${index + 1} is full, please reduce the amount of elements.`)
        });
        div += `</div>`;
        html += `${div}`;
})

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
html = DOMPurify.sanitize(html);
const finalHTML = `<link rel="stylesheet" href="styles.css"><body><div class="container" id="slide">${html}</div></body><script src="script.js"></script>`


fs.writeFileSync(`./${slideHTMLFile}.html`, finalHTML); 
console.log(`CSlide: [Merged] (${slideFile}) => ./slide.html`)
})
