import * as net from "net"

const PACKET_HEADER = 0x5E;

enum E_LOGIN_COMMAND {
    LCMD_GREETING = 0x00000000,
    LCMD_ERROR = 0x000000fe,
    LCMD_SERVER_LIST = 0x000000fd,
}

enum E_LOGIN_RECV {
    RECV_LOGIN_REQUEST = 0xFC,
    RECV_RELOG_REQUEST = 0x16,
    RECV_PING = 0x14,
    RECV_SOCK_FIN = 0xFF,
}

abstract class PacketConstructor {
    protected buf: any[] = [];

    constructor(protected readonly packetId: number) {
    }

    public getPacket() {
        return Buffer.from(this.buf);
    }

    protected start() {
        this.writeHeader();
        this.writeInt32(0);
    }

    protected finish() {
        const len = this.buf.length - 5;
        this.buf.splice(1, 0, (len & 0xff000000) >> 24);
        this.buf.splice(1, 0, (len & 0x00ff0000) >> 16);
        this.buf.splice(1, 0, (len & 0x0000ff00) >> 8);
        this.buf.splice(1, 0, len & 0x000000ff);
    }

    protected writeHeader = () => this.writeByte(PACKET_HEADER);

    protected writeByte(b: number) {
        this.buf.push(b & 0xff);
    }

    protected writeInt16(n: number) {
        this.buf.push(n & 0x00ff);
        this.buf.push((n & 0xff00) >> 8);
    }

    protected writeInt32(n: number) {
        this.buf.push(n & 0x000000ff);
        this.buf.push((n & 0x0000ff00) >> 8);
        this.buf.push((n & 0x00ff0000) >> 16);
        this.buf.push((n & 0xff000000) >> 24);
    }

    protected writeString(s: string) {
        for (const c of s) {
            this.writeByte(c as any);
        }
    }
}

class PacketCreator extends PacketConstructor {
    constructor(packetId: number) {
        super(packetId);

        if (this.packetId === E_LOGIN_COMMAND.LCMD_GREETING)
            this.greet();
    }

    public greet() {
        this.start()
        this.writeInt32(this.packetId)
        this.writeInt32(1)
        this.finish()
    }
}

class PacketReader {
    private offset: number = 0

    constructor(private packet: Buffer) {
        this.readPacket();
    }

    private readPacket() {
        if (this.readByte() !== PACKET_HEADER)
            return console.log("Not a valid packet header")

        this.readInt32() // Checksum
        let length = this.readInt32()
        if (length < this.packet.length - 13) {
            console.log("Invalid packet size..")
            return;
        }
        this.readInt32() // Other

        let header = this.readInt32()
        if (header == E_LOGIN_RECV.RECV_LOGIN_REQUEST) {
            console.log(this.readString())
        }
    }

    private readByte(offset: number = this.offset): number {
        let result = this.packet.readUInt8(offset)
        if (offset === this.offset)
            this.offset += 1;
        return result;
    }

    private readInt16(offset: number = this.offset): number {
        let result = this.packet.readUInt16LE(offset)
        if (offset === this.offset)
            this.offset += 2;
        return result;
    }

    private readInt32(offset: number = this.offset): number {
        let result = this.packet.readUInt32LE(offset)
        if (offset === this.offset)
            this.offset += 4;
        return result;
    }

    private readString(offset: number = this.offset): string {
        let length = this.readInt32(offset)
        offset += 4
        let result = ""
        for (let i = 0; i < length; ++i, ++offset)
            result = result.concat(String.fromCharCode(this.readByte(offset)))
        return result;
    }
}

net.createServer(socket => {
    const socketName = socket.remoteAddress + ":" + socket.remotePort;
    console.info(`New connection ${socketName}`);

    const packet = new PacketCreator(E_LOGIN_COMMAND.LCMD_GREETING);

    socket.write(packet.getPacket());

    socket.on("data", (data: Buffer) => {
        console.info("Received", data);
        new PacketReader(data);
    })

    socket.on("error", (err) => {
        if (!socket.destroyed)
            socket.destroy()
    })

    socket.on('end', () => {
        console.log("Socket end")
        if (!socket.destroyed)
            socket.destroy()
    })
})
.listen({
  host: 'localhost',
  port: 23000,
  exclusive: true
});

console.log("Running");
