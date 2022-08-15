import moment from 'moment'
import {useStore} from 'vuex'

const store = useStore()
export async function getCurrentTime(oldTime, timeNow){
    const old = moment(oldTime)
    const now = moment(timeNow)

    const diff = (now.diff(old))/(1000*60)
    return diff
}