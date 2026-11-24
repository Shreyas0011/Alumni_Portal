// Transcend logo. /logo.png has a wide transparent border around the mark, so
// this crops to the mark itself; `width` is the visible logo width in px.
// `onDark` renders it white for dark backgrounds.
const BrandLogo = ({ width = 150, onDark = false, style }) => (
  <span
    style={{
      display: 'block',
      width,
      height: Math.round(width * 0.222),
      overflow: 'hidden',
      flexShrink: 0,
      ...style,
    }}
  >
    <img
      src="/logo.png"
      alt="Transcend Group of Institutions"
      style={{
        display: 'block',
        width: width * 1.185,
        height: 'auto',
        maxWidth: 'none',
        marginTop: width * -0.192,
        marginLeft: width * -0.088,
        filter: onDark ? 'brightness(0) invert(1)' : undefined,
      }}
    />
  </span>
);

export default BrandLogo;
