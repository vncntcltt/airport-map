<template>
  <div id="airportMap" ref="airportMap" />
</template>

<script>
import AirportMap from '../leaflet/AirportMap'

export default {
  props: {
    airports: Array
  },
  data() {
    return {
      map: new AirportMap(),
      selectedAirports: []
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      const mapId = this.$refs.airportMap.getAttribute('id')
      this.map.add(mapId, this.airports)
      this.map.on('airports.selected', this.onAirportsSelected, this)
      this.map.on('airport.toggled', this.onAirportToggled, this)
    })
  },
  beforeDestroy() {
    this.map.off('airports.selected', this.onAirportsSelected, this)
    this.map.off('airport.toggled', this.onAirportToggled, this)
    this.map.remove()
  },
  methods: {
    onAirportsSelected({ selectedAirportCodes }) {
      this.selectedAirports = selectedAirportCodes
      this.$emit('airport-selection-update', this.selectedAirports)
    },
    onAirportToggled({ airportCode }) {
      const airportIndex = this.selectedAirports.indexOf(airportCode)
      if (airportIndex > -1) {
        this.selectedAirports.splice(airportIndex, 1)
      } else {
        this.selectedAirports.push(airportCode)
      }
      this.$emit('airport-selection-update', this.selectedAirports)
    },
    unselectAirports() {
      this.map.unselectAirports()
      this.selectedAirports = []
      this.$emit('airport-selection-update', this.selectedAirports)
    },
    unselectAirport(airportCode) {
      this.map.unselectAirport(airportCode)
      const airportIndex = this.selectedAirports.indexOf(airportCode)
      if (airportIndex > -1) {
        this.selectedAirports.splice(airportIndex, 1)
      }
      this.$emit('airport-selection-update', this.selectedAirports)
    }
  }
}
</script>

<style>
#airportMap {
  height: 500px;
}
.toggled-airport {
  filter: hue-rotate(150deg);
}
</style>
