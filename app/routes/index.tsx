import Emoji from "~/components/emoji";
import Logo from "~/components/logo";

export default function HomePage() {
  return (
    <div>
      <h1 className="sr-only">ZHE.DEV</h1>
      <Logo classname="mb-20" />
      <p className="mb-20 text-4xl font-extrabold">
        <Emoji emoji="👋" />
        Hello, I'm Zhe.
      </p>
      <p className="font-bold">Web Developer.</p>
      <p>
        Love to help people create opportunities and solve problems with ideas
        <Emoji emoji="💡" />, pixels
        <Emoji emoji="💎" />, codes
        <Emoji emoji="👨‍💻" />
        and technologies
        <Emoji emoji="🚀" />.
      </p>
    </div>
  );
}
