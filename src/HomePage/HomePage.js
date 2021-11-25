import { NavLink } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <h1>Performance Studio Dziennik</h1>
      <h2>Zaloguj się żeby korzystać</h2>
      <NavLink to="/login">Zaloguj Się</NavLink>
    </div>
  );
}
