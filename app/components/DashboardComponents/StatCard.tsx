export const StatCard = ({
  title,
  value = 0,
  unitOfMeasure
}: {
  title: string
  value: number | string
  unitOfMeasure?: string
}) => {
  return (
    <>
      <section className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-sm">
        <p className="text-sm text-slate-400 font-medium">{title}</p>
        <p className="text-3xl font-bold mt-2 text-indigo-400">
          {value} {unitOfMeasure}
        </p>
      </section>
    </>
  )
}
