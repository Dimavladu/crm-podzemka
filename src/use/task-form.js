import * as yup from 'yup'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import {useField, useForm} from 'vee-validate'

export function useTaskForm(fn){
    const {handleSubmit, isSubmitting} = useForm({
            initialValues:{
                status: 'Выполняется',
                color: 'yellow'
            }
        }
    )

    const {value: name, errorMessage: nError, handleBlur: nBlur} = useField(
        'name',
        yup
            .string()
            .required('Введите название задачи')
    )

    const {value: date, errorMessage: dError, handleBlur: dBlur} = useField(
        'date', yup.date().required('Выберите время задачи')
    )
    const {value: status} = useField('status')
    const {value: color} = useField('color')

    const {value: comment, handleBlur: cBlur} = useField('comment', yup.string())
    const onSubmit = handleSubmit(fn)

    return{
        name, nError, nBlur,
        date, dError, dBlur,
        comment, cBlur,
        status, color,
        onSubmit
    }
}