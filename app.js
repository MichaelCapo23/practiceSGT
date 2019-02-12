const express = require('express');

const webserver = express();

const mysql = require('mysql');

const mysql_creds = require('./config/mysql_creds.js')

const db = mysql.createConnection(mysql_creds);

const axios = require('axios');

var cors = require('cors')

const bodyParser = require('body-parser');

webserver.use(express.static(__dirname + '/client'));

webserver.use(express.urlencoded({extended: false}));

webserver.use(bodyParser.json({limit: '25mb'}));

webserver.use(express.json());

webserver.use(cors());

webserver.post('/api/getAllStudents', (request,response)=>{

    db.connect(()=>{

        const getAllStudentsQuery = "SELECT * FROM `Students`"

        db.query(getAllStudentsQuery, (error,data)=>{

            if(!error){

                const output = {

                    'success': true,

                    'data': data

                }

                response.send(output)



            }else{

                const output = {

                    'success': false,

                    'message': 'query failed'

                }

                response.send(output)

            }

        })

    })

});



webserver.post('/api/deleteStudent', (request,response)=>{

    const frontID = request.body.id

    const deleteStudentsQuery = "DELETE FROM `Students` where ID = '"+frontID+"'"

    db.query(deleteStudentsQuery, (error,data)=>{

        if(!error){

            const output = {

                'success': true,

            }

            response.send(output)

        }else{

            const output = {

                'success': false,

                'message': 'query failed'

            }

            response.send(output)

        }

    })

});









webserver.post('/api/addStudent', (request,response)=>{

    const name = request.body.name

    console.log(name)

    const grade = request.body.grade

    const course = request.body.course

    db.connect(()=>{

        const addStudentsQuery = "INSERT INTO `Students` SET `Name` = '"+name+"', Grade = '"+grade+"', Course = '"+course+"'";

        console.log("query: ", addStudentsQuery);

        db.query(addStudentsQuery, (error,data)=>{

            console.log("data", data)

            if(!error){

                const output = {

                    'success': true,

                    'data': data,

                }

                response.send(output)

            } else {

                const output = {

                    'success': "false",

                    'message' : "first query didnt work"

                }

                response.send(output);

            }

        })

    })



});



webserver.post("/api/UpdateStudent", (request, response) => {
    console.log("request.body", request.body);
    const name = request.body.name;
    const course = request.body.course;
    const grade = request.body.grade;
    console.log(name, course, grade);
})





webserver.listen(7000, () => {

    console.log("listening on port 7000");

});

