const socket = io.connect();



const render = (messages) => {
    const html = messages.map((element) =>{
        return(`
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>fotografía</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${element.title}</td>
                    <td class="ctr"> ${element.price}</td>
                    <td class="ctr"><img src="${element.thumbnail}"></td>
                </tr>
                </tbody>
        `)
    }).join(' ');
    document.getElementById('messages').innerHTML = html
}

const renderSaludo = () => {
    const html = () =>{
        return(`
            <p>hola ${username}</p>
        `)}
    document.getElementById('saludo').innerHTML = html
}

const addMessage = () => {
    const message = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    };
    socket.emit('new-message', message)
    return false
}

socket.on('messages', (messages) => {
    console.log(messages)
    render(messages)
})

const renderChat = (chats) => {
    const html = chats.map((element) =>{
        return(`
            <div class="msg">
                <strong>${element.author}</strong>
                <p style="color:Brown"> ${element.time}</p>
                <em>${element.text}</em>
            </div>
        `)
    }).join(' ');
    document.getElementById('chats').innerHTML = html
}
const addChat = () => {
    const chat = {
        author: document.getElementById('author').value,
        text: document.getElementById('text').value,
        time: new Date().toLocaleTimeString(),
    };
    socket.emit('new-chat', chat)
    return false
}


socket.on('chats', (chats) => {
    console.log(chats)
    renderChat(chats)
})
