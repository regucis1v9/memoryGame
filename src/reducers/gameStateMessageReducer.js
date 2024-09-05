const initialState = {
    gameStateMessage: ''
};

const gameStateMessageReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_GAME_STATE_MESSAGE':
            return {
                ...state,
                gameStateMessage: action.payload
            };
        default:
            return state;
    }
};

export default gameStateMessageReducer;
