var express = require('express');
var router = express.Router();

var path = require('path');
var pg = require('pg');
var connectionString;


//check first if Heroku database exists if not connect to localhost
if(process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE-URL;
} else{
  connectionString = 'postgress://localhost:5432/employee';
}

router.post("/addEmployee", function(req, res){
//abstract out information to post to the database
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  var jobTitle = req.body.jobtitle;
  var yearlySalary = req.body.yearlysalary;
  var employeeNum = req.body.employeenumber;
  //make connection to the database
  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;
    }
    var query = client.query('INSERT INTO employee_info (last_name, first_name, employee_number, job_title, yearly_salary) VALUES ($1,$2,$3,$4,$5);',[lastName, firstName, employeeNum, jobTitle, yearlySalary]);

    query.on('end', function(){
      res.status(200).send("Succesfully inserted new row into database");
      done();
    });

    query.on('error', function(error){
      console.log('error inserting person into db:', error);
      res.status(500).send(error);
      done();
    });
  });

}); //end of router.post /addEmployee

//Start of router.get /getEmployees path. Grabs info from the database and returns it to be appended to the DOM
router.get("/getEmployees", function(req, res){
  var results = [];

  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log("error connecting to DB:", err);
      res.status(500).send(err);
      done();
      return;
    }
    var query = client.query('SELECT * FROM employee_info;');

    query.on('row', function(row){
      console.log("we got a row",row);
      results.push(row);
    });

    query.on('end', function(){
      res.send(results);
      done();
    });

    query.on('error', function(error){
      res.status(500).send(err);
      done();
      return;
    });

  });
});

router.get("/*", function(req, res){
  var file = req.params[0] || 'views/index.html';
  res.sendFile(path.join(__dirname, '../public' ,file));
});

module.exports = router;
