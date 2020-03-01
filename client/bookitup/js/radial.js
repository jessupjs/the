'use strict';

class Radial {

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
        vis.h = 315;

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

        // Genre data
        const genre = [];
        vis.data.forEach(d => {
            d.genres.forEach(dd => {
                genre.push({genre: dd})
            })
        });
        vis.genreData = d3.nest()
            .key(d => d.genre).sortKeys(d3.ascending)
            .rollup(v => v.length)
            .entries(genre);

        // Sort
        if (vis.sort === 'abc') {
            vis.genreData.sort((a, b) => b.key - a.key);
        } else {
            vis.genreData.sort((a, b) => b.value - a.value);
        }

        // Update scale (pre)
        vis.coordScale.domain([0, vis.genreData.length]);
        vis.yScale.domain([0, d3.max(vis.genreData, d => d.value)]);

        // Set some new properties
        vis.genreData.forEach((d, i) => {
            d.index = i;
            // Get coords
            d.x = vis.innerRadius * Math.sin(vis.coordScale(i));
            d.y = vis.innerRadius * Math.cos(vis.coordScale(i));
        });

        // Update scales (post)
        vis.xScale.domain([0, d3.max(vis.genreData, d => d.index) + 1]);

        // Filter out entries with no genre and reduce genres to sets
        vis.bookData = vis.data.filter(d => d.hasOwnProperty('genres') && d.genres.length !== 0);
        vis.bookData.forEach(d => {
            if (d.hasOwnProperty('genres')) {
                d.genres = new Set(d.genres);
            }
        });

        // Init geoMaker
        vis.geoMaker = d3.line()
            .curve(d3.curveLinearClosed);

        // :^)
        vis.updateVis();

    }

    updateVis() {
        // Get this vis
        const vis = this;

        // Draw radial area path
        vis.rAreaG.selectAll('.areaPath')
            .data([{area: vis.genreData}])
            .join(
                enter => enter
                    .append('path')
                    .attr('class', 'areaPath')
                    .attr('d', d => vis.areaMaker(d.area)),
                update => update
                    .transition()
                    .attr('d', d => vis.areaMaker(d.area)),
                exit => exit.remove()
            );

        // Update genre count text
        vis.rLabelG.select('.rLabelText1')
            .text(`Books: ${vis.data.length} / Genres: ${vis.genreData.length}`);

        // Draw geos
        vis.geosG.selectAll('.geoG')
            .data(vis.bookData, d => d.key)
            .join(
                // ENTER
                enter => enter
                    .append('g')
                    .attr('class', 'geoG')
                    .each(function (d) {
                        // Get this geoG
                        const geoG = d3.select(this);
                        // Collect genres
                        const genres = [];
                        d.genres.forEach(g => {
                            const currentGenre = vis.genreData.find(cg => {
                                if (cg.hasOwnProperty('key')) {
                                    return cg.key === g;
                                }
                            });
                            genres.push(currentGenre);
                        });
                        // Sort by index
                        genres.sort((a, b) => a.index - b.index);
                        // Add to coords
                        const coords = [];
                        genres.forEach(g => {
                            coords.push([g.x, g.y]);
                        });
                        // Draw path
                        geoG.append('path')
                            .attr('class', 'geoPath')
                            .attr('d', vis.geoMaker(coords));
                        // Draw node circles
                        genres.forEach(g => {
                            geoG.append('circle')
                                .attr('class', 'geoNode')
                                .attr('r', vis.dotG)
                                .attr('cx', g.x)
                                .attr('cy', g.y)
                        });
                        // Get center of polygon
                        const centroid = d3.polygonCentroid(coords);
                        if (centroid[0] && centroid[1]) {
                            // Draw circ
                            geoG.append('circle')
                                .attr('class', 'geoCirc')
                                .attr('r', vis.dotG)
                                .attr('cx', centroid[0])
                                .attr('cy', centroid[1]);
                        } else {
                            // Calc circ ave coords
                            const xAve = coords.map(d => d[0]).reduce((a, c) => a + c) / coords.length;
                            const yAve = coords.map(d => d[1]).reduce((a, c) => a + c) / coords.length;
                            // Draw circ
                            geoG.append('circle')
                                .attr('class', 'geoCirc')
                                .attr('r', vis.dotG)
                                .attr('cx', xAve)
                                .attr('cy', yAve);
                        }

                    }),
                // UPDATE
                update => update
                    .each(function (d) {
                        // Get this geoG
                        const geoG = d3.select(this);
                        // Collect genres
                        const genres = [];
                        d.genres.forEach(g => {
                            const currentGenre = vis.genreData.find(cg => {
                                if (cg.hasOwnProperty('key')) {
                                    return cg.key === g;
                                }
                            });
                            genres.push(currentGenre);
                        });
                        // Sort by index
                        genres.sort((a, b) => a.index - b.index);
                        // Add to coords
                        const coords = [];
                        genres.forEach(g => {
                            coords.push([g.x, g.y]);
                        });
                        // Draw path
                        geoG.select('.geoPath')
                            .attr('d', vis.geoMaker(coords));
                        // Draw node circles
                        genres.forEach(g => {
                            geoG.selectAll('.geoNode')
                                .attr('cx', g.x)
                                .attr('cy', g.y)
                        });
                        // Get center of polygon
                        const centroid = d3.polygonCentroid(coords);
                        if (centroid[0] && centroid[1]) {
                            // Draw circ
                            geoG.select('.geoCirc')
                                .transition()
                                .attr('cx', centroid[0])
                                .attr('cy', centroid[1]);
                        } else {
                            // Calc circ ave coords
                            const xAve = coords.map(d => d[0]).reduce((a, c) => a + c) / coords.length;
                            const yAve = coords.map(d => d[1]).reduce((a, c) => a + c) / coords.length;
                            // Draw circ
                            geoG.select('.geoCirc')
                                .transition()
                                .attr('cx', xAve)
                                .attr('cy', yAve);
                        }

                    })
            )
            .on('mouseover', function (d) {
                // Clear selections
                vis.g.select('.geoPathSel')
                    .classed('geoPathSel', false);
                vis.g.select('.geoCircSel')
                    .classed('geoCircSel', false);
                vis.g.selectAll('.geoNodeSel')
                    .classed('geoNodeSel', false);
                // Define this
                const g = d3.select(this);
                // Show path and outline circ
                g.select('.geoPath')
                    .classed('geoPathSel', true);
                g.select('.geoCirc')
                    .classed('geoCircSel', true);
                g.selectAll('.geoNode')
                    .classed('geoNodeSel', true);
            })
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