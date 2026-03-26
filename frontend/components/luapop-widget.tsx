"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    LuaPop?: {
      init: (config: Record<string, unknown>) => {
        destroy?: () => void;
      };
    };
  }
}

const publicEnv = {
  agentId: process.env.NEXT_PUBLIC_LUA_AGENT_ID ?? "",
  apiUrl: process.env.NEXT_PUBLIC_LUA_API_URL ?? "https://api.heylua.ai",
  cdnUrl:
    process.env.NEXT_PUBLIC_LUA_CDN_URL ??
    "https://lua-ai-global.github.io/lua-pop/lua-pop.umd.js",
  authUrl: process.env.NEXT_PUBLIC_LUA_AUTH_URL ?? "https://auth.heylua.ai",
} as const;

const missingVars = Object.entries({
  NEXT_PUBLIC_LUA_AGENT_ID: publicEnv.agentId,
})
  .filter(([, value]) => !value)
  .map(([key]) => key);

function getLuaPopScriptUrl() {
  if (publicEnv.cdnUrl.endsWith(".js")) {
    return publicEnv.cdnUrl;
  }

  return `${publicEnv.cdnUrl.replace(/\/$/, "")}/lua-pop/lua-pop.umd.js`;
}

function getWidgetConfig() {
  const apiUrl = publicEnv.apiUrl.replace(/\/$/, "");
  const isCustomApi = apiUrl !== "https://api.heylua.ai";
  const isVoiceSafeHost =
    typeof window !== "undefined" &&
    (window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  return {
    agentId: publicEnv.agentId,
    sessionId: crypto.randomUUID(),
    position: "bottom-right",
    displayMode: "floating",
    environment: isCustomApi ? "custom" : "production",
    customBaseApiUri: isCustomApi ? apiUrl : undefined,
    chatTitle: "Sales Assistant",
    buttonText: "Chat",
    buttonIcon: "💬",
    buttonColor: "#ca7a2c",
    welcomeMessage: "Hi there. How can I help you today?",
    chatInputPlaceholder: isVoiceSafeHost
      ? "Type or tap the mic to speak..."
      : "Ask a question or tell us what you need...",
    voiceModeEnabled: isVoiceSafeHost,
    popupButtonStyles: {
      borderRadius: "25px",
      width: "auto",
      height: "50px",
      padding: "0 20px",
      fontSize: "15px",
      fontWeight: "600",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    chatWindowWidth:
      typeof window !== "undefined" && window.innerWidth < 640
        ? "calc(100vw - 20px)"
        : "380px",
    chatWindowHeight:
      typeof window !== "undefined" && window.innerWidth < 640
        ? "min(78vh, 640px)"
        : "620px",
    runtimeContext: `surface:frontend,authUrl:${publicEnv.authUrl}`,
  };
}

export function LuaChatWidget() {
  useEffect(() => {
    if (missingVars.length > 0) {
      if (process.env.NODE_ENV !== "production") {
        console.error(
          `Lua widget disabled. Missing environment variables: ${missingVars.join(", ")}.`,
        );
      }
      return;
    }

    let widgetInstance: { destroy?: () => void } | undefined;
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-lua-pop="true"]',
    );

    const initializeWidget = () => {
      widgetInstance = window.LuaPop?.init(getWidgetConfig());
    };

    if (window.LuaPop) {
      initializeWidget();
      return () => widgetInstance?.destroy?.();
    }

    const script = existingScript ?? document.createElement("script");

    if (!existingScript) {
      script.src = getLuaPopScriptUrl();
      script.async = true;
      script.dataset.luaPop = "true";
      document.body.appendChild(script);
    }

    script.addEventListener("load", initializeWidget, { once: true });

    return () => {
      script.removeEventListener("load", initializeWidget);
      widgetInstance?.destroy?.();
    };
  }, []);

  return null;
}

export function LuaWidgetConfigWarning() {
  if (missingVars.length === 0) {
    return null;
  }

  return (
    <div className="config-warning" role="alert">
      <p>Chat widget is not configured yet.</p>
      <p>Missing: {missingVars.join(", ")}</p>
    </div>
  );
}
