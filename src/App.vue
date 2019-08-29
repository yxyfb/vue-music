<template>
  <div id="app">
    <g-header></g-header>
    <g-tab></g-tab>
    <keep-alive>
      <router-view/>
    </keep-alive>

    <v-player></v-player>
  </div>
</template>

<script>
import Gheader from 'common/g-header/g-header'
import Gtab from 'common/g-tab/g-tab'
import Player from 'pages/player/player'

export default {
  name: 'App',
  components: {
    'g-header': Gheader,
    'g-tab': Gtab,
    'v-player': Player
  }
}
</script>

<style>

</style>
