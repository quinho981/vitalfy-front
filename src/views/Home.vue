<!-- TODO: APAGAR -->
<template>
    <div>
        <div class="flex items-center justify-between mr-6">
            <div class="flex items-center cursor-pointer" v-if="!isEditTitle" @click="isEditTitle = true">
                <span v-if="!stepStatus('finished')">{{ title ? title : $t("newConsultation") }} <i class="pi pi-pencil ml-1"></i></span>
            </div>
            <div 
                v-else
                class="flex gap-2 mb-2"
            >
                <InputText id="name1" type="text" size="small" class="!w-[30rem]" v-model="title"/>
                <Button @click="title = ''; isEditTitle = false" icon="pi pi-times" severity="secondary" outlined />
                <Button @click="isEditTitle = false" icon="pi pi-check" />
            </div>
            <div v-if="stepStatus('finished')">
                <Button :label='$t("button.copyText")' icon="pi pi-copy" class="p-button-link !m-0 !p-0" @click="copyText" />
            </div>
        </div>
        <Fluid
            ref="fluidRef"
            :class="{'items-center': stepStatus('not-started')}" 
            class="flex justify-center h-[calc(100dvh-13rem)] overflow-auto"
        >
            <div class="flex w-full md:w-3/5">
                <div class="flex flex-col gap-3 md:px-3 w-full ">
                    <ul>
                        <li 
                            class="flex mb-3 items-center"
                            v-for="(item, index) in chat" :key="index"
                        >
                            <Avatar 
                                label="V" 
                                class="mr-2 flex-shrink-0" 
                                size="small" 
                                :style="{ 'background-color': '#2196F3', color: '#ffffff' }" 
                                shape="circle">
                            </Avatar> 
                            <span
                                id="anamnese-result"
                                ref="typingElements"
                                class="bg-slate-200 dark:bg-[#18181b] p-2 rounded-xl" 
                                v-html="item"
                            ></span>
                        </li>
                        <div 
                            v-if="loadingTranscript && stepStatus('in-progress')"
                            class="flex items-center"
                        >
                            <Avatar label="V" class="mr-2" size="small" :style="{ 'background-color': '#2196F3', color: '#ffffff' }" shape="circle"></Avatar>
                            <div class="inline-flex items-center gap-[3px] bg-slate-200 dark:bg-[#18181b] p-2 rounded-xl">
                                <div class="dot mt-1 w-1.5 h-1.5 rounded-full bg-[#333] dark:bg-slate-400"></div>
                                <div class="dot mt-1 w-1.5 h-1.5 rounded-full bg-[#333] dark:bg-slate-400"></div>
                                <div class="dot mt-1 w-1.5 h-1.5 rounded-full bg-[#333] dark:bg-slate-400"></div>
                            </div>
                        </div>

                        <LoadingFinish 
                            v-if="loadingFinish"
                        />
                    </ul>

                    <div
                        v-if="stepStatus('not-started')"  
                        class="font-semibold text-4xl text-center mb-2"
                    >
                        {{ $t("transcription.howCanIHelpToday") }}
                    </div>

                    <div
                        v-if="stepStatus('not-started')"  
                        class="flex flex-col"
                    >
                        <label for="query-content">{{ $t("transcription.queryContext") }}</label>
                        <div class="flex gap-2">
                            <Textarea
                                rows="1"
                                autoResize  
                                id="query-content" 
                                class="text-lg !max-h-44 border "
                                v-model="transcribedText"
                            />
                            <Button 
                                v-if="stepStatus('not-started')"
                                icon="pi pi-microphone" 
                                @click="recordConversation"
                            />
                        </div>
                        <div
                            v-if="stepStatus('not-started')" 
                            class="flex items-center pr-1 mt-[0.5px]"
                        >
                            <div class="content-microphone-test mr-1">
                                <div id="bars-container" class="flex gap-0.5 items-center">
                                    <div class="bar w-[4px] h-[15px] rounded-lg"></div>
                                    <div class="bar w-[4px] h-[15px] rounded-lg"></div>
                                    <div class="bar w-[4px] h-[15px] rounded-lg"></div>
                                    <div class="bar w-[4px] h-[15px] rounded-lg"></div>
                                    <div class="bar w-[4px] h-[15px] rounded-lg"></div>
                                    <div class="bar w-[4px] h-[15px] rounded-lg"></div>
                                    <div class="bar w-[4px] h-[15px] rounded-lg"></div>
                                </div>
                            </div>
                            <div class="label-microphone-test">
                                {{ $t("transcription.testMicrophone") }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fluid>
        <Fluid 
            v-if="stepStatus('in-progress') || stepStatus('paused')"
            class="flex justify-center items-center px-4"
        >
            <div class="flex flex-col md:w-3/5 mt-2">
                <div class="flex gap-2 mt-2">
                    <Button
                        v-if="stepStatus('in-progress') || stepStatus('paused')"
                        icon="pi pi-times-circle" 
                        :label='$t("transcription.button.cancelRecord")' 
                        severity="danger"
                        @click="cancelConversation"
                        :disabled="loadingFinish"
                    />
                    <Button
                        v-if="stepStatus('in-progress')"
                        icon="pi pi-stop-circle" 
                        :label='$t("transcription.button.pauseRecord")' 
                        severity="warn"
                        @click="stopConversation"
                        :disabled="loadingFinish"
                    />
                    <Button
                        v-if="stepStatus('paused')"
                        icon="pi pi-play" 
                        :label='$t("transcription.button.continueRecord")' 
                        severity="info"
                        @click="recordConversation"
                    />
                    <Button
                        v-if="stepStatus('in-progress') || stepStatus('paused')"
                        icon="pi pi-check-circle" 
                        :label='$t("transcription.button.finishRecord")' 
                        :loading="loadingFinish"
                        @click="finishConversation"
                    />
                </div>
                <p class="text-xs text-center mt-2">{{ $t("transcription.vitalfyError") }}</p>
            </div>
        </Fluid>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { AnamneseService } from '@/service/AnamneseService';
import { setupMicrophoneAnalyser } from '@/utils/MicrophoneAnalyser'
import { useShowToast } from '@/utils/useShowToast';
import { useI18n } from 'vue-i18n';
import { emitter } from '@/eventBus';

const { t } = useI18n();
const { showSuccess, showError } = useShowToast();

const transcribedText = ref('');
const chat = ref([]);
const buttonRecognition = ref(false);
const loadingTranscript = ref(false);
const loadingFinish = ref(false);
const status = ref('not-started');
const isEditTitle = ref(false);
const title = ref('');

let recognition;

const setupSpeechRecognition = () => {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.lang = 'pt-BR';
    recognition.interimResults = true;

    let transcript = '';
    recognition.onresult = (event) => {
        for(let i = event.resultIndex; i < event.results.length; i++) {
            if(event.results[i].isFinal) {
                transcript += event.results[i][0].transcript;
                loadingTranscript.value = false
                chat.value.push(event.results[i][0].transcript);
            }
            loadingTranscript.value = true
        }
        transcribedText.value = transcript;
    };

    recognition.onerror = (event) => {
        if (event.error === 'no-speech' || event.error === 'audio-capture') {
            recordConversation();
        }
        
        buttonRecognition.value = false
        loadingTranscript.value = false
    };

    recognition.onend = () => {
        if (buttonRecognition.value) {
            recognition.start();
        }
    };

};

const recordConversation = () => {
    if (recognition) {
        recognition.start();
        status.value = 'in-progress'
        buttonRecognition.value = true
        loadingTranscript.value = true
    }
};

const stopConversation = () => {
    if (recognition) {
        recognition.stop();
        status.value = 'paused'
        buttonRecognition.value = false
        loadingTranscript.value = false
    }
};

const cancelConversation = () => {
    if (recognition) {
        recognition.abort();
        status.value = 'not-started'
        transcribedText.value = ''
        chat.value = []
        buttonRecognition.value = false
        loadingTranscript.value = false

        setupMicrophoneAnalyser();
    }
};

const finishConversation = () => {
    if (recognition) {
        recognition.stop();

        loadingFinish.value = true
        AnamneseService.generator(transcribedText.value, title.value, 'finished')
            .then((response) => {
                chat.value = []
                status.value = 'finished'
                loadingFinish.value = false

                emitter.emit('refresh-sidebar')

                showSuccess(t('notifications.titles.success'), t('notifications.messages.anamnesisGeneratedSuccessfully'), 3000)
                chat.value.push(response);
            })
            .catch(e => {
                showError(t('notifications.titles.error'), t('notifications.messages.anamnesisGeneratingError'), 3000)
                loadingFinish.value = false
            })
            
        buttonRecognition.value = false
        loadingTranscript.value = false
    }
};

const stepStatus = (step) => {
    return step === status.value
}

const copyText = () => {
    let textToCopy = document.getElementById("anamnese-result").innerText;
    navigator.clipboard.writeText(textToCopy);
    showSuccess(t('notifications.titles.success'), t('notifications.messages.textCopiedSuccessfully'), 3000)
};



// ADICIONAR O CÓDIGO ABAIXO EM UM HELPER
// =============================================
// =============================================
const typingElements = ref([])
const typeText = (el, text) => {
    // Limpa o conteúdo anterior
    el.textContent = ''
    
    let index = 0
    const type = () => {
        if (index < text.length) {
            // Adiciona um caractere por vez
            el.textContent += text.charAt(index)
            index++
            loadingTranscript.value = false
            
            // Agenda o próximo caractere
            setTimeout(type, 10) // Velocidade de digitação (30ms entre caracteres)
        }
    }
    
    // Inicia a digitação
    type()
}

const fluidRef = ref(null);
// Observa as mudanças no chat
watch(() => chat.value, async (newChat) => {
    await nextTick() // Espera o DOM atualizar
    
    if (newChat.length > 0) {
        const lastIndex = newChat.length - 1
        const lastTextEl = typingElements.value[lastIndex]

        // Observa as mudanças no chat e rola para baixo automaticamente
        if (fluidRef.value) {
            // Rola para a parte inferior do elemento
            fluidRef.value.$el.scrollTop = fluidRef.value.$el.scrollHeight;
        }
        // ---------------------------------
        
        if (lastTextEl) {
            // Se o texto contém HTML, usa innerHTML
            if (!newChat[lastIndex].includes('<')) {
            //     typeTextHTML(lastTextEl, newChat[lastIndex])
            // } else {
                typeText(lastTextEl, newChat[lastIndex])
            }
        }
    }
}, { deep: true })
// =============================================
// =============================================
// =============================================

const resetAnamnese = () => {
    transcribedText.value = '';
    chat.value = [];
    status.value = 'not-started';
    title.value = '';

    setupMicrophoneAnalyser();
}

onMounted(() => {
    setupMicrophoneAnalyser();    
    setupSpeechRecognition();
    emitter.on('clear-anamnese', resetAnamnese);
});

onBeforeUnmount(() => {
    if (recognition) {
        recognition.stop();
    }
    emitter.off('clear-anamnese', resetAnamnese);
});
</script>

<style scoped>
.dot {
    animation: bounce 0.6s infinite alternate;
}
.dot:nth-child(2) {
    animation-delay: 0.2s;
}
.dot:nth-child(3) {
    animation-delay: 0.4s;
}
@keyframes bounce {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(-5px); /* Ajuste da altura do "pulo" */
    }
}
</style>