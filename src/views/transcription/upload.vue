<template>
    <section>
        <div class="mb-3 py-3">
            <h1 class="text-3xl font-bold">Novo atendimento</h1>
            <p class="my-1 text-lg text-surface-500">Grave ou envie o áudio da consulta para gerar automaticamente o documento clínico e os insights</p>
        </div>
        <div class="flex gap-x-4 flex-wrap md:flex-nowrap">
            <div class="card w-full md:w-1/2 flex flex-col mb-5 md:mb-0">
                <SelectButtonMode 
                    :modelValue="inputMode"
                    @changeInputMode="confirmInputModeChangeIfFileSelected"
                />

                <RecordCardTitle v-if="isRecordMode()" />
                <UploadCardTitle v-if="!isRecordMode()" />

                <div class="flex flex-col">
                    <div>
                        <div class="flex gap-x-1">
                            <label class="mb-1" for="name">Nome do Paciente<span class="text-red-500">*</span></label>
                        </div>
                        <InputText id="name" v-model="form.patient" type="text" class="w-full" maxlength="254" placeholder="Digite o nome do paciente..." :class="{ 'p-invalid': errorMessagePatient }" />
                        <small v-if="errorMessagePatient" class="text-red-500">
                            {{ errorMessagePatient }}
                        </small>
                    </div>
                    <div class="flex gap-4 flex-wrap xl:flex-nowrap mt-2 mb-5">
                        <div class="w-full">
                            <label class=" mb-1" for="template">Template<span class="text-red-500">*</span></label>
                            <Select 
                                id="template" 
                                v-model="form.template_id" 
                                :options="dropdownTemplates" 
                                filter
                                :loading="loadingTemplates"
                                :class="{ 'p-invalid': errorMessage }"
                                optionValue="id" 
                                optionLabel="name" 
                                placeholder="Selecione" 
                                class="w-full" 
                            />
                        </div>
                        <div class="w-full">
                            <label class=" mb-1" for="type">Tipo de atendimento<span class="text-red-500">*</span></label>
                            <Select 
                                id="type" 
                                v-model="form.type_id" 
                                :options="dropdownTypes"
                                :loading="loadingTypes"
                                :class="{ 'p-invalid': errorMessageType }"
                                optionValue="id" 
                                optionLabel="type" 
                                placeholder="Selecione" 
                                class="w-full" 
                            />
                        </div>
                    </div>

                    <FileUpload
                        ref="uploader"
                        name="demo[]"
                        :auto="false"
                        @select="onFileSelect"
                        :multiple="false"
                        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac"
                        class="vitalfy-uploader"
                        :showThumbnails="false"
                        v-if="!isRecordMode()"
                    >
                        <template #header><span class="hidden"></span></template>
                        <template #content="{ files }"> 
                            <div 
                                v-if="files.length > 0" 
                                class="space-y-3"
                            >
                                <div 
                                    v-for="(file) of files" 
                                    :key="file.name + file.type + file.size"
                                    class="group flex items-center justify-between gap-4 p-4 rounded-2xl 
                                        bg-white/70 backdrop-blur-md border border-slate-200
                                        shadow-sm hover:shadow-md transition-all duration-300 dark:bg-neutral-700/70 dark:border-neutral-700"
                                >
                                    <div class="flex items-center gap-4 flex-1 min-w-0">
                                        <div class="flex items-center justify-center w-12 h-12 rounded-xl 
                                                    bg-gradient-to-br from-blue-500 to-indigo-600 
                                                    text-white shadow-md">
                                            <FileVolume size="22"/>
                                        </div>

                                        <div class="flex flex-col min-w-0">
                                            <span class="font-semibold text-sm sm:text-base truncate text-slate-800 dark:text-slate-300">
                                                {{ file.name }}
                                            </span>
                                            <span class="text-xs text-slate-500 dark:text-slate-400">
                                                {{ formatSize(file.size) }}
                                            </span>
                                        </div>

                                        <span class="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-medium dark:bg-blue-500/20 dark:text-blue-400">
                                            {{ file.type.split('/')[1] || 'audio' }}
                                        </span>
                                    </div>

                                    <button 
                                        @click="removeFile"
                                        class="
                                            w-9 h-9 flex items-center justify-center rounded-lg
                                            hover:bg-red-50 text-red-500 dark:hover:bg-red-900 transition"
                                    >
                                        <i class="pi pi-times"></i>
                                    </button>
                                </div>
                            </div>
                        </template>
                        <template #empty>
                            <div 
                                @click="openFileDialog"
                                class="group relative flex flex-col items-center justify-center text-center
                                    p-8 rounded-2xl border-2 border-dashed border-slate-300
                                    bg-gradient-to-br from-white to-slate-50
                                    hover:border-blue-400 hover:bg-blue-50/40
                                    transition-all duration-300 cursor-pointer 
                                    dark:bg-gradient-to-br dark:from-neutral-800 dark:to-neutral-900 
                                    dark:border-neutral-700 dark:hover:border-blue-500"
                            >
                                <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                                            bg-blue-500/5 blur-xl transition"></div>

                                <div class="flex items-center justify-center w-14 h-14 rounded-2xl
                                            bg-blue-100 text-blue-600 mb-4
                                            group-hover:scale-105 transition dark:bg-blue-500/20 dark:text-blue-400">
                                    <Upload size="24"/>
                                </div>

                                <p class="text-base font-medium text-slate-700 dark:text-slate-300">
                                    Arraste seu áudio aqui
                                </p>
                                <p class="text-sm text-slate-500 dark:text-slate-400">
                                    ou clique para selecionar um arquivo
                                </p>

                                <div class="mt-3 px-5 py-2 rounded-md text-sm font-medium
                                            bg-blue-600 text-white shadow-sm
                                            group-hover:shadow-md group-hover:scale-[1.02]
                                            transition">
                                    Selecionar arquivo
                                </div>
                            </div>
                        </template>
                    </FileUpload>
                    
                    <AudioRecord 
                        v-if="isRecordMode()"
                        @recorded="handleRecordedFile" 
                        @recording-started="scrollAfterRecordingStart"
                    />
                    
                    <div class="flex justify-end mt-3 gap-x-1">
                        <Button
                            ref="submitBtn"
                            @click="transcribeAudio"
                            :disabled="!selectedFile || isTranscribing || loadingTranscribeAndGenerate"
                            class="!border !border-blue-500 mr-2 !text-blue-500 !bg-white !rounded-lg font-semibold hover:!bg-blue-100 duration-300 dark:!border-2 dark:!bg-neutral-800 dark:hover:!bg-neutral-700 "
                        >
                            <Loader2 v-if="isTranscribing" :size="17" class="animate-spin mr-2" />
                            <MessagesSquare v-else :size="17" class="mr-1" />
                            {{ isTranscribing ? 'Transcrevendo...' : 'Transcrever' }}
                        </Button>
                        <Button
                            @click="transcribeAndGenerateDocument"
                            :disabled="!selectedFile || isTranscribing || loadingTranscribeAndGenerate"
                            class="!bg-gradient-to-br !from-blue-500 !to-blue-700 !border-none !text-white !rounded-lg font-semibold hover:!from-blue-600 hover:!to-blue-800 duration-300"
                        >
                            <Loader2 v-if="loadingTranscribeAndGenerate" :size="17" class="animate-spin mr-2" />
                            <FilePlus v-else :size="17" />
                            {{ loadingTranscribeAndGenerate ? 'Transcrevendo...' : 'Transcrever e gerar documento' }}
                        </Button>
                        <button
                            v-tooltip.top="{
                                value: `<span class='text-sm'><u>Transcrever</u>: exibe o texto da consulta nesta tela. Você poderá gerar o documento clínico em seguida.</span>\n
                                    <span class='text-sm'><u>Transcrever e gerar documento</u>: cria o documento automaticamente. A transcrição poderá ser vista nos detalhes do documento.</span>`,
                                escape: false,
                                showDelay: 300
                            }"
                            class="flex items-center justify-center rounded-full border-none text-gray-400 transition"
                        >
                            <HelpCircle :size="15" />
                        </button>
                    </div>
                </div>
            </div>
            <TranscriptConversation
                :transcriptions="transcriptions"
                :is-transcribing="isTranscribing"
                :dialog-clear="dialogClear"
                :loading-finish="loadingFinish"
                :loading-transcribe-and-generate="loadingTranscribeAndGenerate"
                @clear="dialogClear = true"
                @finish="finishConversation"
            />
        </div>
        <ChangeInputMode 
            :active="dialogChangeInputMode" 
            :loading="dialogLoading" 
            @close="dialogChangeInputMode = false" 
            @confirm="confirmChangeInputMode"
        />
        <ClearTranscription 
            :active="dialogClear"
            :loading="dialogLoading"
            @close="dialogClear = false" 
            @confirm="confirmClearTranscription"
        />
    </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Upload, FileVolume, Loader2, FilePlus, MessagesSquare, HelpCircle } from 'lucide-vue-next';
