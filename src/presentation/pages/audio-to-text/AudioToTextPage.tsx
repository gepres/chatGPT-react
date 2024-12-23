import { useState } from "react";
import { GptMessage, MyMessage, TextMessageBoxFile, TypingLoader } from "../../components";
import { audioToTextUseCase } from "../../../core/use-cases";


const displaimer = `## ¿ Qué audio quieres Procesar hoy ?`



interface TextMessage {
  text: string;
  isGpt: boolean;
}

type Message = TextMessage;

export const AudioToTextPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text:string, file:File) => {
      setIsLoading(true);
      setMessages((prev) => [...prev, { text, isGpt: false }]);

      console.log({text, file});
      
      const {ok,data} = await audioToTextUseCase(file,text);

      if( !ok || !data) return;

      console.log(data);

        const gptMessage = `## Transcripción: \n __Duración:__ ${data.duration} \n\n ## El texto es: \n ${data.text}`
      
      setMessages((prev) => [...prev, { text: gptMessage, isGpt: true }]);
      


      for(const segment of data.segments) {
        const segmentMessage  = `__De ${ Math.round(segment.start)} a ${Math.round(segment.end)} segundos:__ \n\n${segment.text}`
        setMessages((prev) => [...prev, { text: segmentMessage, isGpt: true }]);
      }

      
      setIsLoading(false);  

  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
        <GptMessage text={displaimer} />
          {
            messages.map((message, index) => (
              message.isGpt ? (
                <GptMessage key={index} text={message.text} />
              )
              : (
                <MyMessage key={index} text={message.text ?? 'Transcribe el audio'} />
              )
            ))
          }


          {
            isLoading && (
              <div className="col-start-1 col-end-12">
                <TypingLoader className="fade-in" />
              </div>
            )
          }
        </div>
      </div>
     <TextMessageBoxFile onSendMessage={handlePost} placeholder="Escribe aquí..." accept="audio/*" />
    </div>
  )
}
