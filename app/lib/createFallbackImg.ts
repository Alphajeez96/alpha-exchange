type FallbackOptions = {
  size?: number;
  textColor?: string;
  backgroundColor?: string;
};

const cache = new Map<string, string>();

const getCacheKey = (
  text: string,
  {size, backgroundColor, textColor}: FallbackOptions
): string => {
  return `${text}|${size}|${backgroundColor}|${textColor}`;
};

export const createFallbackImg = (
  text: string,
  options: FallbackOptions = {
    size: 20,
    textColor: "#0f0f0f",
    backgroundColor: "#D7F4FF",
  }
): string => {
  if (typeof window === "undefined" || typeof document === "undefined")
    return "";

  const size = options?.size ?? 20;
  const backgroundColor = options?.backgroundColor ?? "#D7F4FF";
  const textColor = options?.textColor ?? "#25262c";
  const fontFamily =
    getComputedStyle(document.body).fontFamily || "Inter, sans-serif";

  const key = getCacheKey(text, {size, backgroundColor, textColor});
  const cached = cache.get(key);
  if (cached) return cached;

  const scale = window.devicePixelRatio
    ? Math.max(2, Math.ceil(window.devicePixelRatio))
    : 2;
  const canvas = document.createElement("canvas");
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = true;

  // Background circle
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = backgroundColor;
  ctx.fill();

  const letter = text?.charAt(0)?.toUpperCase() || "T";
  ctx.fillStyle = textColor;
  ctx.font = `500 ${size * 0.55}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const verticalOffset = size * 0.02;
  ctx.fillText(letter, size / 2, size / 2 + verticalOffset);

  const dataUrl = canvas.toDataURL("image/png", 1.0);
  cache.set(key, dataUrl);
  return dataUrl;
};
