import { useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

function AlphaNumericKeyboard({ onChangeHandler }) {
  const [currentLayout, setCurrentLayout] = useState("default");

  const handleKeypress = (input) => {
    if ((input == "{shift}" || input == "{lock}") && currentLayout == "default")
      setCurrentLayout("shift");
    else if (
      (input == "{shift}" || input == "{lock}") &&
      currentLayout == "shift"
    )
      setCurrentLayout("default");
  };
  const kblayout = {
    default: [
      "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
      "{tab} q w e r t y u i o p [ ] \\",
      "{lock} a s d f g h j k l ; ' {enter}",
      "{shift} z x c v b n m , . / {shift}",
      ".com @ {space}",
    ],
    shift: [
      "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
      "{tab} Q W E R T Y U I O P { } |",
      '{lock} A S D F G H J K L : " {enter}',
      "{shift} Z X C V B N M < > ? {shift}",
      ".com @ {space}",
    ],
  };

  return (
    <Keyboard
      onChange={onChangeHandler}
      layout={kblayout}
      onKeyPress={handleKeypress}
      layoutName={currentLayout}
    />
  );
}

export default AlphaNumericKeyboard;
