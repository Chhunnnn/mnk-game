import { getDatabase, ref, set, onValue, update, get, child} from "firebase/database";

const baseSessionPath = 'sessions/'

export function onSessionData(sessionId, callback, option = {}) {
  const db = getDatabase()
  const sessionRef = ref(db, baseSessionPath + sessionId)
  return onValue(sessionRef, callback, option)
}

export function writeSessionData(sessionId, turn, isGameOver, board, placed, crossSession, naughtSession) {
  const db = getDatabase()
  var body = {
    turn: turn,
    isGameOver: isGameOver,
    board : board,
    placed: placed
  }

  if (crossSession) {
    body[crossSession] = 'cross',
    body['cross'] = crossSession
  }
  if (naughtSession) {
    body[naughtSession] = 'naught',
    body['naught'] = naughtSession
  }

  set(ref(db, baseSessionPath + sessionId), body);
}

export function updateSessionData(sessionId, turn, isGameOver, board, placed) {
  const db = getDatabase();
  const updates = {};
  updates[baseSessionPath + sessionId + '/turn'] = turn
  updates[baseSessionPath + sessionId + '/isGameOver'] = isGameOver
  updates[baseSessionPath + sessionId + '/board'] = board
  updates[baseSessionPath + sessionId + '/placed'] = placed
  return update(ref(db), updates);
}

export function getTurnSessionData(sessionId, turnSessionId) {
  const dbRef = ref(getDatabase());
  return get(child(dbRef, `${baseSessionPath}${sessionId}/${turnSessionId}`))
}

export function getSessionData(sessionId) {
  const dbRef = ref(getDatabase());
  return get(child(dbRef, `${baseSessionPath}${sessionId}`))
}


