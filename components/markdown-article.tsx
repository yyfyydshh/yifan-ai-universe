import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1]) nodes.push(<a key={match.index} href={match[2]} target="_blank" rel="noreferrer">{match[1]} ↗</a>);
    else if (match[3]) nodes.push(<code key={match.index}>{match[3]}</code>);
    else nodes.push(<strong key={match.index}>{match[4]}</strong>);
    last = pattern.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function MarkdownArticle({ source }: { source: string }) {
  const lines = source.split(/\r?\n/);
  const out: ReactNode[] = [];
  let i = 0;
  let headingIndex = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line || line.startsWith("# ")) { i++; continue; }
    if (line.startsWith("## ")) {
      const heading = line.slice(3);
      const slug = heading.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
      headingIndex += 1;
      out.push(<h2 id={`section-${String(headingIndex).padStart(2, "0")}-${slug}`} key={i}>{heading}</h2>);
      i++;
      continue;
    }
    if (line.startsWith("> ")) { out.push(<blockquote key={i}>{inline(line.slice(2))}</blockquote>); i++; continue; }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) { items.push(lines[i].trim().slice(2)); i++; }
      out.push(<ul key={`ul-${i}`}>{items.map(item => <li key={item}>{inline(item)}</li>)}</ul>); continue;
    }
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) { rows.push(lines[i].split("|").slice(1, -1).map(x => x.trim())); i++; }
      const clean = rows.filter(row => !row.every(cell => /^:?-+:?$/.test(cell)));
      const [head, ...body] = clean;
      out.push(<div className="article-table-wrap" key={`table-${i}`}><table><thead><tr>{head.map(cell => <th key={cell}>{cell}</th>)}</tr></thead><tbody>{body.map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>); continue;
    }
    const paragraph = [line]; i++;
    while (i < lines.length && lines[i].trim() && !/^(## |# |> |- |\|)/.test(lines[i].trim())) { paragraph.push(lines[i].trim()); i++; }
    out.push(<p key={`p-${i}`}>{inline(paragraph.join(" "))}</p>);
  }
  return <div className="article-body">{out}</div>;
}
