import { useOutletContext } from "react-router-dom"

function MyProfile(){
    const {user} = useOutletContext()
    return(
        <p>{user.first_name} {user.last_name}'s Profile</p>
    )
}

export default MyProfile

