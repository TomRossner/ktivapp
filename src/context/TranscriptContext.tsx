import { createContext, useState, ReactNode } from 'react';
import { LS_getAutoTranscribe, LS_getFontFamily, LS_getFontSize, LS_getTheme, LS_getCustomDictionary, LS_setCustomDictionary } from '../utils/LS';

interface TranscriptContextType {
    inputValue: string;
    setInputValue: (value: string) => void;
    outputValue: string;
    setOutputValue: (value: string) => void;
    resetInput: () => void;
    theme: 'dark' | 'light';
    setTheme: (theme: 'dark' | 'light') => void;
    fontSize: string;
    setFontSize: (size: string) => void;
    resetFontSize: () => void;
    settingsTabOpen: boolean;
    setSettingsTabOpen: (open: boolean) => void;
    defaultFontSize: string;
    setDefaultFontSize: (size: string) => void;
    isAutoTranscribeChecked: boolean;
    setIsAutoTranscribeChecked: (checked: boolean) => void;
    font: string;
    setFontFamily: (font: string) => void;
    defaultFont: string;
    setDefaultFont: (font: string) => void;
    customDictionary: Record<string, string>;
    setCustomDictionary: (dict: Record<string, string>) => void;
    addDictionaryEntry: (key: string, value: string) => void;
    removeDictionaryEntry: (key: string) => void;
    updateDictionaryEntry: (oldKey: string, newKey: string, newValue: string) => void;
}

export const TranscriptContext = createContext<TranscriptContextType>({
    inputValue: "",
    setInputValue: () => {},
    outputValue: "",
    setOutputValue: () => {},
    resetInput: () => {},
    theme: "light",
    setTheme: () => {},
    fontSize: "",
    setFontSize: () => {},
    resetFontSize: () => {},
    settingsTabOpen: false,
    setSettingsTabOpen: () => {},
    defaultFontSize: "20",
    setDefaultFontSize: () => {},
    isAutoTranscribeChecked: true,
    setIsAutoTranscribeChecked: () => {},
    font: "",
    setFontFamily: () => {},
    defaultFont: "",
    setDefaultFont: () => {},
    customDictionary: {},
    setCustomDictionary: () => {},
    addDictionaryEntry: () => {},
    removeDictionaryEntry: () => {},
    updateDictionaryEntry: () => {}
})

interface TranscriptProviderProps {
    children: ReactNode;
}

const TranscriptProvider = ({children}: TranscriptProviderProps) => {
    const [inputValue, setInputValue] = useState("");
    const [outputValue, setOutputValue] = useState("");
    const [theme, setTheme] = useState<'dark' | 'light'>(LS_getTheme());
    const [defaultFontSize, setDefaultFontSize] = useState(LS_getFontSize());
    const [fontSize, setFontSize] = useState(defaultFontSize);
    const [settingsTabOpen, setSettingsTabOpen] = useState(false);
    const [isAutoTranscribeChecked, setIsAutoTranscribeChecked] = useState(LS_getAutoTranscribe());
    const [defaultFont, setDefaultFont] = useState(LS_getFontFamily());
    const [font, setFontFamily] = useState(defaultFont);
    const [customDictionary, setCustomDictionaryState] = useState<Record<string, string>>(LS_getCustomDictionary());

    const resetInput = () => setInputValue("");
    const resetFontSize = () => setFontSize("20");

    const setCustomDictionary = (dict: Record<string, string>) => {
        setCustomDictionaryState(dict);
        LS_setCustomDictionary(dict);
    };

    const addDictionaryEntry = (key: string, value: string) => {
        const newDict = { ...customDictionary, [key]: value };
        setCustomDictionary(newDict);
    };

    const removeDictionaryEntry = (key: string) => {
        const newDict = { ...customDictionary };
        delete newDict[key];
        setCustomDictionary(newDict);
    };

    const updateDictionaryEntry = (oldKey: string, newKey: string, value: string) => {
        const newDict = { ...customDictionary };
        if (oldKey !== newKey) {
            delete newDict[oldKey];
        }
        newDict[newKey] = value;
        setCustomDictionary(newDict);
    };

    const value: TranscriptContextType = {
      inputValue,
      setInputValue,
      resetInput,
      outputValue,
      setOutputValue,
      theme,
      setTheme,
      fontSize,
      setFontSize,
      resetFontSize,
      settingsTabOpen,
      setSettingsTabOpen,
      defaultFontSize,
      setDefaultFontSize,
      isAutoTranscribeChecked,
      setIsAutoTranscribeChecked,
      font,
      setFontFamily,
      defaultFont,
      setDefaultFont,
      customDictionary,
      setCustomDictionary,
      addDictionaryEntry,
      removeDictionaryEntry,
      updateDictionaryEntry
    };

  return (
    <TranscriptContext.Provider value={value}>{children}</TranscriptContext.Provider>
  )
}

export default TranscriptProvider;
