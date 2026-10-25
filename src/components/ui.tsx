import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "quiet" | "ghost";
};

export function Button({ tone = "primary", className = "", type = "button", ...props }: ButtonProps) {
  const tones: Record<NonNullable<ButtonProps["tone"]>, string> = {
    primary: "brand-fill hover:opacity-90",
    quiet: "bg-surface text-ink border border-line hover:bg-bg",
    ghost: "bg-transparent text-ink hover:bg-bg",
  };
  return (
    <button
      type={type}
      className={`press inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-base font-medium disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]} ${className}`}
      {...props}
    />
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-ink">
      {label}
      {children}
    </label>
  );
}

const control =
  "h-11 w-full rounded-md border border-line bg-surface px-3 text-base font-normal text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${control} ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-28 w-full rounded-md border border-line bg-surface px-3 py-3 text-base font-normal leading-normal text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${props.className ?? ""}`}
    />
  );
}

export function SelectInput({
  children,
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${control} ${className}`}>
      {children}
    </select>
  );
}

export function initialOf(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "ప";
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("te", { granularity: "grapheme" });
    const first = segmenter.segment(trimmed)[Symbol.iterator]().next().value?.segment;
    if (first) return first;
  }
  return trimmed.slice(0, 1);
}