import { AnamneseService } from '@/service/AnamneseService';
import { TranscriptsService } from '@/service/TranscriptsService';
import { SelectOptionsService } from '@/service/SelectOptionsService';
import { useShowToast } from '@/utils/useShowToast';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from "vue-router";
import api from '@/services/axios';
import Cookies from 'js-cookie';
import { useHelpers } from '@/utils/helper';
import { useUserStore } from '@/stores/userStore'

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { showSuccess, showError } = useShowToast();
const { formatSize } = useHelpers();
const userStore = useUserStore()

const inputMode = ref('record')
const chatTranscription = ref();
const uploader = ref(null)
const selectedFile = ref(null)
const isTranscribing = ref(false)
const loadingFinish = ref(false)
const dialogClear = ref(false)
const dialogLoading = ref(false)
const dialogChangeInputMode = ref(false)
const transcriptions = ref([])
const loadingTemplates = ref(false)
const loadingTypes = ref(false)
const loadingTranscribeAndGenerate = ref(false)
const endConversationTime = ref('')
const dropdownTemplates = ref([]);
const dropdownTypes = ref([]);
const errorMessage = ref(false);
const fileSize = ref('')
const form = ref({
    patient: '',
    template_id: null,
    type_id: null
})
const submitBtn = ref(null)
const pendingInputMode = ref(null);

