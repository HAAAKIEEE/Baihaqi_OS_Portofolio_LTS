'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { useOs, type OsWindowInstance, type WindowAppId } from '@/context/OsContext';

interface WindowFrameContextValue {
  appId: WindowAppId;
  isMaximized: boolean;
  isFocused: boolean;
  onDragStart: (e: React.MouseEvent) => void;
}

const WindowFrameContext = createContext<WindowFrameContextValue | null>(null);

export function useWindowFrame() {
  return useContext(WindowFrameContext);
}

interface OsWindowFrameProps {
  windowState: OsWindowInstance;
  isFocused: boolean;
  children: React.ReactNode;
}

export function OsWindowFrame({ windowState, isFocused, children }: OsWindowFrameProps) {
  const { focusWindow, updateWindowPosition } = useOs();
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0 || windowState.isMaximized) return;
      if (typeof window !== 'undefined' && window.innerWidth < 768) return;

      focusWindow(windowState.id);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: windowState.position.x,
        origY: windowState.position.y,
      };
    },
    [focusWindow, windowState.id, windowState.isMaximized, windowState.position.x, windowState.position.y]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const maxX = Math.max(240, Math.round(window.innerWidth * 0.38));
      const maxY = Math.max(160, Math.round(window.innerHeight * 0.32));

      const clampedX = Math.max(-maxX, Math.min(maxX, dragRef.current.origX + dx));
      const clampedY = Math.max(-maxY, Math.min(maxY, dragRef.current.origY + dy));
      updateWindowPosition(windowState.id, { x: clampedX, y: clampedY });
    };

    const handleMouseUp = () => {
      dragRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [updateWindowPosition, windowState.id]);

  const frameStyle = windowState.isMaximized
    ? ({ zIndex: windowState.zIndex } as React.CSSProperties)
    : ({
        zIndex: windowState.zIndex,
        '--win-x': `${windowState.position.x}px`,
        '--win-y': `${windowState.position.y}px`,
      } as React.CSSProperties);

  return (
    <WindowFrameContext.Provider
      value={{
        appId: windowState.id,
        isMaximized: windowState.isMaximized,
        isFocused,
        onDragStart,
      }}
    >
      <div
        onMouseDown={() => focusWindow(windowState.id)}
        style={frameStyle}
        className={
          windowState.isMaximized
            ? 'fixed inset-x-0 top-10 bottom-20 md:inset-x-0 md:top-10 md:bottom-20 flex flex-col [&>section]:max-w-none [&>section]:w-full [&>section]:h-full [&>section]:flex-1 [&>section]:overflow-y-auto [&>section]:os-scroll [&>section]:rounded-none [&>section]:border-x-0 [&>section]:ring-1 [&>section]:ring-dark-primary/60'
            : `w-full md:w-[min(92vw,60rem)] md:absolute md:left-1/2 md:top-1/2 md:[transform:translate(calc(-50%+var(--win-x)),calc(-50%+var(--win-y)))] [&>section]:max-h-[calc(100vh-11.5rem)] [&>section]:overflow-y-auto [&>section]:os-scroll ${
                isFocused
                  ? '[&>section]:ring-1 [&>section]:ring-dark-primary/70 [&>section]:shadow-2xl'
                  : 'opacity-95 [&>section]:border-dark-outline-variant/40'
              }`
        }
      >
        {children}
      </div>
    </WindowFrameContext.Provider>
  );
}
