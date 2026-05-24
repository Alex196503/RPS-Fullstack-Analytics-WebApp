//Ignore this file, it's just a component for the winner glow effect. It is used in the GameDuel component to create a glowing effect around the winner's badge.
export const WinnerGlow = () => {
  return (
    <>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1] pointer-events-none w-0 h-0 flex items-center justify-center">
        <div className="absolute w-[280px] h-[280px] md:w-[420px] md:h-[420px] rounded-full bg-white/[0.04] animate-pulse" />
        <div className="absolute w-[210px] h-[210px] md:w-[320px] md:h-[320px] rounded-full bg-white/[0.05]" />
        <div className="absolute w-[150px] h-[150px] md:w-[230px] md:h-[230px] rounded-full bg-white/[0.06]" />
      </div>
    </>
  )
}
