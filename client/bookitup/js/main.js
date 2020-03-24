'use strict';

// radials
let orderedRadialZonaK, orderedRadialJeffB, orderedRadialJaredJ, orderedRadialNingC;
let radialZonaK, radialJeffB, radialJaredJ, radialNingC;
let roseZonaK, roseJeffB, roseJaredJ, roseNingC;

let _hierarchy;

let boxes40180098;
let boxes36047860;

// Load shared general data
d3.json('data/genre_hierarchy.json').then(d => {

    // Put up for global access
    _hierarchy = d;
    //console.log('////////////////////////// GENRE HIERARCHY');
    //console.log(_hierarchy);

    // Test : Zona Kostic
    d3.json(`data/scrapy-ZonaKostic.json`).then(d => {
        const data1 = d;
        const data2 = JSON.parse(JSON.stringify(d));
        orderedRadialZonaK = new OrderedRadial(data1, 'orderedRadialZonaK');
        radialZonaK = new Radial(data1, 'radialZonaK');
        roseZonaK = new Rose(data2, 'roseZonaK');
    }).catch(err => console.log(err));

    // Test : Jeff Baglioni
    d3.json(`data/scrapy-JeffBaglioni.json`).then(d => {
        const data1 = d;
        const data2 = JSON.parse(JSON.stringify(d));
        orderedRadialJeffB = new OrderedRadial(data1, 'orderedRadialJeffB');
        radialJeffB = new Radial(data1, 'radialJeffB');
        roseJeffB = new Rose(data2, 'roseJeffB');
    }).catch(err => console.log(err));

    // Test : Ning Chen
    d3.json(`data/scrapy-NingChen.json`).then(d => {
        const data1 = d;
        const data2 = JSON.parse(JSON.stringify(d));
        orderedRadialNingC = new OrderedRadial(data1, 'orderedRadialNingC');
        radialNingC = new Radial(data1, 'radialNingC');
        roseNingC = new Rose(data2, 'roseNingC');
    }).catch(err => console.log(err));

    // Test : Jared Jessup
    d3.json(`data/scrapy-JaredJessup.json`).then(d => {
        const data1 = d;
        const data2 = JSON.parse(JSON.stringify(d));
        orderedRadialJaredJ = new OrderedRadial(data1, 'orderedRadialJaredJ');
        radialJaredJ = new Radial(data1, 'radialJaredJ');
        roseJaredJ = new Rose(data2, 'roseJaredJ');
    }).catch(err => console.log(err));

}).catch(err => console.log(err));


// Load book data for boxes
d3.json('data/book_40180098.json').then(d => {
    boxes40180098 = new Boxes(d, 'boxes40180098');
}).catch(err => console.log(err));
d3.json('data/book_36047860.json').then(d => {
    boxes36047860 = new Boxes(d, 'boxes36047860');
}).catch(err => console.log(err));

/*
 sortIt
 */
function sortIt(passthru) {
    radialZonaK.sortIt(passthru.value);
    roseZonaK.sortIt(passthru.value);
    radialJeffB.sortIt(passthru.value);
    roseJeffB.sortIt(passthru.value);
    radialNingC.sortIt(passthru.value);
    roseNingC.sortIt(passthru.value);
    radialJaredJ.sortIt(passthru.value);
    roseJaredJ.sortIt(passthru.value);
}