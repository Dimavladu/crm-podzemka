import * as yup from 'yup'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import {useField, useForm} from 'vee-validate'

export function useMeetUpdate(fn){
    const {handleSubmit, isSubmitting} = useForm()

    const {value: name} = useField('name', yup.string())
    const {value: format} = useField('format', yup.string())
    const {value: dateStart} = useField('dateStart')
    const {value: dateEnd} = useField('dateEnd')
    const {value: choice} = useField('choice')
    const {value: prePaid} = useField('prePaid', yup.string())
    const {value: cost} = useField('cost', yup.string())
    const {value: people} = useField('people', yup.string())
    const {value: comment} = useField('comment', yup.string())
    const {value: contract} = useField('contract', yup.string())
    const {value: color} = useField('color', yup.string())
    const onSubmit = handleSubmit(fn)

    return{
        name, format, dateStart, dateEnd, choice, prePaid, cost, people, comment, contract, vcolor, onSubmit
    }
}