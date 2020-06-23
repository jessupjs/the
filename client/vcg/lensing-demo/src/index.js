import './index.css';
import * as osd from 'openseadragon';
import * as l from 'lensing';
// NPM link work around
// import * as l from '../../lensing/src/index';

// Image
const target = 'viewer'
const image = 'PIA23533_index32.dzi'

// Config
const viewer_config = {
    id: target,
    prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
    tileSources: `./assets/${image}`,
    homeFillsViewer: true,
    visibilityRatio: 1.0
}

// Instantiate viewer
const viewer = osd(viewer_config);

// Instantiate Lensing
viewer.lensing = l.construct(osd, viewer, viewer_config);