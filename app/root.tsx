import type { MetaFunction } from "@remix-run/cloudflare";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import Logo from "./components/logo";
import styles from "./styles/tailwind.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
export const meta: MetaFunction = () => {
  return { title: "Zhe.Dev | Home" };
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="p-8 antialiased bg-white text-neutral-800 dark:bg-neutral-900 dark:text-neutral-50">
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <header className="mb-20">
        <Link to="/" title="Zhe.Dev">
          <Logo className="mb-4" />
        </Link>
        <p className="text-4xl font-extrabold">Zhe.</p>
      </header>
      <main className="mb-20">{children}</main>
      <footer className="text-sm text-neutral-300">
        <p>&copy; Zhe Zhang</p>
      </footer>
    </>
  );
}
