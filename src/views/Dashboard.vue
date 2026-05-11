<template>
    <section>
        <div class="mb-3 py-3">
            <div>
                <h1 class="text-3xl font-bold">Dashboard</h1>
                <p class="my-1 text-lg text-surface-500">Bem-vindo de volta, <span class="font-semibold text-surface-700 dark:text-surface-300">{{ userStore.username }}</span></p>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-5">
            <div class="col-span-12 md:col-span-6 xl:col-span-3">
                <div class="card mb-0 flex flex-col gap-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-medium text-surface-500 uppercase tracking-wide dark:text-surface-300">Atendimentos hoje</span>
                        <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 dark:bg-blue-950">
                            <FileText :size="17" class="text-blue-700 dark:text-blue-400" />
                        </div>
                    </div>
                    <div v-if="!loadingSummary" class="text-3xl font-bold text-surface-800 dark:text-surface-0">{{ dataSummary.transcriptsCountToday }}</div>
                    <Skeleton v-else height="32px" width="3rem" class="rounded-lg" />
                    <span class="text-xs text-surface-400">Consultas finalizadas</span>
                </div>
            </div>

            <div class="col-span-12 md:col-span-6 xl:col-span-3">
                <div class="card mb-0 flex flex-col gap-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-medium text-surface-500 uppercase tracking-wide dark:text-surface-300">Tempo total hoje</span>
                        <div class="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 dark:bg-green-950">
                            <Clock :size="17" class="text-green-700 dark:text-green-400" />
                        </div>
                    </div>
                    <div v-if="!loadingSummary" class="text-3xl font-bold text-surface-800 dark:text-surface-0">{{ convertSecondsToMinutes(dataSummary.transcriptsDurationToday) }}</div>
                    <Skeleton v-else height="32px" width="6rem" class="rounded-lg" />
                    <span class="text-xs text-surface-400">Tempo de atendimento registrado</span>
                </div>
            </div>

            <div class="col-span-12 md:col-span-6 xl:col-span-3">
                <div class="card mb-0 flex flex-col gap-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-medium text-surface-500 uppercase tracking-wide dark:text-surface-300">Atendimentos urgentes</span>
                        <div class="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 dark:bg-red-950">
                            <OctagonAlert :size="17" class="text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    <div v-if="!loadingSummary" class="text-3xl font-bold text-surface-800 dark:text-surface-0">{{ dataSummary.urgentTranscriptsCountToday }}</div>
                    <Skeleton v-else height="32px" width="3rem" class="rounded-lg" />
                    <span class="text-xs text-surface-400">Casos marcados como prioridade</span>
                </div>
            </div>

            <div class="col-span-12 md:col-span-6 xl:col-span-3">
                <div class="card mb-0 flex flex-col gap-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-medium text-surface-500 uppercase tracking-wide dark:text-surface-300">Duração média hoje</span>
                        <div class="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 dark:bg-purple-950">
                            <Timer :size="17" class="text-purple-700 dark:text-purple-400" />
                        </div>
                    </div>
                    <div v-if="!loadingSummary" class="text-3xl font-bold text-surface-800 dark:text-surface-0">{{ convertSecondsToMinutes(dataSummary.averageTranscriptsTime) }}</div>
                    <Skeleton v-else height="32px" width="4rem" class="rounded-lg" />
                    <span class="text-xs text-surface-400">Tempo médio por atendimento</span>
                </div>
            </div>

            <div class="card col-span-12 lg:col-span-9 mb-0">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-x-3">
                        <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 dark:bg-blue-950">
                            <FileText :size="17" class="text-blue-700 dark:text-blue-400" />
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-surface-800 leading-tight dark:text-surface-300">Documentos clínicos recentes</p>
                            <p class="text-xs text-surface-400 mt-0.5">Últimos atendimentos registrados</p>
                        </div>
                    </div>
                    <router-link
                        :to="{ name: 'transcriptsHistory' }"
                        class="inline-flex items-center gap-x-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors dark:text-blue-400"
                    >
                        Ver todos
                        <i class="pi pi-arrow-right text-[10px]" />
                    </router-link>
                </div>
                <RecentsTranscriptsItem
                    :transcripts="recentTranscripts"
                    :loading="loadingTranscripts"
                />
            </div>

            <div class="card col-span-12 lg:col-span-3 mb-0 flex flex-col gap-y-0">
                <div class="flex items-center gap-x-3 mb-5">
                    <div class="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 dark:bg-purple-950">
                        <Sparkles :size="17" class="text-purple-700 dark:text-purple-400" />
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-surface-800 leading-tight dark:text-surface-300">Uso da IA hoje</p>
                        <p class="text-xs text-surface-400 mt-0.5">Aproveitamento das transcrições</p>
                    </div>
                </div>

                <div class="flex flex-col items-center justify-center py-4 border border-surface-100 rounded-lg bg-surface-50 mb-4 dark:bg-surface-900 dark:border-surface-700">
                    <template v-if="!loadingSummary">
                        <span class="text-3xl font-bold text-surface-800 dark:text-surface-400">{{ Number(aiUsage.utilization || 0).toFixed(1) }}%</span>
                        <span class="text-xs text-surface-400 mt-1 flex items-end gap-x-1">
                            aproveitamento
                            <button
                                v-tooltip.top="{
                                    value: `<span class='text-sm'>Mede a eficiência do uso da IA na geração de documentos clínicos.
                                        Calculado com base na proporção entre documentos gerados e o total de transcrições realizadas.</span>`,
                                    escape: false,
                                    showDelay: 300
                                }"
                                class=" rounded-full border-none text-gray-400 transition"
                            >
                                <HelpCircle :size="13" />
                            </button>
                        </span>
                        <div class="w-full px-4 mt-3">
                            <div class="h-1.5 w-full bg-surface-200 rounded-full overflow-hidden">
                                <div
                                    class="h-full rounded-full transition-all duration-500"
                                    :class="aiUsage.utilization >= 70 ? 'bg-emerald-500' : aiUsage.utilization >= 40 ? 'bg-amber-400' : 'bg-red-400'"
                                    :style="{ width: aiUsage.utilization + '%' }"
                                />
                            </div>
                        </div>
                    </template>
                    <Skeleton v-else height="32px" width="4rem" class="rounded-lg" />
                </div>

                <div class="flex flex-col gap-y-0 border border-surface-100 rounded-lg overflow-hidden dark:border-surface-700">
                    <div class="flex items-center justify-between px-4 py-3 border-b border-surface-100 dark:border-surface-700">
                        <div class="flex items-center gap-x-2">
                            <div class="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                            <span class="text-xs text-surface-500 dark:text-surface-400">Transcrições</span>
                        </div>
                        <template v-if="!loadingSummary">
                            <span class="text-sm font-semibold text-surface-800 dark:text-surface-400">{{ aiUsage.transcriptions }}</span>
                        </template>
                        <Skeleton v-else height="14px" width="2rem" />
                    </div>

                    <div class="flex items-center justify-between px-4 py-3 border-b border-surface-100 dark:border-surface-700">
                        <div class="flex items-center gap-x-2">
                            <div class="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                            <span class="text-xs text-surface-500 dark:text-surface-400">Transcrições descartadas</span>
                        </div>
                        <template v-if="!loadingSummary">
                            <span class="text-sm font-semibold text-surface-800 dark:text-surface-400">{{ aiUsage.discarded }}</span>
                        </template>
                        <Skeleton v-else height="14px" width="2rem" />
                    </div>

                    <div class="flex items-center justify-between px-4 py-3 border-b border-surface-100 dark:border-surface-700">
                        <div class="flex items-center gap-x-2">
                            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                            <span class="text-xs text-surface-500 dark:text-surface-400">Documentos gerados</span>
                        </div>
                        <template v-if="!loadingSummary">
                            <span class="text-sm font-semibold text-surface-800 dark:text-surface-400">{{ aiUsage.generatedDocuments }}</span>
                        </template>
                        <Skeleton v-else height="14px" width="2rem" />
                    </div>

                    <div class="flex items-center justify-between px-4 py-3 border-b border-surface-100 dark:border-surface-700">
                        <div class="flex items-center gap-x-2">
                            <div class="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                            <span class="text-xs text-surface-500 dark:text-surface-400">Documentos descartados</span>
                        </div>
                        <template v-if="!loadingSummary">
                            <span class="text-sm font-semibold text-surface-800 dark:text-surface-400">{{ aiUsage.documentsDiscarded }}</span>
                        </template>
                        <Skeleton v-else height="14px" width="2rem" />
                    </div>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-6">
                <div class="card mb-0">
                    <div class="flex items-center gap-x-3 mb-4">
                        <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 dark:bg-blue-950">
                            <TrendingUp :size="17" class="text-blue-700 dark:text-blue-400" />
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-surface-800 leading-tight dark:text-surface-300">Atendimentos na semana</p>
                            <p class="text-xs text-surface-400 mt-0.5">Volume semanal de consultas</p>
                        </div>
                    </div>
                    <div class="relative h-72">
                        <ChartLite type="line" :data="lineData" :options="lineOptions" class="w-full h-full" />
                        <div v-if="loadingSummary" class="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-black/50 rounded-lg">
                            <ProgressSpinner style="width:48px;height:48px" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-6">
                <div class="card mb-0">
                    <div class="flex items-center gap-x-3 mb-4">
                        <div class="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 dark:bg-green-950">
                            <PieChart :size="17" class="text-teal-700 dark:text-green-400" />
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-surface-800 leading-tight dark:text-surface-300">Tipos de atendimento na semana</p>
                            <p class="text-xs text-surface-400 mt-0.5">Distribuição por categoria</p>
                        </div>
                    </div>
                    <div class="relative h-72">
                        <ChartLite type="pie" :data="pieData" :options="pieOptions" class="w-full h-full" />
                        <div v-if="loadingCharts" class="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-black/50 rounded-lg">
                            <ProgressSpinner style="width:48px;height:48px" />
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <SubscriptionSuccessModal 
            v-model:visible="showSubscriptionSuccessModal" 
        />
    </section>
