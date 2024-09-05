const initialState = {
    background: ""
};

const backgroundReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_BACKGROUND':
            return {
                ...state,
                background: action.payload
            };
        default:
            return state;
    }
};

export default backgroundReducer;
