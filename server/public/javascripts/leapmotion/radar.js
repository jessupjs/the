'use strict';

// Config svg - iPAD mini (1024x768)
const mod3_svgW = 1024;
const mod3_svgH = 712;
const windowW = window.innerWidth;

// Append svg
const mod3_svg = d3.select('#radarVis')
    .append('svg')
    .attr('width', mod3_svgW)
    .attr('height', mod3_svgH);

/* `````````````````````````````````\```````````````````````\
    Class: Mod3Main                 |                       |
 ``````````````````````````````````/``````````````````````*/
class Mod3Main {

    // Constructor
    constructor(_data) {
        this.data = mod3Data;

        this.parseData().then(() => {
            // Init
            this.initVis();
        }).catch(err => console.error(err));
    }

    /*
    parseData
     */
    async parseData() {

        // Define this vis
        const vis = this;

        // Iterate
        vis.data.forEach(domain => {
            domain.data.forEach(entry => {
                if (entry.country === 'Central African Republic') {
                    entry.country = 'C. African Rep.';
                } else if (entry.country === 'Republic of Congo') {
                    entry.country = 'Rep. Congo';
                } else if (entry.country === 'Democratic Republic of the Congo') {
                    entry.country = 'Dem. Rep. Congo';
                } else if (entry.country === 'Sao Tome and Principe') {
                    entry.country = 'Sao Tome';
                } else if (entry.country === 'United Republic of Tanzania') {
                    entry.country = 'Tanzania';
                }
            });
        });

    }

    /*
    initVis
     */
    initVis() {

        // Define this vis
        const vis = this;

        // ``````````````````````````````````````````````````````````````````````````````````````````````` Container

        // Config g
        vis.gMargin = {top: 60, right: 60, bottom: 60, left: 60};
        vis.gW = mod3_svgW - (vis.gMargin.left + vis.gMargin.right);
        vis.gH = mod3_svgH - (vis.gMargin.top + vis.gMargin.bottom);

        // Append g
        vis.g = mod3_svg.append('g')
            .attr('class', 'containerG')
            .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);

        // ``````````````````````````````````````````````````````````````````````````````````````````````````` Setup

        // Append mainG
        vis.mainG = vis.g.append('g')
            .attr('class', 'mainG')
            .style('transform', () => `translate(${vis.gW / 2}px, ${vis.gH / 2}px)`);

        // Config main features
        vis.mainAngle = 360;
        vis.mainRad = vis.gW / 2 * 0.5;
        vis.mainGraphInt = 0.5;
        vis.mainGraphExt = Math.round(vis.mainRad * 0.8);

        // Config label features
        vis.labelAngle = 130;
        vis.labelAnglePosition = 90;

        // Set yearData
        vis.yearMin = 1963;
        vis.yearMax = 2013;
        vis.yearPredictTo = 2063;
        vis.yearData = [];
        for (let i = vis.yearMin; i <= vis.yearPredictTo; i++) {
            vis.yearData.push(i);
        }

        // Define axisAngleScale
        vis.axisAngleScale = d3.scaleLinear()
            .domain([0, 4])
            .range([180 - ((360 + vis.mainAngle) / 2), -180 + ((360 + vis.mainAngle) / 2)]);

        // Define yearAngleScale
        vis.yearAngleScale = d3.scaleLinear()
            .domain(d3.extent(vis.yearData, d => d))
            .range([
                180 + vis.labelAnglePosition - ((360 + vis.labelAngle) / 2),
                -180 + vis.labelAnglePosition + ((360 + vis.labelAngle) / 2)
            ]);

        // Define countryAngleScale
        vis.countryAngleScale = d3.scaleLinear()
            .range([
                360 + vis.labelAnglePosition - ((360 + vis.labelAngle) / 2),
                vis.labelAnglePosition + ((360 + vis.labelAngle) / 2)
            ]);

        // Define xScale
        vis.xScale = d3.scaleLinear()
            .domain([0, 4])
            .range([
                ((360 - (360 + vis.mainAngle) / 2) / 360) * (2 * Math.PI),
                (((360 + vis.mainAngle) / 2) / 360) * (2 * Math.PI)]);

        // Define yScale
        vis.yScale = d3.scaleLinear()
            .range([0, vis.mainGraphExt]);

        // Define colorScale
        vis.colorScale = d3.scaleOrdinal()
            .domain([0, 1, 2, 3, 4, 5, 6, 7])
            .range([
                'rgb(250,92,0)', 'rgb(235,14,68)', 'rgb(114,191,0)', 'rgb(111,111,196)',
                'rgb(160,77,0)', 'rgb(165,14,50)', 'rgb(60,121,0)', 'rgb(58,58,116)',
            ]);

        // Define arcMaker
        vis.arcMaker = d3.arc();

        // const
        vis.yScaleDomainSpace = 1.15;

        // Define areaMaker
        vis.areaMakerActual = d3.areaRadial()
            .curve(d3.curveCatmullRomClosed)
            .angle(d => vis.xScale(d[0].order))
            .innerRadius(() => vis.yScale(0))
            .outerRadius(d => {
                let domainMax = null;
                if (vis.hovYear < 2063) {
                    domainMax = Math.max(d[0].total, d[1].total, d[0].targetWorld, d[1].targetWorld, d[0].targetAfrica, d[1].targetAfrica);
                } else {
                    domainMax = Math.max(d[0].total, d[0].targetWorld, d[0].targetAfrica);
                }
                vis.yScale
                    .domain([0, domainMax * vis.yScaleDomainSpace]);
                return vis.yScale(d[0].total);
            });

        // Define areaMaker
        vis.areaMakerEvenWorld = d3.areaRadial()
            .curve(d3.curveCatmullRomClosed)
            .angle(d => vis.xScale(d[0].order))
            .innerRadius(() => vis.yScale(0))
            .outerRadius(d => {
                let domainMax = null;
                if (vis.hovYear < 2063) {
                    domainMax = Math.max(d[0].total, d[1].total, d[0].targetWorld, d[1].targetWorld, d[0].targetAfrica, d[1].targetAfrica);
                } else {
                    domainMax = Math.max(d[0].total, d[0].targetWorld, d[0].targetAfrica);
                }

                vis.yScale
                    .domain([0, domainMax * vis.yScaleDomainSpace]);
                return vis.yScale(d[0].targetWorld);
            });

        // Define areaMaker
        vis.areaMakerEvenAfrica = d3.areaRadial()
            .curve(d3.curveCatmullRomClosed)
            .angle(d => vis.xScale(d[0].order))
            .innerRadius(() => vis.yScale(0))
            .outerRadius(d => {
                let domainMax = null;
                if (vis.hovYear < 2063) {
                    domainMax = Math.max(d[0].total, d[1].total, d[0].targetWorld, d[1].targetWorld, d[0].targetAfrica, d[1].targetAfrica);
                } else {
                    domainMax = Math.max(d[0].total, d[0].targetWorld, d[0].targetAfrica);
                }
                vis.yScale
                    .domain([0, domainMax * vis.yScaleDomainSpace]);
                return vis.yScale(d[0].targetAfrica);
            });