</template>

<script setup>
import { defineAsyncComponent, onMounted, ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLayout } from '@/layout/composables/layout'
import { useUserStore } from '@/stores/userStore'
import { DashboardService } from '@/service/DashboardService'
import { SubscriptionService } from '@/service/SubscriptionService'
import { Mic, FileText, Clock, OctagonAlert, Timer, Sparkles, TrendingUp, PieChart, HelpCircle } from 'lucide-vue-next'
import { useHelpers } from '@/utils/helper'
import ChartLite from '@/components/ChartLite.vue'
import SubscriptionSuccessModal from '@/components/Modal/SubscriptionSuccessModal.vue'

const ProgressSpinner = defineAsyncComponent(() => import('primevue/progressspinner'))

const { convertSecondsToMinutes } = useHelpers()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { getPrimary, getSurface, isDarkTheme } = useLayout()

const loadingSummary = ref(false)
const loadingCharts = ref(false)
const loadingTranscripts = ref(false)
const showSubscriptionSuccessModal = ref(false)
const weekData = ref([0, 0, 0, 0, 0, 0, 0])
const pieData = ref(null)
const pieOptions = ref(null)
const lineData = ref(null)
const lineOptions = ref(null)
const recentTranscripts = ref([])

const dataSummary = ref({
    averageTranscriptsTime: 0,
    transcriptsDurationToday: 0,
    transcriptsCountToday: 0,
    urgentTranscriptsCountToday: 0,

    transcriptsCountWithTrashedToday: 0,
    transcriptDiscarded: 0,
    documentCountWithTrashehdToday: 0,
    documentDiscarded: 0
})

