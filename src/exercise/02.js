// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(key, initialValue = '', {
  serialize = JSON.stringify,
  deserialize = JSON.parse,} = {}
  ) {
  const [value, setValue] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  const preKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = preKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    preKeyRef.current = key
    window.localStorage.setItem(key, serialize(value));
  }, [key, serialize, value])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
