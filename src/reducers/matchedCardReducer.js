const initialState = {
    matchedCards: []
};

const matchedCardReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_MATCHED_CARDS':
            return {
                ...state,
                matchedCards: action.payload
            };
        default:
            return state;
    }
};

export default matchedCardReducer;
