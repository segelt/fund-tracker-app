export function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_THEME':
      //Toggling State
      state.darkMode = !state.darkMode;
      return {...state};
    default:
      return state;
  }
}
