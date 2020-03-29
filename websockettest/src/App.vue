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
  background: #1d2935;
  color: #0068cf;
  
}


#wrapper_right{   
    overflow:auto;
    float: right;
    margin: 2%
}
#wrapper_left{    
    overflow:auto;
    float: left;
    margin: 2%
}

</style>