const scrollAfterRecordingStart = () => {
    nextTick(() => {
        submitBtn.value?.$el?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    })
}

function openFileDialog() {
    if (transcriptions.value.length > 0) {
        alert('Por favor, limpe a transcrição antes de enviar um novo arquivo.');
        return;
    }
    uploader.value?.choose();
}

const onFileSelect = (event) => {
    selectedFile.value = event.files[0];
};

const removeFile = () => {
    selectedFile.value = null;
    uploader.value?.clear();
};

const confirmClearTranscription = () => {
    dialogClear.value = false
    clearTranscriptionData()
};

const clearTranscriptionData = () => {
    removeFile();
    transcriptions.value = [];
    chatTranscription.value = null;
    fileSize.value = ''
    endConversationTime.value = ''
    transcriptId.value = '' 
}

const validateAudioFile = (file) => {
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (file.size > maxSize) return { valid: false, error: 'Arquivo muito grande. Máximo permitido: 100MB' };

    const supportedTypes = [
        'audio/mpeg',      // MP3
        'audio/mp3',       // MP3 alternativo
        'audio/wav',       // WAV
        'audio/m4a',       // M4A
        'audio/aac',       // AAC
        'audio/ogg',       // OGG
        'audio/flac',      // FLAC
        'audio/webm'       // WebM (gerado por gravação no navegador)
    ];

    if (!supportedTypes.includes(file.type)) {
        return { 
            valid: false, 
            error: `Formato não suportado: ${file.type}. Use MP3, WAV, M4A, AAC, OGG, WebM ou FLAC` 
        };
    }

    fileSize.value = file.size
    return { valid: true };
};

const transcriptId = ref()
const transcribeAudio = async () => {
    if (!validateForm()) return;
    if (!hasSelectedFile()) return;

    isTranscribing.value = true;

    const formData = new FormData();
    formData.append('audio', selectedFile.value);

    const { patient, template_id: template, type_id: type } = form.value;
    formData.append('patient', patient);
    formData.append('template', template);
    formData.append('type', type);

    TranscriptsService.store(formData)
        .then(response => {
            const transcript = response.data.transcript
            transcriptId.value = transcript.id

            const processedTranscription = processDeepgramResultAndCreateChatDesign(transcript.conversation, selectedFile.value.name);
            
            chatTranscription.value = processedTranscription.utterances;
            transcriptions.value.unshift(processedTranscription);

            setUsageOnStorage(response.data.remaining)

            selectedFile.value = null;
            uploader.value?.clear();

            showSuccess('Sucesso', 'Transcrição gerada com sucesso!', 3000);
        })
        .catch(error => {
            alert('Erro ao transcrever o áudio.');
        })
        .finally(() => {
            isTranscribing.value = false;
        });
};

const setUsageOnStorage = (remaining) => {
    if(remaining == null) return;

    userStore.remaining = remaining
    localStorage.setItem('remaining',  remaining)
}

const transcribeAndGenerateDocument = async () => {
    if (!validateForm()) return;
    if (!hasSelectedFile()) return;

    loadingTranscribeAndGenerate.value = true;

    const formData = new FormData();
    formData.append('audio', selectedFile.value);

    const { patient, template_id: template, type_id: type } = form.value;
    formData.append('patient', patient);
    formData.append('template', template);
    formData.append('type', type);

    try {
        const response = await TranscriptsService.storeAndGenerateDocument(formData);
        const result = response.data;

        if (result) {
            setUsageOnStorage(response.data.remaining)

            loadingTranscribeAndGenerate.value = false
            showSuccess('Sucesso', 'Documento gerado com sucesso!', 3000);
            
            redirectTo(result.document.transcript_id);
        }
    } catch (error) {
        loadingTranscribeAndGenerate.value = false
        alert('Erro ao transcrever o áudio.');
    }
};

