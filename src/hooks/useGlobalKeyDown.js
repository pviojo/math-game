import { useEffect } from 'react';

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

export default useGlobalKeyDown