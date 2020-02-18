'use strict';

/* `````````````````````````````````\```````````````````````\
    Class: Nodes3                   |                       |
 ``````````````````````````````````/``````````````````````*/
class Nodes3 {

    /*
    Constructor
    */
    constructor(_data_nodes, _data_links, _parent) {
        // Fields
        this.data_nodes = _data_nodes;
        this.data_links = _data_links;
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

        // Init selNode
        vis.selNode_source = {name: ''};
        vis.selNode_target = {name: ''};
        vis.linkMode = false;

        // Config svg
        vis.w = 1000;
        vis.h = 600;

        // Append svg
        vis.svg = d3.select(`#${vis.parent}`)
            .append('svg')
            .attr('width', vis.w)
            .attr('height', vis.h);

        // Config g (container)
        vis.gMargin = {top: 25, right: 25, bottom: 25, left: 25};
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
            .style('transform', `translate(${vis.gW * 5 / 14}px, ${vis.gH / 2}px)`);

        // Append nodesG (front)
        vis.nodesG = vis.g.append('g')
            .attr('id', 'nodesG')
            .style('transform', `translate(${vis.gW * 5 / 14}px, ${vis.gH / 2}px)`);

        // Config
        vis.radius = vis.gH / 2 * 0.75;

        // Config coordScale
        vis.coordScale = d3.scaleLinear()
            .range([Math.PI, -Math.PI]);

        // Config linkLine
        vis.linkLine = d3.line().curve(d3.curveCardinal.tension(-0.5));

        // Get displayData copy
        vis.displayData_nodes = JSON.parse(JSON.stringify(vis.data_nodes));
        vis.displayData_links = JSON.parse(JSON.stringify(vis.data_links));

        // Instantiate * * * * *
        vis.nodes3Controls = new Nodes3Controls(this);

        // Wrangle
        vis.wrangleData();
    }

    /*
    wrangleData
     */
    wrangleData() {
        // Define this vis
        const vis = this;

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
                        d.x = vis.radius * Math.sin(vis.coordScale(i));
                        d.y = vis.radius * Math.cos(vis.coordScale(i));
                        // Position g
                        node.style('transform', `translate(${d.x}px, ${d.y}px)`);
                        // Add event
                        node.on('click', e => {
                            vis.nodeClick(e);
                        });
                        // Append circle
                        node.append('circle')
                            .attr('class', 'nodeCirc1')
                            .attr('r', '21');
                        // Append circle
                        node.append('circle')
                            .attr('class', 'nodeCircHL')
                            .attr('r', '18px');
                        // Append circle
                        node.append('circle')
                            .attr('class', 'nodeCirc2')
                            .attr('r', '15px');
                        // Append circle
                        node.append('text')
                            .text(d.name)
                            .attr('class', 'nodeText');
                    }),
                // UPDATE
                update => update
                    .each(function (d, i) {
                        // Define this
                        const node = d3.select(this);
                        // Get coords
                        d.x = vis.radius * Math.sin(vis.coordScale(i));
                        d.y = vis.radius * Math.cos(vis.coordScale(i));
                        // Position g
                        node.transition()
                            .style('transform', `translate(${d.x}px, ${d.y}px)`);
                        // Add event
                        node.on('click', e => {
                            vis.nodeClick(e);
                        });
                        // Append circle
                        node.select('.nodeText')
                            .text(d.name);
                    }),
                // EXIT
                exit => exit.remove()
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
                        node.attr('d', vis.linkLine(linkCoords));
                    }),
                // UPDATE
                update => update
                    .each(function (d, i) {
                        // Define this
                        const node = d3.select(this);
                        // Get linkCoords
                        const linkCoords = vis.getLinkCoords(d);
                        // Draw
                        node.transition()
                            .attr('d', vis.linkLine(linkCoords));
                    }),
                // EXIT
                exit => exit.remove()
            )
    }

    /*
    getLinkCoords
     */
    getLinkCoords(d) {
        // Define this vis
        const vis = this;

        // Lookup source/target x/y values
        const sourceRef = vis.displayData_nodes.find(n => n.name === d.source);
        const targetRef = vis.displayData_nodes.find(n => n.name === d.target);
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

    /*
    nodeClick
     */
    nodeClick(e) {
        // Define this vis
        const vis = this;

        // If not in link mode
        if (!vis.linkMode) {
            // If selection clicked twice
            if (e.name === vis.selNode_source.name) {
                d3.select(d3.event.currentTarget)
                    .select('.nodeCircHL')
                    .classed('nodeCircHLSource', true);
                vis.linkMode = true;
            }
            // If selection clicked once
            else {
                vis.selNode_source = e;
                vis.linkMode = false;
            }
            // Refresh / send to controls
            vis.nodes3Controls.updateNodeView(e);

        }
        // If in link mode
        else {
            // Clear target styling
            d3.selectAll('.nodeCircHLTarget')
                .classed('nodeCircHLTarget', false);
            // If selection clicked thrice
            if (e.name === vis.selNode_source.name) {
                d3.selectAll('.nodeCircHL')
                    .classed('nodeCircHLSource', false);
                vis.linkMode = false;
                vis.selNode_target = {name: ''};
                vis.mockupLink(false);
                // Refresh / send to controls
                vis.nodes3Controls.updateNodeView(e);
            }
            // If target selected
            else {
                // If target clicked once
                if (vis.selNode_target.name !== e.name) {
                    d3.select(d3.event.currentTarget)
                        .select('.nodeCircHL')
                        .classed('nodeCircHLTarget', true);
                    vis.selNode_target = e;
                    vis.mockupLink(true);
                    vis.nodes3Controls.enableAddLink(true);
                }
                // If target clicked twice
                else {
                    vis.selNode_target = {name: ''};
                    vis.mockupLink(false);
                    vis.nodes3Controls.enableAddLink(false);
                }
            }

        }
    }

    /*
    mockupLink
     */
    mockupLink(build) {
        // Define this vis
        const vis = this;

        // Deal w data
        let mockLineData = [];
        if (build) {
            mockLineData.push({source: vis.selNode_source.name, target: vis.selNode_target.name});
        }

        // Manage mockLine
        vis.linksG.selectAll('.mockLine')
            .data(mockLineData, d => d.source)
            .join(
                // ENTER
                enter => enter
                    .append('path')
                    .attr('class', 'mockLine')
                    .attr('d', d => vis.linkLine(vis.getLinkCoords(d))),
                // UPDATE
                update => update
                    .transition()
                    .attr('d', d => vis.linkLine(vis.getLinkCoords(d))),
                // EXIT
                exit => exit.remove()
            )

    }

    /*
    addLink
     */
    addLink() {
        // Define this vis
        const vis = this;
        vis.displayData_links.push({source: vis.selNode_source.name, target: vis.selNode_target.name});

        // Rebuild
        vis.wrangleData();
    }
}

/*
Ref.
 */
