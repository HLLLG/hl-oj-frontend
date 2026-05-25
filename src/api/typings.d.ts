declare namespace API {
  type BaseResponseBoolean = {
    code?: number
    message?: string
    data?: boolean
  }

  type BaseResponseInteger = {
    code?: number
    message?: string
    data?: number
  }

  type BaseResponseListQuestion = {
    code?: number
    message?: string
    data?: Question[]
  }

  type BaseResponseLoginUserVO = {
    code?: number
    message?: string
    data?: LoginUserVO
  }

  type BaseResponseLong = {
    code?: number
    message?: string
    data?: number
  }

  type BaseResponsePageQuestion = {
    code?: number
    message?: string
    data?: PageQuestion
  }

  type BaseResponsePageQuestionSubmitVO = {
    code?: number
    message?: string
    data?: PageQuestionSubmitVO
  }

  type BaseResponsePageQuestionVO = {
    code?: number
    message?: string
    data?: PageQuestionVO
  }

  type BaseResponsePageUserVO = {
    code?: number
    message?: string
    data?: PageUserVO
  }

  type BaseResponseQuestion = {
    code?: number
    message?: string
    data?: Question
  }

  type BaseResponseQuestionSubmitVO = {
    code?: number
    message?: string
    data?: QuestionSubmitVO
  }

  type BaseResponseQuestionVO = {
    code?: number
    message?: string
    data?: QuestionVO
  }

  type BaseResponseUser = {
    code?: number
    message?: string
    data?: User
  }

  type BaseResponseUserVO = {
    code?: number
    message?: string
    data?: UserVO
  }

  type DeleteRequest = {
    id?: number
  }

  type getQuestionByIdParams = {
    id: number
  }

  type getQuestionSubmitVOById1Params = {
    id: number
  }

  type getQuestionSubmitVOByIdParams = {
    id: number
  }

  type getQuestionVOByIdParams = {
    id: number
  }

  type getUserByIdParams = {
    id: number
  }

  type getUserVOByIdParams = {
    id: number
  }

  type JudgeCase = {
    input?: string
    output?: string
  }

  type JudgeConfig = {
    timeLimit?: number
    memoryLimit?: number
    stackLimit?: number
  }

  type JudgeInfo = {
    message?: string
    time?: number
    memory?: number
    /** 编译/运行错误文本，或答案错误时的用例对比 JSON */
    detail?: string
  }

  type LoginUserVO = {
    id?: number
    userAccount?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    createTime?: string
    updateTime?: string
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type PageQuestion = {
    records?: Question[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageQuestion
    searchCount?: PageQuestion
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageQuestionSubmitVO = {
    records?: QuestionSubmitVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageQuestionSubmitVO
    searchCount?: PageQuestionSubmitVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageQuestionVO = {
    records?: QuestionVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageQuestionVO
    searchCount?: PageQuestionVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageUserVO = {
    records?: UserVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageUserVO
    searchCount?: PageUserVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type Question = {
    id?: number
    title?: string
    content?: string
    tags?: string
    answer?: string
    submitNum?: number
    acceptedNum?: number
    judgeCase?: string
    judgeConfig?: string
    thumbNum?: number
    favourNum?: number
    userId?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type QuestionAddRequest = {
    title?: string
    content?: string
    tags?: string[]
    answer?: string
    judgeCase?: JudgeCase[]
    judgeConfig?: JudgeConfig
  }

  type QuestionEditRequest = {
    id?: number
    title?: string
    content?: string
    tags?: string[]
    answer?: string
    judgeCase?: JudgeCase[]
    judgeConfig?: JudgeConfig
  }

  type QuestionQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    id?: number
    title?: string
    content?: string
    tags?: string[]
    userId?: number
  }

  type QuestionSubmitAddRequest = {
    language?: string
    code?: string
    questionId?: number
  }

  type QuestionSubmitQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    id?: number
    language?: string
    status?: number
    questionId?: number
    userId?: number
  }

  type QuestionSubmitVO = {
    id?: number
    language?: string
    code?: string
    judgeInfo?: JudgeInfo
    status?: number
    questionId?: number
    userId?: number
    createTime?: string
    updateTime?: string
  }

  type QuestionUpdateRequest = {
    id?: number
    title?: string
    content?: string
    tags?: string[]
    answer?: string
    judgeCase?: JudgeCase[]
    judgeConfig?: JudgeConfig
  }

  type QuestionVO = {
    id?: number
    title?: string
    content?: string
    tags?: string[]
    submitNum?: number
    acceptedNum?: number
    thumbNum?: number
    favourNum?: number
    judgeConfig?: JudgeConfig
    userId?: number
    createTime?: string
    updateTime?: string
    userVO?: UserVO
  }

  type User = {
    id?: number
    userAccount?: string
    userPassword?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    editTime?: string
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type UserAddRequest = {
    userAccount?: string
    userPassword?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
  }

  type UserLoginRequest = {
    userAccount?: string
    userPassword?: string
  }

  type UserQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    id?: number
    userAccount?: string
    userName?: string
    userRole?: string
  }

  type UserRegisterRequest = {
    userAccount?: string
    userPassword?: string
    checkPassword?: string
  }

  type UserUpdateMyRequest = {
    userName?: string
    userAvatar?: string
    userProfile?: string
  }

  type UserUpdateRequest = {
    id?: number
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
  }

  type UserVO = {
    id?: number
    userAccount?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    createTime?: string
  }
}
