<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore'
import SubscriptionSuccessModal from '@/components/Modal/SubscriptionSuccessModal.vue'
const showSubscriptionSuccessModal = ref(false)

const userStore = useUserStore()

onMounted(async () => {
    const pendingCheckout = localStorage.getItem('pending_checkout_session')

    if (!pendingCheckout) return

    try {
        await userStore.getUserInfo()
        console.log('plano do usuário: ', userStore.plan)
        if (userStore.plan === 'Pro') {
            showSubscriptionSuccessModal.value = true
        }
        
        localStorage.removeItem('pending_checkout_session')
    } catch (e) {
        console.error(e)
    }
})
</script>

<template>
<div>
    <router-view />
    
    <SubscriptionSuccessModal 
        v-model:visible="showSubscriptionSuccessModal" 
    />
</div>

    
</template>

<style scoped></style>
