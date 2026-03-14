"use client";
import { FaCaretDown } from "react-icons/fa";
import React from "react";
import { useEditorStore } from "@/store/use-editor-store";

const markers = Array.from({ length: 83 }, (_, i) => i);

const DEFAULT_LEFT_MARGIN = 56;
const DEFAULT_RIGHT_MARGIN = 760;

interface MarkerProps {
  position: number;
  isLeft: boolean;
  isDragging: boolean;
  onMouseDown: () => void;
  onDoubleClick: () => void;
}

const Marker = ({
  position,
  isLeft,
  isDragging,
  onMouseDown,
  onDoubleClick,
}: MarkerProps) => {
  return (
    <div
      className="absolute top-0 w-4 h-full cursor-ew-resize z-[5] group -ml-2"
      style={{ left: `${position}px` }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <FaCaretDown
        className={`absolute left-1/2 top-0 h-full transform -translate-x-1/2 transition-colors ${
          isDragging ? "fill-blue-700" : "fill-blue-500"
        }`}
      />
    </div>
  );
};

export const Ruler = () => {
  // ✅ Read AND write margins through the global store so EditorPage stays in sync
  const { leftMargin, rightMargin, setLeftMargin, setRightMargin } = useEditorStore();

  const [isDraggingLeft, setIsDraggingLeft] = React.useState(false);
  const [isDraggingRight, setIsDraggingRight] = React.useState(false);
  const [guideLinePosition, setGuideLinePosition] = React.useState<number | null>(null);
  const rulerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handleLeftMouseDown = () => setIsDraggingLeft(true);
  const handleRightMouseDown = () => setIsDraggingRight(true);

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      const containerRect = contentRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const relativeX = e.clientX - containerRect.left;

      if (isDraggingLeft) {
        const next = Math.min(Math.max(relativeX, 0), rightMargin - 100);
        setLeftMargin(next); // ✅ updates store → editor re-renders with new padding
      } else if (isDraggingRight) {
        const next = Math.max(Math.min(relativeX, 816), leftMargin + 100);
        setRightMargin(next);
      }
    },
    [isDraggingLeft, isDraggingRight, leftMargin, rightMargin, setLeftMargin, setRightMargin]
  );

  const handleMouseUp = React.useCallback(() => {
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
  }, []);

  // ✅ Double-click resets to defaults (56px left, 56px right)
  const handleDoubleClickLeft = () => setLeftMargin(DEFAULT_LEFT_MARGIN);
  const handleDoubleClickRight = () => setRightMargin(DEFAULT_RIGHT_MARGIN);

  // Guide line while dragging
  React.useEffect(() => {
    if (isDraggingLeft || isDraggingRight) {
      const containerRect = contentRef.current?.getBoundingClientRect();
      if (containerRect) {
        setGuideLinePosition(
          containerRect.left + (isDraggingLeft ? leftMargin : rightMargin)
        );
      }
    } else {
      setGuideLinePosition(null);
    }
  }, [isDraggingLeft, isDraggingRight, leftMargin, rightMargin]);

  // Attach / detach global mouse listeners only while dragging
  React.useEffect(() => {
    if (isDraggingLeft || isDraggingRight) {
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDraggingLeft, isDraggingRight, handleMouseMove, handleMouseUp]);

  return (
    <>
      <div
        ref={rulerRef}
        className="h-6 border-b border-gray-300 bg-white flex items-end relative select-none print:hidden overflow-hidden"
      >
        <div className="w-full h-full relative flex justify-center">
          <div ref={contentRef} className="relative h-full w-[816px]">

            {/* Tick marks */}
            {markers.map((marker) => {
              const position = (marker * 816) / 82;
              const isInch = marker % 10 === 0;
              const isHalfInch = marker % 5 === 0 && !isInch;
              return (
                <div
                  key={marker}
                  className="absolute bottom-0"
                  style={{ left: `${position}px` }}
                >
                  {isInch ? (
                    <>
                      <div className="w-[1px] h-3 bg-neutral-600" />
                      <span className="absolute -top-[14px] -left-1.5 text-[9px] text-neutral-600 font-medium">
                        {marker / 10}
                      </span>
                    </>
                  ) : isHalfInch ? (
                    <div className="w-[1px] h-2 bg-gray-400" />
                  ) : (
                    <div className="w-[1px] h-1.5 bg-gray-300" />
                  )}
                </div>
              );
            })}

            {/* Left margin line */}
            <div
              className="absolute top-0 bottom-0 w-[1px] bg-blue-500 pointer-events-none"
              style={{ left: `${leftMargin}px` }}
              title="Left margin"
            />
            <Marker
              position={leftMargin}
              isLeft
              isDragging={isDraggingLeft}
              onMouseDown={handleLeftMouseDown}
              onDoubleClick={handleDoubleClickLeft}
            />

            {/* Right margin line */}
            <div
              className="absolute top-0 bottom-0 w-[1px] bg-blue-500 pointer-events-none"
              style={{ left: `${rightMargin}px` }}
              title="Right margin"
            />
            <Marker
              position={rightMargin}
              isLeft={false}
              isDragging={isDraggingRight}
              onMouseDown={handleRightMouseDown}
              onDoubleClick={handleDoubleClickRight}
            />

            {/* Drag tooltip */}
            {(isDraggingLeft || isDraggingRight) && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                {isDraggingLeft
                  ? `Left: ${Math.round(leftMargin)}px`
                  : `Right: ${Math.round(816 - rightMargin)}px`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-height guide line while dragging */}
      {guideLinePosition !== null && (
        <div
          className="fixed top-0 bottom-0 w-[1px] bg-blue-500 pointer-events-none z-[100] print:hidden"
          style={{
            left: `${guideLinePosition}px`,
            opacity: 0.6,
            boxShadow: "0 0 2px rgba(59, 130, 246, 0.5)",
          }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full" />
        </div>
      )}
    </>
  );
};

export default Ruler;