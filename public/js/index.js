const socket = io()
const form = document.getElementById('chat-form')
let messages = document.querySelector('ul')
let input = document.querySelector('input')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (input.value) {
        socket.emit('message', input.value)
        input.value = ''
        input.focus()
    }
})



socket.on('message', (message) => {
    let element = document.createElement('li')
    element.textContent = message
    messages.appendChild(element)
    messages.scrollTop = messages.scrollHeight
})