/* global window,document,fetch */
import React, {Component} from 'react';
import {render} from 'react-dom';
import DeckGL, {ScatterplotLayer} from 'deck.gl';
import ReactMapGL, {NavigationControl} from 'react-map-gl';
import * as d3 from 'd3';

import "./index.css";
import mapStyle from "./style.json";


const GEOJSON = 'http://insights.nzherald.co.nz/apps/nz-placenames/out.csv'


class Root extends Component {
  constructor(props) {
    super(props);
    this._hovered = this._hovered.bind(this);
    this._updateViewport = this._updateViewport.bind(this);
    this.state = {
      viewport: {
        latitude: -41,
        longitude: 175,
        zoom: 4,
        bearing: 0,
        pitch: 0
      },
      width: 500,
      height: 500,
      data: null,
      hovered: null
    };

    d3.csv(GEOJSON, d => {
      this.setState({data: d.map(p => ({...p, color: p.reo === '0' ? [40,80,255,128] : [255,80,40,128]}))})

    })
      // .then(data => this.setState({data}));
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  _resize() {
    this.setState({
      width: Math.min(window.innerWidth, 960),
      height: Math.min(window.innerHeight * 0.8, 500)
    });
  }

  _hovered(info) {
    if (info.picked) {
      this.setState({hovered: info.object})
    } else {
      this.setState({hovered: null})
    }
    
  }

  _updateViewport(v) {
    v.latitude = Math.min(-34,v.latitude);
    v.latitude = Math.max(-47,v.latitude);
    if (v.longitude < 0) {
      v.longitude = Math.min(-174,v.longitude);
    } else {
      v.longitude = Math.max(173,v.longitude);
    }
    this.setState({viewport: v})
  }

  render() {
    const {viewport, width, height, data, hovered} = this.state;

    return (
      <div>
        <div className={"tooltip" + (hovered && hovered.reo === '0' ? " blue" : " red") }
          style= {{visibility: (hovered ? "visible" : "hidden")}}>
            {hovered && hovered.name}</div>
      <ReactMapGL
        {...viewport}
        width={width}
        height={height}
        mapStyle={mapStyle}
        mapboxApiAccessToken='pk.eyJ1IjoibnpoZXJhbGQiLCJhIjoiSVBPNHM0cyJ9.PDW_j3xU8w-wTnKCpnshPg'
        onViewportChange={this._updateViewport}
        minZoom={4}
        maxZoom={14}
      >
        <DeckGL
          {...viewport}
          width={width}
          height={height}
          debug
          layers={[
            new ScatterplotLayer({
              id: 'scatterplot-layer',
              data,
              radiusScale: (viewport.zoom > 10 ? (viewport.zoom > 12 ? 500 : 2000) : 3000)/viewport.zoom,
              pickable: true,
              onHover: this._hovered,
              onClick: this._hovered,
              radiusMinPixels: 0.05,
              getPosition: d => [d.x, d.y, 0],
              getColor: d => d.color,
              getRadius: d => 2.5
            })
          ]}
        />
      <div style={{position: 'absolute', right: 0}}>
        <NavigationControl onViewportChange={this._updateViewport} />
      </div>
      </ReactMapGL>
    </div>
    );
  }
}

render(<Root />, document.getElementById('root'));
