export interface ChannelConfiguration
{
    "IP": string;
    "MaxPlayers": number;
    "Name": string;
}

export interface ClusterConfiguration
{
    "Channels": ChannelConfiguration[];
    "IP": string;
    "Name": string;
}

export interface FlyffServerOptions
{
    "host": string;
    "message": string;
    "port": number;
    "title": string;
}

export interface GlobalServersOptions
{
    "LoginServer": FlyffServerOptions;
}

export interface CoreConfiguration
{
    "FlyffServer": GlobalServersOptions;
    "Servers": ClusterConfiguration[];
}
