import { useState } from "react"

export const useField = (type) => {
    const [value, setValue] = useState('')
  
    const onChange = (event) => {
      setValue(event.target.value)
    }

    //Nimetty onReset varoituksen välttämiseksi input komponentin kanssa
    const onReset = (event) => {
        setValue('')
    }
  
    return {
      type,
      value,
      onChange,
      onReset
    }
  }