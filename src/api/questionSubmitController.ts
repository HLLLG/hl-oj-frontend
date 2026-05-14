// @ts-ignore
/* eslint-disable */
import { request } from '@/request'

/** 此处后端没有提供注释 POST /question_submit/do */
export async function doQuestionSubmit(
  body: API.QuestionSubmitAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>('/question_submit/do', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /question_submit/get/vo */
export async function getQuestionSubmitVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getQuestionSubmitVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseQuestionSubmitVO>('/question_submit/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /question_submit/list/page/vo */
export async function listQuestionSubmitVoByPage(
  body: API.QuestionSubmitQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageQuestionSubmitVO>('/question_submit/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
