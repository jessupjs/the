'use strict';

// Init data
let data = {};
let mod3Data = null;

const choroplethJsons = [
    'data/leapmotion/for-radar/faostat_combined_pop.json',//0
    'data/leapmotion/for-radar/faostat_combined_em_agri.json', //1
    'data/leapmotion/for-radar/faostat_combined_value.json', //2
];

const jsons1 = ['world', 'africa', 'africaeastern', 'africamiddle', 'africanorthern', 'africasouthern', 'africawestern', 'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Congo', 'Cote dIvoire', 'Djibouti', 'Egypt', 'Eswatini', 'Ethiopia', 'Ethiopia PDR', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Sierra Leone', 'South Africa', 'Sudan', 'Sudan former', 'Togo', 'Tunisia', 'Uganda', 'United Republic of Tanzania', 'Zambia', 'Zimbabwe'];

const promises = [];
const fbs_promises = [];
let mod3_promises = [];
jsons1.forEach(ref => {
    mod3_promises.push(d3.json(`data/leapmotion/for-radar/fbs/faostat_africa_${ref.split(' ').join('').toLowerCase()}_fbs.json`));
});

Promise.all(mod3_promises).then(d1 => {

    // Init new array
    let d1New = [];

    // MOD3: Reconfigure data (add first array element)
    d1.forEach(d1Old => {
        d1New.push(d1Old[0]);
    });

    // MOD3: Define data in obj
    mod3Data = [{domain: d1New[0].domain, data: d1New}];

    // Clear promises
    mod3_promises = [];

    // MOD2 & MOD3
    choroplethJsons.forEach(url => {
        mod3_promises.push(d3.json(url));
    });
    Promise.all(mod3_promises).then(d2 => {

        // MOD3: Add to data
        // Vis3 only uses the first three data sets. Do not push d2[3] or d2[4] to mod3Data
        d2.forEach((d2Now, i) => {
            mod3Data.push({domain: d2Now[0].domain, data: d2Now})
        });

        // Handle in d3Launchpad
        d3LaunchpadPart2()

    }).catch(err => console.error(err));

}).catch(err => console.error(err));

/* `````````````````````````````````\```````````````````````\
    Function: d3Launchpad part 2    |   RE: VOID            |
 ``````````````````````````````````/``````````````````````*/
function d3LaunchpadPart2() {

    /* Set up Mod 3 */
    const mod3 = new Mod3Main(mod3Data);

}
