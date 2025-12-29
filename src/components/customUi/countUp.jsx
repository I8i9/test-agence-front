import React, { useEffect, useRef, memo } from "react";
import { useCountUp } from "react-countup";

const CountUp = ({
  startFrom = 0,
  end,
  duration = 2.5,
  prefix = "",
  suffix = "",
  delay = 0,
  decimals = 0,
  separator = ",",
  easing = true,
}) => {
  const countUpRef = useRef(null);

  const { start, reset } = useCountUp({
    ref: countUpRef,
    start: startFrom,
    end,
    duration,
    delay,
    useEasing: easing,
    separator,
    decimals,
    prefix,
    suffix,
  });

  useEffect(() => {
    reset();
    start();
  }, [startFrom, end, duration, delay, prefix, suffix, decimals, separator, easing]);

  return <span ref={countUpRef} />;
};

// 🔒 Only re-render if props change
function areEqual(prev, next) {
  return (
    prev.startFrom === next.startFrom &&
    prev.end === next.end &&
    prev.duration === next.duration &&
    prev.prefix === next.prefix &&
    prev.suffix === next.suffix &&
    prev.delay === next.delay &&
    prev.decimals === next.decimals &&
    prev.separator === next.separator &&
    prev.easing === next.easing
  );
}

export default memo(CountUp, areEqual);