const aiUsage = computed(() => {
    const transcriptions = dataSummary.value.transcriptsCountWithTrashedToday ?? 0
    const discarded = dataSummary.value.transcriptDiscarded ?? 0
    const generatedDocuments = dataSummary.value.documentCountWithTrashehdToday
    const utilization = transcriptions > 0 ? (generatedDocuments / transcriptions) * 100 : 0
    const documentsDiscarded = dataSummary.value.documentDiscarded ?? 0

    return { transcriptions, discarded, generatedDocuments, utilization, documentsDiscarded }
})

const commonOptions = { responsive: true, maintainAspectRatio: false }

const getSummary = () => {
    loadingSummary.value = true
    DashboardService.summary()
        .then(response => { dataSummary.value = response })
        .finally(() => { loadingSummary.value = false })
}

const getCharts = () => {
    loadingCharts.value = true
    DashboardService.charts()
        .then(response => {
            const data = [0, 0, 0, 0, 0, 0, 0]
            handleBarChart(response, data)
            handlePieChart(response)
        })
        .finally(() => { loadingCharts.value = false })
}

const getLatestRecentTranscripts = () => {
    loadingTranscripts.value = true
    DashboardService.latestRecentTranscripts()
        .then(response => { recentTranscripts.value = response })
        .finally(() => { loadingTranscripts.value = false })
}

