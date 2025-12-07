import React, { useState, useEffect } from "react";
import { normalSentences } from "./data/normal";
import AddSentenceButton from "./AddSentenceButton";

const LOCAL_STORAGE_KEY = "sentences";
const LOCAL_STORAGE_VERSION_KEY = "sentences_version";
const DATA_VERSION = "v2"; // 🔁 Change this whenever you update normalSentences

const Autocomplete: React.FC = () => {
  // Load sentences from localStorage or use normalSentences if version changed
  const [sentences, setSentences] = useState<string[]>(() => {
    const storedVersion = localStorage.getItem(LOCAL_STORAGE_VERSION_KEY);
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);

    // If version matches and data exists → load from storage
    if (stored && storedVersion === DATA_VERSION) {
      return JSON.parse(stored);
    }

    // Otherwise → reset to new data
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalSentences));
    localStorage.setItem(LOCAL_STORAGE_VERSION_KEY, DATA_VERSION);
    return normalSentences;
  });

  const [inputValue, setInputValue] = useState("");
  const [filtered, setFiltered] = useState<string[]>([]);

  useEffect(() => {
    // Store updated sentences in localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sentences));
    localStorage.setItem(LOCAL_STORAGE_VERSION_KEY, DATA_VERSION);
  }, [sentences]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;

    setInputValue(input);

    if (!input) {
      setFiltered([]);
      return;
    }

    const filteredList = sentences.filter((sentence) => {
      const [english = "", tamil = ""] = sentence
        .split("\n\n")
        .map((line) => line.trim());
      return (
        english.toLowerCase().includes(input.toLowerCase()) ||
        tamil.includes(input)
      );
    });

    setFiltered(filteredList);
  };

  const handleSelect = (value: string) => {
    setInputValue(value.trim());
    setFiltered([]);
  };

  const readEnglish = (text: string) => {
    if (!text.trim()) return;
    const english = text.split("\n\n")[0].trim();
    const utter = new SpeechSynthesisUtterance(english);
    utter.lang = "en-US";
    speechSynthesis.speak(utter);
  };

  const clearInput = () => {
    setInputValue("");
    setFiltered([]);
  };

  const addSentence = (english: string, tamil: string) => {
    const newSentence = `${english} \n\n ${tamil}`;
    setSentences([...sentences, newSentence]);
  };

  const resetToDefault = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_VERSION_KEY);
    setSentences(normalSentences);
  };

  return (
    <div className="search-box">
      <div className="row" style={{ position: "relative" }}>
        <textarea
          value={inputValue}
          onChange={handleChange}
          placeholder="Search English or Tamil Sentence..."
          rows={2}
        />

        <button
          className="speak-btn-input"
          onClick={() => readEnglish(inputValue)}
          disabled={!inputValue.trim()}
          title="Speak"
        >
          🔊
        </button>

        {inputValue && (
          <button className="clear-btn" onClick={clearInput} title="Clear">
            ❌
          </button>
        )}
      </div>

      <div className="result-box">
        {filtered.length > 0 && (
          <ul>
            {filtered.map((sentence, i) => {
              const [english = "", tamil = ""] = sentence
                .split("\n\n")
                .map((line) => line.trim());
              return (
                <li
                  key={i}
                  className="list-item"
                  onClick={() => handleSelect(sentence)}
                >
                  <div className="english-line">{english}</div>
                  <div className="tamil-line">{tamil}</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Floating Add Button Component */}
      <AddSentenceButton onAdd={addSentence} />

      {/* Optional reset button (for debugging or testing new data) */}
      <button onClick={resetToDefault} className="reset-btn">
  Reset
</button>

    </div>
  );
};

export default Autocomplete;
