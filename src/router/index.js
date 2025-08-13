import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Contact from '../components/Contact.vue';
import About from '../components/About.vue';
const routes = [
  { path: '/', component: Home },
  { path: '/contact', component: Contact },
  { path: '/about', component: About }
];
export default createRouter({
  history: createWebHistory(),
  routes
});