'use strict';

/* `````````````````````````````````\```````````````````````\
    Class: Nodes1                   |                       |
 ``````````````````````````````````/``````````````````````*/
// Define data1, parent1
const data1 = [
    {col: '1', name: '1a', connectTo: ['2a', '2b']},
    {col: '2', name: '2a', connectTo: ['3a', '3b', '3c']},
    {col: '2', name: '2b', connectTo: ['3d', '3e', '3f', '3g', '3h']},
    {col: '3', name: '3a', connectTo: ['4a']},
    {col: '3', name: '3b', connectTo: ['4b', '4c']},
    {col: '3', name: '3c', connectTo: []},
    {col: '3', name: '3d', connectTo: []},
    {col: '3', name: '3e', connectTo: []},
    {col: '3', name: '3f', connectTo: []},
    {col: '3', name: '3g', connectTo: []},
    {col: '3', name: '3h', connectTo: ['4d', '4e']},
    {col: '4', name: '4a', connectTo: []},
    {col: '4', name: '4b', connectTo: []},
    {col: '4', name: '4c', connectTo: []},
    {col: '4', name: '4d', connectTo: []},
    {col: '4', name: '4e', connectTo: []},
];
const parent1 = 'nodes1';

// Instantiate nodes1
const nodes1 = new Nodes1(data1, parent1);

/* `````````````````````````````````\```````````````````````\
    Class: Nodes2                   |                       |
 ``````````````````````````````````/``````````````````````*/
// Define data2, parent2
const data2 = {
    name: '1a',
    children: [
        {
            name: '2a',
            children: [
                {
                    name: '3a', children: [
                        {name: '4a'}
                    ]
                },
                {
                    name: '3b', children: [
                        {name: '4b'},
                        {name: '4c'},
                    ]
                },
                {name: '3c'},
            ]
        },
        {
            name: '2b',
            children: [
                {name: '3d'},
                {name: '3e'},
                {name: '3f'},
                {name: '3g'},
                {
                    name: '3h', children: [
                        {name: '4d'},
                        {name: '4e'},
                    ]
                },
            ]
        },
    ]
};
const parent2 = 'nodes2';

// Instantiate nodes2
const nodes2 = new Nodes2(data2, parent2);

/* `````````````````````````````````\```````````````````````\
    Class: Nodes3                   |                       |
 ``````````````````````````````````/``````````````````````*/
// Define data3, parent3
const data3_nodes = [
    {name: 'n1', tier: '1'},
    {name: 'n2', tier: '2'},
    {name: 'n3', tier: '2'},
    {name: 'n4', tier: '3'},
    {name: 'n5', tier: '3'},
    {name: 'n6', tier: '3'},
    {name: 'n7', tier: '3'},
];
const data3_links = [
    {source: 'n1', target: 'n2'},
    {source: 'n1', target: 'n3'},
    {source: 'n2', target: 'n4'},
    {source: 'n2', target: 'n5'},
    {source: 'n2', target: 'n6'},
    {source: 'n3', target: 'n6'},
    {source: 'n3', target: 'n7'},
];
const parent3 = 'nodes3';

// Instantiate nodes3
const nodes3 = new Nodes3(data3_nodes, data3_links, parent3);
