// @flow
import React, { Component, PropTypes } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { connect, type Connector } from 'react-redux';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { loadMarkers } from '../../../redux/modules/proposal';
import LocateControl from './LocateControl';
import config from '../../../config';
import type { Dispatch, State } from '../../../types';

type MapCenterObject = {
  lat: number,
  lng: number,
};

type MapOptions = {
  center: MapCenterObject,
  zoom: number,
};

type Props = {
  markers: ?Object,
  defaultMapOptions: MapOptions,
  visible: boolean,
  stepId: string,
  stepType: string,
  dispatch: Dispatch,
};

type ParentProps = {
  defaultMapOptions: MapOptions,
  visible: boolean,
};

export const blueMarker = L.icon({
  iconUrl: '/svg/marker.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export class LeafletMap extends Component {
  static propTypes = {
    markers: PropTypes.object,
    defaultMapOptions: PropTypes.object.isRequired,
    visible: PropTypes.bool,
    stepId: PropTypes.string.isRequired,
    stepType: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    markers: null,
    defaultMapOptions: {
      center: { lat: 48.8586047, lng: 2.3137325 },
      zoom: 12,
    },
    visible: true,
  };

  static getStringPopup(marker: Object) {
    return `
        <h2 class="h4 proposal__title">
          <a href="${marker.url}">${marker.title}</a>
        </h2>
        Par : <a href="${marker.author.url}">${marker.author.username}</a>
      `;
  }

  componentDidMount() {
    const { dispatch, stepId, stepType, visible } = this.props;
    if (visible) {
      dispatch(loadMarkers(stepId, stepType));
    }
  }

  // $FlowFixMe
  componentDidUpdate(prevProps) {
    const { dispatch, stepId, stepType, visible } = this.props;
    if (visible && prevProps.visible !== visible) {
      dispatch(loadMarkers(stepId, stepType));
    }
  }

  props: Props;

  render() {
    const { defaultMapOptions, markers, visible } = this.props;
    const token = config.mapboxApiKey;
    if (!visible) {
      return null;
    }

    const markersList =
      markers && markers.markers && markers.markers.length > 0
        ? markers.markers.map(mark => ({
            lat: mark.lat,
            lng: mark.lng,
            popup: LeafletMap.getStringPopup(mark),
            options: { icon: blueMarker },
          }))
        : [];

    return (
      <Map
        center={defaultMapOptions.center}
        zoom={defaultMapOptions.zoom}
        maxZoom={18}
        style={{
          width: '100%',
          height: '50vw',
        }}>
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/capcollectif/cj4zmeym20uhr2smcmgbf49cz/tiles/256/{z}/{x}/{y}?access_token=${token}`}
        />
        <MarkerClusterGroup
          wrapperOptions={{ enableDefaultStyle: true }}
          options={{
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            maxClusterRadius: 30,
          }}
          markers={markersList}
        />
        <LocateControl />
      </Map>
    );
  }
}

const mapStateToProps = (state: State) => ({
  markers: state.proposal.markers || {},
  stepId: state.project.currentProjectStepById || '',
  stepType:
    state.project.projectsById[state.project.currentProjectById || '']
      .stepsById[state.project.currentProjectStepById].type,
});

const connector: Connector<ParentProps, Props> = connect(mapStateToProps);

export default connector(LeafletMap);
