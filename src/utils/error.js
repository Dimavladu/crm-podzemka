const ERROR_CODES = {
    EMAIL_NOT_FOUND: 'Пользователя с таким email не существует',
    INVALID_PASSWORD: 'Неверный пароль',
    EMAIL_EXISTS: 'Пользователь с таким email уже существует',
    auth: 'Пожалуйста, войдите в систему',
    incorrectConfirm: 'Пожалуйста, проверьте правильность ссылки с вашей почты',
    'Cannot convert undefined or null to object': 'Поле базы данных пустое',
    'TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.':
        'Слишком много попыток входа, попробуйте позже',
    adminWarning: 'Ошибка, проблема с доступом администратора!',
    'Cannot read property \'data\' of undefined': ''  // не работает из-за кавычек, хз почему
}

export function error(code) {
    if (ERROR_CODES[code]) return  ERROR_CODES[code]
    else {

        // return 'Неизвестная ошибка'
    }

}