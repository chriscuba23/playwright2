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


    // flights.forEach(flight => {
    //   expect(flight).toHaveProperty('bounds[0].segments');
    //   let segments = flight.bounds[0].segments;
    //   console.log(segments)
    //   let filteredSegments = segments.filter((segment) => segment.__typename === 'TripSegment')
    //   expect(filteredSegments).not.toBe.undefined;
    //   expect(filteredSegments.length).toBeLessThan(3)
    //   expect(filteredSegments.length).toBeGreaterThan(0)
    // });

    // this is a commit test

    // this is another commit 

    // this is another other commit

       // this is the newest commit
