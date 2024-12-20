import { useState } from "react";
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"


interface Message {
  text: string;
  isGpt: boolean;
}

export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text:string) => {
      setIsLoading(true);
      setMessages((prev) => [...prev, { text, isGpt: false }]);

      // useCase
      setIsLoading(false);
      // TODO: añadir mensaje de is gpt in true
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* <GptMessage text="Hola, ¿cómo estás?" /> */}

          {
            messages.map((message, index) => (
              message.isGpt ? (
                <GptMessage key={index} text="esto es de OpenAI" />
              ) : (
                <MyMessage key={index} text={message.text} />
              )
            ))
          }
          {/* <MyMessage text="Hola Mundo" /> */}


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
