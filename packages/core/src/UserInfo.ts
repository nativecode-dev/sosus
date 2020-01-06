import os from 'os'
import { exec } from 'child_process'

export interface UserInfo {
  gid: number
  homedir: string
  shell: string
  uid: number
  username: string
}

export interface UserIdentifiers {
  gid: number
  uid: number
}

function cmd(command: string) {
  return new Promise<string>((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        reject(error)
      } else {
        resolve(stdout)
      }
    })
  })
}

async function getId(): Promise<UserIdentifiers> {
  const result = await cmd('/usr/bin/id')
  const parts = result.split(' ')
  const gid = parseInt(parts[0], 0)
  const uid = parseInt(parts[1], 0)
  return { gid, uid }
}

export async function userinfo(): Promise<UserInfo> {
  try {
    const userinfo = os.userInfo()
    return {
      gid: userinfo.gid,
      homedir: userinfo.homedir,
      shell: userinfo.shell,
      uid: userinfo.uid,
      username: userinfo.username,
    }
  } catch (error) {
    console.error(error)

    const identifiers = await getId()

    return {
      gid: identifiers.gid,
      homedir: process.env.HOME || '/root',
      uid: identifiers.uid,
      username: process.env.USERNAME || 'root',
      shell: process.env.$0 || '/bin/sh',
    }
  }
}
