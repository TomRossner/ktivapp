import { useContext, useEffect, useRef, useState } from 'react';
import { TranscriptContext } from '../context/TranscriptContext';
import { getDictionary } from "../utils/dictionary";
import Button from './Button';
import {MdOutlineContentCopy} from "react-icons/md";
import {IoMdDoneAll} from "react-icons/io";
import {TbSwitchHorizontal} from "react-icons/tb";

const Output = () => {
  const {inputValue, fontSize, isAutoTranscribeChecked, font, customDictionary} = useContext(TranscriptContext);
  const [transcribedValue, setTranscribedValue] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [warning, setWarning] = useState<string[]>([]);

  const transcribe = (text: string): string => {
    const dictionary = getDictionary(); // Get the latest merged dictionary
    const transcribedText: string[] = [];
    
    for (let i = 0; i < text.length; i++) {
      const currentLetter = text[i];
      const nextLetter = text[i + 1];
      const combination = currentLetter + nextLetter;

      if (combination in dictionary) {
        transcribedText.push(dictionary[combination]);
        i++; // Skip the next letter since we already transcribed it
      } else if (currentLetter in dictionary) {
        transcribedText.push(dictionary[currentLetter]);
      } else {
        if (!warning.includes(currentLetter)) {
          transcribedText.push(currentLetter);
          setWarning((warning) => [...warning, currentLetter]);
        } else {
          transcribedText.push(currentLetter);
        }
      }
    }
    return transcribedText.join("");
  }

  const textareaStyles: React.CSSProperties = {
    fontFamily: font,
    fontSize: Number(fontSize)
  }

  const copyText = () => {
    if (!textAreaRef.current?.value) return;
    setCopied(true);
    navigator.clipboard.writeText(textAreaRef.current.value);
  }


  useEffect(() => {
    if (!inputValue) {
      setTranscribedValue("");
      setWarning([]);
      return;
    }
    if (isAutoTranscribeChecked) {
      setTranscribedValue(transcribe(inputValue));
    }
  }, [inputValue, isAutoTranscribeChecked, customDictionary])

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }, [copied])

  return (
    <>
      <div className="flex items-center justify-start w-full px-2 sm:px-4 gap-2 sm:gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {!isAutoTranscribeChecked ? (
            <Button
              action={() => setTranscribedValue(transcribe(inputValue))}
              text="Transcribe"
              icon={<TbSwitchHorizontal className="text-xl"/>}
              color="blue"
            />
          ) : null}
          <Button
            action={copyText}
            text={copied ? "הועתק!" : "העתק טקסט בערבית"}
            icon={copied ? (
              <IoMdDoneAll className={`text-xl ${copied ? "text-[rgb(66,248,91)]" : ""}`}/>
            ) : (
              <MdOutlineContentCopy className="text-xl"/>
            )}
            color="green"
          />
        </div>
      </div>
      <textarea 
        ref={textAreaRef} 
        id="output" 
        className="w-full min-h-[30vh] max-h-[30vh] mb-4 rounded-lg px-3 py-2 sm:px-4 text-[rgba(0,0,0,0.8)] font-normal text-right bg-[rgba(255,255,255,0.92)] shadow-inner shadow-black/20 border-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 resize-none placeholder:italic" 
        style={textareaStyles} 
        dir="rtl"
        placeholder="הטקסט בערבית יופיע כאן"
        readOnly 
        value={transcribedValue}
      />
    </>
  )
}

export default Output;
