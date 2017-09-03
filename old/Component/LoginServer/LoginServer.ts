import {createServer, Server, Socket} from "net";
import {PacketHandler} from "./Packets/PacketReader";
import {IncomingPacketList, OutgoingPacketList} from "./Packets/List/List";
import {Send} from "./Packets/PacketMaker";

(IncomingPacketList.Instance());
(OutgoingPacketList.Instance());

const loginServer: Server = createServer(socket => {
    const socketName = socket.remoteAddress + ":" + socket.remotePort;
    console.info(`New connection ${socketName}`);

    Send("SendGreetings", socket);

    socket.on("data", (data: Buffer) => new PacketHandler(socket, data));

    socket.on("error", err => socket.destroy());
    socket.on("end", err => socket.destroy());
});

loginServer.listen({
    exclusive: true,
    host: "localhost",
    port: 23000,
});

console.info("[LoginServer] Is Running");
