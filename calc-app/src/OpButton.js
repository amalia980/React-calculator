import {ACTIONS} from './App';
import './App.css'

export default function OpButton ({dispatch, op}) {

return (
    <button onClick={() => dispatch({type: ACTIONS.CHOOSE_OP, payload: {op}})}>
        {op}
    </button>
    )
}

