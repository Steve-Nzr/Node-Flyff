module.exports = (socket, PacketMaker) => {
    PacketMaker.writeInt32(PacketMaker.protocol)
    PacketMaker.writeInt32(1)
    PacketMaker.finish()
    socket.write(PacketMaker.getPacket());
}
