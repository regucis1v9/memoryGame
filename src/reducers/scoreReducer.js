// reducers/scoreReducer.js
const initialState = {
    score: 0 // Initial score value
  };
  
  const scoreReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_SCORE':
        return {
          ...state,
          score: action.payload // Update score with new value
        };
      default:
        return state;
    }
  };
  
  export default scoreReducer;
  