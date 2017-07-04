import * as fs from 'fs';

interface IPacketType {
    "Protocol": number,         // Hex protocol_id of the Packets
    "File": string,             // File component/function to be loaded
    "Func": Function            // Function to be called as default
}

interface IPacketHandle {
    "Outgoing": IPacketType[],
    "Incoming": IPacketType[]
}

const Assoc: IPacketHandle = {
    "Outgoing": [
        {
            "Protocol": 0x00,
            "File": "SendPong",
            "Func": null
        }
    ],
    "Incoming": [
        {
            "Protocol": 0x14,
            "File": "OnPing",
            "Func": null
        }
    ]
}

function SetAssocFunc(type: string, file: string, func: Function) {
    for (let i = 0; i < Assoc[type].length; ++i) {
        if (Assoc[type][i].File === file.substr(0, file.length - 3))
        {
            Assoc[type][i].Func = func
            break
        }
    }
}

namespace List {
    export let Init = () => {
        fs.readdirSync(__dirname + '/Incoming/')
            .forEach((file) => {
                if (file.substr(0,2) === "On" && file.substr(file.length - 2, file.length) === "js")
                    SetAssocFunc("Incoming", file, require(__dirname + '/Incoming/' + file))
            })
        fs.readdirSync(__dirname + '/Outgoing/')
            .forEach((file) => {
                if (file.substr(0,4) === "Send" && file.substr(file.length - 2, file.length) === "js")
                    SetAssocFunc("Outgoing", file, require(__dirname + '/Outgoing/' + file))
            })
    }


    export let Association = (type: string, protocol: number): IPacketType => {
        for (let i = 0; i < Assoc[type].length; ++i) {
            if (Assoc[type][i].Protocol === protocol)
                return Assoc[type][i]
        }
    }
    export let AssociationByName = (type: string, name: string): IPacketType => {
        for (let i = 0; i < Assoc[type].length; ++i) {
            if (Assoc[type][i].File === name)
                return Assoc[type][i]
        }
    }
}


export {List, Assoc}
