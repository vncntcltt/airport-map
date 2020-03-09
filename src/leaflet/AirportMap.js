import L, { Icon, Evented } from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet-lasso'

import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import LTogglableMarker from './LTogglableMarker'

//* Fix webpack issues with marker images
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default Evented.extend({
  add(containerId, airports) {
    this.map = L.map(containerId).setView([0, 0], 5)
    this.airportMarkers = []

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      minZoom: 1,
      maxZoom: 12,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }).addTo(this.map)

    L.control.scale().addTo(this.map)

    const airportClusterGroup = L.markerClusterGroup()
    for (const airport of airports) {
      const airportMarker = new LTogglableMarker([airport.lat, airport.lon], {
        title: `${airport.name} (${airport.code})`,
        itemId: airport.code,
        toggledIconClassName: 'toggled-airport'
      })
      airportMarker.on('marker.toggled', this._onAirportToggled, this)
      this.airportMarkers.push(airportMarker)
      airportClusterGroup.addLayer(airportMarker)
    }
    this.map.addLayer(airportClusterGroup)

    L.control.lasso({ position: 'topleft' }).addTo(this.map)
    this.map.on('lasso.finished', this._onLassoFinished, this)
  },

  remove() {
    if (this.map) {
      this._removeAirportMarkersEvents()
      this.map.off('lasso.finished', this._onLassoFinished, this)
      this.map.remove()
    }
  },

  unselectAirports() {
    this.airportMarkers.forEach(airportMarker => {
      airportMarker.unselect()
    })
  },

  unselectAirport(airportCode) {
    const airportMarker = this.airportMarkers.find(marker => marker.itemId === airportCode)
    if (airportMarker) {
      airportMarker.unselect()
    }
  },

  _onLassoFinished(event) {
    this.unselectAirports()
    const selectedAirportCodes = []
    const selectedMarkers = []
    this._addSelectedMarkers(event.layers, selectedMarkers)
    selectedMarkers.forEach(airportMarker => {
      airportMarker.select()
      selectedAirportCodes.push(airportMarker.itemId)
    })
    this.fire('airports.selected', { selectedAirportCodes: selectedAirportCodes })
  },

  _onAirportToggled(event) {
    this.fire('airport.toggled', { airportCode: event.itemId })
  },

  _removeAirportMarkersEvents() {
    this.airportMarkers.forEach(airportMarker => {
      airportMarker.off('airport.toggled', this._onAirportToggled, this)
    })
  },

  _addSelectedMarkers(layers, selectedMarkers) {
    for (const layer of layers) {
      if (layer instanceof LTogglableMarker) {
        selectedMarkers.push(layer)
      } else if (layer instanceof L.MarkerCluster) {
        this._addSelectedMarkers(layer.getAllChildMarkers(), selectedMarkers)
      }
    }
  }
})
