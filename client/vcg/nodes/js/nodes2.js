'use strict';

/* `````````````````````````````````\```````````````````````\
    Class: Nodes2                   |                       |
 ``````````````````````````````````/``````````````````````*/
class Nodes2 {

    /*
    Constructor
    */
    constructor(_data, _parent) {
        // Fields
        this.data = _data;
        this.parent = _parent;

        // Initialize
        this.initVis();
    }

    /*
    initVis
    */
    initVis() {
        // Define this vis
        const vis = this;

        // Config svg
        vis.w = 1000;
        vis.h = 500;

        // Append svg
        vis.svg = d3.select(`#${vis.parent}`)
            .append('svg')
            .attr('width', vis.w)
            .attr('height', vis.h);

        // Config g (container)
        vis.gMargin = {top: 50, right: 50, bottom: 50, left: 50};
        vis.gW = vis.w - (vis.gMargin.left + vis.gMargin.right);
        vis.gH = vis.h - (vis.gMargin.top + vis.gMargin.bottom);

        // Append g (container)
        vis.g = vis.svg.append('g')
            .attr('id', `container${vis.parent.substring(vis.parent.length - 1)}`)
            .attr('width', vis.gW)
            .attr('height', vis.gH)
            .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);

        // Append links
        vis.linksG = vis.g.append('g')
            .attr('id', 'linksG')
            .style('transform', `translateY(${vis.gH / 2}px)`);

        // Append nodesG
        vis.nodesG = vis.g.append('g')
            .attr('id', 'nodesG')
            .style('transform', `translateY(${vis.gH / 2}px)`);

        // Wrangle
        vis.wrangleData();
    }

    /*
    wrangleData
     */
    wrangleData() {
        // Define this vis
        const vis = this;

        // Get displayData copy
        vis.displayData = JSON.parse(JSON.stringify(vis.data));

        // Est tree
        vis.tree = data => {
            const root = d3.hierarchy(data);
            root.dx = 40;
            root.dy = vis.gW / (root.height);
            return d3.tree().nodeSize([root.dx, root.dy])(root);
        };
        vis.root = vis.tree(vis.displayData);

        // Update
        vis.updateVis();
    }

    /*
    updateVis
     */
    updateVis() {
        // Define this vis
        const vis = this;

        // Build nodes
        vis.nodesG.selectAll('.node')
            .data(vis.root.descendants())
            .join(
                // ENTER
                enter => enter
                    .append('g')
                    .attr('class', 'node')
                    .style('transform', d => `translate(${d.y}px, ${d.x}px)`)
                    .each(function(d) {
                        // Define this
                        const node = d3.select(this);
                        // Append circle
                        node.append('circle')
                            .attr('class', 'nodeCirc1')
                            .attr('r', '20');
                        // Append circle
                        node.append('circle')
                            .attr('class', 'nodeCirc2')
                            .attr('r', '15px');
                        // Append circle
                        node.append('text')
                            .text(d.data.name)
                            .attr('class', 'nodeText');
                    })
            );


        // Append connectors
        vis.linksG.selectAll('.link')
            .data(vis.root.links())
            .join('path')
            .attr('class', 'link')
            .attr('d', d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x));
    }
}

/*
Ref.
 + d3.heirarchy - https://github.com/d3/d3-hierarchy/blob/v1.1.9/README.md#hierarchy
 + heirarchy eg - https://observablehq.com/@d3/d3-hierarchy
 + d3.tree - https://github.com/d3/d3-hierarchy/blob/v1.1.9/README.md#tree
 + tree eg - https://observablehq.com/@d3/tidy-tree
 */

