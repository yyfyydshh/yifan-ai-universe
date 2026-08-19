import Link from "next/link";

export const metadata = { title: "实验室｜杨逸凡" };

export default function LabPage() {
  return (
    <main className="page-shell">
      <section className="home-argument">
        <p>LAB / PROJECT UNIVERSE</p>
        <h1>实验室内容已并入作品宇宙。</h1>
        <div><Link href="/work">进入作品宇宙 →</Link></div>
      </section>
    </main>
  );
}
