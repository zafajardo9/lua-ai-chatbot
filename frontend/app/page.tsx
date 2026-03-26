import { LuaWidgetConfigWarning } from "@/components/luapop-widget";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="page-content">
        <p className="page-eyebrow">Sales Assistant</p>
        <h1 className="page-heading">How can we help you today?</h1>
        <p className="page-subtext">
          Tap the chat button below to talk to our sales assistant.
        </p>
        <LuaWidgetConfigWarning />
      </section>
    </main>
  );
}
