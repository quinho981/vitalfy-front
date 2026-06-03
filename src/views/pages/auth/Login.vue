<template>
    <div class="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-zinc-900">
        <FloatingConfigurator />
        <AsideImage />

        <div class="w-full md:w-1/2 flex items-center justify-center px-6 py-10">
            <div class="w-full max-w-md">
                <div class="text-center mb-8">
                    <div class="flex items-center justify-center">
                        <img src="/vitalfy-logo.png" alt="Vitalfy Logo" class="w-14 h-12" />
                        <h1 class="text-5xl font-semibold text-gray-800 tracking-tight dark:text-gray-200">
                            italfy
                        </h1>
                    </div>

                    <h2 class="text-2xl font-semibold text-gray-700 mt-4 dark:text-gray-300">
                        {{ $t("welcome") }}
                    </h2>

                    <p class="text-sm text-gray-500 mt-2 dark:text-gray-400">
                        {{ $t("auth.login.description") }}
                    </p>
                </div>

                <div class="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl">
                    <Message 
                        v-if="errorMessage" 
                        class="mb-4" 
                        severity="error"
                    >
                        {{ $t("notifications.messages.wrongUserOrPassword") }}
                    </Message>

                    <form @submit.prevent="submit" class="space-y-5">
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                                {{ $t("form.label.email") }}
                            </label>

                            <InputText 
                                id="email" 
                                type="email" 
                                :placeholder='$t("auth.form.label.enterEmail")' 
                                class="w-full !px-4 !py-3 !rounded-lg !border-gray-200 dark:!border-zinc-600"
                                v-model="form.email" 
                            />
                        </div>

                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                                {{ $t("auth.form.label.password") }}
                            </label>

                            <Password 
                                id="password" 
                                v-model="form.password" 
                                :placeholder='$t("auth.form.label.enterPassword")' 
                                :toggleMask="true" 
                                class="w-full !rounded-lg"
                                inputClass="!px-4 !py-3 !rounded-lg !border-gray-200 dark:!border-zinc-600"
                                fluid 
                                :feedback="false"
                            />
                        </div>

                        <div class="flex items-center justify-between text-sm">
                            <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <Checkbox 
                                    v-model="form.checked" 
                                    id="rememberme" 
                                    binary
                                />
                                {{ $t("auth.form.label.rememberMe") }}
                            </label>

                            <a href="#" class="text-primary hover:underline font-medium">
                                {{ $t("auth.form.label.forgotPassword") }}?
                            </a>
                        </div>

                        <Button 
                            :label='$t("auth.form.button.signIn")' 
                            class="w-full !py-3 !text-base !font-semibold !rounded-lg shadow-md"
                            :loading="loading" 
                            type="submit"
                        />
                    </form>
                </div>

                <p class="text-sm text-gray-500 text-center mt-6 dark:text-gray-400">
                    {{ $t("auth.form.label.haveAnAccount") }} 
                    <router-link 
                        to="register" 
                        class="text-primary font-medium hover:underline cursor-pointer"
                    >
                        {{ $t("auth.form.button.signUp") }}
                    </router-link>
                </p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";
import AsideImage from './components/AsideImage.vue'
import { useRouter } from 'vue-router';
import { authStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'

const auth = authStore();
const userStore = useUserStore();

const router = useRouter();
const loading = ref(false);
const errorMessage = ref(false);

const form = ref({
    email: '',
    password: '',
    checked: false
})

const submit = async () => {
    if (!validateForm()) {
        loading.value = false;
        return;
    }

    errorMessage.value = false;
    loading.value = true;

    try {
        await auth.login(form.value);
        await userStore.getUserInfo();
        
        if (!userStore.onboardingCompleted) {
            router.push({ name: 'onboarding' });
        } else {
            router.push({ name: 'dashboard' });
        }
    } catch (error) {
        errorMessage.value = true;
        loading.value = false;
    }
};


const validateForm = () => {
    if (!form.value.email && !form.value.password) {
        errorMessage.value = true;
        return false;
    }
    return true;
};
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
