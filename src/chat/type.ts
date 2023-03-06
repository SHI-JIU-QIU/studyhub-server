export interface Online {
    userId: string,
    socketId: string
}


export interface Message {
    text: string,
    image: string,
    fromId: string,
    toId: string,
}