export const GET_LISTS_START = 'GET_LISTS_START';
export const GET_LISTS = 'GET_LISTS';
export const MOVE_CARD = 'MOVE_CARD';
export const MOVE_LIST = 'MOVE_LIST';
export const TOGGLE_DRAGGING = 'TOGGLE_DRAGGING';

export function getLists(quantity) {
  return dispatch => {
    dispatch({ type: GET_LISTS_START, quantity });
    setTimeout(() => {
      const lists = [];
      let count = 0;
      for (let i = 0; i < quantity; i++) {
        const cards = [];
        const randomQuantity = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
        for (let ic = 0; ic < randomQuantity; ic++) {
          cards.push({
            id: count,
            firstName: 'Scooby',
            lastName: 'Gooba',
            title: 'title'
          });
          count = count + 1;
        }
        lists.push({
          id: i,
          name: 'name',
          cards
        });
      }
      dispatch({ type: GET_LISTS, lists, isFetching: true });
    }, 1000); // fake delay
    dispatch({ type: GET_LISTS_START, isFetching: false });
  };
}

export function moveList(lastX, nextX) {
  return (dispatch) => {
    dispatch({ type: 'TASKS/MOVE_LIST', lastX, nextX });
  };
}

export function moveCard(lastX, lastY, nextX, nextY) {
  return (dispatch) => {
    dispatch({ type: 'TASKS/MOVE_TASK', lastX, lastY, nextX, nextY });
  };
}

export function toggleDragging(isDragging) {
  return (dispatch) => {
    dispatch({ type: 'TASKS/TOGGLE_DRAGGING', isDragging });
  };
}
