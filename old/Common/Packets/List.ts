import * as fs from "fs";
import * as I from "../../../../Common/Interfaces/Interfaces";

export default abstract class PacketList
{
    protected packetList: I.PacketType[];

    public getByName(name: string): I.PacketType
    {
        for (const packetType of this.packetList)
        {
            if (!packetType)
                continue;

            if (packetType.File === name)
                return packetType;
        }

        return null;
    }

    public getByProtocol(protocol: number): I.PacketType
    {
        for (const packetType of this.packetList)
        {
            if (!packetType)
                continue;

            if (packetType.Protocol === protocol)
                return packetType;
        }

        return null;
    }

    protected MakeAssociation(file: string, func: () => void): void
    {
        for (const packetType of this.packetList)
        {
            if (!packetType)
                continue;

            if (packetType.File === file.substr(0, file.length - 3))
            {
                packetType.Func = func;
                break;
            }
        }
    }
}

export class IncomingPacketList extends PacketList
{
    public static Instance(): IncomingPacketList
    {
        if (!this.instance)
            this.instance = new IncomingPacketList();

        return this.instance;
    }
    private static instance: IncomingPacketList;

    constructor()
    {
        super();

        fs.readdir(__dirname + "/Incoming/", (err, files) => {
            files.forEach((file) => {
                if (file.substr(0, 2) === "On" && file.substr(file.length - 2, file.length) === "js")
                    this.MakeAssociation(file, require(`${__dirname}/Incoming/${file}`));
            });
        });
    }
}

export class OutgoingPacketList extends PacketList
{
    public static Instance(): OutgoingPacketList
    {
        if (!this.instance)
            this.instance = new OutgoingPacketList();

        return this.instance;
    }
    private static instance: OutgoingPacketList;

    constructor()
    {
        super();

        console.info("[CONSTRUCT OUTGOING]");
        fs.readdir(__dirname + "/Outgoing/", (err, files) => {
            files.forEach((file) => {
                if (file.substr(0, 2) === "Send" && file.substr(file.length - 2, file.length) === "js")
                    this.MakeAssociation(file, require(`${__dirname}/Outgoing/${file}`));
            });
        });
    }
}
