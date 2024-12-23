import { FormEvent, useRef, useState } from "react";

interface Props {
  onSendMessage: (message: string, file: File) => void;
  placeholder?: string;
  disabledCorrections?: boolean;
  accept?: string;
}

export const TextMessageBoxFile = ({ onSendMessage, placeholder, disabledCorrections = false, accept }: Props) => {

  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // if (message.trim().length === 0) return;
    if(!selectedFile) return;
    onSendMessage(message, selectedFile);
    setMessage("");
    setSelectedFile(null);
  }


  return (
    <form onSubmit={handleSendMessage} className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
      <div className="mr-3">
        <button
          className="flex items-center justify-center text-gray-400 hover:text-gray-600"
          type="button"
          onClick={() => inputFileRef.current?.click()}
        >
          <i className="fa-solid fa-paperclip text-xl"></i>
        </button>
        <input
          type="file"
          ref={inputFileRef}
          accept={accept}
          onChange={(event) => setSelectedFile(event.target.files?.[0])}
          className="hidden" />
      </div>
      <div className="flex-grow">
        <div className="relative w-full">
          <input
            className="flex w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
            type="text"
            name="message"
            placeholder={placeholder}
            autoComplete={disabledCorrections ? "on" : "off"}
            autoCorrect={disabledCorrections ? "on" : "off"}
            spellCheck={disabledCorrections ? "true" : "false"}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            autoFocus />
        </div>
      </div>
      <div className="ml-4">
        <button 
        className="btn-primary"
        disabled={!selectedFile}
        >
          {
            (!selectedFile)
            ?  <span className="mr-2">Enviar</span>
            :  <span className="mr-2">{selectedFile.name.substring(0, 10) + "..."}</span>
          }
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </div>
    </form>
  )
}
