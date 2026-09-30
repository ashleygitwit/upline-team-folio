import type { SceneProps } from "../App";

export default function LoginScene({ onNext }: SceneProps) {
  return (
    <div className="login-shell">
      <div className="card login-card">
        <img src="/upline-logo.png" alt="Upline" />
        <label className="login-field">
          <span>Email</span>
          <input defaultValue="stacey@stocktonhillins.com" readOnly />
        </label>
        <label className="login-field">
          <span>Password</span>
          <input type="password" defaultValue="••••••••" readOnly />
        </label>
        <button className="btn btn-primary btn-block btn-lg mt-20" onClick={onNext}>
          Log in
        </button>
      </div>
    </div>
  );
}
