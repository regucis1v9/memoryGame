const initialState = {
    cardData: []
};

const cardDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_CARD_DATA':
            return {
                ...state,
                cardData: action.payload
            };
        default:
            return state;
    }
};

export default cardDataReducer;
