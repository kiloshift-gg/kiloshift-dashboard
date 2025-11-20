import { AnimatePresence, anticipate, motion } from "motion/react";
import classNames from "classnames";

export default function Logo({
  width = 180,
  height = 20,
  showText = true,
  isScrolled = false,
}) {
  function getAnimation(delay: number) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: [0, 0.25, 0.5, 1, 0.75, 1] },
      transition: { duration: 0.5, delay: delay * 0.8, ease: anticipate },
    };
  }

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 180 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames("relative z-10", isScrolled && "h-full")}
      key={isScrolled ? "scrolled" : "no-scroll"}
    >
      <defs>
        <clipPath id="clip0_435_1262">
          <rect width="180" height="20" fill="white" />
        </clipPath>
        <mask
          id="mask0_435_1262"
          type="luminance"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="180"
          height="20"
        >
          <path d="M180 0H0V20H180V0Z" fill="white" />
        </mask>
      </defs>
      <g clipPath="url(#clip0_435_1262)">
        <g mask="url(#mask0_435_1262)">
          {/* Logo glyph arrows - Original fast-forward design */}
          <motion.path
            d="M4 4.00013H0V0.000131835H4V4.00013Z"
            fill="#00FFFF"
            id="1"
            {...getAnimation(0)}
          />
          <motion.path
            d="M15.9997 4H11.9997V0H15.9997V4Z"
            fill="#00FFFF"
            id="2"
            {...getAnimation(0.6)}
          />
          <motion.path
            d="M7.99987 8.00013H4V4.00013H7.99987V8.00013Z"
            fill="#00FFFF"
            id="3"
            {...getAnimation(0.9)}
          />
          <motion.path
            d="M19.9996 7.99987H15.9997V4H19.9997L19.9996 7.99987Z"
            fill="#00FFFF"
            id="4"
            {...getAnimation(0.3)}
          />
          <motion.path
            d="M11.9999 12H7.99987V8.00013H11.9999V12Z"
            fill="#00FFFF"
            id="5"
            {...getAnimation(0.2)}
          />
          <motion.path
            d="M23.9996 11.9999H19.9997L19.9996 7.99987H23.9996V11.9999Z"
            fill="#00FFFF"
            id="6"
            {...getAnimation(0.1)}
          />
          <motion.path
            d="M7.99987 16H4V12H7.99987V16Z"
            fill="#00FFFF"
            id="7"
            {...getAnimation(0.5)}
          />
          <motion.path
            d="M19.9997 15.9999H15.9997V11.9999H19.9997V15.9999Z"
            fill="#00FFFF"
            id="8"
            {...getAnimation(0.7)}
          />
          <motion.path
            d="M4 20H0V16H4V20Z"
            fill="#00FFFF"
            id="9"
            {...getAnimation(0.4)}
          />
          <motion.path
            d="M15.9997 19.9999H11.9997V15.9999H15.9997V19.9999Z"
            fill="#00FFFF"
            id="10"
            {...getAnimation(0.6)}
          />
          
          {/* kiloshift text - Clean, larger text with better styling */}
          <AnimatePresence>
            {showText && (
              <motion.text
                x="42"
                y="15"
                fill="#EFF1F6"
                fontSize="19"
                fontFamily="ui-monospace, 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Fira Mono', 'Droid Sans Mono', 'Source Code Pro', monospace"
                fontWeight="500"
                letterSpacing="2px"
                textAnchor="start"
                dominantBaseline="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, delay: 0.5 }}
                style={{
                  fontVariantLigatures: "none",
                  fontFeatureSettings: '"liga" 0, "calt" 0',
                  textRendering: "geometricPrecision",
                }}
              >
                kiloshift
              </motion.text>
            )}
          </AnimatePresence>
        </g>
      </g>
    </motion.svg>
  );
}
