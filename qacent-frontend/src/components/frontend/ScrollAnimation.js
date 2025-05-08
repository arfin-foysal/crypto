// Main App Component
export default function ScrollAnimation() {
  return (
    <div className="flex items-center justify-center flex-col font-sans">
      {/* <header className="flex flex-col items-center m-4 text-center">
        <h1 className="font-semibold text-2xl md:text-3xl mb-2">
          Vertical Infinite Scroll Animation
        </h1>
        <p className="text-slate-400 mb-2">
          CSS only, content independent, bi-directional, customizable
        </p>
        <p className="text-slate-400">Vertical scrolling version</p>
      </header> */}
      <div className="flex flex-row gap-8">
        <TagList />
      </div>
    </div>
  );
}

// Tag List Component
function TagList() {
  // Create multiple columns with different speeds and directions
  return (
    <>
      <div className="relative">
        <img
          src="/assets/frontend_assets/scroll-top-layer.png"
          alt=""
          className="absolute -top-20 z-10 blur-2xl bg-[#1C1C1C]"
        />

        <div className="flex flex-row gap-6 relative">
          <VerticalLoopSlider duration="40s" direction="normal">
            <Tag text="JavaScript" />
            <Tag text="webdev" />
            <Tag text="Typescript" />
            <Tag text="Next.js" />
            <Tag text="UI/UX" />
            <Tag text="JavaScript" />
            <Tag text="webdev" />
            <Tag text="Typescript" />
            <Tag text="Next.js" />
            <Tag text="UI/UX" />
          </VerticalLoopSlider>

          <VerticalLoopSlider duration="35s" direction="reverse">
            <Tag text="webdev" />
            <Tag text="Gatsby" />
            <Tag text="JavaScript" />
            <Tag text="Tailwind" />
            <Tag text="Typescript" />
            <Tag text="webdev" />
            <Tag text="Gatsby" />
            <Tag text="JavaScript" />
            <Tag text="Tailwind" />
            <Tag text="Typescript" />
          </VerticalLoopSlider>

          <VerticalLoopSlider duration="30s" direction="normal">
            <Tag text="animation" />
            <Tag text="Tailwind" />
            <Tag text="React" />
            <Tag text="SVG" />
            <Tag text="HTML" />
            <Tag text="animation" />
            <Tag text="Tailwind" />
            <Tag text="React" />
            <Tag text="SVG" />
            <Tag text="HTML" />
          </VerticalLoopSlider>
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundPosition: "0% 0%, 0% 30%, 0% 70%, 0% 100%" }}
          />
        </div>
        <img
          src="/assets/frontend_assets/scroll-bottom-layer.png"
          alt=""
          className="absolute -bottom-20 blur-2xl bg-[#1C1C1C]"
        />
      </div>
    </>
  );
}

// Vertical Loop Slider Component
function VerticalLoopSlider({ children, duration, direction }) {
  return (
    <div className="h-[100vh] overflow-hidden relative">
      {/* Fade overlay for top and bottom */}
      {/* <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#111111] via-transparent to-[#111111]"
        style={{ backgroundPosition: "0% 0%, 0% 30%, 0% 70%, 0% 100%" }}
      /> */}

      <div
        className="flex flex-col"
        style={{
          animation: `verticalLoop ${duration} linear infinite ${
            direction === "reverse" ? "reverse" : "normal"
          }`,
        }}
      >
        {/* Original set of children */}
        {children}

        {/* Duplicated content for seamless looping */}
        {children}
      </div>
    </div>
  );
}

// Tag Component
function Tag({ text }) {
  return (
    <>
      <div className="min-h-[240px] w-[192px] gap-1 text-slate-200 text-sm rounded-md py-3 px-4 mb-4 shadow-md relative flex flex-col justify-center ">
        <img
          src="/assets/frontend_assets/scroll-card-logo.png"
          alt=""
          className="w-12 h-12 object-contain"
        />
        <img
          src="/assets/frontend_assets/scroll-card-bg.png"
          alt=""
          className="absolute top-0 left-0 w-full h-full -z-1"
        />
        <div className="mt-10 py-3 px-2">
          <p className="font-light inter text-[15.13px] tracking-[-0.24px] uppercase">
            {" "}
            {text}
          </p>
          <p className="inter font-light text-[13.45px] tracking-[0.14px] text-[#818688] mt-2">
            White-hat hackers to test our platform.
          </p>
        </div>
      </div>
    </>
  );
}
