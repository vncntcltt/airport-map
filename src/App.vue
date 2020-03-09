<template>
  <div id="app" v-if="airports">
    <main class="content">
      <MapContainer :airports="airports" @airport-selection-update="onAirportSelectionUpdate" ref="mapContainer" />
      <SelectedAirports
        :selectedAirports="selectedAirports"
        @unselect-airports="onAirportsUnselect"
        @unselect-airport="onAirportUnselect"
      />
    </main>
  </div>
</template>

<script>
import MapContainer from '@/components/MapContainer.vue'
import SelectedAirports from '@/components/SelectedAirports'

export default {
  components: {
    MapContainer,
    SelectedAirports
  },
  data() {
    return {
      airports: null,
      selectedAirports: []
    }
  },
  mounted() {
    const vm = this
    fetch('/data/airports.json')
      .then(res => res.json())
      .then(airportData => {
        vm.airports = vm.processAirports(airportData)
      })
  },
  methods: {
    processAirports(airportData) {
      return Object.values(airportData)
        .filter(airport => Boolean(airport.iata) && Boolean(airport.icao))
        .map(apt => ({ ...apt, code: apt.iata }))
    },
    onAirportSelectionUpdate(selectedAirportCodes) {
      const selectedAirports = []
      for (const airportCode of selectedAirportCodes) {
        const airport = this.airports.find(apt => apt.code === airportCode)
        if (airport) {
          selectedAirports.push(airport)
        }
      }
      this.selectedAirports = selectedAirports
    },
    onAirportsUnselect() {
      this.$refs.mapContainer.unselectAirports()
    },
    onAirportUnselect(airportCode) {
      this.$refs.mapContainer.unselectAirport(airportCode)
    }
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  justify-content: center;
}
.content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-width: 1200px;
  padding: 5px;
}
</style>
