// public address: string | undefined;

export class User {
  constructor(
    public userId: number,
    public username: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public email: string, // = "asdf@getMaxListeners.com",
    public address: string,// | undefined,
    public birthdate: number,
    public phoneNumber: string,
  ) {}
}
