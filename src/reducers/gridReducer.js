const initialState = {
    grid: ""
};

const gridReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_GRID':
            return {
                ...state,
                grid: action.payload
            };
        default:
            return state;
    }
};

export default gridReducer;
