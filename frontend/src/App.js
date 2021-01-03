import Routes from './Routes';
import Navigation from './Components/Navbar';
import { Provider } from 'react-redux';
import Notification from './Components/Notification';
import { createStore } from 'redux';
import reducer from './redux/reducers';

const store = createStore(reducer);
function App() {
  return (
    <Provider store={store}>
      <div>
        <Notification />
        <Navigation />
        <Routes />
      </div>
    </Provider>
  );
}

export default App;