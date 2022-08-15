import {computed, watch} from 'vue'
import * as yup from 'yup'
import {useField, useForm} from 'vee-validate'
import {useStore} from 'vuex'

export function useForgetForm() {
    const store = useStore()
    const {handleSubmit, isSubmitting, submitCount} = useForm()

    const {value: email, errorMessage:eError, handleBlur:eBlur} = useField(
        'email',
        yup
            .string()
            .trim()
            .required('Введите e-mail')
            .email('Необходимо ввести корректный e-mail')
    )

    const isToManyAttempts = computed(() => submitCount.value >= 3)

    watch(isToManyAttempts, val => {
        if (val) {
            setTimeout(() => submitCount.value = 0, 15000)
        }
    })

    const onSubmit = handleSubmit(async email  => {
        await store.dispatch('auth/forgetPassword', email)
    })

    return{
        email, eError, eBlur,
        onSubmit, isSubmitting,
    }

}