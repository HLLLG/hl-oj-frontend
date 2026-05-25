export type WrongAnswerDetail = {
  caseIndex?: number
  input?: string
  expectedOutput?: string
  actualOutput?: string
}

export const judgeMessageMap: Record<string, string> = {
  Accepted: '通过',
  'Wrong Answer': '答案错误',
  'Time Limit Exceeded': '超时',
  'Memory Limit Exceeded': '内存超限',
  'Compile Error': '编译错误',
  'Runtime Error': '运行错误',
  'System Error': '系统错误',
  'Dangerous Code': '危险代码',
}

export function getSubmitStatusText(record: {
  status?: number
  judgeInfo?: API.JudgeInfo
}): string {
  if (record.status === 0) return '等待中'
  if (record.status === 1) return '判题中'
  const msg = record.judgeInfo?.message
  const display = msg ? judgeMessageMap[msg] : undefined
  if (display) return display
  if (record.status === 2) return '通过'
  if (record.status === 3) return '失败'
  return '未知'
}

export function getSubmitStatusColor(record: {
  status?: number
  judgeInfo?: API.JudgeInfo
}): string {
  if (record.status === 0 || record.status === 1) return 'default'
  const msg = record.judgeInfo?.message
  if (msg === 'Accepted') return 'success'
  if (record.status === 2) return 'success'
  return 'error'
}

export function getResultPanelClass(record: {
  status?: number
  judgeInfo?: API.JudgeInfo
}): string {
  const msg = record.judgeInfo?.message
  if (msg === 'Accepted' || record.status === 2) return 'result-ac'
  if (record.status === 0 || record.status === 1) return 'result-pending'
  return 'result-fail'
}

export function parseWrongAnswerDetail(detail?: string): WrongAnswerDetail | null {
  if (!detail) return null
  try {
    const parsed = JSON.parse(detail) as WrongAnswerDetail
    if (parsed && typeof parsed === 'object') return parsed
  } catch {
    return null
  }
  return null
}

export function isAccepted(record: { status?: number; judgeInfo?: API.JudgeInfo }): boolean {
  return record.judgeInfo?.message === 'Accepted' || record.status === 2
}

export function hasJudgeDetail(record: { judgeInfo?: API.JudgeInfo }): boolean {
  return Boolean(record.judgeInfo?.detail?.trim())
}
