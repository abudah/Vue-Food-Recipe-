<template>
  <div id="app">
    <router-view/>
    <h1>Recipe</h1>
    <nav>
      <router-link to="/">Bookmarks</router-link>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    
  </div>  
</template>

<style>

</style>