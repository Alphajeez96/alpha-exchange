import Image from "next/image";

interface TokenAmountProps {
  token: string;
  placeholder?: string;
}

export default function TokenAmount({
  token,
  placeholder = "0",
}: TokenAmountProps) {
  const tokenCdnUrl = `https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/128/color/${token.toLowerCase()}.png`;
  return (
    <div className="relative rounded-lg border border-border bg-surface-muted p-4 space-y-3">
      <div className="flex items-center justify-between">
        <input
          className="bg-transparent text-2xl outline-none w-full max-w-3/5 placeholder:text-muted"
          placeholder={placeholder}
        />
        <button className="button ml-3 inline-flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1 text-sm">
          {/* <span className={`size-4 rounded-full ${tokenColorClass}`} /> */}
          <Image src={tokenCdnUrl} alt={token} width={16} height={16} />
          <span>{token}</span>
          <Image
            src="/caret-down.svg"
            alt="Open"
            width={12}
            height={12}
            className="caret-down"
          />
        </button>
      </div>
      <div className="text-xs text-muted">~$1,860</div>
    </div>
  );
}
