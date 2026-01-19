export const LS_getFontSize = (): string => {
    const fontSize = localStorage.getItem('font_size');
    return fontSize ? fontSize : '20';
}

export const LS_setFontSize = (fontSize: string | number): void => {
    localStorage.setItem('font_size', String(fontSize));
}

export const LS_getAutoTranscribe = (): boolean => {
    const auto_transcribe = localStorage.getItem('auto_transcribe');
    return auto_transcribe !== "false";
}

export const LS_setAutoTranscribe = (bool: boolean): void => {
    localStorage.setItem('auto_transcribe', String(bool));
}

export const LS_getTheme = (): 'dark' | 'light' => {
    const theme = localStorage.getItem('theme');
    return theme === 'dark' ? 'dark' : 'light';
}

export const LS_setTheme = (theme: string): void => {
    localStorage.setItem('theme', theme);
}

export const LS_setFontFamily = (font: string): void => {
    localStorage.setItem('font_family', font);
}

export const LS_getFontFamily = (): string => {
    const font = localStorage.getItem('font_family');
    
    switch(font) {
        case "Calibri":
            return "Calibri";
        case "Times New Roman":
            return "Times New Roman";
        case "Gulzar":
            return "Gulzar";
        case "IBM Plex Sans Arabic":
            return "IBM Plex Sans Arabic";
        default:
            return "Calibri";
    }
}

export const LS_getCustomDictionary = (): Record<string, string> => {
    const customDict = localStorage.getItem('custom_dictionary');
    return customDict ? JSON.parse(customDict) : {};
}

export const LS_setCustomDictionary = (dict: Record<string, string>): void => {
    localStorage.setItem('custom_dictionary', JSON.stringify(dict));
}
