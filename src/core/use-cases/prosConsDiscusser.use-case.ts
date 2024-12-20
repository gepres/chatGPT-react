import { ProsConsDiscusserResponse } from "../../interface";

export const prosConsDiscusserUseCase = async (prompt: string) => {
  try {
    
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    })

    if(!resp.ok) throw new Error('No se puede realizar la consulta')
    const data = await resp.json() as ProsConsDiscusserResponse;

    return {
      ok: true,
      ...data
    }

    
  } catch (error) {
    return {
      ok: false,
      role: 'refusal',
      content: 'No se puedo realizar la consulta',
      refusal: null
    }
  }
}