var employees =[];
var counter = 0;
var classCounter = 0;
var totalMonthlyCost = 0;


$(document).ready(function(){
  initialAppend();
  $('#employeeInfo').on('submit', submitButtonClicked);
  $('#employeeData').on('click', '.deactivateEmployee', hideEmp);
  $('#employeeData').on('click', '.activateEmployee', activateEmp);
});

function submitButtonClicked(event){
  //prevent default from happening
    event.preventDefault();
    var formValues ={};

    //cycle through each field and collect value to store in object
    $.each($("#employeeInfo").serializeArray(), function(i, field) {
        formValues[field.name] = field.value;
        //serializeArray will create an object for each field setting the name property from the html as the key and value property as the value of the field when submitted
        //the function(i field) will go through $.each and set the formValues[field.name] equal to the value
        //this creates a new object and stored in each position of the array with the above properties and values
    });
    employees.push(formValues);
    console.log("Values Being sent to the server: ", formValues);
    $.ajax({
      type: 'POST',
      data: formValues,
      url: '/addEmployee'
    });
    $('#employeeInfo').find('input[type=text]').val("");
    $('#employeeInfo').find('input[type=number]').val("");

    calculateMonthly();
    appendEmpInfo();
    counter++;//increase employee counter to be used as a reference to append just the next employee
    console.log(employees);
}

//calculate montly cost by cycling through employees array and adding that to a global variable
function calculateMonthly(){
  for (var i = 0; i < employees.length; i++) { //creates a reference for each person in the array
    var employee = employees[i];
  }
    totalMonthlyCost += Math.round(parseInt(employee.yearlysalary)/12);
    //console.log(totalMonthlyCost);
  $('#monthlysalarycost').text(totalMonthlyCost);//set HTML text to montly cost when employee is add

}

function appendEmpInfo(){
    counter = employees.length - 1;
    var employee = employees[counter];
    var salary = employee.yearlysalary;//grabs the employees Salary
    //create a new row for the table and set the data-salary attribute for the delete button at the end of the column to zero for reference later
    var $row = '<tr class="employeeRow"><td>' + employee.firstname + '</td><td>'+ employee.lastname + '</td><td>' + employee.employeenumber + '</td><td>' + employee.jobtitle + '</td><td class="salaryColumn">' + employee.yearlysalary + '</td><td class="buttonColumn"><button class="deactivateEmployee" data-salary="' + salary + '">DeActivate</button></td></tr>';
    $('#employeeData').append($row);//append new row
    $('.salaryColumn').data('salary', salary); //sets the data-salary attribute to the value of the employees salary
}

function hideEmp(){
  var removeSalary = $(this).data('salary'); //Grabs the data-salary attribute and divideds by 12 for the montly salary to be removed
  console.log("Salary removed: ",removeSalary);
  $(this).closest('.employeeRow').addClass('fade');//grabs the closest class of employeeRow and removes that row
  $(this).closest('.buttonColumn').append('<button class="activateEmployee" data-salary="' + removeSalary + '">Activate</button>');

  $(this).remove();
  totalMonthlyCost -= (removeSalary/12);//subtracts removes Salary from totalMontlyCost
  $('#monthlysalarycost').text(totalMonthlyCost); //sets HTML text when employee is deleted


}

function activateEmp(){
  var addSalary = $(this).data('salary');
  $(this).closest('.employeeRow').removeClass('fade');
  $(this).closest('.buttonColumn').append('<button class="deactivateEmployee" data-salary="' + addSalary + '">Deactivate</button>');
  console.log("Salary Added: ",addSalary);
  $(this).remove();

  totalMonthlyCost += (addSalary/12);
  $('#monthlysalarycost').text(totalMonthlyCost);
}

function initialAppend(){
  $.ajax({
    type: 'GET',
    url: '/getEmployees',
    success: grabEmployees
  });
}

function grabEmployees(employee){
  console.log("The response from the server on initial load is: ", employee);
  employee.forEach(function(employee){
    employees.push(employee);
    var salary = employee.yearly_salary;//grabs the employees Salary
    console.log("Employee Id is",employee.id);
    //create a new row for the table and set the data-salary attribute for the delete button at the end of the column to zero for reference later
    var $row = '<tr class="employeeRow"><td>' + employee.last_name + '</td><td>'+ employee.first_name + '</td><td>' + employee.employee_number + '</td><td>' + employee.job_title + '</td><td class="salaryColumn">' + employee.yearly_salary + '</td><td class="buttonColumn"><button class="deactivateEmployee" data-salary="' + salary + '">DeActivate</button></td></tr>';
    $('#employeeData').append($row);//append new row
    $('.salaryColumn').data('salary', salary);

    totalMonthlyCost += Math.round(parseInt(salary)/12);
    console.log("The total monthly cost is",totalMonthlyCost);
    $('#monthlysalarycost').text(totalMonthlyCost);//set HTML text to montly cost when employee is add
  });
}
