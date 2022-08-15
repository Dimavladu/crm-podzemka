import * as yup from 'yup'
import {useStore} from 'vuex'
import {useField, useForm} from 'vee-validate'

export function useClientForm(fn){
    const store = useStore()

    const {handleSubmit, isSubmitting, submitCount} = useForm()

    const {value: name, errorMessage: nError, handleBlur: nBlur} = useField(
        'name',
        yup
            .string()
            .trim()
            .required('Введите имя')
    )
    const {value: payInfo, errorMessage: iError, handleBlur: iBlur} = useField(
        'payInfo',
        yup
            .string()
            .required('Введите реквизиты')
    )
    const {value: email, errorMessage: eError, handleBlur: eBlur} = useField(
        'email',
        yup
            .string()
            .trim()
            .required('Введите e-mail')
            .email('Необходимо ввести корректный e-mail')
    )
    const {value: phone, errorMessage: pError, handleBlur: pBlur} = useField(
        'phone',
        yup
            .string()
            .trim()
            .required('Введите телефон')

    )
    const onSubmit = handleSubmit(fn)

    return{
        name, nError, nBlur,
        payInfo, iError, iBlur,
        email, eError, eBlur,
        phone, pError, pBlur,
        onSubmit
    }
}