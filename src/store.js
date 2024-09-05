import { createStore} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'; // Import composeWithDevTools from redux-devtools-extension
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  composeWithDevTools() // This replaces your regular compose function
);

export default store;
