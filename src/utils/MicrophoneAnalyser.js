// TODO: APAGAR
export const setupMicrophoneAnalyser = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const analyser = audioContext.createAnalyser();
                const microphone = audioContext.createMediaStreamSource(stream);
                const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

                analyser.fftSize = 256;
                microphone.connect(analyser);
                analyser.connect(scriptProcessor);
                scriptProcessor.connect(audioContext.destination);

                const bars = document.querySelectorAll('.bar');

                scriptProcessor.onaudioprocess = function () {
                    const array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);

                    // Calcula o volume médio e aplica um fator de amplificação
                    const average = array.reduce((sum, value) => sum + value, 0) / array.length;
                    const amplifiedAverage = average * 3; // Ajuste esse fator para alterar a sensibilidade

                    // Limita o valor para não ultrapassar o máximo de 255
                    const normalizedVolume = Math.min(amplifiedAverage, 255);

                    // Define quantas barras devem ser "ativas" com base no volume
                    const activeBarsCount = Math.floor((normalizedVolume / 255) * bars.length);

                    // Atualiza a cor das barras da esquerda para a direita
                    bars.forEach((bar, index) => {
                        if (index < activeBarsCount) {
                            bar.style.background = 'green'; // Barra ativa
                        } else {
                            bar.style.background = 'lightgray'; // Barra inativa
                        }
                    });
                };
            })
            .catch(function (err) {
                console.error('Erro ao acessar o microfone:', err);
            });
    } else {
        alert('API getUserMedia não suportada neste navegador.');
    }
}