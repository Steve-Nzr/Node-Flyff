import {PacketMaker} from '../PacketMaker'

const servers = [
    {
        "id": 1,
        "name": "Serveur 1",
        "ip": "127.0.0.1",
        "channels": [
            {
                "id": 1,
                "serverId": 1,
                "name": "Canal 1",
                "ip": "127.0.0.1",
                "maxPlayer": 500
            }
        ]
    }
]

module.exports = (socket, PacketMaker: PacketMaker, param) => {
    PacketMaker.writeByte(1)
    PacketMaker.writeString(param.account)
    PacketMaker.writeInt32(servers.length)

    servers.forEach(server => {
        PacketMaker.writeInt32(-1)
        PacketMaker.writeInt32(server.id)
        PacketMaker.writeString(server.name)
        PacketMaker.writeString(server.ip)
        PacketMaker.writeInt32(0)
        PacketMaker.writeInt32(0)
        PacketMaker.writeInt32(1)
        PacketMaker.writeInt32(0)

        server.channels.forEach(channel => {
            PacketMaker.writeInt32(server.id)
            PacketMaker.writeInt32(channel.id)
            PacketMaker.writeString(channel.name)
            PacketMaker.writeString(channel.ip)
            PacketMaker.writeInt32(0)
            PacketMaker.writeInt32(0)
            PacketMaker.writeInt32(1)
            PacketMaker.writeInt32(channel.maxPlayer)
        })
    })
    PacketMaker.Finish(socket)
}
