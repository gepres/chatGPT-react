import { AudioToTextResponse } from "../../interface";


export const audioToTextUseCase = async (audioFile: File,prompt?: string) => {
try {

  
    const formData = new FormData();
    formData.append('file', audioFile);
    if(prompt) formData.append('prompt', prompt);

    
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/audio-to-text`,{
      method: 'POST',
      body: formData
    })

    console.log(resp);
    

    if(!resp.ok) throw new Error('No se puede realizar la consulta')
    const data = await resp.json() as AudioToTextResponse;

    return {
      ok: true,
      data
    }

    
  } catch (error) {
    console.log(error);
    
    return {
      ok: false,
      errors:[],
      message: 'No se puedo realizar la consulta'
    }
  }
}