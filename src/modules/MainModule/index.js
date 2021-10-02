import React, { useEffect, useRef, useState } from "react"
import useSound from "use-sound";

import NumericInput from '../../components/NumericInput'

import styles from "./index.module.scss";

import failSound from './sounds/fail.wav';
import successSound from './sounds/sucess1.wav';

const MainModule = () => {
  const [op, setOp] = useState(null)
  const [, setResponse] = useState(null)
  const [points, setPoints] = useState(0)
  const [result, setResult] = useState('');
  const inputRef = useRef();

  const [playFail] = useSound(failSound);
  const [playSuccess] = useSound(successSound);

  const newOp = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const operation = '*'
    const result = a * b;
    const difficulty = (a > 5 ? 2 : 1) + (b > 5 ? 2 : 1);
    setResult('');
    const o = {
      a,
      b,
      operation,
      result,
      difficulty,
    }
    setOp(o);
    window.setTimeout(() => {
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }

  const isOk = () => {
    setPoints((s) => s + op.difficulty);
    setResponse(true);
    playSuccess();
    newOp();
  }
  const isFail = () => {
    setPoints((s) => s - 1);
    setResponse(false);
    playFail();
    newOp();
  }
  const compute = () => {
    if (!op || !result) {
      return;
    }
    if (parseInt(result) === op.result) {
      isOk();
    } else {
      isFail();
    }
  }


  useEffect(() => {
    newOp();
  }, []);


  return (
    <div className={styles.cnt}>
      <div className={styles.topbar}>
        <div className={styles.points}>
          Puntaje: {points}
        </div>
      </div>
      {op && op.operation && (<>
        <div className={styles.display}>
          <div className={styles.operation}>
            <div className={styles.operator1}>
              {op.a}
            </div>
            <div className={styles.symbol}>
              {op.operation}
            </div>
            <div className={styles.operator2}>
              {op.b}
            </div>
          </div>
          <div className={styles.equal}>
            =
          </div>
          <div className={styles.result}>
            <input value={result}
              ref={inputRef}
              onChange={e => setResult(e.target.value)}
              onKeyDown={
                (e) => {
                  if (e.key === 'Enter') { compute() }
                }} />
          </div>

        </div>
        <div className={styles.input}>
          <NumericInput initialValue={result} onChange={(value) => setResult(value)} onEnter={compute} />
        </div>

      </>)
      }
    </div>
  )
}

export default MainModule;