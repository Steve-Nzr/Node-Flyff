module.exports = (socket, PacketMaker, param) => {
    PacketMaker.writeInt32(param.time)
    PacketMaker.Finish(socket)
}
