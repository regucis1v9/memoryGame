const initialState = {
    selectedCardIds: []
};

const selectedCardIdReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_SELECTED_CARD_ID':
            return {
                ...state,
                selectedCardIds: action.payload
            };
        default:
            return state;
    }
};

export default selectedCardIdReducer;
