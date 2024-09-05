const initialState = {
    time: 0
};

const timeReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_TIME':
            return {
                ...state,
                time: action.payload
            };
        default:
            return state;
    }
};

export default timeReducer;
