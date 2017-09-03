import PacketMaker from "../../../../../Common/Packets/Write/Write";

export default (socket, data = null) => {
    PacketMaker.Finish(socket);
};
