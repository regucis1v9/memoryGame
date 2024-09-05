const initialState = {
    gameState: 'inactive'
};

const gameStateReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_GAME_STATE':
            return {
                ...state,
                gameState: action.payload
            };
        default:
            return state;
    }
};

export default gameStateReducer;
