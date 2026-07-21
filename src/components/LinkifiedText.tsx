import { Fragment, type ReactNode } from "react";

/** Match http(s) and bare www. URLs in chat text. */
const URL_RE = /\b((?:https?:\/\/|www\.)[^\s<>"'`]+)/gi;

function trimTrailingPunctuation(url: string): { hrefCore: string; trailing: string } {
  let core = url;
  let trailing = "";
  while (/[),.;:!?'"\]]$/u.test(core)) {
    trailing = core.slice(-1) + trailing;
    core = core.slice(0, -1);
  }
  return { hrefCore: core, trailing };
}

function toHref(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^www\./i.test(trimmed)) return `https://${trimmed}`;
  return null;
}

/** Render plain chat text with clickable http(s)/www links. */
export default function LinkifiedText({ text }: { text: string }) {
  const raw = text ?? "";
  if (!raw) return null;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(URL_RE.source, URL_RE.flags);

  while ((match = re.exec(raw)) !== null) {
    const full = match[1] ?? match[0];
    const start = match.index;
    if (start > lastIndex) {
      nodes.push(raw.slice(lastIndex, start));
    }

    const { hrefCore, trailing } = trimTrailingPunctuation(full);
    const href = toHref(hrefCore);
    if (href && hrefCore) {
      nodes.push(
        <a
          key={`link-${start}-${hrefCore}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-message-link"
        >
          {hrefCore}
        </a>
      );
      if (trailing) nodes.push(trailing);
    } else {
      nodes.push(full);
    }

    lastIndex = start + full.length;
  }

  if (lastIndex < raw.length) {
    nodes.push(raw.slice(lastIndex));
  }

  return (
    <>
      {nodes.map((node, i) =>
        typeof node === "string" ? (
          <Fragment key={`t-${i}`}>{node}</Fragment>
        ) : (
          node
        )
      )}
    </>
  );
}
