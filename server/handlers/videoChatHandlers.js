module.exports = (io, socket) => {

    const sending = (payload) => {
        io.to(payload.userToSignal).emit('user joined', {signal: payload.signal, callerID: payload.callerID});
    }

    const returning = (payload) => {
        io.to(payload.callerID).emit('receiving returned signal', {signal: payload.signal, id: socket.userId});
    }

    socket.on('sending signal', sending)
    socket.on('returning signal', returning)
}
