const PACKET_HEADER = 0x5E

let PacketReader = class PacketManager {
    private offset: number = 0

    constructor(public packet: Buffer) {
    }

    public readByte(offset: number = this.offset): number {
        let result = this.packet.readUInt8(offset)
        if (offset === this.offset)
            this.offset += 1;
        return result;
    }

    public readBytes(count: number = 0, offset: number = this.offset): number[] {
        if (count <= 0)
            return null;
        let result: number[] = [];
        for (let i = 0; i < count; ++i, offset += 1)
        {
            result.push(this.packet.readUInt8(offset))
			if (offset + 1 === this.offset)
				this.offset += 1;
        }
        return result;
    }

    public readInt16(offset: number = this.offset): number {
        let result = this.packet.readUInt16LE(offset)
        if (offset === this.offset)
            this.offset += 2;
        return result;
    }

    public readInt32(offset: number = this.offset): number {
        let result = this.packet.readUInt32LE(offset)
        if (offset === this.offset)
            this.offset += 4;
        return result;
    }

    public readString(offset: number = this.offset): string {
        let length = this.readInt32(offset)
        offset += 4
        let result = ""
        for (let i = 0; i < length; ++i, ++offset)
            result = result.concat(String.fromCharCode(this.readByte(offset)))
        return result;
    }
}

let PacketWriter = class PacketConstructor {
    protected buf: any[] = [];

    constructor(public readonly protocol: number) {
    }

    protected Serialize() {
        this.writeHeader()
        this.writeInt32(0)
        this.writeInt32(this.protocol)
        this.writeInt32(0)
    }

    protected finish() {
        let len = this.buf.length - 5;
        if (len <= 5)
            return;
        console.log(this.getPacket())
        this.buf[1] = len & 0x000000ff
        this.buf[2] = (len & 0x0000ff00) >> 8
        this.buf[3] = (len & 0x00ff0000) >> 16
        this.buf[4] = (len & 0xff000000) >> 24
        console.log(this.getPacket())
    }

    public getPacket() {
        return Buffer.from(this.buf);
    }

    protected writeHeader = () => this.writeByte(PACKET_HEADER);

    public writeByte(b: number) {
        this.buf.push(b & 0xff)
    }

    public writeInt16(n: number) {
        this.buf.push(n & 0x00ff)
        this.buf.push((n & 0xff00) >> 8)
    }

    public writeInt32(n: number) {
        this.buf.push(n & 0x000000ff)
        this.buf.push((n & 0x0000ff00) >> 8)
        this.buf.push((n & 0x00ff0000) >> 16)
        this.buf.push((n & 0xff000000) >> 24)
    }

    public writeString(s: string) {
        this.writeInt32(s.length)
        for (let c of s)
            this.writeByte(c.charCodeAt(0) as any)
    }
}

export {PacketReader, PacketWriter, PACKET_HEADER}
