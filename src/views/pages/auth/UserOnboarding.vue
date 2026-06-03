<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 px-6 py-10">
        <div class="w-full max-w-md">
            <div class="text-center mb-8">
                <div class="flex items-center justify-center">
                    <img src="/vitalfy-logo.png" alt="Vitalfy Logo" class="w-14 h-12" />
                    <h1 class="text-5xl font-semibold text-gray-800 tracking-tight dark:text-gray-200">
                        italfy
                    </h1>
                </div>

                <h2 class="text-2xl font-semibold text-gray-700 mt-4 dark:text-gray-300">
                    Bem-vindo!
                </h2>

                <p class="text-sm text-gray-500 mt-2 dark:text-gray-400">
                    Vamos personalizar sua experiência
                </p>
            </div>

            <div class="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl">
                <form @submit.prevent="submit" class="space-y-5">
                    <div>
                        <label for="specialty" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                            Especialidade
                        </label>

                        <Dropdown 
                            id="specialty" 
                            v-model="form.specialty" 
                            :options="specialties" 
                            optionLabel="name" 
                            optionValue="id"
                            placeholder="Selecione sua especialidade"
                            class="w-full"
                            :loading="loadingSpecialties"
                            filter
                        />
                    </div>

                    <div>
                        <label for="consultationTime" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                            Tempo médio de consulta (minutos)
                        </label>

                        <InputNumber 
                            id="consultationTime" 
                            v-model="form.consultationTime" 
                            :min="1"
                            :max="180"
                            placeholder="Ex: 30"
                            class="w-full"
                        />
                        <p class="text-xs text-gray-400 mt-1">
                            Tempo que você normalmente leva para realizar uma anamnese médica
                        </p>
                    </div>

                    <Button 
                        label="Continuar" 
                        class="w-full !py-3 !text-base !font-semibold !rounded-lg shadow-md"
                        :loading="loading" 
                        type="submit"
                    />

                    <Button 
                        label="Pular" 
                        class="w-full !py-3 !text-base !font-semibold !rounded-lg"
                        :loading="loading" 
                        type="button"
                        severity="secondary"
                        outlined
                        @click="skip"
                    />
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { SelectOptionsService } from '@/service/selectOptionsService';
import { UserService } from '@/service/UserService';

const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const loadingSpecialties = ref(false);
const specialties = ref([]);

const DEFAULT_CONSULTATION_TIME = 30; // 30 minutos como padrão

const form = ref({
    specialty: null,
    consultationTime: null
});

const loadSpecialties = async () => {
    loadingSpecialties.value = true;
    try {
        const response = await SelectOptionsService.getTemplatesMinimal();
        specialties.value = response;
    } catch (error) {
        console.error('Error loading specialties:', error);
    } finally {
        loadingSpecialties.value = false;
    }
};

const submit = async () => {
    loading.value = true;
    try {
        const data = {
            specialty_id: form.value.specialty,
            consultation_time: form.value.consultationTime,
            onboarding_completed: true
        };

        await UserService.update(data);
        await userStore.getUserInfo();
        
        router.push({ name: 'dashboard' });
    } catch (error) {
        console.error('Error saving onboarding data:', error);
    } finally {
        loading.value = false;
    }
};

const skip = async () => {
    loading.value = true;
    try {
        const data = {
            consultation_time: DEFAULT_CONSULTATION_TIME,
            onboarding_completed: true
        };

        await UserService.update(data);
        await userStore.getUserInfo();
        
        router.push({ name: 'dashboard' });
    } catch (error) {
        console.error('Error skipping onboarding:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadSpecialties();
});
</script>

<style scoped>
.p-invalid {
    border-color: #dc3545 !important;
}

.p-error {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}
</style>
