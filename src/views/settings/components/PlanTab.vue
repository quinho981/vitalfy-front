<template>
    <div class="flex flex-col gap-5">
        <div class="border rounded-lg p-4 flex justify-between items-center dark:border-neutral-700">
            <div>
                <p class="font-semibold text-lg">Plano atual</p>
                <p class="text-slate-500 dark:text-slate-400 capitalize">{{ subscription.plan?.name || 'Free' }}</p>
            </div>

            <Tag 
                :value="subscription.has_subscription ? 'Ativo' : 'Inativo'" 
                :severity="subscription.has_subscription ? 'success' : 'secondary'" 
            />
        </div>

        <div class="flex gap-4" v-if="subscription.has_subscription">
            <Button 
                label="Cancelar assinatura" 
                severity="danger" 
                outlined 
                class="dark:hover:!bg-red-950"
                @click="handleCancelSubscription"
                :loading="cancelling"
            />
        </div>

        <div class="flex gap-4" v-else>
            <Button 
                label="Assinar Plano Pro" 
                @click="handleSubscribe('PRO_MONTHLY')"
                :loading="loading"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { SubscriptionService } from '@/service/SubscriptionService';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const subscription = ref({
    has_subscription: false,
    plan: { name: 'Free' },
    subscription: null
});
const loading = ref(false);
const cancelling = ref(false);

const loadSubscription = async () => {
    try {
        const data = await SubscriptionService.getSubscription();
        subscription.value = data;
    } catch (error) {
        console.error('Error loading subscription:', error);
    }
};

const handleSubscribe = async (plan) => {
    loading.value = true;
    try {
        const response = await SubscriptionService.createCheckout(plan);
    
        // TODO: utilizar websocket para marcar o checkout
        localStorage.setItem('pending_checkout_session', response.session_id);
        window.location.href = response.url;
    } catch (error) {
        console.error('Error creating checkout:', error);
    } finally {
        loading.value = false;
    }
};

const handleCancelSubscription = async () => {
    if (!confirm('Tem certeza que deseja cancelar sua assinatura?')) {
        return;
    }
    
    cancelling.value = true;
    try {
        await SubscriptionService.cancelSubscription();
        await loadSubscription();
        await userStore.getUserInfo();
    } catch (error) {
        console.error('Error cancelling subscription:', error);
    } finally {
        cancelling.value = false;
    }
};

onMounted(() => {
    loadSubscription();
});
</script>

<style scoped>
</style>