import { LuaChatWidget } from "@/components/luapop-widget";
import "./globals.css";
export const metadata = {
    title: "Automation Sales",
    description: "Talk to our Lua-powered sales assistant.",
};
export default function RootLayout({ children }) {
    return (<html lang="en">
      <body>
        {children}
        <LuaChatWidget />
      </body>
    </html>);
}
