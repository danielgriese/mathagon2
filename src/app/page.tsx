import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Mathagon 2</h1>
      <div>
        <Link href="/games">My Games</Link>
      </div>
    </div>
  );
}
