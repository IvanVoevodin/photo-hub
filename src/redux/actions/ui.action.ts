import { Dispatch } from "redux";
import { CLEAR_ERRORS, ClearErrorsAction } from "../redux.constant";

const clearErrors = (dispatch: Dispatch<ClearErrorsAction>) => {
    dispatch({type: CLEAR_ERRORS});
};

export default clearErrors
