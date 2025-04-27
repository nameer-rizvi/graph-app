import { useState, useEffect } from "react";

const MINUTE = 5;

export function useTimer(option = {}) {
  const [timeLeft, setTimeLeft] = useState(getSecondsUntilNextMark());
  const progress = getProgress(timeLeft);
  const isMarketOpen = getIsMarketOpen(option);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getSecondsUntilNextMark());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isMarketOpen && timeLeft === 0) {
      setTimeout(() => {
        option.callback?.();
      }, option.delay || 1000);
      // return () => clearTimeout(timeout);
    }
  }, [option.callback, option.delay, timeLeft]);

  return [timeLeft, progress, isMarketOpen];
}

function getProgress(timeLeft) {
  return 100 - (timeLeft / 300) * 100;
}

function getIsMarketOpen({ isCrypto }) {
  if (isCrypto) return true;
  const date = new Date();
  const day = date.getDay();
  const hour = date.getHours();
  return day >= 1 && day <= 5 && hour >= 4 && hour < 20;
}

function getSecondsUntilNextMark() {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const currentMark = Math.floor(minutes / MINUTE) * MINUTE;
  let nextMarkMinutes = currentMark + MINUTE;
  if (minutes % MINUTE === 0 && seconds === 0) {
    nextMarkMinutes = minutes + MINUTE;
  }
  const nextMark = new Date(now);
  nextMark.setMinutes(nextMarkMinutes);
  nextMark.setSeconds(0);
  nextMark.setMilliseconds(0);
  return Math.max(0, Math.floor((nextMark - now) / 1000));
}