        // Set legendOffset
        vis.legendOffset = Math.round(vis.mainGraphExt * 0.075);

        // Set coords
        vis.legendCoords = [
            [0, vis.legendOffset], [vis.legendOffset, 0], [0, -vis.legendOffset], [-vis.legendOffset, 0]
        ];

        vis.legendPathMaker = d3.line()
            .curve(d3.curveCardinalClosed);

        // Init selected country and year
        vis.hovCountry = 'Algeria';
        vis.hovYear = 2013;
        vis.hovFilter = '';
        vis.selCountry = null;
        vis.selYear = null;
        vis.selIndex = null;
        vis.nodeSel = false;
        vis.nodeSelGeo = false;


        // ````````````````````````````````````````````````````````````````````````````````````````````` Append to g

        // Draw quarterboardG
        vis.quarterboardG = vis.mainG.append('g')
            .attr('class', 'quarterboardG');

        // Draw chartboardG
        vis.chartboardG = vis.mainG.append('g')
            .attr('class', 'chartboardG');

        // Build actual chart
        vis.compChart = vis.chartboardG.append('g')
            .attr('class', 'compChart');

        // Add handles
        vis.handleG = vis.chartboardG.append('g')
            .attr('class', 'handleG');

        // Add legendG
        vis.legendG = vis.mainG.append('g')
            .attr('class', 'legendG')
            .style('transform', `translate(${vis.gW * 0.3}px, ${vis.gW * 0.2}px)`);

        // ```````````````````````````````````````````````````````````````````````````````````````````` Perform once

        // Data
        vis.quarterData = [
            {domain: 'Population', colorPos: 1},
            {domain: 'Food Production', colorPos: 2},
            {domain: 'Trade Value', colorPos: 3},
            {domain: 'Emissions', colorPos: 0},
        ];

        // Build rotateG
        vis.rotateQuarterG = vis.quarterboardG.append('g')
            .attr('class', 'rotateQuarterG');

        // Build innerLines
        vis.innerLineGs = [];
        for (let i = 0; i < vis.quarterData.length; i++) {
            const innerLineG = vis.rotateQuarterG.append('g')
                .attr('class', 'innerLineG');
            innerLineG.append('line')
                .attr('class', 'mainAxisLine')
                .attr('x1', 0)
                .attr('x2', 0)
                .attr('y1', 0)
                .attr('y2', this.mainGraphExt)
                .style('transform', `rotate(${vis.axisAngleScale(i)}deg)`)
            ;
            vis.innerLineGs.push(innerLineG);
        }

        // Build quarters
        vis.quarterGs = vis.rotateQuarterG.selectAll('.quarterG')
            .data(vis.quarterData)
            .enter()
            .append('g')
            .attr('class', 'quarterG')
            .each(function (d, i) {
                // Select this quarter
                const quarterG = d3.select(this);
                // Config arcMaker
                vis.arcMaker
                    .startAngle(vis.xScale(i - 0.5))
                    .endAngle(vis.xScale(i + 0.5));
                // Append path1 (outer)
                vis.arcMaker
                    .innerRadius(vis.mainGraphExt)
                    .outerRadius(vis.mainGraphExt * 1.1)
                    .padAngle(Math.PI / 180);
                quarterG.append('path')
                    .attr('class', 'sortArcColor')
                    .attr('d', vis.arcMaker)
                    .attr('fill', vis.colorScale(d.colorPos));
                vis.arcMaker
                    .innerRadius(vis.mainGraphExt * 1.045)
                    .outerRadius(vis.mainGraphExt * 1.045);
                quarterG.append('path')
                    .attr('id', `sortArc${i}`)
                    .attr('class', 'sortArc')
                    .attr('d', vis.arcMaker);
                // Append labels
                const sortLabel = quarterG
                    .append('text')
                    .attr('class', 'navText')
                    .append('textPath')
                    .attr('xlink:href', `#sortArc${i}`)
                    .text(`${vis.quarterData[i].domain}`)
                    .attr('startOffset', '25%');
                // Append path2 (inner)
                vis.arcMaker
                    .innerRadius(vis.mainGraphInt)
                    .outerRadius(vis.mainGraphExt)
                    .padAngle(1.75 * (Math.PI / 180));
                quarterG.append('path')
                    .attr('d', vis.arcMaker)
                    .attr('stroke', vis.colorScale(i))
                    .attr('stroke-opacity', 0.25)
                    .attr('fill', 'none');
                // Append path2 (inner)
                vis.arcMaker
                    .innerRadius(vis.mainGraphExt * 0.9)
                    .outerRadius(vis.mainGraphExt);
                quarterG.append('path')
                    .attr('class', 'resArcColor')
                    .attr('d', vis.arcMaker)
                    .attr('fill', 'rgba(255, 255, 255, 1)');
                vis.arcMaker
                    .innerRadius(vis.mainGraphExt * 0.945)
                    .outerRadius(vis.mainGraphExt * 0.945);
                quarterG.append('path')
                    .attr('id', `resArc${i}`)
                    .attr('class', 'resArc')
                    .attr('d', vis.arcMaker);
                // Append labels
                const resLabel = quarterG
                    .append('text')
                    .attr('class', 'resText')
                    .append('textPath')
                    .attr('xlink:href', `#resArc${i}`)
                    .attr('startOffset', '25%');
            });

        // Add sorting event
        vis.quarterGs
            .on('click', function (e) {
                // Const get group
                d3.select('.sortSel').remove();
                const g = d3.select(this);
                const term = g.select('text').text();
                const index = vis.quarterData.find(d => d.domain === term).colorPos + 1;
                const sortSel = g.append('circle')
                    .attr('class', 'sortSel')
                    .attr('r', '4px')
                    .attr('cy', -vis.mainRad * 0.91)
                    .style('transform', `rotate(${vis.axisAngleScale(index)}deg)`);

                // reset sorting filter
                vis.hovFilter = e;
                vis.wrangleVis()
            });

        // Build rotate
        vis.rotateDeg = 0;
        vis.rotateG = vis.quarterboardG.append('g')
            .attr('class', 'rotateG')
            .style('transform', `translateY(${vis.mainGraphExt * 1.25}px)`);
        const rotateSymbol = vis.rotateG.append('text')
            .attr('class', 'symbol')
            .style('transform', 'rotate(-45deg)')
            .html('&#10558;');
        vis.rotateG.append('text')
            .attr('class', 'symbolText')
            .style('transform', `translateY(${vis.mainGraphExt * 0.15}px)`)
            .text('rotate');
        vis.rotateG.on('click', () => {
            if (vis.rotateDeg === 270) {
                vis.rotateDeg = 0;
            } else {
                vis.rotateDeg += 90;
            }
            rotateSymbol
                .transition()
                .style('transform', `rotate(${-45 + vis.rotateDeg}deg)`);
            vis.rotateQuarterG
                .transition()
                .style('transform', `rotate(${vis.rotateDeg}deg)`);
            vis.compChart
                .transition()
                .style('transform', `rotate(${vis.rotateDeg}deg)`);
            vis.handleG
                .transition()
                .style('transform', `rotate(${vis.rotateDeg}deg)`);
        });

