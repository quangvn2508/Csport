import Routes from './Routes';
import Navigation from './Components/Navbar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/configStore';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div>
          <Navigation />
          <Routes />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
