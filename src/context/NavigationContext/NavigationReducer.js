export function reducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENTROUTE':
      state.CurrentRoute = action.payload;
      return {...state};

    case 'SET_SHOULDRELOADDATA':
      state.ShouldReloadData = action.payload;
      return {...state};

    default:
      return state;
  }
}
