const initialState = {
    rank: ""
};

const rankReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_RANK':
            return {
                ...state,
                rank: action.payload
            };
        default:
            return state;
    }
};

export default rankReducer;
