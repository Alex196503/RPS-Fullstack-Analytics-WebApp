import { redirect } from "react-router"
import { type Route } from "../+types/root"
export async function action({ request }: Route.ActionArgs) {
  return redirect("/login", {
    headers: {
      "Set-Cookie":
        "token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"
    }
  })
}
