import {List} from '../List'
import * as aesjs from 'aes-js'

const key       = toBytes("dldhsvmflvm", 16)
const iv        = toBytes("", 16)
const aesCbc    = new aesjs.ModeOfOperation.cbc(key, iv);

function toBytes(string, padding = 0, bytes = []) {
    let i = 0;
    for (; i < string.length; ++i) {
        bytes = bytes.concat([string.charCodeAt(i)]);
    }
    for (; i < padding; ++i) {
        bytes = bytes.concat([0]);
    }
    return bytes;
}

function decryptPassword(pass) {
    return (aesjs.utils.utf8.fromBytes(aesCbc.decrypt(pass)))
}

module.exports = (socket, PacketReader) => {
    console.log((PacketReader.packet as Buffer).byteLength)
    console.log(PacketReader.readString())
    console.log(PacketReader.readString())
    let password = decryptPassword(PacketReader.readBytes(16*42));
    console.log(password)
}
