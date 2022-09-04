import 'dotenv/config';
import fetch from 'node-fetch';
import express, { query } from 'express';
import {load} from 'cheerio';
import cors from 'cors';
import * as puppeteer from 'puppeteer';
import https from 'https';
import fs from 'fs';


const main_point = https;

const app = express();



const main = async function(url) {

    let sum = 0;
    let prices_list = [];
    const broswer = await puppeteer.launch({headless: true,
    args: ["--window-size=1920,1080"]});  

    
    const page = await broswer.newPage();

    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
    });

    page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36");
  
    console.log(await page.evaluate(() => navigator.userAgent));
   
    

    await page.goto(url);

    await page.waitForSelector('body');
      
    
    await page.click('body');


    

    const body = await page.content(); 
 



    let $ = load(body);

    
    
   

    $('span').each((_, e) => {
        let row  = $(e).text().replace(/(\s+)/g, ' ');
        if(row.includes("current price")) {
            let price = row.trim().substring(row.indexOf("$") + 1);
            prices_list.push(parseFloat(price));}
    });
   

    await broswer.close();
    
    
    console.log('test');

     sum = prices_list.reduce((sum, value) => {
        return sum + value;
    }, 0);

    
    


    return +(sum/prices_list.length.toFixed(2));
}



app.use(cors());

app.get('/getprice/:meal/', async (req, res) => {
  
    console.log("inside getprice");
    const queries = req.params["meal"];
    

    let prices = 0;
    let search = queries.split(',');
    console.log(search);
    for(let query of search) {
        const url = "https://www.walmart.com/search?q=" + query;
        const result = await main(url);
        prices += result;
    }

    

    prices = +(prices.toFixed(2));   
    console.log(prices);

    res.send({price:prices});

   
});

const httpServer = https.createServer({
    key: fs.readFileSync('C:/Users/xela2/Desktop/cook-or-book/cook-or-book/localhost-key.pem'),
    cert: fs.readFileSync('C:/Users/xela2/Desktop/cook-or-book/cook-or-book/localhost.pem'),
  }, app);


  httpServer.listen(process.env.port, () => {
    console.log(`HTTP Server running on port ${process.env.port}`);
}); 