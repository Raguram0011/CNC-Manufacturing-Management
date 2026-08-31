import { LoginPage } from "./LoginPage"
import { ForgotPage } from "./ForgotPage"
import { ResetPage } from "./ResetPage"
import { SessionExpiredPage } from "./ErrorPages"
import type { Role } from "../config/navigation"

export type AuthView = "login" | "forgot" | "reset" | "session-expired"

interface Props {
  view: AuthView
  onNavigate: (view: AuthView) => void
  onLogin: (role: Role) => void
}

export function AuthRouter({ view, onNavigate, onLogin }: Props) {
  switch (view) {
    case "login":
      return (
        <LoginPage
          onLogin={onLogin}
          onForgotPassword={() => onNavigate("forgot")}
        />
      )
    case "forgot":
      return (
        <ForgotPage
          onBack={() => onNavigate("login")}
        />
      )
    case "reset":
      return (
        <ResetPage
          onBack={() => onNavigate("login")}
          onSuccess={() => onNavigate("login")}
        />
      )
    case "session-expired":
      return (
        <SessionExpiredPage
          onLogin={() => onNavigate("login")}
        />
      )
    default:
      return (
        <LoginPage
          onLogin={onLogin}
          onForgotPassword={() => onNavigate("forgot")}
        />
      )
  }
}
