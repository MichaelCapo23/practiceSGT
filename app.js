const express = require('express');

const webserver = express();

const mysql = require('mysql');

const mysql_creds = require('./config/mysql_creds.js');

const db = mysql.createConnection(mysql_creds);

const axios = require('axios');

var cors = require('cors');

const jwt = require('jwt-simple');

const hash = require('./config/token-hash');

const bodyParser = require('body-parser');

webserver.use(express.static(__dirname + '/client'));

webserver.use(express.urlencoded({extended: false}));

webserver.use(bodyParser.json({limit: '25mb'}));

webserver.use(express.json());

webserver.use(cors());

webserver.post('/api/getAllStudents', (request,response)=>{
    db.connect(()=>{
        const getAllStudentsQuery = "SELECT * FROM `Students`";

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
    const id = request.body.id;
    const valuesArray = [name, course, grade, id];
    db.connect(() => {
        const query = "UPDATE `students`" +
                      " SET Name = ?, Course = ?, Grade = ?" +
                      " WHERE ID = ?";
        const UpdateQuery = mysql.format(query, valuesArray);
        console.log(UpdateQuery);
        db.query(UpdateQuery, (err, data) => {
            if(!err) {
                const output = {
                    success: true
                };
                console.log("winning");
                response.send(output)
            } else {
                const output = {
                    success: false
                };
                console.log("losing");
                response.send(output)
            }
        })
    })
})


webserver.post("/api/LogIn", (request, response) => {
    const email = request.body.Email;
    const password = request.body.Password;
    db.connect(() => {
        const query = "SELECT ID FROM `accounts`" +
                      " WHERE Email = ? AND Password = ?";
        const paramsArr = [email, password];
        const SignInQuery = mysql.format(query, paramsArr);
        db.query(SignInQuery, (err, UserId) => {
            if(!err) {
                if(UserId > 1) {
                    const output = {
                        success: false,
                        message: "unable to log you in"
                    }
                    console.log("more than 1 account");
                    response.send(output);
                } else {
                    if(UserId.length > 0) {
                        const token = jwt.encode(email + password, hash);
                        console.log("token: ", token);
                        const output = {
                            success: true,
                            token: token
                        };
                        console.log("succcceeesss");
                        response.send(output)
                    } else {
                        const output = {
                            success: false,
                            message: "Invalid username/password"
                        };
                        console.log("no match");
                        response.send(output);
                    }
                }
            } else {
                const output = {
                    success: false,
                    message: "error logging you in"
                }
                console.log("og err");
                response.send(output);
            }
        })
    })
})




webserver.listen(7000, () => {
    console.log("listening on port 7000");
});

