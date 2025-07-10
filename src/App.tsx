import Home from "./pages/Home";
import { TodoProvider } from "./store/TodoProvider";

function App() {
  return (
    <TodoProvider>
      <Home />
    </TodoProvider>
  );
}

export default App;
