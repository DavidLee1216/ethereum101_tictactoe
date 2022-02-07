import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import FundPage from "./pages/fund";
import "./App.css";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducer from "./store/reducers";

const store = createStore(reducer);

function App() {
  return (
    <Provider store={store}>
      <main className="m-auto">
        <BrowserRouter>
          <Routes>
            <Route path="/charge" element={<FundPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </main>
    </Provider>
  );
}

export default App;
