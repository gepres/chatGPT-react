import { useState } from "react";
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components";
import { prosConsDiscusserUseCase } from "../../../core/use-cases";



interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text:string) => {
      setIsLoading(true);
      setMessages((prev) => [...prev, { text, isGpt: false }]);

       const {ok , content} = await prosConsDiscusserUseCase(text);

       if( !ok) {
         setMessages((prev) => [...prev, { text: 'No se puede realizar la consulta', isGpt: true }]);
       } else {
         setMessages((prev) => [...prev, { 
           text: content, 
           isGpt: true, 
         }]);
       }

      setIsLoading(false);
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
        <GptMessage text="Puedes escribir un mensaje para que yo te explique las pros y contras de un tema que te interese?" />
          {
            messages.map((message, index) => (
              message.isGpt ? (
                <GptMessage key={index} text={message.text} />
              ) : (
                <MyMessage key={index} text={message.text} />
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
      <TextMessageBox onSendMessage={handlePost} placeholder="Escribe aquí..." disabledCorrections />
    </div>
  )
}
