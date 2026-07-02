export default function ActionModal({
  title,
  messageInfo,
  setModalOpen,
  setCurrentPage,
  resetHistory
}: {
  title: string
  messageInfo: string
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentPage: (value: React.SetStateAction<number>) => void
  resetHistory: () => Promise<void>
}) {
  return (
    <>
      <section className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-opacity-60 opacity-100 backdrop-blur-sm transition-opacity duration-300">
        <div className="relative m-4 p-6 w-2/5 min-w-[320px] max-w-[90%] rounded-lg bg-white shadow-lg text-black">
          <h3 className="text-xl font-bold mb-2 text-slate-800">
            {title}
          </h3>
          <div className="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
            <p className="text-xl text-slate-600 font-light">
              {messageInfo}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
            <button
              className="rounded-md border border-transparent cursor-pointer py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={() => setModalOpen((prev) => !prev)}
            >
              Cancel
            </button>
            <button
              className="rounded-md cursor-pointer bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
              type="button"
              onClick={() => {
                setCurrentPage(1)
                setModalOpen((prev) => !prev)
                resetHistory()
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
