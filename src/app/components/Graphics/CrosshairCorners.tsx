"use client";
import classNames from "classnames";
import { motion } from "motion/react";

export default function CrosshairCorners({
  size = 10,
  spacingX = 0,
  baseDelay = 2.5,
  spacingY = 0,
  className = "",
  moveDistance = 5,
  style,
  thickness = 2,
  animationDuration = 2.15,
  key,
  variant = "corners",
  corners = ["top-left", "top-right", "bottom-left", "bottom-right"],
  borders = ["left", "right"],
}: {
  size?: number;
  spacingX?: number;
  spacingY?: number;
  baseDelay?: number;
  thickness?: number;
  animationDuration?: number;
  variant?: "corners" | "cross" | "bordered";
  corners?: ("top-left" | "top-right" | "bottom-left" | "bottom-right")[];
  borders?: ("left" | "right")[];
  className?: string;
  moveDistance?: number;
  style?: React.CSSProperties;
  key?: string;
}) {
  return (
    <motion.div
      key={key || null}
      className={classNames(
        "absolute w-full h-full inset-0 will-change-opacity pointer-events-none",
        className
      )}
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{
        opacity: [0, 1, 0.2, 1, 0.4, 1, 0.6, 1, 0.8, 1],
        scale: [0.99, 1, 0.99, 1, 1, 1],
      }}
      transition={{
        duration: animationDuration,
        ease: "anticipate",
        delay: baseDelay,
      }}
      style={
        {
          ...style,
          "--size": size + "px",
          "--spacing-x": spacingX + "px",
          "--spacing-y": spacingY + "px",
          "--move": moveDistance + "px",
          "--thickness": thickness + "px",
          "--half-size": size / 2 + "px",
        } as any
      }
    >
      {variant === "cross" ? (
        /* Cross/Plus Pattern in Corners */
        <>
          {/* Top Left Cross */}
          <div
            className={classNames(
              "absolute",
              "before:content-[''] before:absolute before:h-[var(--size)] before:w-[var(--thickness)] before:bg-current before:left-1/2 before:top-1/2 before:translate-x-[-50%] before:translate-y-[-50%]",
              "after:content-[''] after:absolute after:h-[var(--thickness)] after:w-[var(--size)] after:bg-current after:left-1/2 after:top-1/2 after:translate-x-[-50%] after:translate-y-[-50%]",
              "transition-all duration-300 group-hover/testimonial:translate-x-[calc(var(--move)*-1)] group-hover/testimonial:translate-y-[calc(var(--move)*-1)]",
              !corners.includes("top-left") && "hidden"
            )}
            style={{
              left: `calc((var(--spacing-x) + var(--half-size)) * -1 + 1px)`,
              top: `calc((var(--spacing-y) + var(--half-size)) * -1)`,
              width: `var(--size)`,
              height: `var(--size)`,
            }}
          ></div>

          {/* Top Right Cross */}
          <div
            className={classNames(
              "absolute",
              "before:content-[''] before:absolute before:h-[var(--size)] before:w-[var(--thickness)] before:bg-current before:left-1/2 before:top-1/2 before:translate-x-[-50%] before:translate-y-[-50%]",
              "after:content-[''] after:absolute after:h-[var(--thickness)] after:w-[var(--size)] after:bg-current after:left-1/2 after:top-1/2 after:translate-x-[-50%] after:translate-y-[-50%]",
              "transition-all duration-300 group-hover/testimonial:translate-x-[var(--move)] group-hover/testimonial:translate-y-[calc(var(--move)*-1)]",
              !corners.includes("top-right") && "hidden"
            )}
            style={{
              right: `calc((var(--spacing-x) + var(--half-size)) * -1)`,
              top: `calc((var(--spacing-y) + var(--half-size)) * -1)`,
              width: `var(--size)`,
              height: `var(--size)`,
            }}
          ></div>

          {/* Bottom Left Cross */}
          <div
            className={classNames(
              "absolute",
              "before:content-[''] before:absolute before:h-[var(--size)] before:w-[var(--thickness)] before:bg-current before:left-1/2 before:top-1/2 before:translate-x-[-50%] before:translate-y-[-50%]",
              "after:content-[''] after:absolute after:h-[var(--thickness)] after:w-[var(--size)] after:bg-current after:left-1/2 after:top-1/2 after:translate-x-[-50%] after:translate-y-[-50%]",
              "transition-all duration-300 group-hover/testimonial:translate-x-[calc(var(--move)*-1)] group-hover/testimonial:translate-y-[var(--move)]",
              !corners.includes("bottom-left") && "hidden"
            )}
            style={{
              left: `calc((var(--spacing-x) + var(--half-size)) * -1 + 1px)`,
              bottom: `calc((var(--spacing-y) + var(--half-size)) * -1)`,
              width: `var(--size)`,
              height: `var(--size)`,
            }}
          ></div>

          {/* Bottom Right Cross */}
          <div
            className={classNames(
              "absolute",
              "before:content-[''] before:absolute before:h-[var(--size)] before:w-[var(--thickness)] before:bg-current before:left-1/2 before:top-1/2 before:translate-x-[-50%] before:translate-y-[-50%]",
              "after:content-[''] after:absolute after:h-[var(--thickness)] after:w-[var(--size)] after:bg-current after:left-1/2 after:top-1/2 after:translate-x-[-50%] after:translate-y-[-50%]",
              "transition-all duration-300 group-hover/testimonial:translate-x-[var(--move)] group-hover/testimonial:translate-y-[var(--move)]",
              !corners.includes("bottom-right") && "hidden"
            )}
            style={{
              right: `calc((var(--spacing-x) + var(--half-size)) * -1)`,
              bottom: `calc((var(--spacing-y) + var(--half-size)) * -1)`,
              width: `var(--size)`,
              height: `var(--size)`,
            }}
          ></div>
        </>
      ) : variant === "bordered" ? (
        /* Corner Pattern with Left and Right Borders */
        <>
          {/* Top Left */}
          <div
            className={classNames(
              "absolute left-0 top-0 before:content-[''] before:absolute before:h-[var(--size)] before:w-[var(--thickness)] before:bg-current after:content-[''] after:absolute after:h-[var(--thickness)] after:w-[var(--size)] after:bg-current transition-all duration-300 group-hover/testimonial:translate-x-[calc(var(--move)*-1)] group-hover/testimonial:translate-y-[calc(var(--move)*-1)]",
              !corners.includes("top-left") && "hidden"
            )}
            style={{
              left: `calc(var(--spacing-x) * -1)`,
              top: `calc(var(--spacing-y) * -1)`,
            }}
          ></div>

          {/* Top Right */}
          <div
            className={classNames(
              "absolute right-0 top-0 before:content-[''] before:absolute before:h-[var(--size)] before:w-[var(--thickness)] before:bg-current before:right-0 after:content-[''] after:absolute after:h-[var(--thickness)] after:w-[var(--size)] after:bg-current after:right-0 transition-all duration-300 group-hover/testimonial:translate-x-[var(--move)] group-hover/testimonial:translate-y-[calc(var(--move)*-1)]",
              !corners.includes("top-right") && "hidden"
            )}
            style={{
              right: `calc(var(--spacing-x) * -1)`,
              top: `calc(var(--spacing-y) * -1)`,
            }}
          ></div>

          {/* Bottom Left */}
          <div
            className={classNames(
              "absolute left-0 bottom-0 before:content-[''] before:absolute before:h-[var(--size)] before:w-[var(--thickness)] before:bg-current before:bottom-0 after:content-[''] after:absolute after:h-[var(--thickness)] after:w-[var(--size)] after:bg-current after:bottom-0 transition-all duration-300 group-hover/testimonial:translate-x-[calc(var(--move)*-1)] group-hover/testimonial:translate-y-[var(--move)]",
              !corners.includes("bottom-left") && "hidden"
            )}
            style={{
              left: `calc(var(--spacing-x) * -1)`,
              bottom: `calc(var(--spacing-y) * -1)`,
            }}
          ></div>

          {/* Bottom Right */}
          <div
            className={classNames(
              "absolute right-0 bottom-0 before:content-[''] before:absolute before:h-[var(--size)] before:w-[var(--thickness)] before:bg-current before:right-0 before:bottom-0 after:content-[''] after:absolute after:h-[var(--thickness)] after:w-[var(--size)] after:bg-current after:right-0 after:bottom-0 transition-all duration-300 group-hover/testimonial:translate-x-[var(--move)] group-hover/testimonial:translate-y-[var(--move)]",
              !corners.includes("bottom-right") && "hidden"
            )}
            style={{
              right: `calc(var(--spacing-x) * -1)`,
              bottom: `calc(var(--spacing-y) * -1)`,
            }}
          ></div>

          {/* Left Border */}
          {borders.includes("left") && (
            <div
              className="absolute left-0 w-[var(--thickness)] bg-current transition-all duration-300 group-hover/testimonial:translate-x-[calc(var(--move)*-1)]"
              style={{
                left: `calc(var(--spacing-x) * -1)`,
                top: `calc(var(--spacing-y) * -1)`,
                height: `calc(100% + (var(--spacing-y) * 2))`,
              }}
            ></div>
          )}

          {/* Right Border */}
          {borders.includes("right") && (
            <div
              className="absolute right-0 w-[var(--thickness)] bg-current transition-all duration-300 group-hover/testimonial:translate-x-[var(--move)]"
              style={{
                right: `calc(var(--spacing-x) * -1)`,
                top: `calc(var(--spacing-y) * -1)`,
                height: `calc(100% + (var(--spacing-y) * 2))`,
              }}
            ></div>
          )}
        </>
      ) : (
        /* Corner Pattern (existing) */
        <>
          {/* Top Left */}
          <div
            className={classNames(
              "absolute left-0 top-0 before:content-[''] before:absolute before:h-[var(--size)] before:w-[var(--thickness)] before:bg-current after:content-[''] after:absolute after:h-[var(--thickness)] after:w-[var(--size)] after:bg-current transition-all duration-300 group-hover/testimonial:translate-x-[calc(var(--move)*-1)] group-hover/testimonial:translate-y-[calc(var(--move)*-1)]",
              !corners.includes("top-left") && "hidden"
            )}
            style={{
              left: `calc(var(--spacing-x) * -1)`,
              top: `calc(var(--spacing-y) * -1)`,
            }}
          ></div>

          {/* Top Right */}
          <div
            className={classNames(
              "absolute right-0 top-0 before:content-[''] before:absolute before:h-[var(--size)] before:w-[var(--thickness)] before:bg-current before:right-0 after:content-[''] after:absolute after:h-[var(--thickness)] after:w-[var(--size)] after:bg-current after:right-0 transition-all duration-300 group-hover/testimonial:translate-x-[var(--move)] group-hover/testimonial:translate-y-[calc(var(--move)*-1)]",
              !corners.includes("top-right") && "hidden"
            )}
            style={{
              right: `calc(var(--spacing-x) * -1)`,
              top: `calc(var(--spacing-y) * -1)`,
            }}
          ></div>

          {/* Bottom Left */}
          <div
            className={classNames(
              "absolute left-0 bottom-0 before:content-[''] before:absolute before:h-[var(--size)] before:w-[var(--thickness)] before:bg-current before:bottom-0 after:content-[''] after:absolute after:h-[var(--thickness)] after:w-[var(--size)] after:bg-current after:bottom-0 transition-all duration-300 group-hover/testimonial:translate-x-[calc(var(--move)*-1)] group-hover/testimonial:translate-y-[var(--move)]",
              !corners.includes("bottom-left") && "hidden"
            )}
            style={{
              left: `calc(var(--spacing-x) * -1)`,
              bottom: `calc(var(--spacing-y) * -1)`,
            }}
          ></div>

          {/* Bottom Right */}
          <div
            className={classNames(
              "absolute right-0 bottom-0 before:content-[''] before:absolute before:h-[var(--size)] before:w-[var(--thickness)] before:bg-current before:right-0 before:bottom-0 after:content-[''] after:absolute after:h-[var(--thickness)] after:w-[var(--size)] after:bg-current after:right-0 after:bottom-0 transition-all duration-300 group-hover/testimonial:translate-x-[var(--move)] group-hover/testimonial:translate-y-[var(--move)]",
              !corners.includes("bottom-right") && "hidden"
            )}
            style={{
              right: `calc(var(--spacing-x) * -1)`,
              bottom: `calc(var(--spacing-y) * -1)`,
            }}
          ></div>
        </>
      )}
    </motion.div>
  );
}
