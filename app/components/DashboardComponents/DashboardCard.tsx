import type { ReactNode } from "react"

export const DashboardCard = ({
  title,
  description,
  children,
  className = ""
}: {
  title: string
  description: string
  children: ReactNode
  className?: string
}) => {
  return (
    <>
      <section
        className={`bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm flex flex-col ${className}`}
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-100">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-slate-400">{description}</p>
          )}
        </div>
        <div className="flex-1 min-h-[260px] bg-slate-900/50 rounded-lg border border-dashed border-slate-600">
          {children}
        </div>
      </section>
    </>
  )
}
