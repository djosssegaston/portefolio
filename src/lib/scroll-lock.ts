let locks = 0;
let previousOverflow = "";
let previousPaddingRight = "";

function applyLock() {
  const body = document.body;
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;

  previousOverflow = body.style.overflow;
  previousPaddingRight = body.style.paddingRight;

  body.style.overflow = "hidden";
  if (scrollbar > 0) {
    body.style.paddingRight = `${scrollbar}px`;
  }
}

function releaseLock() {
  const body = document.body;
  body.style.overflow = previousOverflow;
  body.style.paddingRight = previousPaddingRight;
}

export function lockScroll() {
  if (typeof document === "undefined") return;
  locks += 1;
  if (locks === 1) applyLock();
}

export function unlockScroll() {
  if (typeof document === "undefined") return;
  locks = Math.max(0, locks - 1);
  if (locks === 0) releaseLock();
}
