'use strict';

class OrderedRadial {

    constructor(_data, _ref) {
        this.data = JSON.parse(JSON.stringify(_data));
        this.parent = _ref;
        this.hierarchy = JSON.parse(JSON.stringify(_hierarchy));

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
        vis.innerRadius = Math.round(vis.gW / 2 * 0.45);
        vis.outerRadius = Math.round(vis.gW / 2 * 0.8);

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

        // Build radialG
        vis.radialG = vis.g.append('g')
            .attr('class', 'radialG')
            .style('transform', `translate(${vis.gW / 2}px, ${vis.gH / 2}px)`);

        // Append rLabelG
        vis.rLabelG = vis.radialG.append('g')
            .attr('class', 'rLabelG');

        // Append circ
        vis.rLabelG.append('circle')
            .attr('class', 'rLabelCirc')
            .attr('r', vis.innerRadius);

        vis.rLabelG.append('text')
            .attr('class', 'rLabelText rLabelText1')
            .style('transform', `translate(${-vis.gW / 2 + 10}px, ${-vis.gH / 2 + 20}px)`);

        // Append rAreaG
        vis.rAreaG = vis.radialG.append('g')
            .attr('class', 'rAreaG');

        // Init xScale
        vis.xScale = d3.scaleLinear()
            .range([0, (2 * Math.PI)]);

        // Init yScale
        vis.yScale = d3.scaleLinear()
            .range([vis.innerRadius, vis.outerRadius]);

        // Init areaMaker
        vis.areaMaker = d3.areaRadial()
            .curve(d3.curveCatmullRomClosed)
            .innerRadius(vis.innerRadius)
            .outerRadius(d => vis.yScale(d.value))
            .angle(d => vis.xScale(d.index));

        // Config coordScale
        vis.coordScale = d3.scaleLinear()
            .range([Math.PI, -Math.PI]);

        // Build geoG
        vis.geosG = vis.g.append('g')
            .attr('class', 'geosG')
            .style('transform', `translate(${vis.gW / 2}px, ${vis.gH / 2}px)`);

        // Config
        vis.dotG = 3;

        // Init
        vis.sort = 'abc';

        // :^)
        vis.wrangleData();
    }

    wrangleData() {
        // Get this vis
        const vis = this;

        // Bottle data in genres
        vis.data.forEach(d => {
            let context = '';
            let returnTo = [];
            d.genres.forEach(g => {
                g = g.toLowerCase();
                let found = false;
                findGenre(g, vis.hierarchy);
                if (!found) {
                    returnTo.push(g);
                }
                function findGenre(genre, parent) {
                    parent.children.forEach(c => {
                        if (c.parent === genre) {
                            if (c.parent === 'fiction' || c.parent === 'nonfiction') {
                                context = c.parent;
                            }
                            c.count++;
                            found = true;
                        } else {
                            findGenre(genre, c);
                        }
                    });
                }
            });
            if (context !== '') {
                const startHere = vis.hierarchy.children.find(c => c.parent === context);
                returnTo.forEach(r => {
                    const thenHere = startHere.children.find(c => c.parent === 'other');
                    const orHere = thenHere.children.find(c => c.parent === r);
                    if (orHere) {
                        orHere.count++;
                    } else {
                        thenHere.children.push({parent: r, children: [], count: 1});
                    }
                })
            } else {
                const startHere = vis.hierarchy.children.find(c => c.parent === 'other');
                returnTo.forEach(r => {
                    const orHere = startHere.children.find(c => c.parent === r);
                    if (orHere) {
                        orHere.count++;
                    } else {
                        startHere.children.push({parent: r, children: [], count: 1});
                    }
                });
            }
        });
        console.log(`////////////////////////// ${vis.parent} HIERARCHY`);
        console.log(vis.hierarchy);

        // :^)
        vis.updateVis();

    }

    updateVis() {
        // Get this vis
        const vis = this;

    }


}