import { getDatabase, ref, set, onValue} from "firebase/database";

const baseSessionPath = 'sessions/'

export function onSessionData(sessionId, callback, option = {}) {
  const db = getDatabase()
  const sessionRef = ref(db, baseSessionPath + sessionId)
  return onValue(sessionRef, callback, option)
}

export function writeSessionData(sessionId, turn, isGameOver, board, placed) {
  const db = getDatabase()
  set(ref(db, baseSessionPath + sessionId), {
    turn: turn,
    isGameOver: isGameOver,
    board : board,
    placed: placed
  });
}
