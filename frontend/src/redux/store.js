import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import breadcrumbsReducer from './reducers/breadCrumbsLinks';
import directoryReducer from './reducers/directory';
import errorReducer from './reducers/error';
import setContentReducer from './reducers/setContent';
import setDirectoryReducer from './reducers/setDirectory';
import setIsLastReducer from './reducers/setIsLastDir';
import themeReducer from './reducers/theme';
import userReducer from './reducers/userReducer';
import rootSaga from './saga/rootSaga';

const sagaMiddleware = createSagaMiddleware();
const preloadedState = window.localStorage.getItem('redux') ?? '{}';

const store = createStore(combineReducers({
  directories: directoryReducer,
  error: errorReducer,
  currentDirectory: setDirectoryReducer,
  breadcrumbs: breadcrumbsReducer,
  isLastDir: setIsLastReducer,
  contents: setContentReducer,
  user: userReducer,
  theme: themeReducer,
}),
JSON.parse(preloadedState),
composeWithDevTools(
  applyMiddleware(
    sagaMiddleware,
  ),
));

sagaMiddleware.run(rootSaga);

store.subscribe(() => {
  window.localStorage.setItem('redux', JSON.stringify(store.getState()));
});

export default store;
