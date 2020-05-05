import thunk from "redux-thunk"
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import uiReducer from "./reducers/ui.reducer";
import userReducer from "./reducers/user.reducer";
import { ReducerStateProp } from "./redux.constant";
import dataReducer from "./reducers/data.reducer";

const initialState = {};
const middleware = [thunk];
const reducers = combineReducers<ReducerStateProp>({
    user: userReducer,
    ui: uiReducer,
    data: dataReducer
});

const store = createStore(reducers, initialState, composeWithDevTools(
    applyMiddleware(...middleware)
));

export default store
