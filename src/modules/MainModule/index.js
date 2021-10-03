import React, { useEffect, useRef, useState } from "react"
import useSound from "use-sound";
import isMobile from 'is-mobile';

import NumericInput from '../../components/NumericInput'

import styles from "./index.module.scss";

import failSound from '../../assets/sounds/fail.wav';
import successSound from '../../assets/sounds/sucess1.wav';
import endSound from '../../assets/sounds/end.mp3';
import tickSound from '../../assets/sounds/tick.flac';
import passLevelSound from '../../assets/sounds/passLevel.ogg';

import heartFilled from '../../assets/images/heart-filled.svg';
import heartEmpty from '../../assets/images/heart-empty.svg';
import catEnd from '../../assets/images/cat.gif';

const useGlobalKeyDown = (
  callBack,
  key,
  disabled
) => {
  const handleKeyDown = ({ key: pressedKey }) => {
    if (key instanceof Array) {
      if (!key.includes(pressedKey)) return
    } else {
      if (key !== '_all' && key !== pressedKey) return
    }

    callBack(pressedKey)
  }

  useEffect(() => {
    if (disabled) return
    document.addEventListener('keydown', handleKeyDown, false)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })
}

const MainModule = () => {
  const [stage, setStage] = useState('home')
  const [operation, setOperation] = useState('+')
  const [op, setOp] = useState(null)
  const [now, setNow] = useState(null)
  const [, setResponse] = useState(null)
  const [points, setPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [stepsInLevel, setStepsInLevel] = useState(0)
  const [lives, setLives] = useState(3)
  const [result, setResult] = useState('');
  const inputRef = useRef();

  const [playFail] = useSound(failSound);
  const [playSuccess] = useSound(successSound);
  const [playEndSound] = useSound(endSound);
  const [playTickSound] = useSound(tickSound);
  const [playPassLevelSound] = useSound(passLevelSound);

  useGlobalKeyDown(() => {
    if (stage === 'playing') {
      compute();
    }
  }, 'Enter');


  useEffect(() => {
    const pid = window.setInterval(() => setNow(Math.floor((new Date()).getTime() / 1000) * 1000), 100)
    return () => window.clearInterval(pid)
  }, [])

  const newOp = (operationType = null) => {
    if (!operationType) {
      operationType = operation
    }
    const max = Math.min((operationType === '*' ? 4 : 8) + ((level - 1) * 2), 10)
    let a = 1;
    let b = 1;
    let operationSymbol = null
    let r = null;
    while (true) {
      while (true) {
        a = Math.floor(Math.random() * max) + 1;
        if (!op || (a !== op.a)) {
          break;
        }
      }
      while (true) {
        b = Math.floor(Math.random() * max) + 1;
        if (!op || (b !== op.b)) {
          break;
        }
      }
      switch (operationType) {
        case '+':
          r = a + b;
          operationSymbol = '+';
          break;
        case '-':
          r = a - b;
          operationSymbol = '-';
          break;

        case '*':
        default:
          r = a * b;
          operationSymbol = 'x';
          break;

      }
      if (operationType !== '-') {
        break;
      } else if (r > 0) {
        break;
      }
    }
    const difficulty = (a > 5 ? 2 : 1) + (b > 5 ? 2 : 1);
    const seconds = Math.max(15 - (parseInt(level - 1) * 2), 5);
    const expiresAt = (new Date()).getTime() + (seconds * 1000);
    const o = {
      a,
      b,
      operation: operationSymbol,
      result: r,
      difficulty,
      expiresAt
    }
    setResult('');
    setOp(o);
    if (!isMobile()) {
      window.setTimeout(() => {
        if (inputRef && inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
    setStage('playing');
  }

  const startGame = (operation) => {
    setOperation(operation)
    setPoints(0);
    setLives(3);
    newOp(operation);

  }
  const goHome = () => {
    setStage('home');
  }

  const endGame = () => {
    setStage('gameover');
    window.setTimeout(
      () => playEndSound()
      , 200
    );


  }
  const moveToNextStep = () => {
    console.log('moveToNextStep')
    const m = 10;
    setStepsInLevel(s => s === (m - 1) ? 0 : s + 1)
    if (stepsInLevel === (m - 1)) {
      setLevel(s => s + 1)
      playPassLevelSound();
      increaseLives();
    }
  }
  const increaseLives = () => {
    setLives(s => Math.min(s + 1, 5))
  }
  const decreaseLives = () => {
    console.log('lives', lives)
    if (lives === 1) {
      endGame();
    }
    setLives(s => s - 1)
  }
  const checkIsOk = () => {
    if (!op || !result) {
      return;
    }
    if (parseInt(result) === op.result) {
      isOk();
    }
  }
  const isOk = () => {
    setStage('paused');
    setPoints((s) => s + op.difficulty);
    setResponse(true);
    moveToNextStep();
    if (stepsInLevel < 9) {
      playSuccess();
    }
    window.setTimeout(
      () => newOp()
      , 1000);
  }
  const isFail = () => {
    setPoints((s) => Math.max(s - 1, 0));
    setResponse(false);
    const keepPlaying = lives > 1
    decreaseLives();
    setStepsInLevel(0);
    if (keepPlaying) {
      playFail();
      newOp();
    }

  }
  const compute = () => {
    if (stage !== 'playing') {
      return;
    }
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
    if (op && stage === 'playing') {
      if (op && op.expiresAt && now >= op.expiresAt - 5000) {
        playTickSound();
      }

      if (op.expiresAt && now >= op.expiresAt) {
        if (!result) {
          isFail();
        } else {
          compute()
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, op]);


  useEffect(() => {
    checkIsOk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  if (stage === 'home') {
    return (
      <div className={`${styles.cnt} ${styles.gameover}`}>
        <div>
          <div className={styles.button} onClick={() => startGame('+')}>Sumas</div>
          <div className={styles.button} onClick={() => startGame('-')}>Restas</div>
          <div className={styles.button} onClick={() => startGame('*')}>Multiplicaciones</div>
        </div>
      </div>
    );
  }
  if (stage === 'gameover') {
    return (
      <div className={`${styles.cnt} ${styles.gameover}`}>
        <div>
          <img src={catEnd} alt="" />
          <div className={styles.gameover}>Puntaje: {points}</div>
          <div className={styles.button} onClick={goHome}>Volver al comienzo</div>
        </div>
      </div >
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
      <div className={styles.levelbar}>
        <div className={styles.level}>
          Nivel: {level}
        </div>
        {[...Array(stepsInLevel).keys()].map(() =>
          <span className={styles.stepInLevel} />
        )}
        {[...Array(10 - stepsInLevel).keys()].map(() =>
          <span className={`${styles.stepInLevel} ${styles.empty}`} />
        )}


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
              onChange={e => {
                setResult(e.target.value)
              }}
            />
          </div>
          <div className={styles.exit} onClick={goHome}>✖</div>
          {stage === 'playing' ?
            <div className={styles.timing}>{Math.floor((op.expiresAt - now) / 1000)}</div>
            : ''
          }
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