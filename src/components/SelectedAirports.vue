<template>
  <div class="selected-box">
    <div v-if="selectedAirports.length">
      <div class="selected-all">
        <a class="removeAction" title="Unselect all" @click="$emit('unselect-airports')">x</a>
        Selected airports ({{ selectedAirports.length }})
      </div>
      <div class="selected-item" v-for="airport in selectedAirports" :key="airport.code">
        <a class="removeAction" title="Unselect" @click="$emit('unselect-airport', airport.code)">x</a>
        {{ airport.name }} ({{ airport.code }})
      </div>
    </div>
    <div v-else>Click on a marker or use the lasso tool to select airports.</div>
  </div>
</template>

<script>
export default {
  props: {
    selectedAirports: Array
  }
}
</script>

<style scoped>
.selected-box {
  padding: 16px;
  background-color: #fcf8e3;
  margin-top: 16px;
  border-color: #faebcc;
  color: #24292e;
}
.selected-all {
  padding: 4px;
  font-weight: 700;
}
.selected-item {
  padding: 4px;
}
.removeAction {
  padding-right: 4px;
  color: #586069;
  cursor: pointer;
  position: relative;
  font-size: 14px;
  top: -1px;
  font-weight: normal;
}
</style>
