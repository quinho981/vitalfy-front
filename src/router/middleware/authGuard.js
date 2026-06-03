import { authStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'

export default function authGuard(to, from, next) {
    const auth = authStore();
    const userStore = useUserStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !auth.isAuthenticated) {
        return next('/auth/login');
    }

    // Verificar se o usuário completou o onboarding
    if (requiresAuth && auth.isAuthenticated && !userStore.onboardingCompleted && to.name !== 'onboarding') {
        return next('/auth/onboarding');
    }

    next();
}