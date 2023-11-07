import { useEffect, useState } from "react"
import countryService from "../services/countryService"

export const useCountry = (name) => {
    const [found, setFound] = useState(null)
    const [data, setData] = useState(null)

    useEffect(() => {
        if(name){
            console.log('haetaan:', name)
            countryService
            .getSingle(name)
            .then(result => {
                setData(result)
                setFound(true)
            })
            .catch((error) => {
                setFound(false)
            }
            )
        }
    }, [name])

    return {
        found,
        data
    }
}

export const useField = (type) => {
    const [value, setValue] = useState('')
  
    const onChange = (event) => {
      setValue(event.target.value)
    }
  
    return {
      type,
      value,
      onChange
    }
  }