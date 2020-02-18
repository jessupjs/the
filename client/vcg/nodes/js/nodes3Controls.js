'use strict';

/* `````````````````````````````````\```````````````````````\
    Class: Nodes3Controls           |                       |
 ``````````````````````````````````/``````````````````````*/
class Nodes3Controls {

    /*
    Constructor
    */
    constructor(_mod) {
        // Fields
        this.mod = _mod;

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
        vis.selNode = null;
        vis.linkMode = false;

        // Add/build nodeView
        vis.nodeViewG = vis.mod.svg.append('g')
            .attr('class', 'nodeViewG')
            .style('transform', `translate(${vis.mod.gW - 130}px, 130px)`)
            .classed('invis', true);
        vis.nodeViewLabelG = vis.nodeViewG.append('g')
            .attr('class', 'nodeLabel');
        vis.nodeViewLabelG.append('circle')
            .attr('class', 'nodeCircHL')
            .attr('r', '33');
        vis.nodeViewLabelG.append('circle')
            .attr('class', 'nodeCirc2')
            .attr('r', '30');
        vis.nodeViewLabelG.append('text')
            .attr('class', 'nodeText nodeTextLg');
        vis.removeNodeG = vis.nodeViewG.append('g')
            .attr('class', 'removeNodeG')
            .style('transform', `translate(35px, -35px)`)
            .on('click', () => {
                vis.removeNode();
            });
        vis.removeNodeG.append('circle')
            .attr('class', 'removeNodeCirc')
            .attr('r', '10');
        vis.removeNodeG.append('text')
            .text('-')
            .attr('class', 'nodeText nodeTextMd');
        vis.addLinkG = vis.nodeViewG.append('g')
            .attr('class', 'addLinkG')
            .classed('invis', true)
            .style('transform', `translateY(50px)`)
            .on('click', () => {
                vis.indicateLinkAdd();
            });
        vis.addLinkG.append('text')
            .attr('class', 'nodeText nodeTextW')
            .text('add link');


        // Add newNodeG
        vis.newNodeG = vis.mod.svg.append('g')
            .attr('class', 'newNodeG')
            .style('transform', `translate(40px, 40px)`)
            .on('click', () => {
                vis.addNewNode();
            });

        // Append circle
        vis.newNodeG.append('circle')
            .attr('class', 'nodeCirc2')
            .attr('r', '15px');

        // Append text
        vis.newNodeG.append('text')
            .text('+')
            .attr('class', 'nodeText nodeTextMd');
    }

    /*
    updateNodeView
     */
    updateNodeView(data) {
        // Define this vis
        const vis = this;

        // Update selNode and visibility
        vis.nodeViewG.classed('invis', false);
        if (vis.selNode && data && !vis.linkMode && vis.selNode.name === data.name) {
            vis.nodeViewG.select('.nodeCircHL')
                .classed('nodeCircHLSource', true);
            vis.linkMode = true;
        } else if (data) {
            vis.selNode = data;
            vis.linkMode = false;
            // Manage nodeView
            vis.nodeViewLabelG.select('.nodeText')
                .text(data.name);
        } else {
            vis.selNode = null;
            vis.linkMode = false;
        }
    }

    /*
    enableAddLink
     */
    enableAddLink(on) {
        // Define this vis
        const vis = this;

        // Determine visibility
        if (on) {
            vis.addLinkG.classed('invis', false);
        } else {
            vis.addLinkG.classed('invis', true);
        }
    }

    /*
    indicateLinkAdd
     */
    indicateLinkAdd() {
        // Define this vis
        const vis = this;

        // Add link in mod
        vis.mod.addLink();

        // Undo styling
        vis.enableAddLink(false);
    }

    /*
    removeNode
     */
    removeNode() {
        // Define this vis
        const vis = this;

        // Filter out
        vis.mod.displayData_nodes = vis.mod.displayData_nodes.filter(d => d.name !== vis.selNode.name);
        vis.mod.displayData_links = vis.mod.displayData_links.filter(d => {
            if (d.source !== vis.selNode.name && d.target !== vis.selNode.name) return d;
        });

        // Update view visibility
        vis.nodeViewG.classed('invis', true);

        // Wrangle data
        vis.mod.wrangleData();
    }

    /*
    addNewNode
     */
    addNewNode() {
        // Define this vis
        const vis = this;

        // Prep new node object
        let highestNum = 0;
        vis.mod.displayData_nodes.forEach(d => {
            const num = parseInt(d.name.replace('n', ''), 10);
            if (num > highestNum) {
                highestNum = num;
            }
        });
        const newNodeData = {name: `n${highestNum + 1}`};
        vis.mod.displayData_nodes.push(newNodeData);

        // Update node view
        vis.updateNodeView(newNodeData);

        // Wrangle
        vis.mod.wrangleData();

    }
}

/*
Ref.
 */
