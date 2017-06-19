import {PacketReader, PacketWriter, PACKET_HEADER} from '../../PacketManager/PacketManager'
import {List} from './List'

let PacketMaker = class PacketMaker extends PacketWriter {
    constructor(private readonly socket, protocol: number) {
        super(protocol);
        this.Serialize()
        this.Handle()
    }

    private Handle() {
        let Assoc = List.Association("Outgoing", this.protocol)
        if (Assoc && Assoc.Func) {
            Assoc.Func(this.socket, this)
        }
    }
}

export {PacketMaker}
