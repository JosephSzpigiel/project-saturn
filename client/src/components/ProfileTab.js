import { Avatar, Text, Divider, Flex, Spacer, ButtonGroup, Button, Box, Heading, FormControl, FormLabel, Input, FormErrorMessage, Alert, AlertIcon, AlertTitle, HStack, VStack, Image  } from '@chakra-ui/react'
import { Field, Form, Formik} from 'formik'
import * as yup from 'yup'
import { useState } from 'react'
import UploadWidget from './UploadWidget'

function ProfileTab({user, setUser}){

    const [loginError, setLoginError] = useState(false)
    const [editSuccess, setEditSuccess] = useState(false)
    const [thumbnail, setThumbnail] = useState(user.img_url)

    const URL = /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i

    const signupSchema = yup.object().shape({
        first_name: yup.string().max(15, 'First name must be 15 characters or less').required('First name is required!'),
        last_name: yup.string().max(15, 'Last name must be 15 characters or less').required('Last name is required!'),
        email: yup.string().email('Invalid email').required('Email is required!'),
        img_url: yup.string().matches(URL, 'Enter a valid url')
    })

    return(
        <Box width='1fr'>
            <Flex>
                <Flex direction='column'>
                    <Formik
                        initialValues={{
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            img_url: user.img_url,
                        }}
                        validationSchema= {signupSchema}
                        validateOnBlur={true}
                        validateOnChange={false}
                        onSubmit={(values, actions) => {
                            setEditSuccess(false)
                            fetch(`/users/${user.id}`, {
                                method: 'PATCH',
                                headers: {
                                    "Content-Type": 'application/json'
                                },
                                body: JSON.stringify(values)
                            }).then((resp) => {
                                if (resp.ok) {
                                    resp.json().then((user) => {
                                        console.log(user)
                                        setUser(user)
                                        setEditSuccess(true)
                                        actions.setSubmitting(false)
                                        // navigate into site
                                    })
                                } else { 
                                    actions.setSubmitting(false)
                                    setLoginError(true)
                                }
                            })
                        }}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form>
                                <Field name='first_name'>
                                    {({ field, form }) => (
                                        <FormControl marginBottom={2} isInvalid={form.errors.first_name && form.touched.first_name}>
                                            <FormLabel>First Name</FormLabel>
                                            <Input {...field}/>
                                            <FormErrorMessage as={Alert} status={'error'}>
                                                <AlertIcon />
                                                {errors.first_name}
                                            </FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='last_name'>
                                    {({ field, form }) => (
                                        <FormControl marginBottom={2} isInvalid={form.errors.last_name && form.touched.last_name}>
                                            <FormLabel>Last Name</FormLabel>
                                            <Input {...field}/>
                                            <FormErrorMessage as={Alert} status={'error'}>
                                                <AlertIcon />
                                                {errors.last_name}
                                            </FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='email'>
                                    {({ field, form }) => (
                                        <FormControl marginBottom={2} isInvalid={form.errors.email && form.touched.email}>
                                            <FormLabel>Email</FormLabel>
                                            <Input type='email' {...field}/>
                                            <FormErrorMessage as={Alert} status={'error'}>
                                                <AlertIcon />
                                                {errors.email}
                                            </FormErrorMessage>                                        
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='img_url'>
                                    {({ field, form }) => (
                                        <Flex>
                                            <Spacer/>
                                            <VStack>
                                                {thumbnail ?
                                                <HStack>
                                                    <FormLabel>Profile Picture</FormLabel>
                                                    <Image src={thumbnail} maxWidth={'100px'}/>
                                                </HStack>: null}
                                                <UploadWidget setThumbnail={setThumbnail} values={form.values}/>
                                            </VStack>
                                            <Spacer/>
                                        </Flex>
                                        // <FormControl marginBottom={2} isInvalid={form.errors.img_url && form.touched.img_url}>
                                        //     <FormLabel>Image Url</FormLabel>
                                        //     <Input {...field}/>
                                        //     <FormErrorMessage as={Alert} status={'error'}>
                                        //         <AlertIcon />
                                        //         {errors.img_url}
                                        //     </FormErrorMessage>                                          
                                        // </FormControl>
                                    )}
                                </Field>
                                <Flex marginTop={4}>
                                    <Spacer/>
                                    <Button type='submit' isLoading={isSubmitting}>Submit</Button>
                                    <Spacer/>
                                </Flex>
                                {loginError && <Alert marginTop={4} status='error'>
                                    <AlertIcon />
                                    <AlertTitle> 'Error updating profile' </AlertTitle>
                                </Alert>}
                                {editSuccess && <Alert marginTop={4} status='success'>
                                    <AlertIcon />
                                    <AlertTitle> 'Profile Successfully Updated!' </AlertTitle>
                                </Alert>}
                            </Form> 
                        )}
                    </Formik>
                    
                </Flex>
            <Spacer/>
        </Flex>
        </Box>
    )

}

export default ProfileTab