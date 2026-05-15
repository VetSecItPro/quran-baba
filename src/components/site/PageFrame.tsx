// A four-sided zellige picture frame around the viewport.
// Top + bottom: horizontal strips. Left + right: vertical strips that
// start where the top strip ends and stop where the bottom strip starts,
// so the corners join cleanly. The site header is sticky and sits over the frame.
//
// Bar height/width is consistent: 40px (md) / 56px (lg).
// Bars are pointer-events-none and aria-hidden so they don't trap focus.
//
// Use this only on pages that should look like a framed memorial page
// (landing + /p/[slug]). The /create tool page intentionally renders without it.

export function PageFrame() {
  return (
    <>
      {/* Top horizontal band - sits directly below the sticky 56px-tall header */}
      <div
        aria-hidden="true"
        className="fixed top-14 left-0 right-0 h-10 lg:h-14 z-20 bg-repeat-x bg-center pointer-events-none"
        style={{
          backgroundImage: "url('/ornaments/zellige-strip.png')",
          backgroundSize: "auto 100%",
        }}
      />

      {/* Bottom horizontal band - full width at the viewport bottom */}
      <div
        aria-hidden="true"
        className="fixed bottom-0 left-0 right-0 h-10 lg:h-14 z-20 bg-repeat-x bg-center pointer-events-none"
        style={{
          backgroundImage: "url('/ornaments/zellige-strip.png')",
          backgroundSize: "auto 100%",
        }}
      />

      {/* Left vertical column - starts where top band ends, stops where bottom band starts */}
      <div
        aria-hidden="true"
        className="fixed left-0 top-24 bottom-10 lg:top-28 lg:bottom-14 w-10 lg:w-14 z-20 bg-repeat-y bg-center pointer-events-none hidden md:block"
        style={{
          backgroundImage: "url('/ornaments/zellige-column.jpg')",
          backgroundSize: "100% auto",
        }}
      />

      {/* Right vertical column */}
      <div
        aria-hidden="true"
        className="fixed right-0 top-24 bottom-10 lg:top-28 lg:bottom-14 w-10 lg:w-14 z-20 bg-repeat-y bg-center pointer-events-none hidden md:block"
        style={{
          backgroundImage: "url('/ornaments/zellige-column.jpg')",
          backgroundSize: "100% auto",
        }}
      />
    </>
  );
}
