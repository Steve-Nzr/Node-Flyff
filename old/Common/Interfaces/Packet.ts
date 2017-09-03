import {Socket} from "net";
import {OutgoingPacketList} from "../../Component/LoginServer/Packets/List/List";

export interface PacketType
{
    "Protocol": number;
    "File": string;
    "Func": (Socket: Socket, OutgoingPacketList: OutgoingPacketList, data: any) => void;
}

export interface PacketHandle
{
    "Out": PacketType[];
    "In": PacketType[];
}
