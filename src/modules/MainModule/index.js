import React, { useEffect, useRef, useState } from "react"
import useSound from "use-sound";
import isMobile from 'is-mobile';

import NumericInput from '../../components/NumericInput'

import styles from "./index.module.scss";

import failSound from './sounds/fail.wav';
import successSound from './sounds/sucess1.wav';
import endSound from './sounds/end.mp3';

import heartFilled from './images/heart-filled.svg';
import heartEmpty from './images/heart-empty.svg';

const MainModule = () => {
  const [stage, setStage] = useState('playing')
  const [op, setOp] = useState(null)
  const [, setResponse] = useState(null)
  const [points, setPoints] = useState(0)
  const [lives, setLives] = useState(3)
  const [result, setResult] = useState('');
  const inputRef = useRef();

  const [playFail] = useSound(failSound);
  const [playSuccess] = useSound(successSound);
  const [playEndSound] = useSound(endSound);

  const newOp = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const operation = 'x'
    const r = a * b;
    const difficulty = (a > 5 ? 2 : 1) + (b > 5 ? 2 : 1);
    setResult('');
    const o = {
      a,
      b,
      operation,
      result: r,
      difficulty,
    }
    setOp(o);
    if (!isMobile()) {
      window.setTimeout(() => {
        if (inputRef && inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }

  const startGame = () => {
    setPoints(0);
    setLives(3);
    newOp();
    setStage('playing');
  }

  const endGame = () => {
    window.setTimeout(
      () => playEndSound()
      , 500
    );

    setStage('gameover');
  }
  const decreaseLives = () => {
    if (lives === 1) {
      endGame();
    }
    setLives(s => s - 1)
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
    decreaseLives();
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
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (stage === 'gameover') {
    return (
      <div className={`${styles.cnt} ${styles.gameover}`}>
        <div>
          <div className={styles.gameover}>Puntaje: {points}</div>
          <div className={styles.button} onClick={startGame}>Empezar de nuevo</div>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.cnt}>
      <div className={styles.topbar}>
        <div className={styles.points}>
          Puntaje: {points}
        </div>
        <div className={styles.lives}>
          {[...Array(5 - lives).keys()].map(() =>
            <img src={heartEmpty} style={{ opacity: .2 }} alt="" />
          )}
          {[...Array(lives).keys()].map(() =>
            <img src={heartFilled} alt="" />
          )}
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
              placeholder="?"
              disabled={isMobile()}
              ref={inputRef}
              onChange={e => setResult(e.target.value)}
              onKeyDown={
                (e) => {
                  if (e.key === 'Enter') { compute() }
                }} />
          </div>

        </div>
        <div className={styles.input}>
          <NumericInput initialValue={result} maxLength={3} onChange={(value) => { console.log(value); setResult(value) }} onEnter={compute} />
        </div>

      </>)
      }
    </div>
  )
}

export default MainModule;