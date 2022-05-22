import Vue from 'vue'
import VueRouter from 'vue-router'
import Recipe from '../views/Recipe.vue'
import AboutView from '../views/AboutView.vue'
import Home from '../views/Home.vue'
import homme from '../views/homme.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/recipe/:id',
    name: 'Recipe',
    component: Recipe
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/homme',
    name: 'homme',
    component: homme
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
