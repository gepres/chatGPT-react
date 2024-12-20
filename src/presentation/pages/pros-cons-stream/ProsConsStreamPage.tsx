import { useRef, useState } from "react";
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../../components";
import { prosConsDiscusserStreamGeneratorUseCase } from "../../../core/use-cases";




interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsStreamPage = () => {

  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {

    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }


    setIsLoading(true);
    isRunning.current = true;
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const stream = prosConsDiscusserStreamGeneratorUseCase(text, abortController.current.signal);

    setIsLoading(false);
    setMessages((messages) => [...messages, { text: 'Estoy escribiendo...', isGpt: true }]);

    for await (const text of stream) {
      setMessages((messages) => {
        const newMessage = [...messages];
        newMessage[newMessage.length - 1].text = text;
        return newMessage;
      });
    }

    // const reader = await prosConsDiscusserStreamUseCase(text);
    // setIsLoading(false);

    // if(!reader) return;

    // const decoder = new TextDecoder();
    // let message = '';
    // setMessages((messages) => [...messages, { text: message, isGpt: true }]);
    // while (true) {
    //   const { value, done } = await reader.read();
    //   if (done) {
    //     break;
    //   }
    //   const decodedChunk = decoder.decode(value, { stream: true });
    //   message += decodedChunk;
    //   setMessages((messages) => {
    //     const newMessage = [...messages];
    //     newMessage[newMessage.length - 1].text = message;
    //     return newMessage;
    //   });
    //   console.log(message);
    // }

  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text="Que deseas comparar hoy?" />
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
