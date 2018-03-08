import React, {Component} from 'react';
import {render} from 'react-dom';
import DeckGL, {ScatterplotLayer} from 'deck.gl';
import ReactMapGL, {NavigationControl} from 'react-map-gl';
import { csv } from 'd3-fetch';

import "./index.css";
import mapStyle from "./style.json";

console.log(process.env.PUBLIC_URL)
const GEOJSON = `${process.env.NODE_ENV==='production' ? process.env.PUBLIC_URL + '/' : ""}out.csv`
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOXACCESSTOKEN;


class Root extends Component {
  state = {
    viewport: {
      latitude: -41.1,
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

  componentDidMount() {
    csv(GEOJSON).then(d => {
      this.setState({data: d.map(p => ({...p, color: p.reo === '0' ? [40,80,255,128] : [255,80,40,128]}))})
    })
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  _resize = () => {
    this.setState({
      width: Math.min(window.innerWidth, 960),
      height: Math.min(window.innerHeight * 0.8, 500)
    });
  }

  _hovered = info => {
    if (info.picked) {
      this.setState({hovered: info.object})
    } else {
      this.setState({hovered: null})
    }
  }

  _updateViewport = v => {
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
          mapboxApiAccessToken={MAPBOX_TOKEN}
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
