import { useState } from "react";
import { GptMessage, MyMessage, TextMessageBox, TextMessageBoxSelect, TypingLoader } from "../../components";
import { translateUseCase } from "../../../core/use-cases";



interface Message {
  text: string;
  isGpt: boolean;
}

const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];


export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);



  const handlePost = async (text:string, selectedOption:string) => {
      setIsLoading(true);
      const complementMessage = `Traduce: ${text} al idioma ${selectedOption}`;
      setMessages((prev) => [...prev, { text:complementMessage, isGpt: false }])
      const {ok, message} = await translateUseCase(text, selectedOption);
      if( !ok) {
        setMessages((prev) => [...prev, { text: 'No se puede realizar la consulta', isGpt: true }]);
      } else {
        setMessages((prev) => [...prev, { 
          text: message, 
          isGpt: true, 
        }]);
      }
      setIsLoading(false);
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
        <GptMessage text="que quieres que tradusca hoy?" />
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
      <TextMessageBoxSelect onSendMessage={handlePost} placeholder="Escribe aquí..." options={languages} disabledCorrections />
    </div>
  )
}
