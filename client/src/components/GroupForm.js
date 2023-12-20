import { Flex, Textarea, Spacer, ButtonGroup, Button, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Box, Heading, FormControl, FormLabel,
    Input, FormErrorMessage, Alert, AlertIcon, AlertTitle, Select, VStack, Image, HStack,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,  } from '@chakra-ui/react'
import { Field, Form, Formik} from 'formik'
import * as yup from 'yup'
import { useState } from 'react'
import { useOutletContext, useNavigate, NavLink } from 'react-router-dom'
import UploadWidget from './UploadWidget'


function GroupForm({user, setUser, isOpen, onClose, setMyGroups, setGroups}){
    const [groupError, setGroupError] = useState(false)
    const [thumbnail, setThumbnail] = useState('')
    

    const nav = useNavigate()

    const eventSchema = yup.object().shape({
        name: yup.string().max(15, 'Group name must be 15 characters or less').required('Group name is required!'),
        description: yup.string().required('Description is required!')
    })

    return (
        <Modal scrollBehavior='inside' isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                    <ModalHeader m={3} size='lg' align='center'>Create a  Group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                    <Formik
                        initialValues={{
                            name: '',
                            img_url: '',
                            description: ''
                        }}
                        validationSchema={eventSchema}
                        validateOnBlur={true}
                        validateOnChange={false}
                        onSubmit={(values, actions) => {
                            console.log(values)
                            values.img_url = thumbnail
                            console.log(values)
                            fetch('/groups', {
                                method: 'POST',
                                headers: {
                                    "Content-Type": 'application/json'
                                },
                                body: JSON.stringify(values)
                            }).then(resp => {
                                    if (resp.ok) {
                                        resp.json().then(( group ) => {
                                            console.log(group)
                                            fetch(`/usergroups`,{
                                                method: 'POST',
                                                headers: {
                                                    "Content-Type": 'application/json'
                                                },
                                                body: JSON.stringify({'user_id': user.id, 'group_id': group.id, 'admin':1})
                                            }).then(resp => {
                                            if (resp.ok) {
                                                resp.json().then((userGroup)=>{
                                                    console.log(userGroup)
                                                    setGroups(curr => [...curr, group])
                                                    setMyGroups(curr => [...curr, userGroup])
                                                    onClose()
                                                    setThumbnail('')
                                                    actions.setSubmitting(false)
                                                })
                                            }else{
                                                setGroupError(true)
                                                actions.setSubmitting(false)
                                            }
                                        })
                                    })
                                }else{
                                    setGroupError(true)
                                    actions.setSubmitting(false)
                                }
                            }
                            )
                        }}
                    >
                        {({ errors, isSubmitting, setSubmitting }) => (
                            <Form>
                                <Field name='name'>
                                    {({ field, form }) => (
                                        <FormControl marginBottom={2} isInvalid={form.errors.name && form.touched.name}>
                                            <FormLabel>Group Name</FormLabel>
                                            <Input minWidth={360} {...field}/>
                                            <FormErrorMessage as={Alert} status={'error'}>
                                                <AlertIcon />
                                                {errors.name}
                                            </FormErrorMessage>                                       
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='description'>
                                    {({ field, form }) => (
                                        <FormControl marginBottom={2} isInvalid={form.errors.description && form.touched.description}>
                                            <FormLabel>Event Description</FormLabel>
                                            <Textarea minWidth={360} {...field}/>
                                            <FormErrorMessage as={Alert} status={'error'}>
                                                <AlertIcon />
                                                {errors.description}
                                            </FormErrorMessage>                                       
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='img_url'>
                                    {({ field, form }) => (
                                        <FormControl marginBottom={2} isInvalid={form.errors.img_url && form.touched.img_url}>
                                            <Flex>
                                                <Spacer/>
                                                <VStack>
                                                    <HStack>
                                                        <FormLabel>Event Image:</FormLabel>
                                                        {thumbnail ? <Image src={thumbnail} maxWidth={'100px'}/>: null}
                                                    </HStack>
                                                    <UploadWidget setThumbnail={setThumbnail} values={form.values}/>
                                                </VStack>
                                                <Spacer/>
                                            </Flex>                                    
                                        </FormControl>
                                    )}
                                </Field>
                                <Flex marginTop={4}>
                                    <Spacer/>
                                        <Button type='submit' isLoading={isSubmitting}>Submit</Button>
                                    <Spacer/>
                                </Flex>
                                {groupError && <Alert marginTop={4} status='error'>
                                    <AlertIcon />
                                    <AlertTitle>Issue creating group</AlertTitle>
                                </Alert>
                                }
                            </Form> 
                        )}
                    </Formik>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default GroupForm