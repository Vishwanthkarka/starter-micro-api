const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express")
const app = express();
const request = require("request-promise");
require('dotenv').config()
const ck = process.env.ck;
const cs = process.env.cs;


const Main = async (page) => {
  try {
    

    
    const allUdemyCourses = await axios.get(`${process.env.mainweb}?page=${page}%20&per_page=30&free=0`).then( async responce => {return await responce.data.results}).catch(err=>console.log(err))
    allUdemyCourses.map(async (course) => {
       let uploadedDate = new Date( course.date)
       let saleStartedDate = new Date(course.sale_start)
       let todaysDate = new Date()
       console.log(todaysDate.getUTCHours()-1  ||   todaysDate.getUTCHours()-1  )
       //console.log((uploadedDate.getMonth() == todaysDate.getUTCMonth() && uploadedDate.getFullYear() ==  todaysDate.getUTCFullYear() && uploadedDate.getDate() == todaysDate.getUTCDate() && (todaysDate.getUTCHours()-1<= uploadedDate.getHours?true:false))||  ( saleStartedDate.getMonth() == todaysDate.getUTCMonth() && saleStartedDate.getFullYear() ==  todaysDate.getUTCFullYear() && saleStartedDate.getDate() == todaysDate.getUTCDate() && (todaysDate.getUTCHours()-1<= saleStartedDate.getHours?true:false)))
      if (
    course.sale_price == 0 &&
    course.isexpired == "Available" &&
    course.store == "Udemy" &&
   // (uploadedDate.getMonth()== todaysDate.getUTCMonth() ||  saleStartedDate.getMonth() == todaysDate.getUTCMonth()) && (uploadedDate.getUTCFullYear()== todaysDate.getUTCFullYear()  ||  saleStartedDate.getUTCFullYear() == todaysDate.getUTCFullYear() )
    
    (( uploadedDate.getMonth() == todaysDate.getUTCMonth() && uploadedDate.getFullYear() ==  todaysDate.getUTCFullYear() && uploadedDate.getDate() == todaysDate.getUTCDate() && (todaysDate.getUTCHours()-1<= uploadedDate.getHours()?true:false))||  ( saleStartedDate.getMonth() == todaysDate.getUTCMonth() && saleStartedDate.getFullYear() ==  todaysDate.getUTCFullYear() && saleStartedDate.getDate() == todaysDate.getUTCDate() && (todaysDate.getUTCHours()-1<= saleStartedDate.getHours()?true:false)))
    ) {
        const {
          image,
          language,
          name,
          shoer_description,
          rating,
          price,
          sale_end,
          sale_start,
          subcatslug,
          catslug,
          lectures,
          url,
          store,
        } = course;
        
        const suk = image.split("/750x422/")[1].split("_")[0];
        const udemyCourseLink =
          "https://www.udemy.com/course" + url.split("udemy.com/course")[1];
          console.log(udemyCourseLink)
        const couponCode =
          udemyCourseLink.split("couponCode=")[1] == !undefined
            ? courseLink.split("couponCode=")[1]
            : "No Coupon code needed";
                
      const requestcourses  = async () => { 
        let resForID = await axios
          .get(
            `${process.env.secoundwebsite}wc-api/v3/products/?filter[sku]=${suk}&consumer_key=${ck}&consumer_secret=${cs}`,
          )
          .then(  async (response)  => {
          
 return await response.data.products[0];
          })
          .catch((error) => {
            console.log("&&&&&&&&&*************************$$$$$$$$$$$$$$$$$$$$$$$$$")
            console.error(error);
           
           
          })
        
        if (resForID == undefined) {
console.log("course id not exited"+resForID)
console.log()


await axios
.post(
  `${process.env.secoundwebsite}wp-json/wc/v3/products?consumer_key=${ck}&consumer_secret=${cs}`,
  {
    "name": "."+name,
    "sale_price":"0.0",
    "price":price,
    "regular_price":price,
    "sku":suk,
    "date_created_gmt": dateInGMT(new Date()),
    "date_on_sale_from_gmt": dateInGMT(new Date()),
        "images":[
          {
             "src":image ,
             "alt":"udemy course "+name,
             "name": name
          }
      ],
    "date_on_sale_to_gmt":dateInGMT(sale_end)
       ,
        "short_description":`<div class ="short_disc"> <b>⏱ Duration</b> ${lectures} hours\r\n
         <b>❤ Rating:</b>  ${rating.slice(0,4).replace("0E-","0.")} out of 5.0  \r\n
        <b>📢 language:</b>${language}\r\n
        <b>🎯 Platform:</b> <a href="https://stilldiscount.com/product-tag/udemy/">udemy</a></div>`,
       
        "description": `  <div class="before-button"></div>
        <div class= "Coupon_section" id = "Coupon_section"><strong>                 🎁 Coupon Code</strong>:<span class ="coupon_color" id = "coupon_color"> <strong>${couponCode}</strong></span></div>
              <div class="center" id="button_enroll"><a href="${udemyCourseLink}" target="_blank" rel="nofollow noopener"><button class="button3" "="">Get Coupon</button></a></div> 
                <div class="realted-courses-section"></div>
      <h1 class="description">📚 Description</h1> <div class ="desc_content"> </div> `
  }
)
.then((response) => console.log(response.data))
.catch((err) => console.log(err));
        }
        else{
            if(resForID.id == undefined){
console.log(resForID)
console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
            }
            else{
            const idOfCourse = resForID.id;
           
      

            console.log("course  exited")
            
            await axios
.post(
  `${process.env.secoundwebsite}wp-json/wc/v3/products/${idOfCourse}?consumer_key=${ck}&consumer_secret=${cs}`,
  {
    "name": "."+name,
    "sale_price":"0.0",
    "price":price,
    "regular_price":price,
    "date_created_gmt": dateInGMT(new Date()),
    "date_on_sale_from_gmt": dateInGMT(new Date()),
        "images":[
          {
             "id":resForID.images[0].id,
             "alt":"udemy course "+name,
             "name": name
          }
      ],
    "date_on_sale_to_gmt":dateInGMT(sale_end)
       ,
        "short_description":`<div class ="short_disc"> <b>⏱ Duration</b> ${lectures} hours\r\n
         <b>❤ Rating:</b>  ${rating.slice(0,4).replace("0E-","0.")} out of 5.0  \r\n
        <b>📢 language:</b>${language}\r\n
        <b>🎯 Platform:</b> <a href="https://stilldiscount.com/product-tag/udemy/">udemy</a></div>`,
       
        "description": `  <div class="before-button"></div>
        <div class= "Coupon_section" id = "Coupon_section"><strong>                 🎁 Coupon Code</strong>:<span class ="coupon_color" id = "coupon_color"> <strong>${couponCode}</strong></span></div>
              <div class="center" id="button_enroll"><a href="${udemyCourseLink}" target="_blank" rel="nofollow noopener"><button class="button3" "="">Get Coupon</button></a></div> 
                <div class="realted-courses-section"></div>
      <h1 class="description">📚 Description</h1> <div class ="desc_content"> </div>  `
}
)
.then(async (response)  => await console.log(response.data.sku))
.catch((err) => { console.log("***&&&^^^^^%%%%%%%%%%%%%$$$##@@@@@@@@@");
 console.log(err)});
 
        }
        
      } }

      requestcourses()
    }
    })

  } catch (err) {
    console.log("*****************" + err + "*********************");
  }
  
};


//  await setTimeout(async function(){ await Main(3) }, 10000);
//  await setTimeout(function(){
//     console.log("delaying-2")

//  }, 500); 


async function aa  (req,res){
await Main(1)
  await Main(2)
  await Main(3)
  res.send("working on it")
}
app.get('/', aa
)

app.listen(process.env.port)

const dateInGMT = (dat) => {
  const date = new Date(dat);
  return (
    date.getUTCFullYear() +
    "-" +
    date.getUTCMonth() +
    1 +
    "-" +
    (date.getUTCDate() < 10 ? "0" + date.getUTCDate() : date.getUTCDate()) +
    "T" +
    (date.getUTCHours() < 10 ? "0" + date.getUTCHours() : date.getUTCHours()) +
    ":" +
    (date.getUTCMinutes() < 10
      ? "0" + date.getUTCMinutes()
      : date.getUTCMinutes()) +
    ":" +
    (date.getUTCSeconds() < 10
      ? "0" + date.getUTCSeconds()
      : date.getUTCSeconds())
  );
};
