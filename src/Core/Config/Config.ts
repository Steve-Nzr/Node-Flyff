import * as I from "../Interfaces/I";

export const Core: I.CoreConfiguration = {
    "FlyffServer": {
        "LoginServer": {
            "host": "localhost",
            "message": "localhost",
            "port": 23000,
            "title": "LoginServer",
        },
    },
    "Servers": [
        {
            "Channels": [
                {
                    "IP": "127.0.0.1",
                    "MaxPlayers": 500,
                    "Name": "Channel 1",
                },
            ],
            "IP": "127.0.0.1",
            "Name": "Server 1",
        },
    ],
};
