import { useState } from 'react';

interface IHintButtonProps {
  remaining: number;
  disabled: boolean;
  onUse: () => Promise<string | null>;
}

export default function HintButton({ remaining, disabled, onUse }: IHintButtonProps) {
  const [hintText, setHintText] = useState<string | null>(null);

  const handleUse = async () => {
    setHintText(null);
    const text = await onUse();
    setHintText(text);
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleUse}
        disabled={disabled || remaining <= 0}
        className="min-h-[44px] px-4 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:bg-slate-600 w-full"
      >
        使用提示（剩余 {remaining} 次）
      </button>
      {hintText ? (
        <div className="mt-3 text-sm text-slate-300 bg-slate-900/40 border border-slate-700 rounded-lg p-3 whitespace-pre-wrap">
          {hintText}
        </div>
      ) : null}
    </div>
  );
}

