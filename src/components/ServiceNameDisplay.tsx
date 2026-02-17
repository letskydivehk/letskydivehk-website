/**
 * Renders a service name on two lines when it contains parenthetical content.
 * e.g. "雙人傘終極組合（包含近鏡 + 全景拍攝）" becomes:
 *   Line 1: 雙人傘終極組合
 *   Line 2: （包含近鏡 + 全景拍攝）
 */
export function ServiceNameDisplay({ name, className }: { name: string; className?: string }) {
  // Match both full-width and half-width parentheses
  const match = name.match(/^(.+?)\s*([（(].+[）)])$/);

  if (!match) {
    return <span className={className}>{name}</span>;
  }

  return (
    <span className={className}>
      {match[1]}
      <br />
      <span className="text-[0.85em] opacity-80">{match[2]}</span>
    </span>
  );
}
