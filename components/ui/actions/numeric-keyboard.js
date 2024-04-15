import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

function NumericKeyboard({ onChangeHandler }) {
  const currentLayout = "default";

  const kblayout = {
    default: [
      "7 8 9", //
      "4 5 6", //
      "1 2 3", //
      "0 . {bksp}", //
    ],
  };

  return (
    <Keyboard
      onChange={onChangeHandler}
      layout={kblayout}
      layoutName={currentLayout}
    />
  );
}

export default NumericKeyboard;
