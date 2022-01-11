import { useReducer } from 'react';
import './App.css';
import DigitButton from './DigitButton';
import OpButton from './OpButton';

 export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OP: 'choose-op',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}


function reducer (state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          curOp: payload.digit,
          overwrite: false,
        }
      }

      if (payload.digit === "0" && state.curOp === "0") { 
        return state
      }
      if (payload.digit === "." && state.curOp.includes(".")) {
        return state
      }

      return {
        ...state,
        curOp: `${state.curOp || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OP:
      if(state.curOp == null && state.prevOp == null) {
        return state
      }

      //if user accidently choose wrong operator before submit
      if (state.curOp == null) {
        return {
          ...state,
          op: payload.op,
        }
      }

      if (state.prevOp == null) {
        return {
          ...state,
          op: payload.op,
          prevOp: state.curOp,
          curOp: null,
        }
      }

      return {
        ...state,
        prevOp: evaluate(state),
        op: payload.op,
        curOp: null,
        }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          curOp: null,
        }
      }

      if (state.curOp == null) return state
      if (state.curOp === 1) {
        return { ...state, curOp: null}
      }

      return {
        ...state,
        curOp: state.curOp.slice(0, -1),
      }

    case ACTIONS.EVALUATE:
      if (
        state.op == null || 
        state.curOp == null || 
        state.prevOp == null
        ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        prevOp: null,
        op: null,
        curOp: evaluate(state)
      }
  }
}

function evaluate({curOp, prevOp, op}) {
 const prev = parseFloat(prevOp)
 const cur = parseFloat(curOp)
  if (isNaN(prev) || isNaN(cur)) return ""
  let sum = ""

  switch(op) {
    case "+":
      sum = prev + cur
      break
    case "-":
      sum = prev - cur
      break
    case "*":
      sum = prev * cur
      break
    case "÷":
      sum = prev / cur
  }
  return sum.toString();
}

const INT_FORMAT = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) return
  const [int, dec] = operand.split('.')
  if (dec == null) return INT_FORMAT.format(int)
  return `${INT_FORMAT.format(int)}.${dec}`
}

function App() {

  //op = operation, prev = previous, cur = current

  const [{curOp, prevOp, op}, dispatch] = useReducer(reducer, {})

  return (
    <div className="calc-grid">
      <div className='output'>
        <div className='prev-op'>
          {formatOperand(prevOp)} {op}
        </div>

        <div className='cur-op'>{formatOperand(curOp)}</div>
        </div>
      <button 
        className='span-2' 
        onClick={() => dispatch({type: ACTIONS.CLEAR})}
        >AC</button>

      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
        <OpButton op="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>
        <OpButton op="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
        <OpButton op="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
        <OpButton op="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch}/>
      <DigitButton digit="0" dispatch={dispatch}/>
      <button className='span-2' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
