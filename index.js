import 'dotenv/config';
import fetch from 'node-fetch';
import express, { query } from 'express';
import {load} from 'cheerio';
import cors from 'cors';
import * as puppeteer from 'puppeteer';



const app = express();




const main = async function(url) {

    const browser = await puppeteer.launch({
        headless: true
    });



    const page = await browser.newPage();

    await page.goto(url);
      
    
    
    await page.click('body');

    const body = await page.content(); 

    let $ = load(body);

    
    let prices_list = []


    $('span').each((_, e) => {
        let row  = $(e).text().replace(/(\s+)/g, ' ');
        if(row.includes("current price")) {
            let price = row.trim().substring(row.indexOf("$") + 1);
            prices_list.push(parseFloat(price));}
    });
   

    setTimeout(() => {
        browser.close();
      }, 7000);
    
    
    


    const sum = prices_list.reduce((sum, value) => {
        return sum + value;
    }, 0);

    console.log(sum);

    console.log(prices_list);

    console.log(sum/prices_list.length);

    return +(sum/prices_list.length.toFixed(2));


 
   
    


}



app.use(cors());

app.get('/getprice/:meal/', async (req, res) => {
  
    const queries = req.params["meal"];
    
    let regex = /".*?"/g;

    let prices = 0;

    let search = queries.match(regex);
    for(let q of search) {
        let query = q.replace(/['"]+/g, '');
        const url = "https://www.walmart.com/search?q=" + query;
        const result = await main(url);
        prices += result;
    }

    

    prices = +(prices.toFixed(2));   
    console.log(prices);

    res.send({price:prices});

   
});

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.port}`),
);