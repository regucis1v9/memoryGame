const initialState = {
    flippedCards: []
};

const flippedCardReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_FLIPPED_CARDS':
            return {
                ...state,
                flippedCards: action.payload
            };
        default:
            return state;
    }
};

export default flippedCardReducer;
