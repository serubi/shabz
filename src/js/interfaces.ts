export interface IAccount {
  id: number,
  email: string,
  name: string,
  primaryLockId: number
}

export interface ILock {
  id: number,
  name: string,
  accessCode: string,
  status: boolean,
  dateRegistered: string
}

export interface ILog {
  id: number,
  accountId: number,
  date: string,
  status: boolean,
  lockId: number
}

export interface IRole {
  id: number,
  name: string,
  accessLevel: number,
  icon: string
}

export interface ILockAccount {
  id: number,
  accountId: number,
  lockId: number,
  roleId: number
}