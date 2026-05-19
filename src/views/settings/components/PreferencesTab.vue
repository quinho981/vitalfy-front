<template>
    <div >
        <div >
            <div class="flex flex-col max-w-2xl">
                <div>
                    <p class="font-semibold">Tema</p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">Escolha a interface que melhor te atende</p>
                </div>
                <div class="flex gap-4 mt-3 mb-4">
                    <div
                        @click="form.theme = 'system'"
                        class="cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200"
                        :class="form.theme === 'system'
                            ? 'border-primary shadow-lg scale-105'
                            : 'border-gray-100 hover:border-gray-400 dark:border-gray-700'"
                    >
                        <img
                            :src="'/pages/config/system-layout-hibrid.png'"
                            alt="Tema Claro"
                            class="object-cover"
                        />
                        <div class="p-2 text-center font-medium">
                            Sistema
                        </div>
                    </div>
                    <div
                        @click="form.theme = 'light'"
                        class="cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200"
                        :class="form.theme === 'light'
                            ? 'border-primary shadow-lg scale-105'
                            : 'border-gray-100 hover:border-gray-400 dark:border-gray-700'"
                    >
                        <img
                            :src="'/pages/config/system-layout-light.png'"
                            alt="Tema Claro"
                            class="object-cover"
                        />
                        <div class="p-2 text-center font-medium">
                            Claro
                        </div>
                    </div>
                    <div
                        @click="form.theme = 'dark'"
                        class="cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200"
                        :class="form.theme === 'dark'
                            ? 'border-primary shadow-lg scale-105'
                            : 'border-gray-100 hover:border-gray-400 dark:border-gray-700'"
                    >
                        <img
                            :src="'/pages/config/system-layout-dark.png'"
                            alt="Tema Escuro"
                            class="object-cover"
                        />
                        <div class="p-2 text-center font-medium">
                            Escuro
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const savedTheme = localStorage.getItem('app_theme');

const form = reactive({
    theme: savedTheme || 'system',
});

watch(() => form.theme, (value) => {
    if (value === 'system') {
        localStorage.removeItem('app_theme');

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        document.documentElement.classList.toggle('app-dark', prefersDark);

        return;
    }

    localStorage.setItem('app_theme', value);

    document.documentElement.classList.toggle(
        'app-dark',
        value === 'dark'
    );
}, {
    immediate: true
});
</script>

<style scoped>

</style>