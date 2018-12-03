export interface IAccount {
  id: number,
  email: string,
  name: string,
  primaryLock: number
}

export interface ILock {
  id: number,
  name: string,
  accessCode: string,
  status: boolean,
  dateRegistered: Date
}

export interface ILog {
  id: number,
  userId: number,
  date: Date,
  status: boolean
}

export interface IRole {
  id: number,
  name: string,
  accessLevel: number,
  icon: string
}

export interface ILockAccount {
  id: number,
  userId: number,
  lockId: number,
  roleId: number
}