'use client';

import React, { useState } from 'react';
import { LOCAL_WALLPAPER_URL } from '@/data/profile';
import { useOs } from '@/context/OsContext';

export function CosmicWallpaper() {
  const { activeApp, isLocked, isLauncherOpen } = useOs();
  const [imgFailed, setImgFailed] = useState(false);

  const scrimClass = isLocked
    ? 'bg-dark-surface-container-lowest/45 backdrop-blur-sm'
    : isLauncherOpen
      ? 'bg-dark-surface-container-lowest/50 backdrop-blur-sm'
      : activeApp === 'home'
        ? 'bg-dark-surface-container-lowest/15'
        : 'bg-dark-surface-container-lowest/35';

  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden cosmic-horizon-bg">
      {!imgFailed && (
        <img
          src={LOCAL_WALLPAPER_URL}
          alt="Latar belakang desktop kosmik Baihaqi OS"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover object-center"
        />
      )}
      <div className={`absolute inset-0 transition-all duration-surface-enter ${scrimClass}`} />
    </div>
  );
}
