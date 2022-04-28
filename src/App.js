import "./App.css"
import UploadFile from "./components/UploadFile"

function App() {
  const handleOnChange = console.log
  return (
    <div className="App">
      <div>
        <UploadFile onChange={handleOnChange} multiple />
      </div>
    </div>
  );
}

export default App;