const getLastUtteranceEndTime = (utterances) => {
    if (!utterances?.length) return null;
    
    const seconds = Math.round(utterances[utterances.length - 1].end);
    return endConversationTime.value = seconds ?? null;
};

// TODO: VER A NECESSIDADE DESSA FUNÇÃO E EXCLUIR SE DESNECESSÁRIO
const processDeepgramResultAndCreateChatDesign = (conversation, fileName) => {
    return {
        fileName: fileName,
        timestamp: new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        utterances: conversation
    };
};

const finishConversation = async () => {
    loadingFinish.value = true;

    try {
        const payload = buildPayload();
        const response = await AnamneseService.generator(payload);

        redirectTo(response.transcript_id);
    } catch (error) {
        showError(t('notifications.titles.error'), t('notifications.messages.anamnesisGeneratingError'), 3000);
    } finally {
        loadingFinish.value = false;
    }
};

const confirmInputModeChangeIfFileSelected = (newValue) => {
    if (!hasSelectedFile() && !hasTranscriptions()) {
        inputMode.value = newValue
        return
    }
    
    pendingInputMode.value = newValue;
    dialogChangeInputMode.value = true
}

const confirmChangeInputMode = () => {
    dialogChangeInputMode.value = false;
    inputMode.value = pendingInputMode.value;
    pendingInputMode.value = null;
    clearTranscriptionData();
}

const handleRecordedFile = (file) => {
    selectedFile.value = file;
};

const buildPayload = () => {
    const { patient, template_id: template, type_id: type } = form.value;
    return {
        conversation: chatTranscription.value,
        patient,
        template,
        transcript_id: transcriptId.value
    };
};

// TODO: USAR VALIDAÇÃO COM ZOD
const errorMessagePatient = ref(false)
const errorMessageType = ref(false)
const validateForm = () => {
    errorMessage.value = false
    errorMessagePatient.value = false
    errorMessageType.value = false

    let isValid = true

    if (!form.value.template_id) {
        errorMessage.value = true
        isValid = false
    }

    if (!form.value.patient) {
        errorMessagePatient.value = true
        isValid = false
    } else if (form.value.patient.length > 255) {
        errorMessagePatient.value = 'O nome do paciente deve ter no máximo 255 caracteres.'
        isValid = false
    }

    if (!form.value.type_id) {
        errorMessageType.value = true
        isValid = false
    }

    if (!isValid) {
        showError(
            t('notifications.titles.error'),
            "Por favor, verifique os campos do formulário.",
            4000
        )
    }

    return isValid
}

const redirectTo = (id) => {
    router.push({
        name: 'transcriptsShow',
        params: { id: id },
        query: { type: 'new' }
    });
}

const isRecordMode = () => inputMode.value === 'record';
const hasSelectedFile = () => selectedFile.value != null;
const hasTranscriptions = () => transcriptions.value.length > 0;

async function loadTemplates() {
    loadingTemplates.value = true
    try {
        dropdownTemplates.value = await SelectOptionsService.getTemplatesMinimal()
        form.value.template_id = Number(localStorage.getItem("favorite")) || null

        const templateFromUrl = route.query.template

        if (templateFromUrl) {
            form.value.template_id = Number(templateFromUrl)
        }
    } catch (error) {
        console.error(error)
    } finally {
        loadingTemplates.value = false
    }
}

async function loadTypes() {
    loadingTypes.value = true
    try {
        dropdownTypes.value = await SelectOptionsService.getTypesMinimal()
    } catch (error) {
        console.error(error)
    } finally {
        loadingTypes.value = false
    }
}

onMounted(() => {
    loadTemplates();
    loadTypes();
});
</script>

<style scoped>
.custom-uploader .p-fileupload-content {
  padding: 0 !important;
  background: none;
  box-shadow: none;
  border: none !important;
}
.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  border: 2px dashed #ccc;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color .2s;
}
.upload-text {
  text-align: center;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.4;
  font-size: 0.9rem;
}
::v-deep(.p-fileupload-header) {
    padding: 0 !important;
    margin: 0 !important;
    height: 0 !important;
    border: none !important;
}
::v-deep(.p-fileupload-content) {
    padding: 0 !important;
    border: none !important;
}
::v-deep(.p-fileupload-advanced) {
    border: none !important;
}
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>