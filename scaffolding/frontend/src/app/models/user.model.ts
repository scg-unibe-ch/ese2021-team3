// public address: string | undefined;

export class User {
  constructor(
    public userId: number,
    public username: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public address: string,
    public birthdate: string,
    public phoneNumber: string,
  ) {}
}
