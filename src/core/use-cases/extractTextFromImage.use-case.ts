export const extractTextFromImageUseCase = async (file: File,prompt?: string) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if(prompt) formData.append('prompt', prompt);

    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/extract-text-from-image`,{
      method: 'POST',
      body: formData
    })

    if(!resp.ok) throw new Error('No se puede realizar la consulta')
    const data = await resp.json();
    
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