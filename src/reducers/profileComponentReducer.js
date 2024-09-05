// reducers/scoreReducer.js
const initialState = {
    profileComponent: "profile" // Initial score value
  };
  
  const profileComponentReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_PROFILE_COMPONENT':
        return {
          ...state,
          profileComponent: action.payload // Update score with new value
        };
      default:
        return state;
    }
  };
  
  export default profileComponentReducer;
  