import React, { useState } from "react";


interface AddSentenceButtonProps {
  onAdd: (english: string, tamil: string) => void;
}

const AddSentenceButton: React.FC<AddSentenceButtonProps> = ({ onAdd }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [newEnglish, setNewEnglish] = useState("");
  const [newTamil, setNewTamil] = useState("");

  const handleAdd = () => {
    if (!newEnglish.trim() || !newTamil.trim()) {
      alert("Please enter both English and Tamil sentences.");
      return;
    }
    onAdd(newEnglish, newTamil);
    setNewEnglish("");
    setNewTamil("");
    setShowPopup(false);
    alert("✅ Sentence added successfully!");
  };

  return (
    <>
      {/* Floating Add Button */}
      <button onClick={() => setShowPopup(true)} className="add-sentence-button">
        +
      </button>

      {/* Popup */}
      {showPopup && (
        <div className="add-sentence-popup">
          <h4>Add New Sentence</h4>
          <input
            type="text"
            placeholder="English sentence"
            value={newEnglish}
            onChange={(e) => setNewEnglish(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tamil translation"
            value={newTamil}
            onChange={(e) => setNewTamil(e.target.value)}
          />
          <div className="button-group">
            <button className="save-btn" onClick={handleAdd}>
              Save
            </button>
            <button className="close-btn" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddSentenceButton;
