'use strict';

// radials
let radial1, radial2, radial3A, radial3B;
let rose1, rose2, rose3A, rose3B;

// Test 1 : randoms
d3.json(`data/scrapy-randoms_set1_100.json`).then(d => {
    const data1 = d;
    const data2 = JSON.parse(JSON.stringify(d));
    radial1 = new Radial(data1, 'radial1');
    rose1 = new Rose(data2, 'rose1');
}).catch(err => console.log(err));

// Test 2 : similars
d3.json(`data/scrapy-similars_40961621_100.json`).then(d => {
    const data1 = d;
    const data2 = JSON.parse(JSON.stringify(d));
    radial2 = new Radial(data1, 'radial2');
    rose2 = new Rose(data2, 'rose2');
}).catch(err => console.log(err));

// Test 3A : custom - Tamara Munzner
d3.json(`data/scrapy-TamaraMunzner.json`).then(d => {
    const data1 = d;
    const data2 = JSON.parse(JSON.stringify(d));
    radial3A = new Radial(data1, 'radial3A');
    rose3A = new Rose(data2, 'rose3A');
}).catch(err => console.log(err));

// Test 3B : custom - Zona Kostic
d3.json(`data/scrapy-ZonaKostic.json`).then(d => {
    const data1 = d;
    const data2 = JSON.parse(JSON.stringify(d));
    radial3B = new Radial(data1, 'radial3B');
    rose3B = new Rose(data2, 'rose3B');
}).catch(err => console.log(err));

/*
 sortIt
 */
function sortIt(passthru) {
    radial1.sortIt(passthru.value);
    radial2.sortIt(passthru.value);
    radial3A.sortIt(passthru.value);
    radial3B.sortIt(passthru.value);
    rose1.sortIt(passthru.value);
    rose2.sortIt(passthru.value);
    rose3A.sortIt(passthru.value);
    rose3B.sortIt(passthru.value);
}