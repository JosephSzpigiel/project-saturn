import { Flex, Textarea, Spacer, ButtonGroup, Button, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Box, Heading, FormControl, FormLabel, Input, FormErrorMessage, Alert, AlertIcon, AlertTitle, Select, VStack, Image, HStack  } from '@chakra-ui/react'
import { Field, Form, Formik} from 'formik'
import * as yup from 'yup'
import { useState } from 'react'
import { useOutletContext, useNavigate, NavLink } from 'react-router-dom'
import UploadWidget from './UploadWidget'

function EventForm(){
    const [eventError, setEventError] = useState(false)
    const [thumbnail, setThumbnail] = useState('')


    const {user, setUser, setEvents, setMyCreatedIds, myGroups, groups} = useOutletContext()

    const navigate = useNavigate()

    const URL = /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i

    const myGroupIds = myGroups.map(group => group.group_id)

    const activeGroups = groups.filter(group => {
        if(myGroupIds.includes(group.id)){
            return group
        }
    })

    const groupOptions = activeGroups.map(group => {
        return <option key={group.id} value={group.id}>{group.name}</option>
    })

    const eventSchema = yup.object().shape({
        name: yup.string().max(30, 'Event name must be 30 characters or less').required('Event name is required!'),
        description: yup.string().required('Description is required!'),
        event_type_id: yup.number().required('Event Type is required!'),
        start_time: yup.date().required('Start Time is required!'),
        // img_url: yup.string().matches(URL, 'Enter a valid url'),
        max_tickets: yup.number().integer().positive('Tickets Available must be a positive number').required('Tickets are required!'),
        group_id: yup.number().required('Group is required!')
    })

    const today = new Date()
    const month = today.getMonth() + 1
    const hours = today.getHours()
    const minutes = today.getMinutes()
    const todayString = `${today.getFullYear()}-${month}-${today.getDate()}T00:00`
    console.log(todayString)

    // const todayString = `${today.getFullYear()}-${month}-${today.getDate()}T${hours}:${minutes}`


    return (
        <>
        <Breadcrumb m='10px' fontWeight='medium' fontSize='lg'>
            <BreadcrumbItem>
                <BreadcrumbLink as={NavLink} to='/'>
                Home
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <BreadcrumbLink as={NavLink} to='/events'>
                Events
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>
                    Event Form
                </BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
        <Flex marginBottom={'10px'}>
            <Spacer/>
                <Flex direction='column'>
                    <Heading m={3} size='lg' align='center'>Create an Event</Heading>
                    <Formik
                        initialValues={{
                            name: '',
                            description: '',
                            created_by_id: user['id'],
                            event_type_id: '',
                            start_time: '',
                            max_tickets: '',
                            img_url: '',
                            group_id: ''
                        }}
                        validationSchema={eventSchema}
                        validateOnBlur={true}
                        validateOnChange={false}
                        onSubmit={values => {
                            console.log(values)
                            values.img_url = thumbnail
                            console.log(values)
                            fetch('/events', {
                                method: 'POST',
                                headers: {
                                    "Content-Type": 'application/json'
                                },
                                body: JSON.stringify(values)
                            }).then(resp => {
                                    if (resp.ok) {
                                        resp.json().then(({ event }) => {
                                            console.log(event)
                                            setEvents(curr => [...curr, event])
                                            setMyCreatedIds(curr =>  [...curr, event.id])
                                            navigate(`/events/${event.id}`, {state:{event}})
                                    })
                                }else{
                                    setEventError(true)
                                }
                            }

                            )
                            //Navigate to specific event page
                            // .then(resp => )
                        }}
                    >
                        {({ errors, isSubmitting }) => (
                            <Form>
                                <Field name='name'>
                                    {({ field, form }) => (
                                        <FormControl marginBottom={2} isInvalid={form.errors.name && form.touched.name}>
                                            <FormLabel>Event Name</FormLabel>
                                            <Input minWidth={360} {...field}/>
                                            <FormErrorMessage as={Alert} status={'error'}>
                                                <AlertIcon />
                                                {errors.name}
                                            </FormErrorMessage>                                       
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='start_time'>
                                    {({ field, form }) => (
                                        <FormControl marginBottom={2} isInvalid={form.errors.start_time && form.touched.start_time}>
                                            <FormLabel>Start Time</FormLabel>
                                            <Input type='datetime-local' min={todayString}{...field}/>
                                            <FormErrorMessage as={Alert} status={'error'}>
                                                <AlertIcon />
                                                {errors.start_time}
                                            </FormErrorMessage>                                        
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='description'>
                                    {({ field, form }) => (
                                        <FormControl marginBottom={2} isInvalid={form.errors.description && form.touched.description}>
                                            <FormLabel>Description</FormLabel>
                                            <Textarea {...field}/>
                                            <FormErrorMessage as={Alert} status={'error'}>
                                                <AlertIcon />
                                                {errors.description}
                                            </FormErrorMessage>                                        
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='event_type_id'>
                                    {({ field, form }) => (
                                        <FormControl marginBottom={2} isInvalid={form.errors.event_type_id && form.touched.event_type_id}>
                                            <FormLabel>Event Type</FormLabel>
                                            <Select {...field}>
                                                <option value='' disabled> Select option</option>
                                                <option value={1}>Movie</option>
                                                <option value={2}>Game</option>
                                                <option value={3}>Overnight</option>
                                                <option value={4}>Sport</option>
                                            </Select>
                                            <FormErrorMessage as={Alert} status={'error'}>
                                                <AlertIcon />
                                                {errors.event_type_id}
                                            </FormErrorMessage>                                        
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='group_id'>
                                    {({ field, form }) => (
                                        <FormControl marginBottom={2} isInvalid={form.errors.group_id && form.touched.group_id}>
                                            <FormLabel>Group</FormLabel>
                                            <Select {...field}>
                                                <option value='' disabled> Select option</option>
                                                {groupOptions}
                                            </Select>
                                            <FormErrorMessage as={Alert} status={'error'}>
                                                <AlertIcon />
                                                {errors.group_id}
                                            </FormErrorMessage>                                        
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='max_tickets'>
                                    {({ field, form }) => (
                                        <FormControl marginBottom={2} isInvalid={form.errors.max_tickets && form.touched.max_tickets}>
                                            <FormLabel>Tickets Available</FormLabel>
                                            <Input type='number' step="1" min="1" {...field}/>
                                            <FormErrorMessage as={Alert} status={'error'}>
                                                <AlertIcon />
                                                {errors.max_tickets}
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
                                {eventError && <Alert marginTop={4} status='error'>
                                    <AlertIcon />
                                    <AlertTitle>Issue creating Event</AlertTitle>
                                    setSubmitting(false)
                                </Alert>}
                            </Form> 
                        )}
                    </Formik>
                    
                </Flex>
            <Spacer/>
        </Flex>
        </>
    )
}

export default EventForm