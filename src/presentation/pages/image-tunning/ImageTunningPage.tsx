import { useState } from "react";
import { GptMessage, MyMessage, TypingLoader, TextMessageBox, GptMessageImage, GptMessageSelectableImage } from "../../components";
import { imageGenerationUseCase, imageVariationUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  }
}



export const ImageTunningPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // [
  //   {
  //     text: 'Imagen original prueba',
  //     isGpt: true,
  //     info: {
  //       imageUrl: 'http://localhost:3000/gpt/image-generation/1735141876758.png',
  //       alt: 'Imagen original prueba'
  //     }
  //   }
  // ]

  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined
  });

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const {original, mask} = originalImageAndMask


    const imageInfo = await imageGenerationUseCase(text, original, mask);

    setIsLoading(false);

    if (!imageInfo) {
      return setMessages((prev) => [...prev, { text: 'No se puede generar la imagen', isGpt: true }]);
    }

    setOriginalImageAndMask({
      original: undefined,
      mask: undefined
    })

    setMessages((prev) => [...prev, {
      text: text,
      isGpt: true,
      info: {
        imageUrl: imageInfo.url,
        alt: imageInfo.alt
      }
    }]);

  }


  const handleVariation = async () => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: 'Generando la variación...', isGpt: false }]);

    const resp = await imageVariationUseCase(originalImageAndMask.original!);

    setIsLoading(false);

    if (!resp) {
      return setMessages((prev) => [...prev, { text: 'No se puede generar la imagen', isGpt: true }]);
    }

    setMessages((prev) => [...prev, {
      text: 'Variación...',
      isGpt: true,
      info: {
        imageUrl: resp.url,
        alt: resp.alt
      }
    }]);


  }

  return (
    <>
      {
        originalImageAndMask.original && (
          <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
            <span>Editando</span>
            <img className="border rounded-xl w-36 h-36 object-contain" src={originalImageAndMask.mask ?? originalImageAndMask.original} alt="imagen original" />
            <button className="btn-primary mt-2" type="button" onClick={handleVariation}>Generar Variación</button>
          </div>
        )
      }
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
            <GptMessage text="Que imagen quieres generar hoy?" />
            {
              messages.map((message, index) => (
                message.isGpt ? (
                  // <GptMessageImage
                  <GptMessageSelectableImage
                    key={index}
                    text={message.text}
                    imageUrl={message.info?.imageUrl!}
                    alt={message.info?.alt!}
                    onImageSelected={maskImageUrl => setOriginalImageAndMask({
                      original: message.info?.imageUrl!,
                      mask: maskImageUrl
                    }
                    )}
                  />
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
    </>
  )
}
