import fetch from 'node-fetch';
import {load} from 'cheerio';

const url = "https://www.walmart.com/search?q=chicken&typeahead=chicke";

const response = await fetch(url);
const body = await response.text(); 

let $ = load(body);

let title = $('title');
console.log("hei");
console.log(title.text());