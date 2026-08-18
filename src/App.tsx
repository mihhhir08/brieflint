import { Workbench } from "./app/Workbench.tsx";
import { Landing } from "./landing/Landing.tsx";

export default function App() {
  return window.location.pathname.startsWith("/app") ? <Workbench /> : <Landing />;
}
