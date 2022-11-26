const fs=require("fs");
const http=require("http");
const homeFile=fs.readFileSync("home1.html","utf-8");
var requests = require('requests');
const replaceVal=(tempVal,orgVal) =>
{
    let temperature=tempVal.replace("{%tempval%}",Math.round(orgVal.main.temp-273));
    temperature=temperature.replace("{%tempmin%}",Math.round(orgVal.main.temp_min-273));
    temperature=temperature.replace("{%tempmax%}",Math.round(orgVal.main.temp_max-273));
    temperature=temperature.replace("{%location%}",orgVal.name);
    temperature=temperature.replace("{%country%}",orgVal.sys.country);
    temperature=temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
    return temperature;

}
const server=http.createServer((req,res)=>
{
    if(req.url=="/")
    {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Varanasi,IN&appid=1378804aeafe0b631a88802bfd8d17d6")
.on('data',(chunk) => {
    const objData=JSON.parse(chunk);
    const arrData=[objData];
  console.log(objData);
  const realTimeData=arrData.map(val => replaceVal(homeFile,val)).join("");
  res.write(realTimeData);
})
.on('end',(err) =>{
  if (err) return console.log('connection closed due to errors', err);
 res.end();
  console.log('end');
});
    }
});
server.listen(8009,"127.0.0.1");
