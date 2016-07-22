const initialState = {
  fetching: false,
  fetched: false,
  projects: [],
  error: null,

  show: true // shows the sidebar
}

export default function (state = initialState, action) {
    const name = 'FETCH_PROJECTS'
    switch (action.type) {
        case name+ '_PENDING':
            return {...state,
                fetching: true
            }
        case name + '_FULFILLED':
            return {...state,
                fetching: false,
                fetched: true,
                projects: action.payload.data,
            }
        case name + '_REJECTED':
            return {...state,
                fetching: false,
                error: action.payload
            }

        case 'TOGGLE_SIDEBAR':
            return {...state,
                show: action.payload || !state.show
            }
        default:
            return state;
    }
}