const handleBarChart = (response, data) => {
    response.transcriptsByWeek.forEach(item => {
        data[Number(item.day_of_week)] = Number(item.total)
    })
    weekData.value = data
}

const handlePieChart = (response) => {
    const documentStyle = getComputedStyle(document.documentElement)
    const data = response.transcriptsByType
    const colors = ['--p-indigo-500', '--p-purple-500', '--p-red-400', '--p-teal-500', '--p-orange-500', '--p-pink-500']
    const hoverColors = ['--p-indigo-400', '--p-purple-400', '--p-red-300', '--p-teal-400', '--p-orange-400', '--p-pink-400']

    pieData.value = {
        labels: data.map(item => item.type),
        datasets: [{
            data: data.map(item => Number(item.transcripts_count)),
            backgroundColor: data.map((_, i) => documentStyle.getPropertyValue(colors[i % colors.length])),
            hoverBackgroundColor: data.map((_, i) => documentStyle.getPropertyValue(hoverColors[i % hoverColors.length]))
        }]
    }
}

const setColorOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement)
    const textColor = documentStyle.getPropertyValue('--text-color')
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary')
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border')

    pieOptions.value = {
        ...commonOptions,
        plugins: { legend: { labels: { usePointStyle: true, color: textColor } } }
    }

    lineData.value = {
        labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        datasets: [{
            label: 'Atendimentos',
            data: weekData,
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
            borderColor: documentStyle.getPropertyValue('--p-primary-500'),
            tension: 0.4
        }]
    }

    lineOptions.value = {
        ...commonOptions,
        plugins: { legend: { labels: { fontColor: textColor } } },
        scales: {
            x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } },
            y: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } }
        }
    }
}

watch([getPrimary, getSurface, isDarkTheme], () => setColorOptions(), { immediate: true })

const checkCheckoutStatus = async () => {
    if (route.query.checkout_cancelled === 'true') {
        localStorage.removeItem('pending_checkout_session')
    } 

    if (route.query.checkout_success === 'true' && route.query.session_id) {
        try {
            const result = await SubscriptionService.verifyCheckout(route.query.session_id);
            
            if (result.success) {
                console.log('Checkout verificado com sucesso. Atualizando informações do usuário...');
                localStorage.removeItem('pending_checkout_session');
                await userStore.getUserInfo();
                
                showSubscriptionSuccessModal.value = true;
            }
        } catch (error) {
            console.error('Error verifying checkout:', error);
        }
    }
};

onMounted(() => {
    getSummary()
    getLatestRecentTranscripts()
    getCharts()
    setColorOptions()
    checkCheckoutStatus()
})
</script>