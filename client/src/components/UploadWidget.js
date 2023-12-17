import { useEffect, useRef } from "react"
import { Button } from "@chakra-ui/react"

function UploadWidget({setThumbnail, values}){
    const cloudinaryRef = useRef()
    const widgetRef = useRef()
    useEffect(()=> {
        cloudinaryRef.current = window.cloudinary
        widgetRef.current  = cloudinaryRef.current.createUploadWidget({
            cloudName: 'dtzlah962',
            uploadPreset: 'buueotg4'
        }, function(error, result){
            if (!error && result && result.event === "success") {
                console.log("Done! Here is the image info: ", result.info);
                setThumbnail(result.info.url)
                values.img_url = result.info.url
                console.log(values)
            }
        })
    }, [])
    return(
        <Button onClick={() => widgetRef.current.open()}>
            Upload Image
        </Button>
    )
}


export default UploadWidget