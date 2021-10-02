import React, { useEffect, useState } from "react"

import styles from "./index.module.scss";

import useGlobalKeyDown from 'react-global-key-down-hook'

const NumericInput = ({ onChange, onEnter, initialValue }) => {
  const [val, setVal] = useState(initialValue);
  const addToVal = (x) => {
    const newVal = `${val}${x}`;
    setVal(newVal);
    onChange(newVal);
  }
  useGlobalKeyDown(() => {
    onEnter(val);
  }, 'Enter');
  useEffect(() => setVal(initialValue), [initialValue])
  const getButton = (n, type, style) => {
    return (
      <div
        className={styles.button}
        style={style}
        onClick={() => {
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
        }}>
        {n}
      </div>
    )
  }
  return (
    <div className={styles.cnt}
      onKeyPress={
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
        {getButton('Listo', 'enter', { background: '#c06', color: '#fff' })}
      </div>
    </div>)
}

export default NumericInput;