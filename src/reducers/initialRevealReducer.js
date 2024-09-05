// reducers/scoreReducer.js
const initialState = {
    initialReveal: true // Initial score value
  };
  
  const revealReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_INITIAL_REVEAL':
        return {
          ...state,
          initialReveal: action.payload // Update score with new value
        };
      default:
        return state;
    }
  };
  
  export default revealReducer;
  