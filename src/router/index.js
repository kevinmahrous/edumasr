import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Contact from '../components/Contact.vue';
import About from '../components/About.vue';
import Student from '../components/Student.vue';

import Job from '../components/Job.vue';
import Ministry from '../components/Ministry.vue';
import School from '../components/School.vue';
import Parent from '../components/Parent.vue';
const routes = [
  { path: '/', component: Home },
  { path: '/student', component: Student, meta: { role: 'student' } },
  { path: '/Job', component: Job, meta: { role: 'job' } },
  { path: '/Ministry', component: Ministry, meta: { role: 'ministry' } },
  { path: '/School', component: School, meta: { role: 'school' } },
  { path: '/Parent', component: Parent, meta: { role: 'parent' } },
  { path: '/contact', component: Contact },
  { path: '/about', component: About }
];
export default createRouter({
  history: createWebHistory(),
  routes
});