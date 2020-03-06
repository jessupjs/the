'use strict';

// radials
let orderedRadialZonaK;
let radialZonaK;
let roseZonaK;

let _hierarchy;

// Load shared general data
d3.json('data/genre_hierarchy.json').then(d => {

    // Put up for global access
    _hierarchy = d;
    console.log('////////////////////////// GENRE HIERARCHY');
    console.log(_hierarchy);

    // Test 3B : custom - Zona Kostic
    d3.json(`data/scrapy-ZonaKostic.json`).then(d => {
        const data1 = d;
        const data2 = JSON.parse(JSON.stringify(d));
        orderedRadialZonaK = new OrderedRadial(data1, 'orderedRadialZonaK');
        radialZonaK = new Radial(data1, 'radialZonaK');
        roseZonaK = new Rose(data2, 'roseZonaK');
    }).catch(err => console.log(err));

}).catch(err => console.log(err));

/*
 sortIt
 */
function sortIt(passthru) {
    radial1.sortIt(passthru.value);
    rose1.sortIt(passthru.value);
}