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
                        {{ $t("auth.register.title") }}
                    </h2>

                    <p class="text-sm text-gray-500 mt-2 dark:text-gray-400">
                        Crie sua conta e comece a automatizar sua documentação clínica
                    </p>
                </div>

                <div class="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl">
                    <form @submit.prevent="submit" class="space-y-5">
                        <div>
                            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                                {{ $t("form.label.name") }}
                            </label>

                            <InputText 
                                v-model="form.name"
                                :placeholder='$t("auth.form.label.enterName")'
                                class="w-full !px-4 !py-3 !rounded-lg !border-gray-200 dark:!border-zinc-600"
                                :class="{ 'p-invalid': errors.name }"
                            />

                            <small class="p-error" v-if="errors.name">{{ errors.name }}</small>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                                {{ $t("form.label.email") }}
                            </label>

                            <InputText 
                                v-model="form.email"
                                type="email"
                                :placeholder='$t("auth.form.label.enterEmail")'
                                class="w-full !px-4 !py-3 !rounded-lg !border-gray-200 dark:!border-zinc-600"
                                :class="{ 'p-invalid': errors.email }"
                            />

                            <small class="p-error" v-if="errors.email">{{ errors.email }}</small>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                                {{ $t("auth.form.label.password") }}
                            </label>

                            <Password 
                                v-model="form.password"
                                :placeholder='$t("auth.form.label.enterPassword")'
                                :toggleMask="true"
                                fluid 
                                :feedback="true"
                                :class="['w-full !rounded-lg', errors.password ? 'p-invalid' : '']"
                                inputClass="!px-4 !py-3 !rounded-lg !border-gray-200 dark:!border-zinc-600"
                                promptLabel="Escolha a senha" 
                                weakLabel="Muito fraca" 
                                mediumLabel="Média" 
                                strongLabel="Forte"
                            />

                            <small class="p-error" v-if="errors.password">{{ errors.password }}</small>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                                {{ $t("auth.form.label.confirmPassword") }}
                            </label>

                            <Password 
                                v-model="form.password_confirmation"
                                :placeholder='$t("auth.form.label.confirmPassword")'
                                :toggleMask="true"
                                fluid 
                                :feedback="false"
                                :class="['w-full !rounded-lg', errors.password_confirmation ? 'p-invalid' : '']"
                                inputClass="!px-4 !py-3 !rounded-lg !border-gray-200 dark:!border-zinc-600"
                            />

                            <small class="p-error" v-if="errors.password_confirmation">
                                {{ errors.password_confirmation }}
                            </small>
                        </div>

                        <div>
                            <label class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 leading-tight">
                                <Checkbox 
                                    v-model="form.checked"
                                    binary
                                    :class="{ 'p-invalid': errors.checked }"
                                />

                                <span>
                                    {{ $t("auth.form.label.declareTermsParcial") }}
                                    <a 
                                        href="#" 
                                        @click.prevent="showTerms"
                                        class="text-primary font-medium hover:underline"
                                    >
                                        {{ $t("auth.form.label.terms") }}
                                    </a>
                                </span>
                            </label>

                            <small class="p-error block mt-1" v-if="errors.checked">
                                {{ errors.checked }}
                            </small>
                        </div>

                        <Button 
                            :label='$t("auth.form.button.registerNow")'
                            :loading="loading"
                            type="submit"
                            class="w-full !py-3 !text-base !font-semibold !rounded-lg shadow-md"
                        />
                    </form>
                </div>

                <p class="text-sm text-gray-500 text-center mt-6 dark:text-gray-400">
                    {{ $t("auth.form.label.alredyHaveAnAccount") }}
                    <router-link 
                        to="login" 
                        class="text-primary font-medium hover:underline cursor-pointer"
                    >
                        {{ $t("auth.form.button.signIn") }}
                    </router-link>
                </p>
            </div>
        </div>

        <Toast />
        <TermOfUse 
            :active="activeTerms" 
            @close="closeTerms" 
        />
    </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue";
import { authStore } from '@/stores/authStore'
import AsideImage from './components/AsideImage.vue'
import { registerSchema } from '@/validations/authSchema.js';
import { useRouter } from 'vue-router';
import TermOfUse from '@/components/Modal/TermOfUse.vue';
import { useShowToast } from '@/utils/useShowToast';
import { useI18n } from 'vue-i18n';

const Toast = defineAsyncComponent(() => import('primevue/toast'));

const { t } = useI18n();
const { showSuccess, showError } = useShowToast();

const auth = authStore();
const router = useRouter();
const loading = ref(false)
const activeTerms = ref(false)
const errors = ref({});

const form = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    checked: false
})

const submit = () => {
    if (!validateForm()) {
        return;
    }

    loading.value = true
    auth.register(form.value)
        .then(response => {
            showSuccess(t('notifications.titles.success'), t('notifications.messages.userCreatedSuccessfully'), 4000)
            setTimeout(() => {
                router.push({ name: 'login' });
            }, 1000);
        }).catch(error => {
            loading.value = false
            showError(t('notifications.titles.error'), t('notifications.messages.userCreatingError'), 4000)
        })
}

const validateForm = () => {
    try {
        const result = registerSchema.parse(form.value);
        errors.value = {};
        return true;
    } catch (error) {
        errors.value = {};
        error.errors.forEach((err) => {
            if (err.path) {
                errors.value[err.path[0]] = err.message;
            }
        });
        return false;
    }
};

const showTerms = () => {
    activeTerms.value = true;
}

const closeTerms = () => {
    activeTerms.value = false;
}
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