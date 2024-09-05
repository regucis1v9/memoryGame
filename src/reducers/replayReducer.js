// reducers/scoreReducer.js
const initialState = {
    replay: 0 // Initial score value
  };
  
  const replayReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_REPLAY':
        return {
          ...state,
          replay: action.payload // Update score with new value
        };
      default:
        return state;
    }
  };
  
  export default replayReducer;
  