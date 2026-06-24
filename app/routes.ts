import {
  type RouteConfig,
  index,
  layout,
  route
} from "@react-router/dev/routes"

export default [
  index("./routes/home.tsx"),
  route("/register", "./register/index.tsx"),
  route("/login", "./login/index.tsx"),
  route("/logout", "./logout/index.tsx"),
  route("/profile", "./edit-profile/index.tsx"),
  route("/history", "./history/index.tsx"),
  route("/verify-email", "./verify-email/index.tsx"),
  layout("./layouts/HeaderLayout.tsx", [
    layout("./layouts/FooterLayout.tsx", [
      route("play/classic", "./custom-game/index.tsx"),
      route("play/advanced", "./advanced-game/index.tsx")
    ])
  ]),
  route("*", "./not-found-page/index.tsx")
] satisfies RouteConfig
