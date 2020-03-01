'use strict';

// radials
let radial1, radial2, radial3;

// Test 1 : randoms
d3.json(`data/scrapy-randoms_set1_100.json`).then(d => {
    radial1 = new Radial(d, 'radial1')
}).catch(err => console.log(err));

// Test 2 : similars
d3.json(`data/scrapy-similars_40961621_100.json`).then(d => {
    radial2 = new Radial(d, 'radial2')
}).catch(err => console.log(err));

// Test 3 : similars
d3.json(`data/scrapy-TamaraMunzner.json`).then(d => {
    radial3 = new Radial(d, 'radial3')
}).catch(err => console.log(err));

/*
 sortIt
 */
function sortIt(passthru) {
    radial1.sortIt(passthru.value)
    radial2.sortIt(passthru.value)
    radial3.sortIt(passthru.value)
}