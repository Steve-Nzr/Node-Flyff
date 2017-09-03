import {PacketReader, PacketWriter, PACKET_HEADER} from '../../PacketManager/PacketManager'
import {List} from './List'

let PacketHandler = class PackerReader extends PacketReader {
    constructor(private readonly socket, packet: Buffer) {
        super(packet)
        this.UnSerialize()
        this.Handle()
    }

    private UnSerialize() {
        if (this.readByte() !== PACKET_HEADER) {
            console.log("Not a valid packet header")
            return -1;
        }

        this.readInt32() // Checksum
        let length = this.readInt32()
        if (length < this.packet.length - 13) {
            console.log("Invalid packet size..")
            return -1;
        }
        this.readInt32() // Other
    }

    private Handle() {
        let Assoc = List.Association("Incoming", this.readInt32())
        if (Assoc && Assoc.Func) {
            Assoc.Func(this.socket, this)
        }
    }
}

export {PacketHandler}
