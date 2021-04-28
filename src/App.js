import logo from './logo.svg';
import './App.css';
import React from 'react';

// React Google Maps Module
import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

import Geocode from 'react-geocode';

// set API for Geocode
Geocode.setApiKey("Google API");

class App extends React.Component {

  state = {
    address: "",
    city: "",
    area: "",
    state: "",
    zoom: 15,
    height: 400,
    mapPosition: {
      lat: 0,
      lng: 0
    },
    markerPosition: {
      lat: 0,
      lng: 0
    }
  };

  // get the city information
  getCity = (addressArray) => {
    let city = "";
    for (let index = 0; index < addressArray.length; index++) {
      if (addressArray[index].types[0] && 'administrative_area_2' === addressArray[index].types[0]) {
        city = addressArray[index].long_name;
        return city;
      }
    }
  };

  // get the area information
  getArea = (addressArray) => {
    let area = "";
    for (let index = 0; index < addressArray.length; index++) {
      if (addressArray[index].types[0]) {
        for (let j = 0; j < addressArray.length; j++) {
          if ('sublocality_leve_1' === addressArray[index].types[j] || 'locality' === addressArray[index].types[j]) {
            area = addressArray[index].long_name;
            return area;
          }
        }
      }
    }
  };

  // get the state information
  getState = (addressArray) => {
    let state = "";
    for (let index = 0; index < addressArray.length; index++) {
      for (let index = 0; index < addressArray.length; index++) {
        if (addressArray[index].types[0 && 'administrative_area_level_1' === addressArray[index].types[0]]) {
          state = addressArray[index].long_name;
          return state;
        }
      }
    }
  };

  // detect last drag position to get last lat and lng
  onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat();
    let newLng = event.latLng.lng();

    // using Geocode
    Geocode.fromLatLng(newLat, newLng)
      .then(response => {

        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);

        console.log(city, area, state);

        this.setState({
          address: (address) ? address : "",
          area: (area) ? area : "",
          city: (city) ? city : "",
          state: (state) ? state : "",
          mapPosition: {
            lat: newLat,
            lng: newLng
          },
          markerPosition: {
            lat: newLat,
            lng: newLng
          },
        });
      })
  };

  render() {
    const MapWithAMarker = withScriptjs(withGoogleMap(props =>
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}>

        <Marker
          draggable={true}
          onDragEnd={this.onMarkerDragEnd}
          position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lat }}>

          <InfoWindow>
            <div>Hello!</div>
          </InfoWindow>

        </Marker>
      </GoogleMap>
    ));

    return (
      <MapWithAMarker
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=Google API&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }
}

export default App;
