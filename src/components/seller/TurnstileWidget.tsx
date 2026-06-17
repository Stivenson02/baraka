"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

export default function TurnstileWidget({
  siteKey,
  onVerify,
  onExpire,
  onError,
}: {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const callbacksRef = useRef({ onVerify, onExpire, onError });

  useEffect(() => {
    callbacksRef.current = { onVerify, onExpire, onError };
  }, [onError, onExpire, onVerify]);

  useEffect(() => {
    let retryTimer: number | null = null;

    const renderWidget = () => {
      if (!siteKey || !containerRef.current || !window.turnstile || widgetId.current) {
        return false;
      }

      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "light",
        callback: (token) => callbacksRef.current.onVerify(token),
        "expired-callback": () => callbacksRef.current.onExpire?.(),
        "error-callback": () => callbacksRef.current.onError?.(),
      });

      return true;
    };

    if (!renderWidget()) {
      retryTimer = window.setInterval(() => {
        if (renderWidget() && retryTimer) {
          window.clearInterval(retryTimer);
          retryTimer = null;
        }
      }, 100);
    }

    return () => {
      if (retryTimer) {
        window.clearInterval(retryTimer);
      }

      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
      }

      widgetId.current = null;
    };
  }, [siteKey]);

  return <div ref={containerRef} className="mx-auto min-h-[78px] w-full max-w-[320px]" />;
}
