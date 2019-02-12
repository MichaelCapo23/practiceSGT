var studentArray = [];

$(document).ready(initializeApp);

function initializeApp(){
    // $('#modal').hide()
    $('.btn-success').click(handleAddClicked);
    $('.btn-default').click(handleCancelClick);
    //$('.btn-primary').click(loadData)
    loadData();
}

function addClickHandlersToElements(){

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
    })
}

function changeToInputFields(studentObj) {
    debugger;
    const TR = studentObj.target.parentElement.parentElement;
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
    var ajaxOptions= {
        dataType: 'json',
        url: '/api/getAllStudents',
        method:'post',
    }

    $.ajax(ajaxOptions).then(function(response){
        console.log(response);
        studentArray = response.data
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
        console.log('deleted new student to database')
        console.log(response);
    });
}

// function openModal(){

//       $('#modal').show()

// }

