import {computed, watch} from 'vue'
import * as yup from 'yup'
import {useField, useForm} from 'vee-validate'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import moment from 'moment'

export function useRegisterForm() {
    const store = useStore()
    const router = useRouter()
    const {handleSubmit, isSubmitting, submitCount} = useForm()

    const {value: email, errorMessage:eError, handleBlur:eBlur} = useField(
        'email',
        yup
            .string()
            .trim()
            .required('Введите e-mail')
            .email('Необходимо ввести корректный e-mail')
    )
    const MIN_LENGTH_PASS = 8

    const {value: password, errorMessage: pError, handleBlur: pBlur } = useField(
        'password',
        yup
            .string()
            .trim()
            .required('Введите пароль')
            .min(MIN_LENGTH_PASS, `Пароль не может быть короче ${MIN_LENGTH_PASS} символов`)
    )
    const MIN_LENGTH_NAME = 2

    const {value: name, errorMessage: nError, handleBlur: nBlur } = useField(
        'name',
        yup
            .string()
            .trim()
            .required('Необходимо ввести имя')
            .min(MIN_LENGTH_NAME, `Имя не может быть короче ${MIN_LENGTH_NAME} символов`)
    )
    const {value: comment, handleBlur: сBlur } = useField(
        'comment',
        yup
            .string()
    )

    const onSubmit = handleSubmit(async values  => {
        try{
            values.date = moment().format("YYYY-MM-DD, HH:mm")

            await store.dispatch('auth/register', values)
            store.dispatch('setMessage', 'Вы успешно подали заявку, ожидайте подтверждения')
        }catch(e){
        }
    })

    return{
        email, password,
        eError, pError,
        eBlur, pBlur,
        name, nError, nBlur,
        comment, сBlur,
        onSubmit, isSubmitting,
    }

}