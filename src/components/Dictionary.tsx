import { useContext, useState } from 'react';
import {TranscriptContext} from "../context/TranscriptContext"
import { baseDictionary } from '../utils/dictionary';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const Dictionary = () => {
    const {theme, customDictionary, addDictionaryEntry, removeDictionaryEntry, updateDictionaryEntry} = useContext(TranscriptContext);
    const [isAdding, setIsAdding] = useState(false);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [formKey, setFormKey] = useState("");
    const [formValue, setFormValue] = useState("");

    const KeyboardKey = ({children}: {children: React.ReactNode}) => (
        <span className={`inline-flex items-center justify-center min-w-[28px] h-7 px-2 mx-0.5 py-1 rounded text-sm font-semibold shadow ${
            theme === "dark" 
                ? "bg-gray-700 text-white border border-gray-600" 
                : "bg-gray-100 text-gray-900 border border-gray-300"
        }`}>
            {children}
        </span>
    );

    const DictionaryEntry = ({keyText, value, isCustom, onEdit, onDelete}: {
        keyText: string, 
        value: string, 
        isCustom?: boolean,
        onEdit?: () => void,
        onDelete?: () => void
    }) => {
        const renderKey = (key: string) => {
            if (key.includes('/')) {
                return <KeyboardKey>{key}</KeyboardKey>;
            }
            if (key.includes('+')) {
                const parts = key.split('+').map(p => p.trim());
                return (
                    <span className="flex items-center gap-1">
                        {parts.map((part, idx) => (
                            <span key={idx} className="flex items-center">
                                <KeyboardKey>{part}</KeyboardKey>
                                {idx < parts.length - 1 && <span className="mx-1 text-gray-500">+</span>}
                            </span>
                        ))}
                    </span>
                );
            }
            return <KeyboardKey>{key}</KeyboardKey>;
        };

        return (
            <div className="flex items-center gap-2 group" dir="rtl">
                <div className="flex items-center gap-1">
                    {renderKey(keyText)}
                </div>
                <span className="text-gray-400 font-bold">←</span>
                <span className="font-['Calibri'] font-medium text-base">{value}</span>
                {isCustom && (
                    <div className="flex items-center gap-1 ml-2">
                        <button
                            onClick={onEdit}
                            className={`p-1.5 rounded transition-colors ${
                                theme === "dark" 
                                    ? "bg-blue-500 hover:bg-blue-600 text-white" 
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                            title="ערוך"
                        >
                            <FiEdit2 size={16} />
                        </button>
                        <button
                            onClick={onDelete}
                            className={`p-1.5 rounded transition-colors ${
                                theme === "dark" 
                                    ? "bg-red-500 hover:bg-red-600 text-white" 
                                    : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                            title="מחק"
                        >
                            <FiTrash2 size={16} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const handleAdd = () => {
        if (formKey.trim() && formValue.trim()) {
            addDictionaryEntry(formKey.trim(), formValue.trim());
            setFormKey("");
            setFormValue("");
            setIsAdding(false);
        }
    };

    const handleEdit = () => {
        if (editingKey && formKey.trim() && formValue.trim()) {
            updateDictionaryEntry(editingKey, formKey.trim(), formValue.trim());
            setEditingKey(null);
            setFormKey("");
            setFormValue("");
        }
    };

    const handleDelete = (key: string) => {
        if (window.confirm(`Are you sure you want to delete the entry "${key}"?`)) {
            removeDictionaryEntry(key);
        }
    };

    const startEdit = (key: string, value: string) => {
        setEditingKey(key);
        setFormKey(key);
        setFormValue(value);
        setIsAdding(false);
    };

    const cancelForm = () => {
        setIsAdding(false);
        setEditingKey(null);
        setFormKey("");
        setFormValue("");
    };

    // Get all entries (base + custom) and merge them
    const allEntries: Record<string, string> = { ...baseDictionary, ...customDictionary };
    
    // Separate entries into custom only (for the custom section)
    const customEntries: Record<string, string> = {};
    
    Object.keys(customDictionary).forEach(key => {
        customEntries[key] = customDictionary[key];
    });

    // Helper function to get value from allEntries, checking multiple keys
    const getValue = (keys: string[], defaultValue: string): string => {
        for (const key of keys) {
            if (key in allEntries) {
                return allEntries[key];
            }
        }
        return defaultValue;
    };

    // Grouped dictionary entries - each group contains related entries
    // Uses allEntries so custom overrides are shown
    const consonantGroups = [
        [
            {key: "א", value: allEntries["א"] || "ا"},
            {key: "א'", value: allEntries["א'"] || "ء"},
            {key: "א×", value: allEntries["א×"] || "أ"},
            {key: "א־", value: allEntries["א־"] || "إ"},
            {key: "א~", value: allEntries["א~"] || "آ"},
            {key: "א֫", value: allEntries["א֫"] || "ٱ"},
            {key: "א!", value: allEntries["א!"] || " ٰ"},
        ],
        [
            {key: "ב", value: allEntries["ב"] || "ب"},
            {key: "ב'", value: allEntries["ב'"] || "ڤ"},
        ],
        [
            {key: "פ/ף", value: getValue(["פ", "ף"], "ف")},
            {key: "פ'", value: allEntries["פ'"] || "پ"},
        ],
        [
            {key: "ת", value: allEntries["ת"] || "ت"},
            {key: "ת'", value: allEntries["ת'"] || "ث"},
        ],
        [
            {key: "ג'", value: allEntries["ג'"] || "ج"},
            {key: "ג", value: allEntries["ג"] || "چ"},
        ],
        [
            {key: "ח", value: allEntries["ח"] || "ح"},
            {key: "ח'", value: allEntries["ח'"] || "خ"},
        ],
        [
            {key: "ד", value: allEntries["ד"] || "د"},
            {key: "ד'", value: allEntries["ד'"] || "ذ"},
        ],
        [
            {key: "ר", value: allEntries["ר"] || "ر"},
            {key: "ז", value: allEntries["ז"] || "ز"},
            {key: "ז'", value: allEntries["ז'"] || "ژ"},
        ],
        [
            {key: "ס", value: allEntries["ס"] || "س"},
            {key: "ש", value: allEntries["ש"] || "ش"},
        ],
        [
            {key: "צ/ץ", value: getValue(["צ", "ץ"], "ص")},
            {key: "צ'/ץ'", value: getValue(["צ'", "ץ'"], "ض")},
        ],
        [
            {key: "ט", value: allEntries["ט"] || "ط"},
            {key: "ט'", value: allEntries["ט'"] || "ظ"},
        ],
        [
            {key: "ע", value: allEntries["ע"] || "ع"},
            {key: "ע'", value: allEntries["ע'"] || "غ"},
            {key: "ק", value: allEntries["ק"] || "ق"},
        ],
        [
            {key: "כ/ך", value: getValue(["כ", "ך"], "ك")},
            {key: "כ'", value: allEntries["כ'"] || "گ"},
        ],
        [
            {key: "ל", value: allEntries["ל"] || "ל"},
            {key: "מ/ם", value: getValue(["מ", "ם"], "م")},
            {key: "נ/ן", value: getValue(["נ", "ן"], "ن")},
        ],
        [
            {key: "ה", value: allEntries["ה"] || "ه"},
            {key: "ה'", value: allEntries["ה'"] || "ة"},
        ],
        [
            {key: "ו", value: allEntries["ו"] || "و"},
            {key: "ו'", value: allEntries["ו'"] || "ؤ"},
        ],
        [
            {key: "י", value: allEntries["י"] || "י"},
            {key: "י'", value: allEntries["י'"] || "ئ"},
            {key: "י־", value: allEntries["י־"] || "ى"},
        ],
    ];

    const vowelGroups = [
        [
            {key: "Alt + פ", value: allEntries["ַ"] || "ـَـ"},
            {key: "Alt + ק", value: allEntries["ָ"] || "ـًـ"},
        ],
        [
            {key: "Alt + ח", value: allEntries["ִ"] || "ـِـ"},
            {key: "Alt + י", value: allEntries["ײ"] || "ـٍـ"},
        ],
        [
            {key: "Alt + \\", value: allEntries["ֻ"] || "ـُـ"},
            {key: "Alt + ו", value: allEntries["ֹ"] || "ـٌـ"},
        ],
        [
            {key: "Alt + ש", value: allEntries["ְ"] || "ـْـ"},
            {key: "Alt + ד", value: allEntries["ּ"] || "ـّـ"},
            {key: "Alt + ר", value: allEntries["ֳ"] || "ـٰـ"},
        ],
    ];

    const isCustomEntry = (entryKey: string): boolean => {
        // Check if the entry key itself is in custom dictionary
        if (entryKey in customDictionary) {
            return true;
        }
        // For multi-key entries like "פ/ף", check if any of the individual keys are custom
        if (entryKey.includes('/')) {
            const keys = entryKey.split('/');
            return keys.some(key => key in customDictionary || key.trim() in customDictionary);
        }
        return false;
    };

    const getCustomKey = (entryKey: string): string | null => {
        // Return the actual key from customDictionary
        if (entryKey in customDictionary) {
            return entryKey;
        }
        // For multi-key entries, find which one is custom
        if (entryKey.includes('/')) {
            const keys = entryKey.split('/');
            for (const key of keys) {
                const trimmedKey = key.trim();
                if (trimmedKey in customDictionary) {
                    return trimmedKey;
                }
            }
        }
        return null;
    };

    const renderGroup = (group: Array<{key: string, value: string}>) => (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {group.map((entry, idx) => {
                const isCustom = isCustomEntry(entry.key);
                const customKey = isCustom ? getCustomKey(entry.key) : null;
                return (
                    <DictionaryEntry 
                        key={idx} 
                        keyText={entry.key} 
                        value={entry.value}
                        isCustom={isCustom}
                        onEdit={isCustom && customKey ? () => startEdit(customKey, entry.value) : undefined}
                        onDelete={isCustom && customKey ? () => handleDelete(customKey) : undefined}
                    />
                );
            })}
        </div>
    );

    return (
        <div className={`border rounded-lg ${
            theme === "dark" 
                ? "bg-[rgba(255,255,255,0.8)] border-white/50" 
                : "bg-[rgba(0,0,0,0.05)] border-black/10"
        }`}>
            <div className={`px-3 sm:px-4 pt-3 sm:pt-4 pb-2 border-b w-full ${
                theme === "dark" ? "border-white/20" : "border-black/10"
            }`}>
                <div className="flex justify-between items-center">
                    <h2 className={`inline-flex gap-2 text-lg sm:text-xl font-bold ${theme === "dark" ? "text-black" : "text-black"}`} dir="rtl">
                        <span>מילון</span>
                        <span>-</span>
                        <span className="font-bold ml-2">Dictionary</span>
                    </h2>
                    <button
                        onClick={() => {
                            setIsAdding(true);
                            setEditingKey(null);
                            setFormKey("");
                            setFormValue("");
                        }}
                        className={`p-2 rounded-md transition-colors ${
                            theme === "dark"
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                        title="הוסף ערך חדש"
                    >
                        <FiPlus size={18} />
                    </button>
                </div>
            </div>
            <div className="overflow-y-auto text-black p-3 sm:p-4 max-h-[50vh] sm:max-h-[60vh]">
                {(isAdding || editingKey) && (
                    <div className={`mb-4 p-3 rounded-lg border ${
                        theme === "dark" 
                            ? "bg-gray-100 border-gray-300" 
                            : "bg-white border-gray-300"
                    }`} dir="rtl">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-black">
                                {editingKey ? "ערוך ערך" : "הוסף ערך חדש"}
                            </h3>
                            <button
                                onClick={cancelForm}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">מפתח (עברית):</label>
                                <input
                                    type="text"
                                    value={formKey}
                                    onChange={(e) => setFormKey(e.target.value)}
                                    className={`w-full px-2 py-1 rounded border ${
                                        theme === "dark"
                                            ? "bg-white border-gray-400 text-black"
                                            : "bg-white border-gray-400 text-black"
                                    }`}
                                    dir="rtl"
                                    placeholder="לדוגמה: א"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">ערך (ערבית):</label>
                                <input
                                    type="text"
                                    value={formValue}
                                    onChange={(e) => setFormValue(e.target.value)}
                                    className={`w-full px-2 py-1 rounded border ${
                                        theme === "dark"
                                            ? "bg-white border-gray-400 text-black"
                                            : "bg-white border-gray-400 text-black"
                                    }`}
                                    dir="rtl"
                                    placeholder="לדוגמה: ا"
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={cancelForm}
                                    className={`px-3 py-1 rounded ${
                                        theme === "dark"
                                            ? "bg-gray-300 hover:bg-gray-400 text-black"
                                            : "bg-gray-200 hover:bg-gray-300 text-black"
                                    }`}
                                >
                                    ביטול
                                </button>
                                <button
                                    onClick={editingKey ? handleEdit : handleAdd}
                                    className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                    {editingKey ? "שמור" : "הוסף"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {Object.keys(customEntries).length > 0 && (
                    <>
                        <h3 className="text-black font-heebo font-bold mb-3 text-lg" dir="rtl">ערכים מותאמים אישית:</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4">
                            {Object.entries(customEntries).map(([key, value]) => (
                                <DictionaryEntry
                                    key={key}
                                    keyText={key}
                                    value={value}
                                    isCustom={true}
                                    onEdit={() => startEdit(key, value)}
                                    onDelete={() => handleDelete(key)}
                                />
                            ))}
                        </div>
                    </>
                )}

                <h3 className="text-black font-heebo font-bold mb-3 text-lg" dir="rtl">עיצורים:</h3>
                <div className="flex flex-col gap-2">
                    {consonantGroups.map((group, idx) => (
                        <div key={idx}>
                            {renderGroup(group)}
                        </div>
                    ))}
                </div>
                <h3 className="text-black font-heebo font-bold mb-3 mt-4 text-lg" dir="rtl">תנועות:</h3>
                <div className="flex flex-col gap-2">
                    {vowelGroups.map((group, idx) => (
                        <div key={idx}>
                            {renderGroup(group)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dictionary;
