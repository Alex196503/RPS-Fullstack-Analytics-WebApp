import {
  type RouteConfig,
  index,
  layout,
  route
} from "@react-router/dev/routes"

export default [
  index("./routes/home.tsx"),
  layout("./layouts/HeaderLayout.tsx", [
    layout("./layouts/FooterLayout.tsx", [
      route("play/classic", "./custom-game/index.tsx"),
      route("play/advanced", "./advanced-game/index.tsx")
    ])
  ]),
  route("*", "./not-found-page/index.tsx")
] satisfies RouteConfig
