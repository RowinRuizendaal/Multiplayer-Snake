const socket = io()
const form = document.getElementById('chat-form')
let messages = document.querySelector('ul')
let input = document.querySelector('input')
const user = document.querySelectorAll('.user')

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



socket.on('message', (message) => {
    let element = document.createElement('li')
    element.textContent = message
    messages.appendChild(element)
    messages.scrollTop = messages.scrollHeight
})