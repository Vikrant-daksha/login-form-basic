import { useEffect } from "react";
import { useTimer } from "react-timer-hook";

function Timer({ expiryTimestamp, size, onExpire, shouldPause }) {
  const { seconds, minutes, pause } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      if (onExpire) onExpire();
    },
  });

  useEffect(() => {
    if (shouldPause) {
      pause();
    }
  }, [shouldPause, pause]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: `${size}` }}>
        <span>{String(minutes).padStart(2, "0")}</span>:
        <span>{String(seconds).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

export default Timer;
