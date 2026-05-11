import ACCESS_ENUM from '@/access/accessEnum.ts'

const checkAccess = (loginUser: any, needAccess = ACCESS_ENUM.NOT_LOGIN) => {
  // 获取当前用户的权限
  const userAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN

  // 需要用户登录才可以访问
  if (needAccess === ACCESS_ENUM.USER) {
    return userAccess !== ACCESS_ENUM.NOT_LOGIN
  }

  // 需要管理员权限才可以访问
  if (needAccess === ACCESS_ENUM.ADMIN) {
    return userAccess === ACCESS_ENUM.ADMIN
  }
  return true
}

export default checkAccess
