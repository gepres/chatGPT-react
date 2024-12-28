import { useEffect, useState, useRef } from "react";
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../../components";
import { createThreadUseCase, postQuestionUseCase } from "../../../core/use-cases";
import { QuestionResponse } from "../../../interface";

interface Message {
  text: string;
  isGpt: boolean;
}

export const AssistantPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string>();
  const chatContainerRef = useRef<HTMLDivElement>(null); // Referencia al contenedor del chat para el scroll

  useEffect(() => {
    const threadId = localStorage.getItem("threadId");
    if (threadId) {
      setThreadId(threadId);
    } else {
      createThreadUseCase().then((id) => {
        setThreadId(id);
        localStorage.setItem("threadId", id);
      });
    }
  }, []);

  useEffect(() => {
    if (threadId) {
      setMessages((prev) => [...prev, { text: `Número de thread: ${threadId}`, isGpt: true }]);
    }
  }, [threadId]);

  useEffect(() => {
    // Hacer scroll automático al final del contenedor cuando los mensajes cambien
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handlePost = async (text: string) => {
    if (!threadId) return;

    setIsLoading(true);

    // Añadir el mensaje del usuario
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    // Obtener todas las respuestas
    const replies: QuestionResponse[] = await postQuestionUseCase(threadId, text);

    setIsLoading(false);

    setMessages([
      { text: `Número de thread: ${threadId}`, isGpt: true },
      ...replies.map((reply) => ({
        text: reply.content.join("\n"),
        isGpt: reply.role === "assistant",
      })),
    ]);
  };

  return (
    <div className="chat-container">
      <div ref={chatContainerRef} className="chat-messages overflow-y-auto h-full">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text="Buenos días, soy Sam, en que puedo ayudarte hoy?" />
          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text={message.text} />
            ) : (
              <MyMessage key={index} text={message.text} />
            )
          )}
          {isLoading && (
            <div className="col-start-1 col-end-12">
              <TypingLoader className="fade-in" />
            </div>
          )}
        </div>
      </div>
      <TextMessageBox onSendMessage={handlePost} placeholder="Escribe aquí..." disabledCorrections />
    </div>
  );
};
