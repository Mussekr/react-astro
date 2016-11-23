import Actions from '../constants/actions';
import Immutable from 'immutable';

const initialState = Immutable.Map({
    telescope: Immutable.List(),
    mount: Immutable.List(),
    imagingCamera: Immutable.List(),
    guideCamera: Immutable.List(),
    filter: Immutable.List(),
    misc: Immutable.List(),
    gearError: Immutable.List()
});

/* eslint-disable arrow-body-style */
export function reducer(state = initialState, action) {
    switch (action.type) {
    case Actions.GEAR_LIST:
        return action.gear.reduce((prevState, gearItem) => {
            return prevState.update(gearItem.gear_type, gearTypes => gearTypes.push(gearItem));
        }, initialState);
    case Actions.DELETE_GEAR_FAILED:
        return state.set('gearError', Immutable.List(action.error));
    case Actions.ADD_GEAR_FAILED:
        return state.set('gearError', Immutable.List(action.error));
    case Actions.IMAGE_GEAR_FAILED:
        return state.set('gearError', Immutable.List(action.error));
    default:
        return state;
    }
}

/* eslint-enable arrow-body-style */
