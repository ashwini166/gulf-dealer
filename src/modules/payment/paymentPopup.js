const PAYMENT_WINDOW_NAME = "gulfincart_secure_payment";
const PAYMENT_RETURN_EVENT = "gulfincart:tap-payment-return";
const POPUP_WIDTH = 640;
const POPUP_HEIGHT = 820;

const getPaymentWindowFeatures = () => {
  const width = Math.min(POPUP_WIDTH, Math.max(360, window.screen.availWidth - 40));
  const height = Math.min(POPUP_HEIGHT, Math.max(640, window.screen.availHeight - 40));
  const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
  const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);

  return [
    `width=${Math.round(width)}`,
    `height=${Math.round(height)}`,
    `left=${Math.round(left)}`,
    `top=${Math.round(top)}`,
    "popup=yes",
    "resizable=yes",
    "scrollbars=yes",
    "toolbar=no",
    "menubar=no",
    "location=no",
    "status=no",
  ].join(",");
};

const writeWaitingScreen = (paymentWindow) => {
  try {
    paymentWindow.document.title = "Opening secure payment...";
    paymentWindow.document.body.innerHTML = `
      <main style="min-height:100vh;display:flex;align-items:center;justify-content:center;margin:0;background:#f8fafc;font-family:Inter,Arial,sans-serif;color:#0f172a">
        <section style="text-align:center">
          <div style="height:36px;width:36px;margin:0 auto 16px;border:4px solid #dbeafe;border-top-color:#2563eb;border-radius:999px;animation:spin 1s linear infinite"></div>
          <h1 style="font-size:18px;margin:0 0 8px">Opening secure payment</h1>
          <p style="font-size:13px;margin:0;color:#64748b">Please keep this window open.</p>
        </section>
        <style>@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");@keyframes spin{to{transform:rotate(360deg)}}</style>
      </main>
    `;
  } catch {
    // Some browsers restrict writing to newly opened windows.
  }
};

const notifyPaymentReturn = (tapId) => {
  const payload = {
    type: PAYMENT_RETURN_EVENT,
    tapId,
    createdAt: Date.now(),
  };

  try {
    window.localStorage.setItem(PAYMENT_RETURN_EVENT, JSON.stringify(payload));
  } catch {
    // Storage can be blocked by browser privacy settings.
  }

  try {
    const channel = new BroadcastChannel(PAYMENT_RETURN_EVENT);
    channel.postMessage(payload);
    channel.close();
  } catch {
    // BroadcastChannel is optional browser support.
  }
};

export const handleTapReturnInPaymentWindow = (tapId) => {
  if (!tapId || typeof window === "undefined") {
    return false;
  }

  if (window.name !== PAYMENT_WINDOW_NAME) {
    return false;
  }

  notifyPaymentReturn(tapId);
  window.setTimeout(() => window.close(), 250);

  return true;
};

export const subscribeTapPaymentReturn = (callback) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const seenTapIds = new Set();

  const handlePayload = (payload) => {
    const tapId = payload?.tapId;

    if (!tapId || seenTapIds.has(tapId)) {
      return;
    }

    seenTapIds.add(tapId);
    callback(tapId);
  };

  const handleStorage = (event) => {
    if (event.key !== PAYMENT_RETURN_EVENT || !event.newValue) {
      return;
    }

    try {
      handlePayload(JSON.parse(event.newValue));
    } catch {
      // Ignore malformed cross-tab messages.
    }
  };

  let channel = null;

  try {
    channel = new BroadcastChannel(PAYMENT_RETURN_EVENT);
    channel.onmessage = (event) => handlePayload(event.data);
  } catch {
    channel = null;
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);

    if (channel) {
      channel.close();
    }
  };
};

export const preparePaymentWindow = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const paymentWindow = window.open("", PAYMENT_WINDOW_NAME, getPaymentWindowFeatures());

  if (paymentWindow) {
    writeWaitingScreen(paymentWindow);
    paymentWindow.focus?.();
  }

  return paymentWindow;
};

export const closePreparedPaymentWindow = (paymentWindow) => {
  try {
    paymentWindow?.close?.();
  } catch {
    // Ignore close failures.
  }
};

export const openPaymentWindow = (url, preparedWindow = null) => {
  if (!url || typeof window === "undefined") {
    return false;
  }

  const paymentWindow =
    preparedWindow && !preparedWindow.closed
      ? preparedWindow
      : window.open("", PAYMENT_WINDOW_NAME, getPaymentWindowFeatures());

  if (!paymentWindow) {
    window.location.assign(url);
    return false;
  }

  try {
    paymentWindow.opener = null;
  } catch {
    // Some browsers do not allow changing opener.
  }

  try {
    paymentWindow.location.replace(url);
  } catch {
    paymentWindow.location.href = url;
  }

  paymentWindow.focus?.();
  return true;
};
