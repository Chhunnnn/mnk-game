import { v4 as uuidv4 } from 'uuid';

export function generateNewSession() {
  const sid = uuidv4()
  const cid = uuidv4()
  const nid = uuidv4()

  return {
    'session': sid,
    'crossSession': cid,
    'naughtSession': nid
  }
}


