const socket = io()
const form = document.getElementById('chat-form')
const user = document.querySelectorAll('.user')

let messages = document.querySelector('ul')
let input = document.querySelector('input')

const onlineStatus = document.querySelector('header nav ul')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (input.value) {
        socket.emit('message', input.value)
        let element = document.createElement('li')
        element.classList.add('self')
        element.textContent = input.value
        messages.appendChild(element)
        messages.scrollTop = messages.scrollHeight
        input.value = ''
        input.focus()
    }
})




user.forEach((el) => {
    el.addEventListener('click', () => {
        socket.emit('joinRoom', el.dataset.id)

        while (messages.firstChild) {
            messages.removeChild(messages.firstChild)
        }
    })
})


socket.on('count', (data) => {
    onlineStatus.innerHTML = `${data} People are online`

})

socket.on('message', (message) => {
    let element = document.createElement('li')
    element.classList.add('other')
    element.textContent = message
    messages.appendChild(element)
    messages.scrollTop = messages.scrollHeight
})