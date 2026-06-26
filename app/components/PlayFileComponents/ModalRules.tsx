import IconClose from "../../images/icon-close.svg"
import { SVGModalImage } from "~/components/PlayFileComponents/SVGModalImageClassic"
import { SVGModalImageAdvanced } from "./SVGModalImageAdvanced"
import type { ModalProps } from "../../types/layout-types"

export const ModalRules = ({
  name,
  menu,
  setMenuOpen
}: ModalProps) => {
  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70">
      <div className="bg-white w-full h-full md:w-[400px] md:h-[400px] md:max-h-[90vh] md:rounded-lg p-4 flex flex-col md:justify-between items-center animate-fade-in shadow-[0_20px_50px_rgba(156,163,175,0.3)]">
        <section className="flex w-full justify-between items-center px-2 py-7">
          <h3 className="text-3xl tracking-wide text-gray-800 font-bold uppercase">
            {name}
          </h3>
          <img
            src={IconClose}
            className="w-4 h-4 object-cover cursor-pointer"
            alt="Image that closes the modal"
            onClick={() => setMenuOpen(false)}
          />
        </section>
        <section className="w-full flex-1 flex flex-col items-center justify-center p-4 min-h-0 overflow-hidden">
          <div className="w-full h-full max-h-[45vh] flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_svg]:max-w-full [&_svg]:max-h-full">
            {menu === "custom" ? (
              <SVGModalImage />
            ) : (
              <SVGModalImageAdvanced />
            )}
          </div>
        </section>
      </div>
    </section>
  )
}
