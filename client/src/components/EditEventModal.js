import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Alert,
    AlertIcon,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Select,
    Textarea,
    ModalCloseButton,
    Input,
    Button
} from "@chakra-ui/react";
import { Field, Form, Formik} from 'formik'
import * as yup from 'yup'

function EditEventModal({isEditOpen, onEditClose, eventInfo, setEventInfo, setDate, setTicketsLeft, ticketsSold}){
    const URL = /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i

    const eventSchema = yup.object().shape({
        name: yup.string().max(15, 'Event name must be 15 characters or less').required('Event name is required!'),
        description: yup.string().required('Description is required!'),
        event_type_id: yup.number().required('Event Type is required!'),
        start_time: yup.date().required('Start Time is required!'),
        img_url: yup.string().matches(URL, 'Enter a valid url'),
        max_tickets: yup.number().integer().positive('Tickets Available must be a positive number').required('Tickets are required!').min(ticketsSold, 'Must have more tickets than sold!')
    })

    const today = new Date()
    const month = today.getMonth() + 1
    const hours = today.getHours()
    const minutes = today.getMinutes()
    const todayString = `${today.getFullYear()}-${month}-${today.getDate()}T00:00`


    return(

    <Modal isOpen={isEditOpen} onClose={onEditClose} isCentered>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Edit {eventInfo.name}</ModalHeader>
            <ModalCloseButton/>
            <ModalBody pb={6}>
                <Formik
                    initialValues={{
                        name: eventInfo['name'],
                        img_url: eventInfo['img_url'],
                        description: eventInfo['description'],
                        event_type_id: eventInfo['event_type_id'],
                        start_time: eventInfo['start_time'],
                        max_tickets: eventInfo['max_tickets']
                    }}
                    validationSchema={eventSchema}
                    validateOnBlur={true}
                    validateOnChange={false}
                    onSubmit={values => {
                        console.log(values)
                        fetch(`/events/${eventInfo['id']}`,{
                            method: 'PATCH',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(values)
                        }).then(resp => {
                            if (resp.ok){
                                resp.json().then(event => {
                                    setEventInfo(event)
                                    setDate(new Date(event.start_time))
                                    const ticketList = event.registrations.map(r => r.tickets)
                                    const ticketsSold = ticketList.reduce((a,b) => a+b,0)
                                    setTicketsLeft(event.max_tickets - ticketsSold)
                                    onEditClose()
                                })
                            }
                        })
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
                                <Field name='img_url'>
                                    {({ field, form }) => (
                                        <FormControl marginBottom={2} isInvalid={form.errors.img_url && form.touched.img_url}>
                                            <FormLabel>Image Url</FormLabel>
                                            <Input {...field}/>
                                            <FormErrorMessage as={Alert} status={'error'}>
                                                <AlertIcon />
                                                {errors.img_url}
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
                                <ModalFooter>
                                    <Button type='submit' colorScheme='blue' mr={3}>
                                        Edit
                                    </Button>
                                    <Button onClick={onEditClose}>Cancel</Button>
                                </ModalFooter>
                            </Form>)}
                    </Formik>
            </ModalBody>
        </ModalContent>
    </Modal>
    )
}

export default EditEventModal