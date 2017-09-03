import {IncomingPacketList, OutgoingPacketList} from "../List";
import * as I from "../../Interfaces/Interfaces";

const PACKET_HEADER = 0x5E;

abstract class BufferRead {
    private offset: number = 0;

    constructor(public packet: Buffer) {
    }

    public readByte(offset: number = this.offset): number {
        const result = this.packet.readUInt8(offset);

        if (offset === this.offset)
            this.offset += 1;

        return result;
    }

    public readBytes(count: number = 0, offset: number = this.offset): number[] {
        if (count <= 0)
            return null;

        const result: number[] = [];

        for (let i = 0; i < count; ++i, offset += 1)
        {
            result.push(this.packet.readUInt8(offset));

            if (offset + 1 === this.offset)
                this.offset += 1;
        }

        return result;
    }

    public readInt16(offset: number = this.offset): number {
        const result = this.packet.readUInt16LE(offset);

        if (offset === this.offset)
            this.offset += 2;

        return result;
    }

    public readInt32(offset: number = this.offset): number {
        const result = this.packet.readUInt32LE(offset);

        if (offset === this.offset)
            this.offset += 4;

        return result;
    }

    public readString(offset: number = this.offset): string {
        const length = this.readInt32(offset)

        offset += 4;
        let result = "";

        for (let i = 0; i < length; ++i, ++offset)
            result = result.concat(String.fromCharCode(this.readByte(offset)));

        return result;
    }
}

export class PackerReader extends BufferRead
{
    constructor(private readonly socket, packet: Buffer)
    {
        super(packet);

        this.UnSerialize();
        this.Handle();
    }

    private UnSerialize(): boolean
    {
        if (this.readByte() !== PACKET_HEADER)
        {
            console.error("Not a valid packet header");
            return false;
        }

        this.readInt32(); // Checksum

        const length = this.readInt32();
        if (length < this.packet.length - 13)
        {
            console.error("Invalid packet size..")
            return false;
        }

        this.readInt32(); // Other

        return true;
    }

    private Handle(): void
    {
        const packetType = IncomingPacketList.Instance().getByProtocol(this.readInt32());

        if (!packetType || !packetType.Func)
            return;

        packetType.Func(this.socket)
    }
}
