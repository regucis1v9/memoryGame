const initialState = {
    gems: 0
};

const gemReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_GEMS':
            return {
                ...state,
                gems: action.payload
            };
        default:
            return state;
    }
};

export default gemReducer;
