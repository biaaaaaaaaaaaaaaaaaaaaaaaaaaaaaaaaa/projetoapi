// DECLARAÇÕES DOS ELEMENTOS USANDO DOM

const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("resultado");
const canvas = document.getElementById("canvas");

//FUNÇÃO QUE HABILITA A CÂMERA 

async function configurarCamera(){
    try{
        const midia = await navigator.mediaDevices.getUserMedia({
            video:{ faxingMode: "environement" }, //aciona a camera traseira
            audio:false
        });
        // recebe a função midia para habilitar a camera
        videoElemento.srcObject = media;
        // garante que o video comece
        videoElemento.onplay();

    }catch(erro){
        resultado.innerText="Erro ao acessar a câmera", erro
    }
} 
//executa a função da câmera
configurarCamera();

//função para ler o texto que a camera pegar
botaoScanear.onclick = async ()=>{
    botaoScanear.disable = true; //habilita a camera
    resultado.innerText = "Fazendo a leitura...aguarde";

    //preparando o canvas para criar estrutura da camera
    const contexto = canvas.getContext("2d");

    //ajustar o tamanho do canvas
    canvas.width = videoElemento.videoWidth; //largura
    canvas.height = videoElemento.videoHeight; //altura

    // reset para garnatir que a fot nao saia invertida
    contexto.setTransform(1, 0, 0, 1, 0, 0);

    //filtro de contraste e escala de cinza antes de tirar a foto
    //ajuda evitar as letras aleatorias

    contexto.filter = 'contrast(1.2) grayscale(1)';
    try{
        //consumindo api
        const { data: {text}} = await Tesseract.reconize(
            canvas, //aonde o texto vai aparecer
            'por' // idioma do texto
        );
        // remove espaços excessivos e caracteres especiais
        const textoFinal = text.trim();
        resultado.innerText = textoFinal.length > 0 ? textoFinal: "Não foi possivel indentificar o texto!"

    }catch(erro){
        console.error(erro);
        resultado.innerText="Erro ao processar", erro

    }
    finally{
        botaoScanear.disable = false; // desabilita a camera para fazer uma nova captura

    }
}