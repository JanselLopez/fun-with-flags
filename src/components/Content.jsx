import { useState } from "react"
import FilterNav from "./FilterNav"
import FlagPanel from "./FlagPanel"

const Content =()=>{
    const [name,setName] = useState('')
    const [region,setRegion] = useState('')
    return (
        <>
        <FilterNav info={{name,setName,region,setRegion}}></FilterNav>
        <FlagPanel name={name} region={region}></FlagPanel>
        </>
    )
}

export default Content