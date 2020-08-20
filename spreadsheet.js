const express = require("express");
//const bodyParser = require('body-parser');
const app = express();
// создаем парсер для данных в формате json
const jsonParser = express.json();
//порт
const PORT = process.env.PORT||80;
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
/*app.use(function (req, res, next) {
	console.log(req.body);
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.post('/', function(req, res) {
  console.log(req.body);
  res.jsonp({lolkek:'yougay'});
});
*/
app.get('/', function(req, res) {

	console.log(req.query);
  
	//GOOGLESHEETS
	const GoogleSpreadsheet = require('google-spreadsheet');
	const {promisify} = require('util');
	email='maemail="'+req.query.email+'"';
	console.log(email);
	function PrepareRows(rows){//packs rows to dataProvider to send to site to the chart
		arr=[];
		rows.forEach((row)=>{
			arr.push({
				simplecount:row.simplecount,
				consciouscount:row.consciouscount,
				unconsciouscount:row.unconsciouscount,
				sended:row.sended,
				mentalcondition:row.mentalcondition,
				physicalstate:row.physicalstate,
				location:row.location
			});
		});
		return arr;
	}

	const creds = require('./secret.json');
	async function acessSpreadSheet(){
		const doc = new GoogleSpreadsheet('1OmbdPVOWX6CB1iWM4LVL7gzsvbGC6y9vNjgXns0RBJQ');
		await promisify(doc.useServiceAccountAuth)(creds);
		const info = await promisify(doc.getInfo)();
		const sheet = info.worksheets[0];

		//console.log(`Title: ${sheet.title} , Rows: ${sheet.rowCount}`);
		const rows = await promisify(sheet.getRows)({
			offset: 1,
			limit:200,
			orderby:'sended',
			query:email
		});
		//console.log(rows);
		res.jsonp(PrepareRows(rows));
		
	}

	acessSpreadSheet();
	//ENDGOOGLESHEETS
	
}); 
	

app.listen(PORT,()=>{
	console.log('Server has been started...');
});
