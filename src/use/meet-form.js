import * as yup from 'yup'
import {useStore} from 'vuex'
import {useField, useForm} from 'vee-validate'

export function useMeetForm(fn){
    const {handleSubmit, isSubmitting} = useForm({
            initialValues:{ color: 'white' }
        }
    )
    const {value: name, errorMessage: nError, handleBlur: nBlur} = useField(
        'name', yup.string().required('Введите имя заказчика')
    )
    const {value: format, errorMessage: fError, handleBlur: fBlur} = useField(
        'format', yup.string().required('Введите формат мероприятия')
    )
    const {value: dateStart} = useField('dateStart')
    const {value: dateEnd} = useField('dateEnd')
    const {value: choice} = useField('choice')
    const {value: prePaid, errorMessage: preError, handleBlur: preBlur} = useField(
        'prePaid',
        yup.string().required('Введите предоплату').min(0, 'Предоплата не может быть меньше 0')
    )
    const {value: cost, errorMessage: cError, handleBlur: cBlur} = useField(
        'cost',
        yup.string().required('Введите общую сумму').min(0, 'Общая сумма не может быть меньше 0')
    )
    const {value: phone, errorMessage: phoneError, handleBlur: phoneBlur} = useField(
        'phone',
        yup.string().min(11, 'Введите номер телеофна, начиная с 7').max(11, 'Проверьте правильность номера')
    )
    const {value: people, errorMessage: pError, handleBlur: pBlur} = useField(
        'people',
        yup.string().required('Введите ожидаемое количество людей').min(0, 'Количество людей не может быть меньше 0')
    )
    const onSubmit = handleSubmit(fn)

    return{
        name, nError, nBlur,
        format, fError, fBlur,
        dateStart, dateEnd, choice,
        prePaid, preError, preBlur,
        cost, cError, cBlur,
        people, pError, pBlur,
        phone, phoneError, phoneBlur,
        onSubmit
    }
}
