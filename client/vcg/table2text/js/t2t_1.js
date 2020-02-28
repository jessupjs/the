'use strict';

/* `````````````````````````````````\```````````````````````\
    Class: T2t_1                   |                       |
 ``````````````````````````````````/``````````````````````*/
class T2t_1 {

    /*
    Constructor
    */
    constructor(_data1, _data2, _parent) {
        // Fields
        this.data = _data1;
        this.metadata = _data2;
        this.parent = _parent;

        // dataPrep to clean
        this.dataPrep().then(() => {

            // Initialize
            this.initVis();
        }).catch(err => console.error(err));
    }

    /*
    initVis
    */
    async dataPrep() {
        // Define this vis
        const vis = this;

        // Objects from array (states)
        const mod_states = [];
        vis.data.states.forEach(d => mod_states.push({id: `${d}`}));
        vis.data.states = mod_states;
        // Objects from 2d array (edges) - [source_fst_state, destination_fst_state, label (z), weight (-log prob)]
        const mod_edges = [];
        vis.data.edges.forEach(d => {
            mod_edges.push({
                source: `${d[0]}`,
                target: `${d[1]}`,
                label: d[2],
                weight: d[3],
            });
        });
        vis.data.edges = mod_edges;
    }

    /*
    initVis
    */
    initVis() {
        // Define this vis
        const vis = this;

        // Config svg
        vis.w = 1200;
        vis.h = 600;

        // Append svg
        vis.svg = d3.select(`#${vis.parent}`)
            .append('svg')
            .attr('width', vis.w)
            .attr('height', vis.h);

        // Config g (container)
        vis.gMargin = {top: 0, right: 50, bottom: 0, left: 50};
        vis.gW = vis.w - (vis.gMargin.left + vis.gMargin.right);
        vis.gH = vis.h - (vis.gMargin.top + vis.gMargin.bottom);

        // Append g (container)
        vis.g = vis.svg.append('g')
            .attr('id', `container${vis.parent.substring(vis.parent.length - 1)}`)
            .attr('width', vis.gW)
            .attr('height', vis.gH)
            .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);

        // Append linksG (back)
        vis.linksG = vis.g.append('g')
            .attr('id', 'linksG')
            .style('transform', `translate(${vis.gW / 2}px, ${vis.gH / 2}px)`);

        // Append nodesG (front)
        vis.nodesG = vis.g.append('g')
            .attr('id', 'nodesG')
            .style('transform', `translate(${vis.gW / 2}px, ${vis.gH / 2}px)`);

        // Config
        vis.radius = vis.gH / 2 * 0.9;

        // Config coordScale
        vis.coordScale = d3.scaleLinear()
            .range([Math.PI, -Math.PI]);

        // Define colorScale
        vis.colorScale = d3.scaleLinear()
            .range(['rgb(255,231,222)', 'rgb(255,110,4)']);

        // Define strokeScale
        vis.strokeScale = d3.scaleLinear()
            .range([0.2, 1]);

        // Config linkLine
        vis.linkLine = d3.line().curve(d3.curveCardinal.tension(-0.5));

        // Get displayData copy
        vis.displayData_nodes = JSON.parse(JSON.stringify(vis.data.states));
        vis.displayData_links = JSON.parse(JSON.stringify(vis.data.edges));
        console.log('////////////// DISPLAY DATA :: nodes')
        console.log(vis.displayData_nodes)
        console.log('////////////// DISPLAY DATA :: links')
        console.log(vis.displayData_links)

