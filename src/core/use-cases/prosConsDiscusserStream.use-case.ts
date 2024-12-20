
export const prosConsDiscusserStreamUseCase = async (prompt: string) => {
  try {
    
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    })

    if(!resp.ok) throw new Error('No se puede realizar la consulta')

      const reader = resp.body?.getReader();
      if (!reader) {
        console.log('No se puede leer el stream');
        return null;
        
      }

      return reader;

  } catch (error) {
    console.log(error);
    
    return null
  }
}