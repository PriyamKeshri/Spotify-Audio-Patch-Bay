import { useState } from 'react';
import { Laptop2, Radio, Smartphone, Speaker, Tv } from 'lucide-react';
import { useAvailableDevices, usePlaybackControls } from '../../hooks/usePlayback';
import { usePlayerStore } from '../../store/playerStore';
import { cn } from '../../lib/utils';
import type { SpotifyDevice } from '../../types/spotify';

const deviceIcons: Record<string, typeof Laptop2> = {
  Computer: Laptop2,
  Smartphone: Smartphone,
  Speaker: Speaker,
  TV: Tv,
};

export function DevicePicker() {
  const [open, setOpen] = useState(false);
  useAvailableDevices();
  const devices = usePlayerStore((s) => s.devices);
  const { transferPlayback } = usePlaybackControls();

  const activeDevice = devices.find((d) => d.is_active);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors',
          activeDevice
            ? 'border-signal-500/40 text-signal-400'
            : 'border-console-700 text-console-400 hover:text-console-200'
        )}
        aria-label="Choose playback device"
      >
        <Radio className="h-3.5 w-3.5" />
        <span className="max-w-[120px] truncate">{activeDevice?.name ?? 'No device'}</span>
      </button>

      {open && (
        <div
          className="panel-brushed absolute bottom-10 right-0 z-20 w-72 rounded-xl p-2"
          onMouseLeave={() => setOpen(false)}
        >
          <p className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-console-500">
            Connect to a device
          </p>
          {devices.length === 0 && (
            <p className="px-2 py-2 text-xs text-console-400">
              No devices found. Open Spotify on any device to make it available here.
            </p>
          )}
          <div className="space-y-0.5">
            {devices.map((device) => (
              <DeviceRow
                key={device.id ?? device.name}
                device={device}
                onSelect={() => {
                  if (device.id) transferPlayback({ deviceId: device.id, play: true });
                  setOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DeviceRow({ device, onSelect }: { device: SpotifyDevice; onSelect: () => void }) {
  const Icon = deviceIcons[device.type] ?? Speaker;
  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm hover:bg-console-700',
        device.is_active ? 'text-signal-400' : 'text-console-200'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 truncate">{device.name}</span>
      <span className={cn('led h-2 w-2', device.is_active ? 'led--on' : 'led--off')} />
    </button>
  );
}
