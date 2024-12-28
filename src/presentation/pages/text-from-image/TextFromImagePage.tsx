import { useState } from "react";
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxFile } from "../../components";
import { extractTextFromImageUseCase } from "../../../core/use-cases";



interface Message {
  text: string;
  isGpt: boolean;
}


export const TextFromImagePage = () => {
  const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
  
    const handlePost = async (text:string, file:File) => {
        setIsLoading(true);
        setMessages((prev) => [...prev, { text, isGpt: false }]);

        const {ok, data} = await extractTextFromImageUseCase(file,text);
        if( !ok || !data) return;
        setIsLoading(false);
        setMessages((prev) => [...prev, { text: data.message, isGpt: true }]);
    }
  
    return (
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
            <GptMessage text="Que imagenes quieres extraer texto de hoy?" />
            {
              messages.map((message, index) => (
                message.isGpt ? (
                  <GptMessage key={index} text={message.text} />
                ) : (
                  <MyMessage key={index} text={message.text ?? 'describe que ves en la imagen'} />
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
        <TextMessageBoxFile onSendMessage={handlePost} placeholder="Escribe aquí..." accept="image/*" />
      </div>
    )
}