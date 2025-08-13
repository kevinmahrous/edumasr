import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { ref, onValue } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, rtdb } from './firebase'; // ✅ import initialized versions
import './style.css';

const app = createApp(App);

app.use(PrimeVue, {
    theme: { preset: Aura }
});

let currentRole = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        const roleRef = ref(rtdb, 'users/' + user.uid + '/role');
        onValue(roleRef, (snapshot) => {
            currentRole = snapshot.val();
        });
    } else {
        currentRole = null;
    }
});

router.beforeEach((to, from, next) => {
    if (to.meta.role && to.meta.role !== currentRole) {
        return next('/');
    }
    next();
});

app.use(router).mount('#app');
