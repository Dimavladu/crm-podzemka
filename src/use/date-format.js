import moment from 'moment'

export function useDateFormat(task){
    moment.defaultFormat = "YYYY-MM-DD, HH:mm"

    const dateNow = moment(new Date(), moment.defaultFormat)
    const date = moment(task.date, moment.defaultFormat)
    const fullDate = task.date
    let dateString = ''

    if((date.diff(dateNow)) > 0){
        const remainingDate = {}

        if (date.diff(dateNow, 'days') >= 1) {
            const mDate = date.diff(dateNow, 'days', 'hours')
            remainingDate.days = Math.floor(mDate)
            remainingDate.hours = Math.floor((mDate % 1) * 24 )
        }
        else if(date.diff(dateNow, 'hours') >= 1){
            remainingDate.hours = date.diff(dateNow, 'hours')
        }
        remainingDate.minutes = Math.floor((date.diff(dateNow, 'hours', 'minutes') % 1 ) * 60)

        dateString = `${remainingDate.minutes} м`

        if (remainingDate.days) dateString = `${remainingDate.days} д ${remainingDate.hours} ч ${remainingDate.minutes} м`
        else if (remainingDate.hours) dateString = `${remainingDate.hours} ч ${remainingDate.minutes} м`


        if (task.comment === null) comment = ''

        task.date = {fullDate, remainingDate, dateString}
    }
    else {
        dateString = 'Время истекло'
        task.date = {fullDate, dateString}
    }

    return task
}