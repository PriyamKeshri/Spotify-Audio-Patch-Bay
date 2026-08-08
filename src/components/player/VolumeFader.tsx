import { Volume1, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

interface VolumeFaderProps {
  volume: number; // 0-100
  onChange: (value: number) => void;
}

export function VolumeFader({ volume, onChange }: VolumeFaderProps) {
  const [localVolume, setLocalVolume] = useState(volume);
  const displayVolume = localVolume;

  const Icon = displayVolume === 0 ? VolumeX : displayVolume < 50 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-2 group">
      <Icon className="h-4 w-4 shrink-0 text-console-400" />
      <div className="relative flex h-4 w-24 items-center">
        <div className="absolute h-1 w-full rounded-full bg-console-700" />
        <div
          className="absolute h-1 rounded-full bg-console-300 group-hover:bg-signal-500"
          style={{ width: `${displayVolume}%` }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={displayVolume}
          onChange={(e) => {
            const val = Number(e.target.value);
            setLocalVolume(val);
            onChange(val);
          }}
          aria-label="Volume"
          className={cn(
            'absolute w-full appearance-none bg-transparent',
            '[&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-console-100',
            '[&::-webkit-slider-thumb]:opacity-0 group-hover:[&::-webkit-slider-thumb]:opacity-100',
            '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-opacity'
          )}
        />
      </div>
    </div>
  );
}
