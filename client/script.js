var studentArray = [];

$(document).ready(initializeApp);

function initializeApp(){
    $('.btn-success').click(handleAddClicked);
    $('.btn-default').click(handleCancelClick);
    checkAuth();
}

function addClickHandlersToElements(){

}

function checkAuth() {
    if(localStorage.getItem("token")) {
        loadData();
    } else {
        if(window.location.pathname == "/") {
            location.replace("http://localhost:7000/signIn.html");
        }
    }
}

function handleAddClicked(){
    addStudent();
}

function handleCancelClick(){
    clearAddStudentFormInputs()
    // Just reset the value inside the inputs
    //$('tbody>tr')
}

function addStudent(){
    // var newStudent = {};
    // newStudent.name = $('#studentName').val();
    // newStudent.course = $('#course').val();
    // newStudent.grade = parseInt($('#studentGrade').val());
    var studentName = $('#studentName').val();
    var studentCourse = $('#course').val();
    var studentGrade = parseInt($('#studentGrade').val());
    if(studentName ==='' || studentCourse ===''|| parseFloat(studentGrade<=0) || parseFloat(studentCourse> 100) || isNaN(studentGrade)){
        alert("invalid input");
        return;
    }else{
        sendNewStudentData(studentName, studentGrade, studentCourse)
    }
    // studentArray.push(newStudent);
    // console.log(studentArray);
    // updateStudentList(studentArray);
    // clearAddStudentFormInputs();
}

function clearAddStudentFormInputs(){
    console.log('clear add student');
    $('input').val(' ');
}

function renderStudentOnDom(studentObj){
    console.log(studentObj)
    var nameTableData = $('<td>',{
        class: 'col-xs-3 col-sm-3',
        text: studentObj.Name,
        'text-align': 'center'
    });

    var gradeTableData = $('<td>',{
        class: 'col-xs-3 col-sm-3',
        text: studentObj.Grade,
        'text-align': 'center'
    });

    var courseTableData = $('<td>,',{
        class: 'col-xs-3 col-sm-3',
        text: studentObj.Course,
        'text-align': 'center'
    })

    var deleteButton = $('<button>',{
        class: 'btn btn-danger',
        text: 'Delete',
        'text-align': 'center',
        // onclick: "openModal()",
        on: {
            click: handleDeleteClicked
            //click: handleDeleteClicked, deleteStudentData
            //click: deleteStudentData, handleDeleteClicked
        }
    })

    var editButton = $('<button>',{
        class: 'btn btn-warning edit',
        text: 'Edit',
        'text-align': 'center',
        rowNum: studentObj.ID,
        on: {
            click: handleEditClicked
        }
    })

    var buttonTd = $('<td>',{class: 'col-xs-1 col-sm-3'}).append(deleteButton);
    var buttonTd2 = $('<td>',{class: 'col-xs-1 col-sm-3'}).append(editButton);
    var newTableRow = $('<tr>').append(nameTableData, courseTableData, gradeTableData, buttonTd, buttonTd2);
    $('tbody').append(newTableRow);

    function handleDeleteClicked(){
        var studentIndex = studentArray.indexOf(studentObj);
        studentArray.splice(studentIndex, 1);
        newTableRow.remove();
        calculateGradeAverage(studentArray);
        deleteStudentData(studentObj.ID);
    }

    function handleEditClicked(studentObj){
        changeToInputFields(studentObj);
    }
}

function CalleditStudentList(studentObj) {
    debugger;
    const TR = studentObj.target.parentElement.parentElement;
    const name = TR.children[0].childNodes[0].value;
    const course = TR.children[1].childNodes[0].value;
    const grade = TR.children[2].childNodes[0].value;
    const id = TR.children[4].childNodes[0].attributes.rowNum.value;
    editStudentList(name, course, grade, id);
}


function editStudentList(name, course, grade, id){
    debugger;
    $.ajax({
        dataType: 'json',
        method: "POST",
        url: "/api/UpdateStudent",
        data: {
            name,
            course,
            grade,
            id
        }
    }).then((reponse) => {
        if(reponse.success) {
            loadData();
        } else {
            //handle failed query here
        }

    })
}

function validation(){
    const tests = [
        {
            element: "input[name=email]",
            pattern: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
            message: 'must be a valid email address'
        },

        {
            element: "input[name=password]",
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/,
            message: 'Must have one at least eight characters, one capital and a number'
        },
    ];

    if( tests.length === tests.filter( validateInputAndDisplayError).length){
        console.log("it worked!");
        logUserIn();
    }
}

function validateInputAndDisplayError( incomingTests ){
    const element = incomingTests.element, pattern = incomingTests.pattern, errorMessage = incomingTests.message;
    const value = $( element ).val();
    const result = pattern.test( value );
    if( !result ){
        $( element ).next().text( errorMessage ).css("color", "red");
    } else {
        $( element ).next().text('');
    }
    return result;
}

function logUserIn() {
    debugger;
    const Email = $('input[name=email]').val();
    const Password = $('input[name=password]').val();
    $.ajax({
        method: "POST",
        url: "/api/LogIn",
        data: {
            Email,
            Password
        }
    }).then((response) => {
        if(response.success) {
            localStorage.setItem("token", response.token);
            location.replace("http://localhost:7000/");
        } else {
            $('.errorMessage').css("display", "block").css("color", "red").text(response.message);
        }
    })
}

