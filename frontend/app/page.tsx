import { LuaWidgetConfigWarning } from "@/components/luapop-widget";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="page-content">
        <h1>This is the demo chat App</h1>
        <LuaWidgetConfigWarning />
      </section>
    </main>
  );
}