        // Build sort
        vis.sortButtonG = vis.quarterboardG.append('g')
            .attr('class', 'rotateG')
            .style('transform', `translateY(${-vis.mainGraphExt * 1.25}px)`);
        vis.sortButtonG.append('text')
            .attr('class', 'symbol')
            .html('&#8595;');
        vis.sortButtonG.append('text')
            .attr('class', 'symbolText')
            .style('transform', `translateY(${-vis.mainGraphExt * 0.12}px)`)
            .text('click to sort');


        // Config labelOffset
        vis.labelOffset = 1.275;

        // Add time labels
        vis.timeLabelG = vis.quarterboardG.append('g')
            .attr('class', 'timeLabelG');
        vis.timeGs = vis.timeLabelG.selectAll('timeG')
            .data(vis.yearData)
            .enter()
            .append('g')
            .attr('class', 'timeG')
            .each(function (d, i) {
                // Get this timeG
                const timeG = d3.select(this)
                    .style('transform', `rotate(${vis.yearAngleScale(d)}deg)`);

                // Append tick
                timeG.append('line')
                    .attr('class', 'grabLine')
                    .attr('x1', 0)
                    .attr('y1', vis.mainGraphExt * vis.labelOffset)
                    .attr('x2', 0)
                    .attr('y2', vis.mainGraphExt * (vis.labelOffset + 0.6));

                // Append tick
                const timeLineBack = timeG.append('line')
                    .attr('class', 'timeLineBack')
                    .attr('x1', 0)
                    .attr('y1', vis.mainGraphExt * vis.labelOffset)
                    .attr('x2', 0)
                    .attr('y2', () => vis.mainGraphExt * (vis.labelOffset + 0.29));
                if (d === vis.hovYear) {
                    timeLineBack.classed('timeLineBackHov', true);
                }

                // Append tick
                timeG.append('line')
                    .attr('class', 'timeLine')
                    .attr('x1', 0)
                    .attr('y1', vis.mainGraphExt * vis.labelOffset)
                    .attr('x2', 0)
                    .attr('y2', () => {
                        if (i === 0 || i === Math.floor(vis.yearData.length / 2) || i === vis.yearData.length - 1) {
                            return vis.mainGraphExt * (vis.labelOffset + 0.13);
                        } else if (d % 5 === 0) {
                            return vis.mainGraphExt * (vis.labelOffset + 0.06);
                        } else {
                            return vis.mainGraphExt * (vis.labelOffset + 0.04);
                        }
                    });

                // Append label
                if (d % 10 === 0) {
                    timeG.append('g')
                        .style('transform', `translateY(${vis.mainGraphExt * (vis.labelOffset + 0.08)}px)`)
                        .append('text')
                        .attr('class', 'timeText')
                        .text(d)
                        .style('transform', `rotate(-90deg) translateY(1px)`);
                }
                if (i === 0 || i === Math.floor(vis.yearData.length / 2) || i === vis.yearData.length - 1) {
                    timeG.append('g')
                        .style('transform', `translateY(${vis.mainGraphExt * (vis.labelOffset + 0.15)}px)`)
                        .append('text')
                        .attr('class', 'timeText timeTextBold')
                        .style('transform', `rotate(-90deg) translateY(1px)`)
                        .text(d);
                }
            });

        // Append timeset labels
        vis.timesetLabelG = vis.timeLabelG.append('g')
            .attr('class', 'timesetLabelG');
        // Get angles
        const labelAngle1 = vis.yearAngleScale(1963);
        const labelAngle2 = vis.yearAngleScale(2013);
        const labelAngle3 = vis.yearAngleScale(2063);
        // Build arc1
        vis.arcMaker
            .innerRadius(vis.mainGraphExt * 1.65)
            .outerRadius(vis.mainGraphExt * 1.65)
            .startAngle(vis.xScale(2 + 2 * (labelAngle1 / 180)))
            .endAngle(vis.xScale(2 + 2 * (labelAngle2 / 180)));
        vis.timesetLabelG.append('path')
            .attr('id', 'timesetPath1')
            .attr('d', vis.arcMaker)
            .style('transform', `scale(1, -1) rotate(${labelAngle2 - labelAngle1}deg)`);
        vis.timesetLabelG.append('text')
            .append('textPath')
            .attr('x-link:href', '#timesetPath1')
            .attr('class', 'timesetLabel')
            .attr('startOffset', '25%')
            .text('Past Trends');
        // Build arc2
        vis.arcMaker
            .startAngle(vis.xScale(2 + 2 * (labelAngle2 / 180)))
            .endAngle(vis.xScale(2 + 2 * (labelAngle3 / 180)));
        vis.timesetLabelG.append('path')
            .attr('id', 'timesetPath2')
            .attr('d', vis.arcMaker);
        vis.timesetLabelG.append('text')
            .append('textPath')
            .attr('x-link:href', '#timesetPath2')
            .attr('class', 'timesetLabel')
            .attr('startOffset', '25%')
            .text('Future Predictions');

        // Append selYearG
        vis.selYearG = vis.timeLabelG.append('g')
            .style('transform', `rotate(${vis.yearAngleScale(2013)}deg) translateY(${vis.mainGraphExt * 1.24}px)`);
        vis.selYearG.append('circle')
            .attr('class', 'yearDot')
            .attr('r', vis.mainGraphExt * 0.02);

        // Append year to label
        vis.legendG.append('text')
            .attr('class', 'legendLabel legendYear')
            .style('transform', `translate(108px, -30px)`)
            .text(vis.hovYear);

        // Add events to TIMEGs
        vis.timeLabelG
            .on("touchstart", timeTouch)
            .on("touchmove", timeTouch)
            .on("touchend", timeTouch);
        function timeTouch() {
            if (typeof d3.event.cancelable !== 'boolean' || d3.event.cancelable) {
                d3.event.preventDefault();
            }
            // Get located
            const myLocation = d3.event.changedTouches[0];
            const realTarget = document.elementFromPoint(myLocation.clientX, myLocation.clientY);
            const targetParent = realTarget ? d3.select(realTarget.parentElement) : null;
            if (targetParent && targetParent.attr('class') === 'timeG') {
                // Clear
                d3.select('.timeLineBackHov')
                    .classed('timeLineBackHov', false);
                d3.select('.timeLineSel')
                    .classed('timeLineBackHov', false);
                d3.select('.selYearDot')
                    .classed('selYearDot', false);
                // Add styles
                targetParent.select('.timeLineBack')
                    .classed('timeLineBackHov', true);
                targetParent.select('.timeLineSel')
                    .classed('timeLineSel', true);
                vis.selYearG.select('.yearDot')
                    .classed('selYearDot', true);
                // Update sel year
                targetParent.each(d => {
                    vis.hovYear = d;
                    vis.selYear = d;
                });
                vis.selYearG
                    .transition()
                    .style('transform', `rotate(${vis.yearAngleScale(vis.selYear)}deg) 
                        translateY(${vis.mainGraphExt * 1.24}px)`);
                // Update legend year
                vis.legendG.select('.legendYear')
                    .text(vis.selYear ? vis.selYear : vis.hovYear);
                // Wrangle vis
                vis.wrangleVis();
            }
        }

