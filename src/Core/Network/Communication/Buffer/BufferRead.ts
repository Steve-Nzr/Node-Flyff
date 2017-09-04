export abstract class BufferRead
{
    private readonly buffer: Buffer = null;
    private offset: number = 0;

    constructor(buffer: Buffer, offset: number = 0)
    {
        this.buffer = buffer;
        this.offset = offset;
    }

    public readByte(changeOffset: boolean = true)
    {
        const int8 = this.buffer.readUInt8(this.offset);

        this.incOffset(1, changeOffset);
        return (int8);
    }

    public readInt16(changeOffset: boolean = true)
    {
        const int16 = this.buffer.readUInt16LE(this.offset);

        this.incOffset(2, changeOffset);
        return (int16);
    }

    public readInt32(changeOffset: boolean = true)
    {
        const int32 = this.buffer.readUInt32LE(this.offset);

        this.incOffset(4, changeOffset);
        return (int32);
    }

    public readString(size: number, changeOffset: boolean = true)
    {
        let str = "";

        for (let i = 0; i < size; ++i)
        {
            str += String.fromCharCode(this.buffer.readUInt8(this.offset));
            this.incOffset(1, changeOffset);
        }

        return (str);
    }

    private incOffset(count: number, changeOffset: boolean)
    {
        if (changeOffset)
            this.offset += count;
    }
}