        // Wrangle
        vis.wrangleData();
    }

    /*
    wrangleData
     */
    wrangleData() {
        // Define this vis
        const vis = this;

        // Get counts
        vis.nodeCount_source = d3.nest()
            .key(d => d.source)
            .rollup(v => v.length)
            .entries(vis.displayData_links);
        vis.nodeCount_source.sort((a, b) => a.key - b.key);
        vis.nodeCount_target = d3.nest()
            .key(d => d.target)
            .rollup(v => v.length)
            .entries(vis.displayData_links);
        vis.nodeCount_target.sort((a, b) => a.key - b.key);

        // Add counts to node data
        vis.displayData_nodes.forEach(d => {
            const source = vis.nodeCount_source.find(s => s.key === d.id);
            const target = vis.nodeCount_target.find(s => s.key === d.id);
            const sourceCt = source ? source.value : 0;
            const targetCt = target ? target.value : 0;
            d.tot_occurrences = sourceCt + targetCt;
        });

        // Const forward and backward links
        let forwards = 0;
        let backwards = 0;
        let selfs = 0;
        vis.displayData_links.forEach(d => {
            if (+d.source > +d.target) {
                forwards++;
            } else if (+d.source < +d.target) {
                backwards++;
            } else {
                selfs++;
            }
        });

        console.log('////////////// COUNTS');
        console.log('Forward links: ' + forwards);
        console.log('Backward links: ' + backwards);
        console.log('Looping (self) links: ' + selfs);



        // Update color and stroke scales
        vis.colorScale.domain(d3.extent(vis.displayData_nodes, d => d.tot_occurrences));
        vis.colorScale.domain(d3.extent(vis.displayData_links, d => d.weight));

        // Update
        vis.updateVis();
    }

    /*
    updateVis
     */
    updateVis() {
        // Define this vis
        const vis = this;

        // Update scale
        vis.coordScale.domain([0, vis.displayData_nodes.length]);

        // Append nodes
        vis.nodesG.selectAll('.node')
            .data(vis.displayData_nodes, d => d.name)
            .join(
                // ENTER
                enter => enter
                    .append('g')
                    .attr('class', 'node')
                    .each(function (d, i) {
                        // Define this
                        const node = d3.select(this);
                        // Get coords
                        d.x = vis.radius * Math.sin(vis.coordScale(d.id));
                        d.y = vis.radius * Math.cos(vis.coordScale(d.id));
                        // Position g
                        node.style('transform', `translate(${d.x}px, ${d.y}px)`);
                        // Add event
                        node.on('click', e => {
                            vis.nodeClick(e);
                        });
                        /*// Append circle
                        node.append('circle')
                            .attr('class', 'nodeCirc1')
                            .attr('r', '15px');
                        // Append circle
                        node.append('circle')
                            .attr('class', 'nodeCircHL')
                            .attr('r', '12px');*/
                        // Append circle
                        node.append('circle')
                            .attr('class', 'nodeCirc2')
                            .attr('r', '9px')
                            .attr('fill', vis.colorScale(d.tot_occurrences));
                        // Append circle
                        node.append('text')
                            .text(d.id)
                            .attr('class', 'nodeText');
                    }),
            );

        // Append links
        vis.linksG.selectAll('.link')
            .data(vis.displayData_links)
            .join(
                // ENTER
                enter => enter
                    .append('path')
                    .attr('class', 'link')
                    .each(function (d, i) {
                        // Define this
                        const node = d3.select(this);
                        // Get linkCoords
                        const linkCoords = vis.getLinkCoords(d);
                        // Draw
                        node.attr('d', vis.linkLine(linkCoords))
                            .attr('stroke-width', vis.strokeScale(d.weight));
                    }),
            );

    }

    /*
    getLinkCoords
     */
    getLinkCoords(d) {
        // Define this vis
        const vis = this;

        // Lookup source/target x/y values
        const sourceRef = vis.displayData_nodes.find(n => n.id === d.source);
        const targetRef = vis.displayData_nodes.find(n => n.id === d.target);
        const middleRef1 = {
            x: targetRef.x + (sourceRef.x - targetRef.x) / 3,
            y: sourceRef.y + (targetRef.y - sourceRef.y) / 3,
        };
        const middleRef2 = {
            x: sourceRef.x + (targetRef.x - sourceRef.x) / 3,
            y: targetRef.y + (sourceRef.y - targetRef.y) / 3,
        };
        const middleRef = (middleRef1.x < middleRef2.x) ? middleRef1 : middleRef2;

        return [
            [sourceRef.x, sourceRef.y], [middleRef.x, middleRef.y], [targetRef.x, targetRef.y]
        ];
    }

}