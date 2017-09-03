import {Socket} from "net";

import * as I from "../Core/Interfaces/I";
import * as Logger from "../Core/Logger/Logger";
import {Core} from "../Core/Config/Config";
import {FlyffServer} from "../Core/FlyffServer/FlyffServer";

class LoginServer extends FlyffServer
{
    constructor(options: I.FlyffServerOptions)
    {
        super(options);
    }

    protected async HandleClient(socket: Socket)
    {
        console.info("YEAH");
    }
    protected async HandleMessage(socket: Socket, data: Buffer)
    {
        return;
    }
}

const Login = new LoginServer(Core.FlyffServer.LoginServer);
if (Login)
    Login.startServer();
