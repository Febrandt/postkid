import React from "react";

function TextAreaWithTabs({ value = "", onChange = () => {}, ...props }) {
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();

      // Use setRangeText to insert the tab (spaces)
      e.target.setRangeText('\t', e.target.selectionStart, e.target.selectionEnd, 'end');

      // Notify the parent of the updated value
      onChange(e);

      // Move the caret to the right of the inserted tab
      
    }
  };

  return (
    <textarea
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      {...props} // Spread any additional props
    />
  );
}

export default TextAreaWithTabs;
