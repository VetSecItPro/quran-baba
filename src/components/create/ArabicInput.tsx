"use client";

import { useEffect, useRef, useState } from "react";

const ROWS: string[][] = [
  ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د"],
  ["ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط"],
  ["ئ", "ء", "ؤ", "ر", "ﻻ", "ى", "ة", "و", "ز", "ظ"],
];

const SHIFT_MAP: Record<string, string> = {
  ض: "َ", ص: "ً", ث: "ُ", ق: "ٌ", ف: "ْ", غ: "ّ",
  ع: "ِ", ه: "ٍ", خ: "ـ", ح: "}", ج: "{", د: "]",
  ش: "آ", س: "ّ", ي: "ـ", ب: "،", ل: "؛", ا: "أ",
  ت: "ـ", ن: "،", م: "؟", ك: ":", ط: "؛",
  ئ: "ـ", ء: "ٔ", ؤ: "ـ", ر: "}", ﻻ: "ـ", ى: "إ",
  ة: "ـ", و: ",", ز: ".", ظ: "ـ",
};

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
};

export function ArabicInput({ value, onChange, placeholder, multiline = false }: Props) {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const caretRef = useRef<number | null>(null);

  function rememberCaret() {
    const el = inputRef.current;
    if (!el) return;
    caretRef.current = el.selectionStart ?? value.length;
  }

  function insert(ch: string) {
    const el = inputRef.current;
    const pos = caretRef.current ?? value.length;
    const next = value.slice(0, pos) + ch + value.slice(pos);
    onChange(next);
    requestAnimationFrame(() => {
      if (!el) return;
      const newPos = pos + ch.length;
      el.focus();
      el.setSelectionRange(newPos, newPos);
      caretRef.current = newPos;
    });
  }

  function backspace() {
    const pos = caretRef.current ?? value.length;
    if (pos <= 0) return;
    const next = value.slice(0, pos - 1) + value.slice(pos);
    onChange(next);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(pos - 1, pos - 1);
      caretRef.current = pos - 1;
    });
  }

  function space() {
    insert(" ");
  }

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (t.closest("[data-arabic-keyboard]") || t.closest("[data-arabic-input]")) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative">
      <div className="flex gap-2" data-arabic-input>
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyUp={rememberCaret}
            onClick={rememberCaret}
            placeholder={placeholder}
            dir="auto"
            rows={2}
            className="font-arabic text-lg w-full px-3 py-2 rounded-lg bg-parchment border border-gold/30 text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition-colors resize-y"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyUp={rememberCaret}
            onClick={rememberCaret}
            placeholder={placeholder}
            dir="auto"
            className="font-arabic text-xl w-full px-3 py-2 rounded-lg bg-parchment border border-gold/30 text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition-colors"
          />
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle Arabic keyboard"
          title="Arabic keyboard"
          className="shrink-0 px-3 rounded-full border border-gold/40 bg-cream-soft text-ink hover:border-gold transition-colors"
        >
          ⌨︎
        </button>
      </div>

      {open && (
        <div
          data-arabic-keyboard
          className="mt-2 bg-cream-soft border border-gold/30 rounded-xl p-3 shadow-lg"
          dir="rtl"
        >
          {ROWS.map((row, i) => (
            <div key={i} className="flex gap-1.5 justify-center mb-1.5">
              {row.map((k) => (
                <KeyButton key={k} onClick={() => insert(shift ? SHIFT_MAP[k] ?? k : k)}>
                  <span className="font-arabic text-xl">
                    {shift ? SHIFT_MAP[k] ?? k : k}
                  </span>
                </KeyButton>
              ))}
            </div>
          ))}
          <div className="flex gap-1.5 justify-center">
            <KeyButton onClick={() => setShift((s) => !s)} wide active={shift}>
              {shift ? "أبجد" : "حركات"}
            </KeyButton>
            <KeyButton onClick={space} className="flex-1">
              ⎵
            </KeyButton>
            <KeyButton onClick={backspace} wide>
              ⌫
            </KeyButton>
            <KeyButton onClick={() => setOpen(false)} wide>
              ✕
            </KeyButton>
          </div>
        </div>
      )}
    </div>
  );
}

function KeyButton({
  children,
  onClick,
  wide = false,
  active = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  wide?: boolean;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`${wide ? "px-3" : "w-9"} h-10 rounded-md border text-ink transition-colors ${
        active
          ? "bg-emerald text-white border-emerald"
          : "bg-parchment border-gold/30 hover:border-gold"
      } ${className}`}
    >
      {children}
    </button>
  );
}
