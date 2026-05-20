<template>
    <div class="tour-guide-container">
        <button
            v-if="showTourButton"
            @click="startTour"
            class="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900 transition-all duration-300 flex items-center justify-center group"
            v-tooltip.left="'Iniciar tour guiado'"
        >
            <HelpCircle :size="24" />
            <span class="absolute right-full mr-3 px-3 py-1 bg-surface-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Tour guiado
            </span>
        </button>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import { HelpCircle } from 'lucide-vue-next';

const props = defineProps({
    tourType: {
        type: String,
        default: 'recording'
    },
    showTourButton: {
        type: Boolean,
        default: true
    },
    autoStart: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['tour-complete', 'tour-cancel']);

let tour = null;

const tourSteps = {
    recording: [
        {
            id: 'recording-start',
            target: '.recorder-container',
            title: 'Bem-vindo ao Gravador de Áudio',
            text: 'Aqui você pode gravar suas consultas médicas de forma simples e rápida. Clique no botão do microfone para começar.',
            attachTo: {
                element: '.recorder-container',
                on: 'bottom'
            },
            buttons: [
                {
                    text: 'Próximo',
                    action: 'next'
                }
            ]
        },
        {
            id: 'recording-timer',
            target: '.timer-display',
            title: 'Timer de Gravação',
            text: 'O timer mostra o tempo decorrido da gravação. Você pode pausar e retomar a gravação a qualquer momento.',
            attachTo: {
                element: '.timer-display',
                on: 'top'
            },
            buttons: [
                {
                    text: 'Anterior',
                    action: 'back'
                },
                {
                    text: 'Próximo',
                    action: 'next'
                }
            ]
        },
        {
            id: 'recording-controls',
            target: '.recording-controls',
            title: 'Controles de Gravação',
            text: 'Use estes botões para iniciar, pausar, retomar ou concluir a gravação. A gravação é salva automaticamente quando você conclui.',
            attachTo: {
                element: '.recording-controls',
                on: 'top'
            },
            buttons: [
                {
                    text: 'Anterior',
                    action: 'back'
                },
                {
                    text: 'Próximo',
                    action: 'next'
                }
            ]
        },
        {
            id: 'transcription-button',
            target: '.transcription-button',
            title: 'Gerar Transcrição',
            text: 'Após concluir a gravação, clique neste botão para gerar a transcrição do áudio. O processo pode levar alguns segundos, dependendo da duração da gravação.',
            attachTo: {
                element: '.transcription-button',
                on: 'top'
            },
            buttons: [
                {
                    text: 'Anterior',
                    action: 'back'
                },
                {
                    text: 'Próximo',
                    action: 'next'
                }
            ]
        },
        {
            id: 'transcribe-and-generate-button',
            target: '.transcribe-and-generate-button',
            title: 'Transcrever e gerar documento',
            text: '',
            attachTo: {
                element: '.transcribe-and-generate-button',
                on: 'top'
            },
            buttons: [
                {
                    text: 'Anterior',
                    action: 'back'
                },
                {
                    text: 'Próximo',
                    action: 'next'
                }
            ]
        },
        {
            id: 'transcription-preview',
            target: '.transcription-preview',
            title: 'Transcrição em Tempo Real',
            text: 'Enquanto você grava, a transcrição é gerada em tempo real. Você pode revisar o texto e fazer correções antes de salvar.',
            attachTo: {
                element: '.transcription-preview',
                on: 'left'
            },
            buttons: [
                {
                    text: 'Anterior',
                    action: 'back'
                },
                {
                    text: 'Concluir',
                    action: 'complete'
                }
            ]
        }
    ],
};

const startTour = () => {
    if (tour) {
        tour.complete();
    }

    const steps = tourSteps[props.tourType] || tourSteps.recording;

    tour = new Shepherd.Tour({
        defaultStepOptions: {
            cancelIcon: {
                enabled: true
            },
            classes: 'shepherd-theme-custom',
            scrollTo: {
                behavior: 'smooth',
                block: 'center'
            },
            arrow: true,
            highlightClass: 'shepherd-highlight'
        },
        useModalOverlay: true
    });

    steps.forEach(step => {
        tour.addStep({
            ...step,
            buttons: step.buttons.map(btn => ({
                ...btn,
                classes: btn.text === 'Concluir' ? 'shepherd-button-primary' : 'shepherd-button-secondary',
                action: () => {
                    if (btn.action === 'complete') {
                        tour.complete();
                    } else if (btn.action === 'next') {
                        tour.next();
                    } else if (btn.action === 'back') {
                        tour.back();
                    }
                }
            }))
        });
    });

    tour.on('complete', () => {
        emit('tour-complete');
        localStorage.setItem(`tour_completed_${props.tourType}`, 'true');
    });

    tour.on('cancel', () => {
        emit('tour-cancel');
    });

    tour.start();
};

const checkTourCompleted = () => {
    return localStorage.getItem(`tour_completed_${props.tourType}`) === 'true';
};

onMounted(() => {
    if (props.autoStart && !checkTourCompleted()) {
        
        setTimeout(() => {
            startTour();
        }, 1000);
    }
});

onUnmounted(() => {
    if (tour) {
        tour.complete();
    }
});
</script>

<style scoped>

</style>