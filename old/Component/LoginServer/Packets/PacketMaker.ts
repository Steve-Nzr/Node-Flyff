import {PacketReader, PacketWriter, PACKET_HEADER} from '../../PacketManager/PacketManager'
import {List} from './List'

export class PacketMaker extends PacketWriter {
    constructor(private readonly socket, name: string, param: any) {
        super(List.AssociationByName("Outgoing", name).Protocol);
        this.Serialize()
        this.Send(param)
    }

    private Send(param: any) {
        let Assoc = List.Association("Outgoing", this.protocol)
        if (Assoc && Assoc.Func) {
            Assoc.Func(this.socket, this, param)
        }
    }

    public Finish(socket) {
        this.finish()
        socket.write(this.getPacket());
    }
}

export function Send(name: string, socket, param: any = {}) {
    new PacketMaker(socket, name, param)
}
