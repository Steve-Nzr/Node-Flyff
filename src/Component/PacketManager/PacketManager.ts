const PACKET_HEADER = 0x5E

let PacketReader = class PacketManager {
    private offset: number = 0

    constructor(public packet: Buffer) {
    }

    protected readByte(offset: number = this.offset): number {
        let result = this.packet.readUInt8(offset)
        if (offset === this.offset)
            this.offset += 1;
        return result;
    }

    protected readBytes(count: number = 0, offset: number = this.offset): number[] {
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

    protected readInt16(offset: number = this.offset): number {
        let result = this.packet.readUInt16LE(offset)
        if (offset === this.offset)
            this.offset += 2;
        return result;
    }

    protected readInt32(offset: number = this.offset): number {
        let result = this.packet.readUInt32LE(offset)
        if (offset === this.offset)
            this.offset += 4;
        return result;
    }

    protected readString(offset: number = this.offset): string {
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

    constructor(protected readonly protocol: number) {
    }

    protected Serialize() {
        this.writeHeader();
        this.writeInt32(0);
    }

    protected finish() {
        let len = this.buf.length - 5;
        this.buf.splice(1, 0, (len & 0xff000000) >> 24)
        this.buf.splice(1, 0, (len & 0x00ff0000) >> 16)
        this.buf.splice(1, 0, (len & 0x0000ff00) >> 8)
        this.buf.splice(1, 0, len & 0x000000ff)
    }

    public getPacket() {
        return Buffer.from(this.buf);
    }

    protected writeHeader = () => this.writeByte(PACKET_HEADER);

    protected writeByte(b: number) {
        this.buf.push(b & 0xff)
    }

    protected writeInt16(n: number) {
        this.buf.push(n & 0x00ff)
        this.buf.push((n & 0xff00) >> 8)
    }

    protected writeInt32(n: number) {
        this.buf.push(n & 0x000000ff)
        this.buf.push((n & 0x0000ff00) >> 8)
        this.buf.push((n & 0x00ff0000) >> 16)
        this.buf.push((n & 0xff000000) >> 24)
    }

    protected writeString(s: string) {
        for (let c of s)
            this.writeByte(c as any)
    }
}

export {PacketReader, PacketWriter, PACKET_HEADER}
