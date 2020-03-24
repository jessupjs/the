'use strict';

class Boxes {

    // Configs
    w = 375;
    h = this.w * 3 / 2;

    constructor(_data, _ref) {
        this.data = JSON.parse(JSON.stringify(_data));
        console.log('! Data !')
        console.log(this.data)
        this.parent = _ref;

        this.initVis()
    }

    initVis() {
        // Get this vis
        const vis = this;

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
            .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.right}px`);

        // Build boxesG
        vis.boxesG = vis.g.append('g')
            .attr('class', 'boxesG')
            .style('transform', `translate(${vis.gW / 2}px, ${vis.gH / 2}px`);

        // Major defs
        vis.padding = 6;

        // Author pic defs
        vis.author = vis.data.book.authors.author.name;
        vis.authorPicUrl = vis.data.book.authors.author.image_url['#text'];
        vis.authorSize = 100;

        // Append author image
        vis.authorG = vis.boxesG.append('g')
            .attr('class', 'vis.authorG');
        vis.authorG.append('defs')
            .append('clipPath')
            .attr('id', 'image-clip')
            .append('rect')
            .attr('x', -vis.authorSize / 2)
            .attr('y', -vis.authorSize / 2)
            .attr('width', vis.authorSize)
            .attr('height', vis.authorSize);
        vis.authorG.append('image')
            .attr('clip-path', 'url(#image-clip)')
            .attr('xlink:href', vis.authorPicUrl)
            .attr('x', -vis.authorSize / 2)
            .attr('y', -vis.authorSize / 2)
            .attr('width', vis.authorSize);

        // Ratings defs
        vis.workRatingsCount = vis.data.book.work.ratings_count['#text'];
        vis.workAverageRating = vis.data.book.average_rating;
        vis.workTextReviewsCount = vis.data.book.work.text_reviews_count['#text'];
        vis.authorRatingsCount = vis.data.book.authors.author.ratings_count;
        vis.authorAverageRating = vis.data.book.authors.author.average_rating;
        vis.authorTextReviewsCount = vis.data.book.authors.author.text_reviews_count;
        let workRatingDist = vis.data.book.work.rating_dist;
        workRatingDist = workRatingDist.split('|');
        workRatingDist.pop();
        vis.workRatingDist = [];
        workRatingDist.forEach(d => {
            const split = d.split(':');
            vis.workRatingDist.push({rating: split[0], count: split[1]});
        });

        // Scale ratingsCount
        vis.ratingsCountScale = d3.scaleLinear()
            .domain([0, vis.authorRatingsCount])
            .range([0, vis.authorSize - ((vis.workRatingDist.length + 1) * vis.padding)]);

        // Append ratingsCount g
        vis.ratingsG = vis.boxesG.append('g')
            .attr('class', 'ratingsCountG')
            .style('transform', `translate(${vis.authorSize * 0.5+ vis.padding}px, -${vis.authorSize * 0.5 + vis.padding}px)`);
        vis.ratingsG.append('g')
            .datum(vis.authorRatingsCount)
            .attr('class', 'authorRatingsCount author')
            .append('rect')
            .attr('width', d => vis.ratingsCountScale(d))
            .attr('height', d => vis.ratingsCountScale(d))
            .attr('y', d => -vis.ratingsCountScale(d));
        vis.ratingsG.append('g')
            .datum(vis.workRatingsCount)
            .attr('class', 'workRatingsCount work')
            .append('rect')
            .attr('width', d => vis.ratingsCountScale(d))
            .attr('height', d => vis.ratingsCountScale(d))
            .attr('y', d => -vis.ratingsCountScale(d));

        // Scale ratings
        vis.ratingScale = d3.scaleLinear()
            .domain([0, 5])
            .range([0, vis.ratingsCountScale(vis.authorRatingsCount * 0.5)]);

        // Append rating
        vis.ratingsG.append('g')
            .datum(vis.authorAverageRating)
            .attr('class', 'authorAverageRating author')
            .style('transform', `translateX(${-vis.padding}px)`)
            .append('rect')
            .attr('width', d => vis.ratingScale(d))
            .attr('height', d => vis.ratingScale(d))
            .attr('x', d => -vis.ratingScale(d))
            .attr('y', d => -vis.ratingScale(d));

        // Append rating
        vis.ratingsG.append('g')
            .datum(vis.workAverageRating)
            .attr('class', 'workAverageRating work')
            .style('transform', `translateY(${vis.padding}px)`)
            .append('rect')
            .attr('width', d => vis.ratingScale(d))
            .attr('height', d => vis.ratingScale(d));

        // Append reviewsG
        vis.reviewsG = vis.boxesG.append('g')
            .attr('class', 'reviewsCountG')
            .style('transform', `translate(${vis.authorSize * 0.5+ vis.padding}px, ${vis.authorSize * 0.5 + vis.padding}px)`);
        vis.reviewsG.append('g')
            .datum(vis.authorTextReviewsCount)
            .attr('class', 'authorReviewsCount author')
            .append('rect')
            .attr('width', d => vis.ratingsCountScale(d))
            .attr('height', d => vis.ratingsCountScale(d));
        vis.reviewsG.append('g')
            .datum(vis.workTextReviewsCount)
            .attr('class', 'workReviewssCount work')
            .append('rect')
            .attr('width', d => vis.ratingsCountScale(d))
            .attr('height', d => vis.ratingsCountScale(d));

        // Build frame
        vis.buildFrame();

        // :^)
        vis.wrangleData();
    }

    /*
    wrangleData
     */
    wrangleData() {
        // Get this vis
        const vis = this;


        // :^)
        vis.updateVis();

    }

    /*
    updateVis
     */
    updateVis() {
        // Get this vis
        const vis = this;

    }

    /*
    buildFrame
     */
    buildFrame() {
        // Define this
        const vis = this;

        // Config
        const smallSd = 10;

        // Capture colors
        vis.cover = vis.data.add_ons.cover;

        vis.frameG = vis.svg.append('g')
            .attr('class', 'frameG');
        vis.frameG.append('rect')
            .attr('x', smallSd * 2)
            .attr('y', smallSd)
            .attr('width', vis.w - smallSd * 4)
            .attr('height', smallSd)
            .attr('fill', vis.cover.colors[0]);
        vis.frameG.append('rect')
            .attr('x', vis.w - smallSd * 2)
            .attr('y', smallSd * 2)
            .attr('width', smallSd)
            .attr('height', vis.h - smallSd * 4)
            .attr('fill', vis.cover.colors[1]);
        vis.frameG.append('rect')
            .attr('x', smallSd * 2)
            .attr('y', vis.h - smallSd * 2)
            .attr('width', vis.w - smallSd * 4)
            .attr('height', smallSd)
            .attr('fill', vis.cover.colors[2]);
        vis.frameG.append('rect')
            .attr('x', smallSd)
            .attr('y', smallSd * 2)
            .attr('width', smallSd)
            .attr('height', vis.h - smallSd * 4)
            .attr('fill', vis.cover.colors[3]);

    }


}