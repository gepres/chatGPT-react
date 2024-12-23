import { useState } from "react";
import { GptMessage, GptMessageAudio, MyMessage, TextMessageBoxSelect, TypingLoader } from "../../components";
import { textToAudioUseCase } from "../../../core/use-cases";

const displaimer = `## ¿ Qué audio quieres generar hoy ?
  * todo el audio generado es por AI
`


const voices = [
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "nova", text: "Nova" },
  { id: "shimmer", text: "Shimmer" },
]

interface TextMessage {
  text: string;
  isGpt: boolean;
  type: 'text';
}

interface AudioMessage {
  text: string;
  isGpt: boolean;
  audio: string;
  type: 'audio';
}

type Message = TextMessage | AudioMessage;

export const TextToAudioPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text:string, voice:string) => {
      setIsLoading(true);
      setMessages((prev) => [...prev, { text, isGpt: false, type: 'text' }]);

      const {ok, message, audioUrl} = await textToAudioUseCase(text, voice);

      console.log(audioUrl);

      if( !ok) return;

      setMessages((prev) => [...prev, { text: voice + ' - '+message, isGpt: true, type: 'audio', audio: audioUrl! }]);
      
      setIsLoading(false);

  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
        <GptMessage text={displaimer} />
          {
            messages.map((message, index) => (
              message.isGpt && message.type === 'audio' ? (
                <GptMessageAudio key={index} text={message.text} audio={message.audio} />
              ) : message.isGpt && message.type === 'text' ?
              (
                <GptMessage key={index} text={message.text} />
              )
              : (
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
     <TextMessageBoxSelect onSendMessage={handlePost} placeholder="Escribe aquí..." options={voices} disabledCorrections />
    </div>
  )
}
