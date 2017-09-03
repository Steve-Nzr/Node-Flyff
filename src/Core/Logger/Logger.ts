export function Error(message: string)
{
    console.error("\x1b[41m%s\x1b[0m", message);
}

export function Log(message: string)
{
    console.info("\x1b[93m%s\x1b[0m", message);
}
