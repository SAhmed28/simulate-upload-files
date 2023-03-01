import './App.css';
import UploadComponent from './components/UploadComponents/UploadComponents';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div>
      <UploadComponent></UploadComponent>
      <Toaster />
    </div>
  );
}

export default App;
