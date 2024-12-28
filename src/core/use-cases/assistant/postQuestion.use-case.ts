import { QuestionResponse } from "../../../interface";

export const postQuestionUseCase = async (threadId: string, question: string) => {
  try {

    const resp = await fetch(`${import.meta.env.VITE_ASSISTANT_API}/user-question`,{ 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ threadId, question })
    });

    if(!resp.ok) throw new Error('No se puede realizar la consulta')
    const replies = await resp.json() as QuestionResponse[];
    console.log(replies);
    return replies
    
  } catch (error) {
    console.log(error);
    throw new Error('No se puede realizar la consulta')
  }
}