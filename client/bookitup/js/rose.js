'use strict';

class Rose {

    constructor(_data, _ref) {
        this.data = _data.splice(0, 100);
        this.parent = _ref;

        this.initVis()
    }

    initVis() {
        // Get this vis
        const vis = this;

        // Config
        vis.w = 375;
        vis.h = 375;

        // Get container and config
        vis.svg = d3.select(`#${vis.parent}`)
            .append('svg')
            .attr('width', vis.w)
            .attr('height', vis.h);

        // Config g
        vis.gMargin = {top: 0, right: 0, bottom: 0, left: 0};
        vis.gW = vis.w - (vis.gMargin.right + vis.gMargin.left);
        vis.gH = vis.h - (vis.gMargin.top + vis.gMargin.bottom);

        // Build g
        vis.g = vis.svg.append('g')
            .style('transform', `translate(${vis.gMargin.left}px ${vis.gMargin.right}px`);

        // Config radialG
        vis.innerRadius = Math.round(vis.gW / 2 * 0.3);
        vis.outerRadius = Math.round(vis.gW / 2 * 0.6);

        // Build controlG
        vis.controlG = vis.g.append('g')
            .attr('class', 'controlG')
            .style('transform', `translate(${vis.gW / 2}px, ${vis.gH / 2}px)`);

        // Add handle
        vis.handleG = vis.controlG.append('g')
            .attr('class', 'controlG');
        vis.handleG.append('circle')
            .attr('class', 'handleCirc')
            .attr('r', `${vis.gW / 2 * 0.85}`);
        vis.handleHandle();

        // Build radialG
        vis.radialG = vis.g.append('g')
            .attr('class', 'radialG')
            .style('transform', `translate(${vis.gW / 2}px, ${vis.gH / 2}px)`);

        // Append rLabelG
        vis.rLabelG = vis.radialG.append('g')
            .attr('class', 'rLabelG');

        // Append circ
        /*vis.rLabelG.append('circle')
            .attr('class', 'rLabelCirc')
            .attr('r', vis.innerRadius);*/

        // Init xScale
        vis.xScale = d3.scaleLinear()
            .range([0, (2 * Math.PI)]);

        // Init yScale (rating)
        vis.yScale = d3.scaleLinear()
            .domain([0, 5])
            .range([vis.innerRadius, vis.outerRadius]);

        // Define arcMaker
        vis.arcMaker = d3.arc()
                .innerRadius(vis.innerRadius)
                .padAngle(0.01);


        // Init
        vis.sort = 'abc';

        // :^)
        vis.wrangleData();
    }

    wrangleData() {
        // Get this vis
        const vis = this;

        // Sort
        if (vis.sort === 'abc') {
            vis.data.sort((a, b) => {
                if (a.hasOwnProperty('author') && b.hasOwnProperty('author')) {
                    const b_last = b.author.split(' ')[b.author.split(' ').length - 1];
                    const a_last = a.author.split(' ')[a.author.split(' ').length - 1];
                    if (a_last > b_last) {
                        return 1;
                    }
                    if (b_last > a_last) {
                        return -1;
                    }
                    return 0;
                }
            });
        } else {
            vis.data.sort((a, b) => {
                if (a.hasOwnProperty('ave_rating') && b.hasOwnProperty('ave_rating')) {
                    return +b.ave_rating - +a.ave_rating;
                }
            });
        }

        // Update scales
        vis.xScale.domain([0, vis.data.length]);

        // :^)
        vis.updateVis();

    }

    updateVis() {
        // Get this vis
        const vis = this;

        // Add arcs
        vis.radialG.selectAll('.arcG')
            .data(vis.data, d => d.id)
            .join(
                // ENTER
                enter => enter
                    .append('g')
                    .attr('class', 'arcG')
                    .each(function(d, i) {
                        // Define this
                        const arcG = d3.select(this);
                        // Update arcMaker
                        vis.arcMaker
                            .outerRadius(vis.yScale(d.ave_rating))
                            .startAngle(vis.xScale(i))
                            .endAngle(vis.xScale(i + 1));
                        // Append arc
                        arcG.append('path')
                            .attr('class', 'arc')
                            .attr('d', vis.arcMaker);
                    }),
                update => update
                    .each(function(d, i) {
                        // Define this
                        const arcG = d3.select(this);
                        // Update arcMaker
                        if (d.hasOwnProperty('ave_rating')) {
                            vis.arcMaker
                                .outerRadius(vis.yScale(d.ave_rating))
                                .startAngle(vis.xScale(i))
                                .endAngle(vis.xScale(i + 1));
                            // Append arc
                            arcG.select('.arc')
                                .transition()
                                .attr('d', vis.arcMaker);
                        }
                    }),
                exit => exit.remove()
            )

    }

    handleHandle() {
        // Get this vis
        const vis = this;

        // Handle Listeners
        vis.handleG.on('mouseover', hover);

        function hover() {
        }

    }

    sortIt(by) {
        // Get this vis
        const vis = this;

        // Update sort
        vis.sort = by;

        // Wrangle
        vis.wrangleData();
    }


}