function changeToInputFields(studentObj) {
    debugger;
    const TR = studentObj.target.parentElement.parentElement;
    debugger;
    TR.children[0].remove();
    TR.children[1].remove();
    TR.children[0].remove();
    let gradeTD = TR.children[0] = document.createElement("td");
    let courseTD = TR.children[0] = document.createElement("td");
    let nameTD = TR.children[0] = document.createElement("td");
    let inputTag1 = document.createElement("input");
    let inputTag2 = document.createElement("input");
    let inputTag3 = document.createElement("input");
    inputTag1.classList.add("col-xs-12");
    inputTag2.classList.add("col-xs-12");
    inputTag3.classList.add("col-xs-12");
    gradeTD.append(inputTag1);
    courseTD.append(inputTag2);
    nameTD.append(inputTag3);
    TR.prepend(gradeTD);
    TR.prepend(courseTD);
    TR.prepend(nameTD);
    $(".edit").off("click");
    TR.children[4].childNodes[0].addEventListener("click", CalleditStudentList);
}

function updateStudentList(updatingStudentArray){
    debugger;
    console.log(updatingStudentArray);
    $('tbody>tr').remove();
    for(var studentIndex = 0; studentIndex < updatingStudentArray.length; studentIndex++){
        console.log(updatingStudentArray[studentIndex]);
        renderStudentOnDom(updatingStudentArray[studentIndex]);
    }
    calculateGradeAverage(updatingStudentArray);
}

function calculateGradeAverage(calculateStudentArray){
    var gradeTotal = 0;
    var numberAvg = null;
    console.log(calculateStudentArray);
    for(var student = 0; student < calculateStudentArray.length; student++){
        console.log(calculateStudentArray[student]);
        gradeTotal += parseFloat(calculateStudentArray[student].grade);
        console.log(gradeTotal);
    }

    numberAvg = gradeTotal/calculateStudentArray.length;
    numberAvg.toFixed(2);
    renderGradeAverage(numberAvg);
}

function renderGradeAverage(average){
    if(studentArray.length > 0){
        $('.avgGrade').text(average);
    }else{
        $('.avgGrade').text(0);
    }
}

function handleDeleteButton(){
    $(this).closest('tr').remove();
    console.log(handleDeleteButton);
}

function loadData(){
    debugger;
    var ajaxOptions= {
        dataType: 'json',
        url: '/api/getAllStudents',
        method:'post',
    }
    $.ajax(ajaxOptions).then(function(response){
        console.log(response);
        studentArray = response.data;
        debugger;
        updateStudentList(studentArray)
    });
}

function sendNewStudentData(name, grade, course){
    var ajaxAdd = {
        dataType: 'json',
        url: "/api/addStudent",
        method: 'post',
        data:{ name: name, grade: grade, course: course},
    }



    $.ajax(ajaxAdd).then(function(response){
        var studentObj = {
            name: name,
            course: course,
            grade: grade,
            id: response.data.insertId
        }

        clearAddStudentFormInputs();
        studentArray.push(studentObj);
        updateStudentList(studentObj);
        loadData();
        console.log(response)
    });
}

function deleteStudentData(student_id){
    var ajaxDelete = {
        dataType: 'json',
        url: "/api/deleteStudent",
        method: 'post',
        data: {
            id: student_id
        }
    }

    $.ajax(ajaxDelete).then(function(response){
        console.log('deleted new student to database');
        console.log(response);
    });
}

function validationSignUp(){
    const tests = [
        {
            element: "input[name=emailSignUp]",
            pattern: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
            message: 'must be a valid email address'
        },

        {
            element: "input[name=passwordSignUp]",
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/,
            message: 'Must have one at least eight characters, one capital and a number'
        },
        {
            element: "input[name=passwordConfirm]",
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/,
            message: 'Must have one at least eight characters, one capital, a number and match the password above'
        },
    ];

    if( tests.length === tests.filter( validateInputAndDisplayError).length){
        if(checkPasswords()) {
            console.log("it worked!");
            SignUserIn();
        } else {
            debugger;
            const message = "Both passwords must match!";
            $("input[name=passwordConfirm]").next().text( message ).css("color", "red");
        }

    }
}

function validateInputAndDisplayError( incomingTests ){
    const element = incomingTests.element, pattern = incomingTests.pattern, errorMessage = incomingTests.message;
    const value = $( element ).val();
    const result = pattern.test( value );
    if( !result ){
        $( element ).next().text( errorMessage ).css("color", "red");
    } else {
        $( element ).next().text('');
    }
    return result;
}

function SignUserIn() {
    debugger;
    const Email = $('input[name=emailSignUp]').val();
    const Password = $('input[name=passwordConfirm]').val();
    $.ajax({
        method: "POST",
        url: "/api/SignUp",
        data: {
            Email,
            Password
        }
    }).then((response) => {
        debugger;
        if(response.success) {
            localStorage.setItem("token", response.token);
            location.replace("http://localhost:7000/");
        } else {
            $('.errorMessageSignUp').css("display", "block").css("color", "red").text(response.message);
        }
    })
}

function checkPasswords() {
    const password1 = $('input[name=passwordConfirm]').val();
    const password2 = $('input[name=passwordSignUp]').val();
    if(password1 === password2) {
        return true;
    } else {
        return false;
    }
};

// function openModal(){

//       $('#modal').show()

// }

