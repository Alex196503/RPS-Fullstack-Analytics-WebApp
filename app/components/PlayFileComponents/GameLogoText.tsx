import type { TitleComponentsProps } from "../../types/layout-types"

export const TitleComponents = ({
  components
}: TitleComponentsProps) => {
  return (
    <>
      <section className="flex flex-col leading-none gap-y-0 max-w-1/2 py-3 px-2 mb-3">
        {components.map((component) => {
          return (
            <h1
              className="text-white text-3xl font-bold uppercase"
              key={component}
            >
              {component}
            </h1>
          )
        })}
      </section>
    </>
  )
}
