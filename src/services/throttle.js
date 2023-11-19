export function throttle(func, time = 33) {
  let inThrottle = false;
  return function () {
    if (!inThrottle) {
      func.apply(this, arguments);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, time);
    }
  };
}