        vis.timeGs.on('mouseover', e => {

            // Update legend year
            vis.legendG.select('.legendYear')
                .text(vis.selYear ? vis.selYear : vis.hovYear);

            // Check area
            vis.areaSelCheck();

            // Clear
            d3.select('.timeLineBackHov')
                .classed('timeLineBackHov', false);
            d3.select('.timeLineHov')
                .classed('timeLineHov', false);

            // Set
            const target = d3.event.currentTarget;

            // Style
            d3.select(target).select('.timeLineBack')
                .classed('timeLineBackHov', true);
            d3.select(target).select('.timeLine')
                .classed('timeLineHov', true);

            // If selected block not active
            if (!vis.selYear) {
                vis.hovYear = e;
                vis.wrangleVis();
            }

        }).on('mouseout', e => {
            // If selected  block not active
            if (vis.selYear) {
                // Clear
                d3.select('.timeLineBackHov')
                    .classed('timeLineBackHov', false);
                d3.select('.timeLineHov')
                    .classed('timeLineHov', false);
            }

        }).on('click', e => {
            // Delegate
            timeClick(e);
        });

        // Add events to TIMEGs
        vis.selYearG.on('click', e => {
            // Delegate
            timeClick(e);
        });

        function timeClick(e) {

            if (e !== vis.selYear && e) {

                // Clear
                d3.select('.selYearDot')
                    .classed('selYearDot', false);
                d3.select('.timeLineSel')
                    .classed('timeLineSel', false);

                // Set
                const target = d3.event.currentTarget;
                vis.hovYear = e;
                vis.selYear = e;

                // Style
                vis.selYearG
                    .transition()
                    .style('transform', `rotate(${vis.yearAngleScale(vis.selYear)}deg) 
                        translateY(${vis.mainGraphExt * 1.24}px)`);
                vis.selYearG.select('.yearDot')
                    .classed('selYearDot', true);
                d3.select(target).select('.timeLine')
                    .classed('timeLineSel', true);

                // Wrangle
                vis.wrangleVis();

            } else {

                // Clear
                d3.select('.selYearDot')
                    .classed('selYearDot', false);
                d3.select('.timeLineSel')
                    .classed('timeLineSel', false);

                // Set
                vis.selYear = '';
            }
        }

        // Add country labels
        vis.countryLabelG = vis.quarterboardG.append('g')
            .attr('class', 'countryLabelG');

        // Append selYearG
        vis.countryAngleScale.domain([0, 1]);
        vis.selCountryG = vis.countryLabelG.append('g')
            .style('transform', `rotate(${vis.countryAngleScale(0)}deg) translateY(${vis.mainGraphExt * 1.24}px)`);
        vis.selCountryG.append('circle')
            .attr('class', 'countryDot')
            .attr('r', vis.mainGraphExt * 0.02);

        // Append area
        vis.evenArea = vis.compChart.append('path')
            .attr('class', 'evenArea area');

        // Append area
        vis.evenAreaAfrica = vis.compChart.append('path')
            .attr('class', 'evenAreaAfrica area');

        // Append area
        vis.actualArea = vis.compChart.append('path')
            .attr('class', 'actualArea area');

        // Add events to areas
        vis.actualArea.on('mouseover', e => {
            vis.areaHov('country', true);
            vis.nodeDisplay('country', true);
        }).on('mouseout', e => {
            vis.areaHov('country', false);
            vis.nodeDisplay('country', false);
        }).on('click', e => {
            vis.areaSel('country', true);
        });

        // Add events to areas
        vis.evenArea.on('mouseover', e => {
            vis.areaHov('world', true);
            vis.nodeDisplay('world', true);
        }).on('mouseout', e => {
            vis.areaHov('world', false);
            vis.nodeDisplay('world', false);
        }).on('click', e => {
            vis.areaSel('world', true);
        });

        // Add events to areas
        vis.evenAreaAfrica.on('mouseover', e => {
            vis.areaHov('africa', true);
            vis.nodeDisplay('africa', true);
        }).on('mouseout', e => {
            vis.areaHov('africa', false);
            vis.nodeDisplay('africa', false);
        }).on('click', e => {
            vis.areaSel('africa', true);
        });

