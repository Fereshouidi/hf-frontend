

export const effect_removeAccountFromSwitch = (element) => {
    element.style.backgroundColor = 'red';
    setTimeout(() => {
        element.style.backgroundColor = 'transparent';
    }, 100)
}

export const effect_dealingWithUser = (element) => {
    element.classList.add('likeClicked');
    setTimeout(() => {
        element.classList.remove('likeClicked');
    }, 100)
}
