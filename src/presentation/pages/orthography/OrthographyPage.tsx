import { useState } from "react";
import { GptOrthographyMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { orthographyUseCase } from "../../../core/use-cases";


interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  }
}

export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text:string) => {
      setIsLoading(true);
      setMessages((prev) => [...prev, { text, isGpt: false }]);

      const {ok, userScore, errors, message} = await orthographyUseCase(text);

      if( !ok) {
        setMessages((prev) => [...prev, { text: 'No se puede realizar la consulta', isGpt: true }]);
      } else {
        setMessages((prev) => [...prev, { 
          text: message, 
          isGpt: true, 
          info: {
            userScore: userScore, 
            errors: errors,
            message: message
          }
        }]);
      }
      
      setIsLoading(false);
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">


          {
            messages.map((message, index) => (
              message.isGpt ? (
                <GptOrthographyMessage key={index} {...message.info!} />
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
