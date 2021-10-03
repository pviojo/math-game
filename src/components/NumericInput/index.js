import React, { useEffect, useState } from "react"

import styles from "./index.module.scss";

const DigitButton = ({ char, style, onSelect }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      className={`${styles.button} ${pressed ? styles.pressed : ''}`}
      style={style}
      onClick={(e) => { setPressed(true); onSelect(e); window.setTimeout(() => setPressed(false), 200) }}>
      {char}
    </div>
  );
}

const NumericInput = ({ maxLength, initialValue, onChange, onEnter }) => {
  const [val, setVal] = useState(initialValue);
  const addToVal = (x) => {
    let newVal = `${val}${x}`;
    if (maxLength !== null) {
      newVal = newVal.substring(0, maxLength)
    }
    setVal(newVal);
    onChange(newVal);
  }
  useEffect(() => setVal(initialValue), [initialValue])
  const getButton = (n, type, style) => {
    return <DigitButton style={style} char={n} onSelect={() => {
      switch (type) {
        case 'delete':
          if (val && val.length > 0) {
            const newVal = val.substring(0, val.length - 1);
            setVal(newVal);
            onChange(newVal);
          }
          break;
        case 'enter':
          onEnter(val)
          break;
        case 'digit':
        default:
          addToVal(n)
          break;

      }
    }} />
  }
  return (
    <div className={styles.cnt}
      onTouchStart={
        (e) => {
          console.log(e);
          if (e.key === 'Enter') { onEnter(val) }
        }}>
      <div
        className={styles.digits}
      >
        {getButton(1, 'digit')}
        {getButton(2, 'digit')}
        {getButton(3, 'digit')}
        {getButton(4, 'digit')}
        {getButton(5, 'digit')}
        {getButton(6, 'digit')}
        {getButton(7, 'digit')}
        {getButton(8, 'digit')}
        {getButton(9, 'digit')}
        {getButton('⌫', 'delete')}
        {getButton('0', 'digit')}
        {getButton('Listo', 'enter', { background: '#f69', color: '#fff' })}
      </div>
    </div>)
}

NumericInput.defaultProps = {
  maxLength: null,
  onEnter: () => { },
  onChange: () => { },
}

export default NumericInput;