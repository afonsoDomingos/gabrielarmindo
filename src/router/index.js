import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Admin from '../views/Admin.vue';

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login },
    {
        path: '/admin',
        name: 'Admin',
        component: Admin,
        beforeEnter: (to, from, next) => {
            const token = localStorage.getItem('gabriel_admin_token');
            if (token) next();
            else next('/login');
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
