"use client";
import { FaCaretDown } from "react-icons/fa";
import React from "react";

const markers = Array.from({ length: 83 }, (_, i) => i);

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
    onDoubleClick
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
                    isDragging ? 'fill-blue-700' : 'fill-blue-500'
                }`} 
            />
        </div>
    );
};

export const Ruler = () => {
    const [leftMargin, setLeftMargin] = React.useState(56);
    const [rightMargin, setRightMargin] = React.useState(760);
    const [isDraggingLeft, setIsDraggingLeft] = React.useState(false);
    const [isDraggingRight, setIsDraggingRight] = React.useState(false);
    const [guideLinePosition, setGuideLinePosition] = React.useState<number | null>(null);
    const rulerRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    const handleLeftMouseDown = () => {
        setIsDraggingLeft(true);
    };

    const handleRightMouseDown = () => {
        setIsDraggingRight(true);
    };

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
        const containerRect = contentRef.current?.getBoundingClientRect();
        if (!containerRect) return;

        const relativeX = e.clientX - containerRect.left;

        if (isDraggingLeft) {
            const newLeftMargin = Math.min(
                Math.max(relativeX, 0),
                rightMargin - 100
            );
            setLeftMargin(newLeftMargin);
        } else if (isDraggingRight) {
            const newRightMargin = Math.max(
                Math.min(relativeX, 816),
                leftMargin + 100
            );
            setRightMargin(newRightMargin);
        }
    }, [isDraggingLeft, isDraggingRight, leftMargin, rightMargin]);

    const handleMouseUp = React.useCallback(() => {
        setIsDraggingLeft(false);
        setIsDraggingRight(false);
    }, []);

    const handleDoubleClickLeft = () => {
        setLeftMargin(56);
    };

    const handleDoubleClickRight = () => {
        setRightMargin(760);
    };

    // Update guide line position when dragging or margins change
    React.useEffect(() => {
        if (isDraggingLeft || isDraggingRight) {
            const containerRect = contentRef.current?.getBoundingClientRect();
            if (containerRect) {
                if (isDraggingLeft) {
                    setGuideLinePosition(containerRect.left + leftMargin);
                } else if (isDraggingRight) {
                    setGuideLinePosition(containerRect.left + rightMargin);
                }
            }
        } else {
            setGuideLinePosition(null);
        }
    }, [isDraggingLeft, isDraggingRight, leftMargin, rightMargin]);

    React.useEffect(() => {
        if (isDraggingLeft || isDraggingRight) {
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDraggingLeft, isDraggingRight, handleMouseMove, handleMouseUp]);

    return (
        <>
            <div
                ref={rulerRef}
                className="h-6 border-b border-gray-300 bg-white flex items-end relative select-none print:hidden overflow-hidden"
            >
                <div className="w-full   h-full relative flex justify-center">
                    <div 
                        ref={contentRef}
                        className="relative h-full w-[816px]"
                    >
                        {/* Ruler markers */}
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

                        {/* Left margin indicator */}
                        <div
                            className="absolute top-0 bottom-0 w-[1px] bg-blue-500 pointer-events-none"
                            style={{ left: `${leftMargin}px` }}
                            title="Left margin"
                        />
                        <Marker
                            position={leftMargin}
                            isLeft={true}
                            isDragging={isDraggingLeft}
                            onMouseDown={handleLeftMouseDown}
                            onDoubleClick={handleDoubleClickLeft}
                        />

                        {/* Right margin indicator */}
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

                        {/* Tooltip when dragging */}
                        {(isDraggingLeft || isDraggingRight) && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                                {isDraggingLeft 
                                    ? `Left: ${Math.round(leftMargin)}px` 
                                    : `Right: ${Math.round(816 - rightMargin)}px`
                                }
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Vertical guide line that extends through entire document */}
            {guideLinePosition !== null && (
                <div
                    className="fixed top-0 bottom-0 w-[1px] bg-blue-500 pointer-events-none z-[100] print:hidden"
                    style={{ 
                        left: `${guideLinePosition}px`,
                        opacity: 0.6,
                        boxShadow: '0 0 2px rgba(59, 130, 246, 0.5)'
                    }}
                >
                    {/* Top indicator dot */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                </div>
            )}
        </>
    );
};

export default Ruler;