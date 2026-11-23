'use client';

import React from 'react';
import { useOs, type WindowAppId } from '@/context/OsContext';
import { useWindowFrame } from '@/components/os/OsWindowFrame';

interface WindowTitleBarProps {
  appId?: WindowAppId;
  title: string;
  badgeText?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  onDragStart?: (e: React.MouseEvent) => void;
}

export function WindowTitleBar({
  appId,
  title,
  badgeText,
  leftSlot,
  rightSlot,
  onDragStart,
}: WindowTitleBarProps) {
  const { windows, closeWindow, closeApp, minimizeWindow, toggleMaximizeWindow } = useOs();
  const frame = useWindowFrame();

  const resolvedAppId = appId ?? frame?.appId;
  const isMaximized = resolvedAppId ? windows[resolvedAppId]?.isMaximized : false;
  const handleDragStart = onDragStart ?? frame?.onDragStart;

  const handleClose = () => {
    if (resolvedAppId) {
      closeWindow(resolvedAppId);
    } else {
      closeApp();
    }
  };

  const handleMinimize = () => {
    if (resolvedAppId) {
      minimizeWindow(resolvedAppId);
    }
  };

  const handleToggleMaximize = () => {
    if (resolvedAppId) {
      toggleMaximizeWindow(resolvedAppId);
    }
  };

  const stopDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <header
      onMouseDown={handleDragStart}
      onDoubleClick={handleToggleMaximize}
      className={`sticky top-0 z-20 shrink-0 flex flex-wrap items-center justify-between gap-gutter-md px-gutter-lg py-gutter-md bg-dark-surface-container/95 backdrop-blur-xl border-b border-dark-outline-variant/50 select-none ${
        handleDragStart && !isMaximized ? 'md:cursor-grab md:active:cursor-grabbing' : ''
      }`}
    >
      <div className="flex items-center gap-gutter-sm min-w-0">
        <div
          className="flex items-center gap-gutter-sm shrink-0"
          onMouseDown={stopDrag}
          onDoubleClick={stopDrag}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Tutup jendela (X)"
            title="Tutup (X)"
            className="w-3 h-3 rounded-full bg-dark-error inline-block hover:brightness-110 transition-all duration-state-change shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-dark-error"
          />
          <button
            type="button"
            onClick={handleMinimize}
            aria-label="Minimize jendela"
            title="Minimize"
            className="w-3 h-3 rounded-full bg-dark-tertiary inline-block hover:brightness-110 transition-all duration-state-change shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-dark-tertiary"
          />
          <button
            type="button"
            onClick={handleToggleMaximize}
            aria-label={isMaximized ? 'Pulihkan ukuran jendela' : 'Fullscreen jendela'}
            title={isMaximized ? 'Pulihkan ukuran' : 'Fullscreen'}
            className="w-3 h-3 rounded-full bg-dark-primary inline-block hover:brightness-110 transition-all duration-state-change shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-dark-primary"
          />
        </div>

        {leftSlot ? (
          <div className="ml-gutter-sm min-w-0" onMouseDown={stopDrag}>
            {leftSlot}
          </div>
        ) : (
          <span
            data-design-text-token="mono-md"
            className="font-mono text-mono-md text-dark-on-surface ml-gutter-sm truncate"
          >
            {title}
          </span>
        )}
      </div>

      {(rightSlot || badgeText) && (
        <div
          className="flex items-center gap-gutter-sm flex-wrap"
          onMouseDown={stopDrag}
          onDoubleClick={stopDrag}
        >
          {rightSlot}
          {badgeText && (
            <span
              data-component-id="badge-status"
              data-component-type="badge"
              data-component-variant="status"
              role="status"
              className="inline-flex items-center px-gutter-sm py-gutter-xs rounded-full bg-dark-tertiary-container/25 border border-dark-tertiary/40 text-dark-tertiary"
            >
              <span
                data-design-text-token="label-sm"
                className="font-label text-label-sm tabular-nums"
              >
                {badgeText}
              </span>
            </span>
          )}
        </div>
      )}
    </header>
  );
}
