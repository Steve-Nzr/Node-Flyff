import * as assert from "assert";
import {createServer, Server, Socket} from "net";

import * as I from "../Interfaces/I";
import * as Logger from "../Logger/Logger";

export abstract class FlyffServer
{
    protected readonly options: I.FlyffServerOptions;

    constructor(options: I.FlyffServerOptions)
    {
        assert.ok(options);
        assert.ok(options.title);
        assert.ok(options.port);
        assert.ok(options.message);

        this.options = options;
    }

    public startServer()
    {
        const loginServer: Server = createServer((socket: Socket) => {
            this.HandleClient(socket);

            socket.on("data", (data: Buffer) => this.HandleMessage(socket, data));
            socket.on("error", err => socket.destroy());
            socket.on("end", err => socket.destroy());
        });
        loginServer.listen({
            exclusive: true,
            host: this.options.host,
            port: this.options.port,
        });

        Logger.Log(`[${this.options.title}] Is Running`);
    }

    protected async NewClient(socket: Socket)
    {
        const socketName = socket.remoteAddress + ":" + socket.remotePort;
        Logger.Log(`[${this.options.title}] New client connected ${socketName}`);
        this.HandleClient(socket);
    }

    protected async NewMessage(socket: Socket, data: Buffer)
    {
        const socketName = socket.remoteAddress + ":" + socket.remotePort;
        Logger.Log(`[${this.options.title}] New message from ${socketName}`);
        this.HandleMessage(socket, data);
    }

    protected async HandleClient(socket: Socket)
    {
        return;
    }
    protected async HandleMessage(socket: Socket, data: Buffer)
    {
        return;
    }
}
