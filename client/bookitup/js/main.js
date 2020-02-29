'use strict';

// Test 1 : randoms
d3.json(`data/scrapy-randoms_set1_100.json`).then(d => {
    const radial = new Radial(d, 'radial1')
}).catch(err => console.log(err));

// Test 2 : similars
d3.json(`data/scrapy-similars_40961621_100.json`).then(d => {
    const radial = new Radial(d, 'radial2')
}).catch(err => console.log(err));

// Test 3 : similars
d3.json(`data/scrapy-TamaraMunzner.json`).then(d => {
    const radial = new Radial(d, 'radial3')
}).catch(err => console.log(err));