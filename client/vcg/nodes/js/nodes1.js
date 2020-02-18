'use strict';

/* `````````````````````````````````\```````````````````````\
    Class: Nodes1                   |                       |
 ``````````````````````````````````/``````````````````````*/
class Nodes1 {

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
        vis.h = 450;

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

        // Append nodesG
        vis.linksG = vis.g.append('g')
            .attr('id', 'linksG');

        // Append nodesG
        vis.nodesG = vis.g.append('g')
            .attr('id', 'nodesG');

        // Config colScale, rowScale
        vis.colScale = d3.scaleLinear()
            .range([0, vis.gW]);
        vis.rowScale = d3.scaleLinear()
            .range([0, vis.gH]);

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

        // Define and discover max cols and rows
        vis.colMax = d3.max(vis.displayData, d => parseInt(d.col, 10));
        vis.rowMax = 0;
        for (let i = 1; i <= vis.colMax; i++) {

            // Get rows from cols
            const rows = vis.displayData.filter(d => d.col === `${i}`);

            // Update maxRow count
            if (i === 1) {
                vis.rowMax += rows.length;
            }
            rows.forEach(r => {
                vis.rowMax += r.connectTo.length > 1 ? r.connectTo.length - 1 : 0;
            });

            // Define startRow
            let startRow = 1;

            // Recursive row trace
            rows.forEach(r => {
                let rowH = 1;
                recursiveRowTrace(r);

                function recursiveRowTrace(row) {
                    if (row.connectTo.length > 0) {
                        // Count
                        rowH += row.connectTo.length > 1 ? row.connectTo.length - 1 : 0;

                        // Recording and recursion
                        row.connectTo.forEach(cT => {
                            const connRow = vis.displayData.find(d => d.name === cT);
                            connRow.connectedFrom = row.name;
                            recursiveRowTrace(connRow);
                        });
                    }
                }

                // Add row height property
                r.rowH = rowH;

                // Define and confirm row position
                r.row = startRow;
                if (r.hasOwnProperty('connectedFrom')) {
                    const fromNode = vis.displayData.find(d => d.name === r.connectedFrom);
                    const fromRow = fromNode.row;
                    let addTo = 0;
                    fromNode.connectTo.forEach((d, i) => {
                        if (d === r.name && r.row !== (fromRow + i + addTo)) {
                            r.row = fromRow + i;
                        }
                        const connect = vis.displayData.find(c => c.name === d);
                        addTo += connect.rowH - 1;
                    });

                }

                // Update start row
                startRow += r.rowH;

            });
        }

        // Update
        vis.updateVis();
    }

    /*
    updateVis
     */
    updateVis() {
        // Define this vis
        const vis = this;

        // Update scales
        vis.colScale.domain([1, vis.colMax]);
        vis.rowScale.domain([1, vis.rowMax]);

        // Append nodes
        vis.nodesG.selectAll('.node')
            .data(vis.displayData)
            .join(
                // ENTER
                enter => enter
                    .append('g')
                    .attr('class', 'node')
                    .style('transform', (d, i) => {
                        vis.displayData[i].x = vis.colScale(+d.col);
                        const rowPos = d.row;
                        vis.displayData[i].y = vis.rowScale(d.row + ((d.rowH - 1) / 2));
                        return `translate(${vis.displayData[i].x}px, ${vis.displayData[i].y}px)`;
                    })
                    .each(function (d, i) {
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
                            .text(d.name)
                            .attr('class', 'nodeText');
                    })
            );

        // Separate connectorData (i.e. remove first)
        const connectorData = vis.displayData.filter(d => d.col !== '1');

        // Append connectors
        vis.linksG.selectAll('.link')
            .data(connectorData)
            .join(
                // ENTER
                enter => enter
                    .append('line')
                    .attr('class', 'link')
                    .each(function (d, i) {
                        // Define this
                        const visConnector = d3.select(this);
                        // Get connectedFrom
                        const connectedFrom = vis.displayData.find(dd => dd.name === d.connectedFrom);
                        visConnector
                            .attr('x1', connectedFrom.x)
                            .attr('x2', d.x)
                            .attr('y1', connectedFrom.y)
                            .attr('y2', d.y);
                    })
            )


    }

}