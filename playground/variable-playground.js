var person = {
    name: 'Mickael',
    age: 21
}

function updatePerson (obj) {
    obj.age = 27
}

updatePerson(person)
console.log(person)

// Array

var arr = [21, 22]

function addValue(array, value) {
    //array.push(value)
    array = [12, 15]
}

console.log(arr)
addValue(arr, 12)
console.log(arr)