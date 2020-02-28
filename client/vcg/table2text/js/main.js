'use strict';

/* `````````````````````````````````\```````````````````````\
    Class: T2T1                     |                       |
 ``````````````````````````````````/``````````````````````*/

// Json refs
const jsons = ['data/e2e_fst.json', 'data/e2e_z_align.json'];

// Load data
const promises = [];
jsons.forEach(url => {
    promises.push(d3.json(url));
});
Promise.all(promises).then(d => {

    // Instantiate
    const t2t_1 = new T2t_1(d[0], d[1], 'container1')

}).catch(err => console.error(err));