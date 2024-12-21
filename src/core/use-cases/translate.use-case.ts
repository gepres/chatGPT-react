import { TranslateResponse } from "../../interface";

export const translateUseCase = async (prompt: string, lang:string) => {
  try {
      
      const resp = await fetch(`${import.meta.env.VITE_GPT_API}/translate`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt,lang })
      })
  
      if(!resp.ok) throw new Error('No se puede realizar la consulta')
      const data = await resp.json() as TranslateResponse;
      console.log(data);
      
      return {
        ok: true,
        ...data
      }
  
      
    } catch (error) {
      return {
        ok: false,
        message: 'No se puede realizar la consulta'
      }
    }
}