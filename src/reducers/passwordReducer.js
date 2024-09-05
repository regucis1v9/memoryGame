const initialState = {
    password: 'locked' // Initialize with false to hide the overlay initially
};

const passwordReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_PASSWORD':
            return {
                ...state,
                password: action.payload
            };
        default:
            return state;
    }
};

export default passwordReducer;