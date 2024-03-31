let flights2 = [2, 2, 3, 7]

flights2.forEach(flight => {

    console.log(flight)
})

let filteredValue = flights2.filter(item => item == 2)



console.log(filteredValue)


let flightDetails = [{
    name: 'flight1',
    country: 'Ireland'
},
{
    name: 'flight2',
    country: 'Ireland'
},
{
    name: 'flight3',
    country: 'Sweden'
}];

let filteredCountry = flightDetails.map(item => item.country).filter(item => item == 'Ireland')
let filteredCountryObj = flightDetails.filter(item => item.country == 'Ireland')

console.log(filteredCountry)
console.log(filteredCountryObj)


