import {List} from '../List'
import * as Packet from '../PacketMaker'

module.exports = (socket, PacketReader) => {
    let time = PacketReader.readInt32()
    Packet.Send("SendPong", socket, {time: time})
}
