<template>


  <div id="app">
    
    <HelloWorld msg="Welcome"/> 
    
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld    
  },    
  data() {
    return {
    

    }
  },
  created() {
    
    
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#wrapper{
    background:red;
    overflow:auto;
    float: right
}

</style>
