<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth, rtdb } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { ref as dbRef, onValue } from 'firebase/database';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import logoDark from '../assets/logo-dark.png';
import logoLight from '../assets/logo-light.png';

const user = ref(null);
const role = ref(null); // store user role
const router = useRouter();
const isMobileMenuOpen = ref(false);
const isDark = ref(localStorage.getItem('theme') === 'dark');
const logo = computed(() => (isDark.value ? logoDark : logoLight));

function toggleTheme() {
  isDark.value = !isDark.value;
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  applyTheme();
}

function applyTheme() {
  document.body.classList.remove('light-theme', 'dark-theme');
  document.body.classList.add(isDark.value ? 'dark-theme' : 'light-theme');
}

function logout() {
  signOut(auth).then(() => {
    router.push('/login');
  });
}

onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    user.value = u;
    if (u) {
      const rolePath = dbRef(rtdb, 'users/' + u.uid + '/role');
      onValue(rolePath, (snapshot) => {
        role.value = snapshot.val();
      });
    } else {
      role.value = null;
    }
  });

  applyTheme();
});

// Dynamically build dashboard link from role
const dashboardRoute = computed(() => {
  if (!role.value) return '/';
  return `/${role.value.charAt(0).toUpperCase()}${role.value.slice(1)}`;
});
</script>

<template>
  <header class="m-2">
    <Menubar :model="[]" class="custom-menubar">
      <template #start>
        <div class="logo-wrapper">
           <img :src="logo" alt="Logo" class="w-8 h-8" /> 
          <span class="title">EduMasr</span>
        </div>
      </template>

      <template #end>
        <div class="desktop-menu nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link v-if="role" :to="dashboardRoute" class="nav-link">Dashboard</router-link>
          <router-link to="/contact" class="nav-link">Contact</router-link>
          <router-link to="/about" class="nav-link">About</router-link>

          <Button
            v-if="user"
            label="Logout"
            style="background: var(--text) !important; color: var(--background) !important;"
            size="small"
            @click="logout"
          />
          <template v-else>
            <Button
              label="Login"
              size="small"
              style="background: var(--text) !important; color: var(--background) !important;"
              @click="router.push('/login')"
              class="auth-btn"
            />
            <Button
              label="Signup"
              style="background: var(--text) !important; color: var(--background) !important;"
              size="small"
              @click="router.push('/signup')"
              class="auth-btn"
            />
          </template>

          <Button
            icon="pi pi-moon"
            size="small"
            class="theme-btn"
            @click="toggleTheme"
            v-if="!isDark"
            style="background: var(--text) !important; color: var(--background) !important;"
          />
          <Button
            icon="pi pi-sun"
            size="small"
            class="theme-btn"
            @click="toggleTheme"
            style="background: var(--text) !important; color: var(--background) !important;"
            v-else
          />
        </div>

        <Button
          icon="pi pi-bars"
          class="mobile-toggle"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          style="background: var(--text) !important; color: var(--background) !important;"
        />
      </template>
    </Menubar>

    <!-- Mobile menu -->
    <div class="mobile-menu" v-if="isMobileMenuOpen">
      <router-link to="/" class="mobile-link" @click="isMobileMenuOpen = false">Home</router-link>
      <router-link v-if="role" :to="dashboardRoute" class="mobile-link" @click="isMobileMenuOpen = false">Dashboard</router-link>
      <router-link to="/contact" class="mobile-link" @click="isMobileMenuOpen = false">contact</router-link>
      <router-link to="/about" class="mobile-link" @click="isMobileMenuOpen = false">About</router-link>

      <div class="mobile-actions">
        <template v-if="user">
          <Button
            label="Logout"
            style="background: var(--text) !important; color: var(--background) !important;"
            size="small"
            @click="() => { logout(); isMobileMenuOpen = false; }"
          />
          <Button
            icon="pi pi-moon"
            size="small"
            class="theme-btn"
            @click="() => { toggleTheme(); isMobileMenuOpen = false; }"
            v-if="!isDark"
            style="background: var(--text) !important; color: var(--background) !important;"
          />
          <Button
            icon="pi pi-sun"
            size="small"
            class="theme-btn"
            @click="() => { toggleTheme(); isMobileMenuOpen = false; }"
            style="background: var(--text) !important; color: var(--background) !important;"
            v-else
          />
        </template>

        <template v-else>
          <Button
            label="Login"
            size="small"
            style="background: var(--primary-text-color) !important; color: var(--primary-color) !important;"
            @click="() => { router.push('/login'); isMobileMenuOpen = false; }"
            class="auth-btn"
          />
          <Button
            label="Signup"
            style="background: var(--primary-text-color) !important; color: var(--primary-color) !important;"
            size="small"
            @click="() => { router.push('/signup'); isMobileMenuOpen = false; }"
            class="auth-btn"
          />
          <Button
            icon="pi pi-moon"
            size="small"
            class="theme-btn"
            @click="() => { toggleTheme(); isMobileMenuOpen = false; }"
            v-if="!isDark"
          />
          <Button
            icon="pi pi-sun"
            size="small"
            class="theme-btn"
            @click="() => { toggleTheme(); isMobileMenuOpen = false; }"
            v-else
          />
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}


.title {
  font-weight: bold;
  font-size: 1.2rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color);
  transition: background-color 0.2s;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
}

.nav-link:hover {
  background-color: var(--surface-hover);
}

.auth-btn {
  margin-left: 0.5rem;
}

.desktop-menu {
  display: flex;
  align-items: center;
}

.theme-btn {
  background: transparent;
  border: none;
  color: var(--text-color);
  padding: 0.4rem 0.5rem;
}

.mobile-toggle {
  display: none;
  margin-left: 1rem;
}

.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 1rem;
  gap: 0.5rem;
  background-color: var(--surface-ground);
}

.mobile-actions {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.mobile-link {
  padding: 0.5rem;
  text-decoration: none;
  color: var(--text-color);
  border-radius: 4px;
  transition: background-color 0.2s;
}

.mobile-link:hover {
  background-color: var(--surface-hover);
}

@media (max-width: 1000px) {
  .desktop-menu {
    display: none;
  }
  .mobile-toggle {
    display: inline-flex;
  }
  .mobile-menu {
    display: flex;
  }
}
</style>