        // Prep data
        vis.prepData().then(() => {
            // Up next
            vis.wrangleVis();
        }).catch(err => console.error(err));

    }

    /*
    prepData
     */
    async prepData() {

        // Define this vis
        const vis = this;

        // ````````````````````````````````````````````````````````````````````````````````````````````````` Predict

        // Init radar
        vis.radarData = [];

        // Iterate data
        vis.data.forEach(d_domain => {
            d_domain.data.forEach(d_country => {

                // Get country start and stop
                if (+d_country.years[0].year === vis.yearMin && +d_country.years[d_country.years.length - 1].year === vis.yearMax) {
                    // Init vars
                    let startYrTot = 0;
                    let stopYrTot = 0;
                    if (d_domain.domain === 'Food Balance Sheets') {
                        startYrTot = d_country.years[0].totals['Production'];
                        stopYrTot = d_country.years[d_country.years.length - 1].totals['Production'];
                    } else if (d_domain.domain === 'Agriculture Total') {
                        let foundItem = d_country.years[0].items.find(d => d.item === 'Agriculture total');
                        startYrTot = foundItem['Emissions (CO2eq)'];
                        foundItem = d_country.years[d_country.years.length - 1].items.find(d => d.item === 'Agriculture total');
                        stopYrTot = foundItem['Emissions (CO2eq)'];
                    } else if (d_domain.domain === 'Annual population') {
                        startYrTot = d_country.years[0].items[0]['Total Population - Both sexes'];
                        stopYrTot = d_country.years[d_country.years.length - 1].items[0]['Total Population - Both sexes'];
                    } else if (d_domain.domain === 'Crops and livestock products') {
                        startYrTot = d_country.years[0].items[0]['Export Value'];
                        stopYrTot = d_country.years[d_country.years.length - 1].items[0]['Export Value'];
                    }
                    const totalChange = (stopYrTot - startYrTot) / stopYrTot;
                    const annualChange = totalChange / (vis.yearMax - vis.yearMin);

                    // Create object
                    let newParentObj = {
                        domain: d_domain.domain,
                        country: d_country.country,
                        calcRange: [vis.yearMin, vis.yearMax],
                        totalChange: +totalChange.toFixed(4),
                        annualChange: +annualChange.toFixed(4),
                        years: []
                    };

                    // Init
                    let std2013 = 0;
                    // Update obj years
                    for (let i = vis.yearMin; i <= vis.yearPredictTo; i++) {
                        let total = 0;
                        let type = '';
                        if (i <= vis.yearMax) {
                            // Init type
                            type = 'reported';
                            // Discover total
                            if (d_domain.domain === 'Food Balance Sheets') {
                                total = d_country.years[i - vis.yearMin].totals['Production'];
                            } else if (d_domain.domain === 'Agriculture Total') {
                                let foundItem = d_country.years[i - vis.yearMin].items.find(d => d.item === 'Agriculture total');
                                total = foundItem['Emissions (CO2eq)'];
                            } else if (d_domain.domain === 'Annual population') {
                                total = d_country.years[i - vis.yearMin].items[0]['Total Population - Both sexes'];
                            } else if (d_domain.domain === 'Crops and livestock products') {
                                total = d_country.years[i - vis.yearMin].items[0]['Export Value'];
                            }
                            // Record 2013
                            if (i === 2013) {
                                std2013 = total;
                                newParentObj.std2013 = total;
                            }
                        } else {
                            type = 'predicted';
                            total = std2013 * Math.pow(1 + newParentObj.annualChange, i - vis.yearMax);
                        }

                        // Create object
                        let newChildObj = {
                            year: i,
                            type: type,
                            total: Math.round(total)
                        };

                        // Append to parent
                        newParentObj.years.push(newChildObj);

                    }

                    vis.radarData.push(newParentObj);

                }
            });
        });

        // Update radarData w comparisons
        vis.radarData = d3.nest()
            .key(d => d.country)
            .entries(vis.radarData);

        // Filter out those w less than 4 domains
        vis.radarData = vis.radarData.filter(d => d.values.length === 4);

        // Get world comparison
        let worldComp = vis.radarData.find(d => d.key === 'World');
        let worldPop = worldComp.values.find(d => d.domain === 'Annual population');
        let worldFood = worldComp.values.find(d => d.domain === 'Food Balance Sheets');
        let worldValue = worldComp.values.find(d => d.domain === 'Crops and livestock products');
        let worldEmissions = worldComp.values.find(d => d.domain === 'Agriculture Total');
        // Get africa comparison
        let africaComp = vis.radarData.find(d => d.key === 'Africa');
        let africaPop = africaComp.values.find(d => d.domain === 'Annual population');
        let africaFood = africaComp.values.find(d => d.domain === 'Food Balance Sheets');
        let africaValue = africaComp.values.find(d => d.domain === 'Crops and livestock products');
        let africaEmissions = africaComp.values.find(d => d.domain === 'Agriculture Total');

        // Iterate and update
        for (let rD of vis.radarData) {

            for (let i = vis.yearMin; i <= vis.yearPredictTo; i++) {

                // Get pop
                const nestedPopYr = rD.values.find(d => d.domain === 'Annual population').years[i - vis.yearMin];
                const worldPopYr = worldPop.years[i - vis.yearMin];
                const africaPopYr = africaPop.years[i - vis.yearMin];
                // Get percent of
                const pctOfWorld = nestedPopYr.total / worldPopYr.total;
                const pctOfAfrica = nestedPopYr.total / africaPopYr.total;
                // Update pop
                nestedPopYr.pctOfWorld = pctOfWorld;
                nestedPopYr.targetWorld = Math.round(worldPopYr.total * pctOfWorld);
                nestedPopYr.pctOfAfrica = pctOfAfrica;
                nestedPopYr.targetAfrica = Math.round(africaPopYr.total * pctOfAfrica);

                // Get other domains
                const nestedFoodYr = rD.values.find(d => d.domain === 'Food Balance Sheets').years[i - vis.yearMin];
                const worldFoodYr = worldFood.years[i - vis.yearMin];
                const africaFoodYr = africaFood.years[i - vis.yearMin];
                const nestedValueYr = rD.values.find(d => d.domain === 'Crops and livestock products').years[i - vis.yearMin];
                const worldValueYr = worldValue.years[i - vis.yearMin];
                const africaValueYr = africaValue.years[i - vis.yearMin];
                const nestedEmissionsYr = rD.values.find(d => d.domain === 'Agriculture Total').years[i - vis.yearMin];
                const worldEmissionsYr = worldEmissions.years[i - vis.yearMin];
                const africaEmissionsYr = africaEmissions.years[i - vis.yearMin];
                // Update pop
                nestedFoodYr.pctOfWorld = pctOfWorld;
                nestedFoodYr.targetWorld = Math.round(worldFoodYr.total * pctOfWorld);
                nestedValueYr.pctOfWorld = pctOfWorld;
                nestedValueYr.targetWorld = Math.round(worldValueYr.total * pctOfWorld);
                nestedEmissionsYr.pctOfWorld = pctOfWorld;
                nestedEmissionsYr.targetWorld = Math.round(worldEmissionsYr.total * pctOfWorld);
                nestedFoodYr.pctOfAfrica = pctOfAfrica;
                nestedFoodYr.targetAfrica = Math.round(africaFoodYr.total * pctOfAfrica);
                nestedValueYr.pctOfAfrica = pctOfAfrica;
                nestedValueYr.targetAfrica = Math.round(africaValueYr.total * pctOfAfrica);
                nestedEmissionsYr.pctOfAfrica = pctOfAfrica;
                nestedEmissionsYr.targetAfrica = Math.round(africaEmissionsYr.total * pctOfAfrica);
            }

        }

    }

    /*
    wrangleVis
     */
    wrangleVis() {

        // Init this vis
        const vis = this;

        // ````````````````````````````````````````````````````````````````````````````````````````````` countryData

        // Preserve data w copy
        vis.displayRadarData = vis.radarData.filter(d => {
            if (d.key !== 'Djibouti') {
                return d;
            }
        });

        // Hack regions
        vis.displayRadarData.splice(0, 7);

        // If filter
        if (vis.hovFilter !== '') {

            // on click filter population, largest to smallest
            if (vis.hovFilter.domain === 'Population') {
                vis.displayRadarData.sort(function (a, b) {
                    return b['values'][1]['std2013'] - a['values'][1]['std2013'];
                });
            }

            // on click filter food production, largest to smallest
            if (vis.hovFilter.domain === 'Food Production') {
                vis.displayRadarData.sort(function (a, b) {
                    return b['values'][0]['std2013'] - a['values'][0]['std2013'];
                });
            }

            // on click filter trade value, largest to smallest
            if (vis.hovFilter.domain === 'Trade Value') {
                vis.displayRadarData.sort(function (a, b) {
                    return b['values'][3]['std2013'] - a['values'][3]['std2013'];
                });
            }

            // on click filter emissions, largest to smallest
            if (vis.hovFilter.domain === 'Emissions') {
                vis.displayRadarData.sort(function (a, b) {
                    return b['values'][2]['std2013'] - a['values'][2]['std2013'];
                });
            }
        } else {
            vis.displayRadarData.sort(function (a, b) {
                if (a.key < b.key) {
                    return -1;
                }
                if (a.key > b.key) {
                    return 1;
                }

                // names must be equal
                return 0;
            });
        }

        // Form country data. Created empty array so names wont add each time to chart
        vis.countryData = [];
        vis.displayRadarData.forEach((d, i) => {
            if (vis.selCountry) {
                if (vis.selCountry === d.key) {
                    vis.selIndex = i;
                }
            }
            vis.countryData.push({country: d.key, index: i})
        });

        // update scale
        vis.countryAngleScale.domain([0, vis.countryData.length - 1]);

        // ````````````````````````````````````````````````````````````````````````````````````````````` displayData

        vis.displayData = [];
        vis.displayRadarData.forEach(country => {
            if (country.key === vis.hovCountry) {
                country.values.forEach(domain => {
                    let order = 0;
                    let colorPos = 0;
                    let multiplier = 0;
                    let unit = '';
                    if (domain.domain === 'Annual population') {
                        order = 0;
                        colorPos = 1;
                        multiplier = 1000;
                        unit = 'people';
                    } else if (domain.domain === 'Food Balance Sheets') {
                        order = 1;
                        colorPos = 2;
                        multiplier = 1000;
                        unit = 'tonnes';
                    } else if (domain.domain === 'Crops and livestock products') {
                        order = 2;
                        colorPos = 3;
                        multiplier = 1000;
                        unit = 'usd';
                    } else if (domain.domain === 'Agriculture Total') {
                        order = 3;
                        colorPos = 0;
                        multiplier = 1000;
                        unit = 'gigagrams';
                    }
                    let yearGroup = [];
                    domain.years.forEach(year => {
                        if (year.year === +vis.hovYear || year.year === vis.yearPredictTo) {
                            year.order = order;
                            year.colorPos = colorPos;
                            year.multiplier = multiplier;
                            year.unit = unit;
                            yearGroup.push(year);
                        }
                    });
                    vis.displayData.push(yearGroup);
                });
            }
        });
        // Sort by order
        vis.displayData.sort((a, b) => {
            return a[0].order - b[0].order;
        });

        // Setup legend data
        vis.legendDisplayData = [{
            countryPop: [...vis.displayData][0][0].total * 1000,
            geo: 'Country'
        }, {
            pctOfAfrica: [...vis.displayData][0][0].pctOfAfrica,
            geo: 'Africa'
        }, {
            pctOfWorld: [...vis.displayData][0][0].pctOfWorld,
            geo: 'World'
        },];

        vis.updateVis();

    }

    /*
    updateVis
     */
    updateVis() {

        // Init this vis
        const vis = this;

        // ````````````````````````````````````````````````````````````````````````````````````````````` displayData

        // Append area
        vis.evenArea
            .transition()
            .attr('d', vis.areaMakerEvenWorld(vis.displayData));

        // Append area
        vis.evenAreaAfrica
            .transition()
            .attr('d', vis.areaMakerEvenAfrica(vis.displayData));

        // Append area
        vis.actualArea
            .transition()
            .attr('d', vis.areaMakerActual(vis.displayData));

        // Create handles
        vis.handles = vis.handleG.selectAll('.handle')
            .data(vis.displayData)
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'handle')
                    .each(function (d, i) {
                        // Define this handleG
                        const handleG = d3.select(this);

                        // Add handleArmG
                        const handleArmG = handleG.append('g')
                            .attr('class', 'handleArm')
                            .style('transform', `rotate(${vis.axisAngleScale(i + 1)}deg)`);

                        // Set yScale domain
                        const domainMax = Math.max(d[0].total, d[1].total, d[0].targetWorld,
                            d[1].targetWorld, d[0].targetAfrica, d[1].targetAfrica);
                        vis.yScale
                            .domain([0, domainMax * vis.yScaleDomainSpace]);

                        const domain = vis.quarterData[i].domain.toLowerCase().split(' ').join('');

                        /// Append worldCirc
                        const worldCirc = handleArmG.append('circle')
                            .attr('class', `worldCirc nodeCirc ${domain}Circ`)
                            .attr('r', vis.mainGraphExt * 0.02)
                            .attr('cx', () => {
                                return vis.yScale(d[0].targetWorld)
                            });

                        /// Append africaCirc
                        const africaCirc = handleArmG.append('circle')
                            .attr('class', `africaCirc nodeCirc ${domain}Circ`)
                            .attr('r', vis.mainGraphExt * 0.02)
                            .attr('cx', () => {
                                return vis.yScale(d[0].targetAfrica)
                            });

                        // Append countryCirc
                        const countryCirc = handleArmG.append('circle')
                            .attr('class', `countryCirc nodeCirc ${domain}Circ`)
                            .attr('r', vis.mainGraphExt * 0.02)
                            .attr('cx', () => {
                                return vis.yScale(d[0].total)
                            });

                        // Add events to areas
                        worldCirc.on('mouseover', e => {
                            vis.nodeHov(true);
                        }).on('mouseout', e => {
                            vis.nodeHov(false);
                        });


                        // Add events to areas
                        africaCirc.on('mouseover', e => {
                            vis.nodeHov(true);
                        }).on('mouseout', e => {
                            vis.nodeHov(false);
                        });

                        // Add events to areas
                        countryCirc.on('mouseover', e => {
                            vis.nodeHov(true);
                        }).on('mouseout', e => {
                            vis.nodeHov(false);
                        });
                    }),
                update => update
                    .each(function (d, i) {
                        // Define this handleG
                        const handleG = d3.select(this);
                        // Add handleArmG
                        const handleArmG = handleG.select('.handleArm')
                            .style('transform', `rotate(${vis.axisAngleScale(i + 1)}deg)`);
                        // Set yScale domain
                        let domainMax = null;
                        if (vis.hovYear < 2063) {
                            domainMax = Math.max(d[0].total, d[1].total, d[0].targetWorld, d[1].targetWorld, d[0].targetAfrica, d[1].targetAfrica);
                        } else {
                            domainMax = Math.max(d[0].total, d[0].targetWorld, d[0].targetAfrica);
                        }
                        vis.yScale
                            .domain([0, domainMax * vis.yScaleDomainSpace]);
                        /// Append countryCirc
                        handleArmG.select('.countryCirc')
                            .transition()
                            .attr('r', vis.mainGraphExt * 0.02)
                            .attr('cx', () => {
                                return vis.yScale(d[0].total)
                            });
                        /// Append worldCirc
                        handleArmG.select('.worldCirc')
                            .transition()
                            .attr('r', vis.mainGraphExt * 0.02)
                            .attr('cx', () => {
                                return vis.yScale(d[0].targetWorld)
                            });
                        /// Append africaCirc
                        handleArmG.select('.africaCirc')
                            .transition()
                            .attr('r', vis.mainGraphExt * 0.02)
                            .attr('cx', () => {
                                return vis.yScale(d[0].targetAfrica)
                            });
                    }),
                exit => exit.remove()
            );

        // Build legend
        vis.legendG.selectAll('.geoG')
            .data(vis.legendDisplayData)
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'geoG')
                    .each(function (d, i) {
                        // Get this geoG
                        const geoG = d3.select(this)
                            .style('transform', `translate(
                            ${(vis.legendCoords.length - 1 - i) * (vis.legendOffset * 1.8)}px, 
                            ${i * (vis.legendOffset * 3)}px
                        )`);
                        // Build path
                        geoG.append('path')
                            .attr('class', `${d.geo.toLowerCase()}LegendPath legendPath`)
                            .attr('d', vis.legendPathMaker(vis.legendCoords));
                        // Write label
                        geoG.append('text')
                            .attr('class', 'legendLabel')
                            .text(() => {
                                if (d.geo === 'Country') {
                                    if (vis.selCountry) {
                                        return vis.selCountry;
                                    } else if (vis.hovCountry) {
                                        return vis.hovCountry;
                                    }
                                }
                                return d.geo;
                            })
                            .style('transform', `translateX(${vis.legendOffset * 1.5}px)`);
                        geoG.append('text')
                            .attr('class', 'legendSubLabel legendSubLabel1')
                            .style('transform', `translate(${vis.legendOffset * 1.8}px, ${vis.legendOffset * 1.2}px)`)
                            .text(() => {
                                if (d.geo === 'Country') {
                                    return `Population: ${d3.format('.2f')(d.countryPop / 1000000)}m`;
                                } else if (d.geo === 'Africa') {
                                    return `${d3.format('.2%')(d.pctOfAfrica)} of pop.`;
                                } else {
                                    return `${d3.format('.2%')(d.pctOfWorld)} of pop.`;
                                }
                            });
                    }),
                update => update
                    .each(function (d, i) {
                        // Get this geoG
                        const geoG = d3.select(this);
                        // Write label
                        geoG.select('.legendLabel')
                            .text(() => {
                                if (d.geo === 'Country') {
                                    if (vis.selCountry) {
                                        return vis.selCountry;
                                    } else if (vis.hovCountry) {
                                        return vis.hovCountry;
                                    }
                                }
                                return d.geo;
                            })
                            .style('transform', `translateX(${vis.legendOffset * 1.5}px)`);
                        geoG.select('.legendSubLabel1')
                            .text(() => {
                                if (d.geo === 'Country') {
                                    return `Population: ${d3.format('.2f')(d.countryPop / 1000000)}m`;
                                } else if (d.geo === 'Africa') {
                                    return `${d3.format('.2%')(d.pctOfAfrica)} of pop.`;
                                } else {
                                    return `${d3.format('.2%')(d.pctOfWorld)} of pop.`;
                                }
                            })
                    }),
                exit => exit
            );

        // Append country labels
        vis.countryGs = vis.countryLabelG.selectAll('.countryG')
            .data(vis.countryData, d => d.country)
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'countryG')
                    .each(function (d, i) {
                        // Get this countryG
                        const countryG = d3.select(this);
                        // Rotate each
                        countryG
                            .style('transform', `rotate(${vis.countryAngleScale(i)}deg)`);

                        // Append tick
                        countryG.append('line')
                            .attr('class', 'grabCountryLine')
                            .attr('x1', 0)
                            .attr('y1', vis.mainGraphExt * vis.labelOffset)
                            .attr('x2', 0)
                            .attr('y2', vis.mainGraphExt * (vis.labelOffset + 0.51));

                        // Append tick
                        const countryLineBack = countryG.append('line')
                            .attr('class', 'countryLineBack')
                            .attr('x1', 0)
                            .attr('y1', vis.mainGraphExt * vis.labelOffset)
                            .attr('x2', 0)
                            .attr('y2', () => vis.mainGraphExt * (vis.labelOffset + 0.51));
                        if (d.country === vis.hovCountry) {
                            countryLineBack.classed('countryLineBackHov', true);
                        }

                        // Append label
                        const country = countryG.append('g')
                            .attr('class', 'country')
                            .style('transform', `translateY(${vis.mainGraphExt * vis.labelOffset}px)`)
                        const countryListText = country.append('text')
                            .attr('class', 'countryListText')
                            .style('transform', `rotate(90deg) translateY(1px)`)
                            .text(() => {
                                if (vis.hovFilter !== '') {
                                    return (i + 1) + '. ' + d.country;
                                } else {
                                    return d.country;
                                }
                            });
                        if (d.country === vis.hovCountry) {
                            countryListText.classed('countryListTextHov', true);
                        }

                        // Add event to countryLabel
                        countryG.on('mouseover', e => {

                            // Check area
                            vis.areaSelCheck();

                            // Clear
                            d3.select('.countryLineBackHov')
                                .classed('countryLineBackHov', false);
                            d3.select('.countryListTextHov')
                                .classed('countryListTextHov', false);

                            // Set
                            const target = d3.event.currentTarget;

                            // Style
                            d3.select(target).select('.countryLineBack')
                                .classed('countryLineBackHov', true);
                            d3.select(target).select('.countryListText')
                                .classed('countryListTextHov', true);

                            // If selected block not active
                            if (!vis.selCountry) {
                                vis.hovCountry = e.country;
                                vis.wrangleVis();
                            }
                        }).on('mouseout', e => {
                            // If selected  block not active
                            if (vis.selCountry) {
                                // Clear
                                d3.select('.countryLineBackHov')
                                    .classed('countryLineBackHov', false);
                                d3.select('.countryListTextHov')
                                    .classed('countryListTextHov', false);
                            }
                        }).on('click', e => {
                            // Delegate
                            countryClick(e);
                        });

                        // Add events to TIMEGs
                        vis.selCountryG.on('click', e => {
                            // Delegate
                            countryClick(e);
                        });

                        /*
                        countryClick
                         */
                        function countryClick(e) {

                            if (e) {
                                if (e.country !== vis.selCountry) {
                                    // Clear
                                    d3.select('.selCountryDot')
                                        .classed('selCountryDot', false);
                                    d3.select('.countryListTextSel')
                                        .classed('countryListTextSel', false);

                                    // Set
                                    const target = d3.event.currentTarget;
                                    vis.hovCountry = e.country;
                                    vis.selCountry = e.country;
                                    vis.selIndex = e.index;

                                    // Style
                                    vis.selCountryG
                                        .transition()
                                        .style('transform', `rotate(${vis.countryAngleScale(e.index)}deg) 
                                        translateY(${vis.mainGraphExt * 1.24}px)`);
                                    vis.selCountryG.select('.countryDot')
                                        .classed('selCountryDot', true);
                                    d3.select(target).select('.countryListText')
                                        .classed('countryListTextSel', true);


                                    // Wrangle
                                    vis.wrangleVis();
                                } else {
                                    // Clear
                                    d3.select('.selCountryDot')
                                        .classed('selCountryDot', false);
                                    d3.select('.countryListTextSel')
                                        .classed('countryListTextSel', false);

                                    // Set
                                    vis.selCountry = '';
                                    vis.selIndex = null;
                                }
                            } else {
                                // Clear
                                d3.select('.selCountryDot')
                                    .classed('selCountryDot', false);
                                d3.select('.countryListTextSel')
                                    .classed('countryListTextSel', false);

                                // Set
                                vis.selCountry = '';
                                vis.selIndex = null;
                            }
                        }
                    }),
                update => update
                    .each(function (d, i) {
                        // Get this countryG
                        const countryG = d3.select(this);
                        // Rotate each
                        countryG
                            .transition()
                            .style('transform', `rotate(${vis.countryAngleScale(i)}deg)`);
                        // Append label
                        countryG.select('.country')
                            .style('transform', `translateY(${vis.mainGraphExt * vis.labelOffset}px)`)
                            .select('text')
                            .text(() => {
                                if (vis.hovFilter !== '') {
                                    return (i + 1) + '. ' + d.country;
                                } else {
                                    return d.country;
                                }
                            });
                        // Update selection indicator
                        vis.selCountryG
                            .transition()
                            .style('transform', `rotate(${vis.countryAngleScale(vis.selIndex)}deg) 
                                translateY(${vis.mainGraphExt * 1.24}px)`);
                    }),
                exit => exit.remove()
            );

        // Add events to COUNTRYGs
        vis.countryLabelG
            .on("touchstart", countryTouch)
            .on("touchmove", countryTouch)
            .on("touchend", countryTouch);
        function countryTouch() {
            if (typeof d3.event.cancelable !== 'boolean' || d3.event.cancelable) {
                d3.event.preventDefault();
            }
            // Get located
            const myLocation = d3.event.changedTouches[0];
            const realTarget = document.elementFromPoint(myLocation.clientX, myLocation.clientY);
            const targetParent = realTarget ? d3.select(realTarget.parentElement) : null;
            if (targetParent && targetParent.attr('class') === 'countryG') {
                // Clear
                d3.select('.countryLineBackHov')
                    .classed('countryLineBackHov', false);
                d3.select('.countryListTextHov')
                    .classed('countryListTextHov', false);
                // Add styles
                targetParent.select('.countryLineBack')
                    .classed('countryLineBackHov', true);
                targetParent.select('.countryListText')
                    .classed('countryListTextHov', true);
                // Update sel year
                targetParent.each(d => {
                    vis.hovCountry = d.country;
                    vis.selCountry = d.country;
                    vis.selIndex = d.index;
                });
                vis.selCountryG
                    .transition()
                    .style('transform', `rotate(${vis.countryAngleScale(vis.selIndex)}deg) 
                                        translateY(${vis.mainGraphExt * 1.24}px)`);
                vis.selCountryG.select('.countryDot')
                    .classed('selCountryDot', true);
                // Update legend
                // Wrangle vis
                vis.wrangleVis();
            }
        }

    }

    /*
    nodeHov
     */
    nodeHov(visible) {

        // Get circs
        let domain = d3.select(d3.event.target).attr('class').split(' ')[2];
        const circs = d3.selectAll(`.${domain}`);

        if (visible) {
            // Make visible
            circs.classed(`${domain}Hov`, true);
        } else {
            // Make visible
            circs.classed(`${domain}Hov`, false);
        }

        // Init this vis
        const vis = this;
    }

    /*
    nodeDisplay
     */
    nodeDisplay(loc, visible) {

        // Init this vis
        const vis = this;

        if (visible) {
            if (vis.nodeSelGeo) {
                if (vis.nodeSelGeo === loc) {
                    // Fetch
                    d3.selectAll('.resText textPath')
                        .text((d, i) => {
                            const dD = vis.displayData[i][0];
                            if (loc === 'country') {
                                return d3.format(',')(dD.total * dD.multiplier) + ' ' + dD.unit
                            } else if (loc === 'africa') {
                                return d3.format(',')(dD.targetAfrica * dD.multiplier) + ' ' + dD.unit
                            } else {
                                return d3.format(',')(dD.targetWorld * dD.multiplier) + ' ' + dD.unit
                            }
                        });
                }
            } else {
                // Fetch
                d3.selectAll('.resText textPath')
                    .text((d, i) => {
                        const dD = vis.displayData[i][0];
                        if (loc === 'country') {
                            return d3.format(',')(dD.total * dD.multiplier) + ' ' + dD.unit
                        } else if (loc === 'africa') {
                            return d3.format(',')(dD.targetAfrica * dD.multiplier) + ' ' + dD.unit
                        } else {
                            return d3.format(',')(dD.targetWorld * dD.multiplier) + ' ' + dD.unit
                        }
                    });
            }
        } else {
            if (!this.nodeSel) {
                // Fetch
                d3.selectAll('.resText textPath')
                    .text('');
            }
        }
    }

    /*
    areaSel
     */
    areaSelCheck(loc, status) {

        // Init this vis
        const vis = this;

        // Check
        if (vis.nodeSel) {
            if (vis.nodeSelGeo === 'country') {
                vis.nodeDisplay('country', true);
            } else if (vis.nodeSelGeo === 'africa') {
                vis.nodeDisplay('africa', true);
            } else if (vis.nodeSelGeo === 'world') {
                vis.nodeDisplay('world', true);
            }
        }
    }

    /*
    areaSelCheck
     */
    areaSel(loc, status) {

        // Init this vis
        const vis = this;

        if (!vis.nodeSel) {
            // Define
            vis.nodeSel = true;
            vis.nodeSelGeo = loc;
            // Reclass
            d3.selectAll(`.${loc}Circ`)
                .classed(`${loc}CircSel`, true);

        } else {
            if (vis.nodeSelGeo === loc) {
                // Define
                vis.nodeSel = false;
                vis.nodeSelGeo = '';
                // Reclass
                d3.selectAll(`.${loc}Circ`)
                    .classed(`${loc}CircSel`, false);
            } else {
                // Reset
                d3.selectAll(`.nodeCirc`)
                    .classed(`countryCircHov`, false)
                    .classed(`africaCircHov`, false)
                    .classed(`worldCircHov`, false)
                    .classed(`countryCircSel`, false)
                    .classed(`africaCircSel`, false)
                    .classed(`worldCircSel`, false);
                // Define
                vis.nodeSelGeo = loc;
                // Reclass
                d3.selectAll(`.${loc}Circ`)
                    .classed(`${loc}CircSel`, true);
                // Reload content
                vis.nodeDisplay(loc, true);
            }
        }

    }


    /*
    areaHov
     */
    areaHov(loc, status) {

        // Init this vis
        const vis = this;

        if (vis.nodeSelGeo !== loc) {
            // Clear
            if (status) {
                // Reclass
                d3.selectAll(`.${loc}Circ`)
                    .classed(`${loc}CircHov`, true);
            } else {
                // Reclass
                d3.selectAll(`.${loc}Circ`)
                    .classed(`${loc}CircHov`, false);
            }
        }
    }

}

/*
 Ref.
   + https://pages.uoregon.edu/rgp/PPPM613/class8a.htm
   + https://stackoverflow.com/questions/43592987/svg-transformation-flip-horizontally
   + https://www.toptal.com/designers/htmlarrows/arrows/
   + https://stackoverflow.com/questions/3918842/how-to-find-out-the-actual-event-target-of-touchmove-javascript-event
 */
