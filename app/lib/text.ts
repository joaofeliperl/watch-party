export default function humanizeSeconds(value?: number) {
  if (value == null) return "";
  return new Date(value * 1000).toISOString().slice(11, 19).replace("00:", "");
}
