import { useToast } from "vue-toastification"

export function useNotif(task){
    const toast = useToast()
        // if (task.date.remainingDate?.hours === 1 ||
        //     (task.date.remainingDate?.minutes === 5 && !task.date.remainingDate.hours)){
        //     toast.warning(`${task.name} ${task.date.dateString}`)
        // }
    if (task.date.remainingDate?.minutes){
        toast.warning(`${task.name} ${task.date.dateString}`)
    }
}