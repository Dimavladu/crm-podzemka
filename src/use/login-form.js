import {computed, watch} from 'vue'
import * as yup from 'yup'
import {useField, useForm} from 'vee-validate'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

export function useLoginForm() {
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
    const MIN_LENGTH = 8

    const {value: password, errorMessage: pError, handleBlur: pBlur } = useField(
        'password',
        yup
            .string()
            .trim()
            .required('Введите пароль')
            .min(MIN_LENGTH, `Пароль не может быть короче ${MIN_LENGTH} символов`)
    )

    const isToManyAttempts = computed(() => submitCount.value >= 3)

    watch(isToManyAttempts, val => {
        if (val) {
            setTimeout(() => submitCount.value = 0, 15000)
        }
    })

    const onSubmit = handleSubmit(async values  => {
        try{
            await store.dispatch('auth/login', values)
            let page = ''
            if ( store.state.auth.admin ) page = 'usersAdmin'
            else if( store.state.auth.admin === false ) page = 'calendar'
            router.push({name: page})
        }catch(e){
            console.dir(e)
        }
    })

    return{
        email, password,
        eError, pError,
        eBlur, pBlur,
        onSubmit, isSubmitting,
        isToManyAttempts
    }

}