<template>
  <div class="manage-page">
    <div class="manage-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">用户提交管理</h1>
          <p class="page-desc">管理员浏览、检索全部用户的题目代码提交记录</p>
        </div>
      </div>

      <div class="search-bar">
        <a-form layout="inline" :model="filterForm" class="filter-form">
          <a-form-item label="提交编号">
            <a-input
              v-model:value="filterForm.id"
              placeholder="提交 ID"
              allow-clear
              style="width: 140px"
              @press-enter="handleSearch"
            />
          </a-form-item>
          <a-form-item label="题目编号">
            <a-input
              v-model:value="filterForm.questionId"
              placeholder="题目 ID"
              allow-clear
              style="width: 140px"
              @press-enter="handleSearch"
            />
          </a-form-item>
          <a-form-item label="用户编号">
            <a-input
              v-model:value="filterForm.userId"
              placeholder="用户 ID"
              allow-clear
              style="width: 140px"
              @press-enter="handleSearch"
            />
          </a-form-item>
          <a-form-item label="用户账号">
            <a-input
              v-model:value="filterForm.userAccount"
              placeholder="精确匹配账号"
              allow-clear
              style="width: 140px"
              @press-enter="handleSearch"
            />
          </a-form-item>
          <a-form-item label="语言">
            <a-select
              v-model:value="filterForm.language"
              placeholder="全部"
              allow-clear
              style="width: 120px"
            >
              <a-select-option v-for="opt in languageOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="状态">
            <a-select
              v-model:value="filterForm.status"
              placeholder="全部"
              allow-clear
              style="width: 120px"
            >
              <a-select-option :value="0">等待中</a-select-option>
              <a-select-option :value="1">判题中</a-select-option>
              <a-select-option :value="2">通过</a-select-option>
              <a-select-option :value="3">失败</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSearch">搜索</a-button>
            <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
          </a-form-item>
        </a-form>
      </div>

      <a-table
        :data-source="submitList"
        :columns="columns"
        :loading="loading"
        :pagination="false"
        row-key="id"
        class="submit-table"
        table-layout="fixed"
        :scroll="{ x: 1280 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'id'">
            <a-tooltip :title="String(record.id)">
              <span class="id-text cell-ellipsis">{{ record.id }}</span>
            </a-tooltip>
          </template>

          <template v-else-if="column.key === 'status'">
            <a-tag :color="getSubmitStatusColor(record)">{{ getSubmitStatusText(record) }}</a-tag>
          </template>

          <template v-else-if="column.key === 'judgeInfo'">
            <span v-if="record.judgeInfo?.time !== undefined">
              {{ record.judgeInfo.time }} ms
              <span v-if="record.judgeInfo?.memory !== undefined" class="memory-text">
                / {{ record.judgeInfo.memory }} KB
              </span>
            </span>
            <span v-else class="muted">-</span>
          </template>

          <template v-else-if="column.key === 'userId'">
            <a-tooltip
              :title="
                getUserAccount(record.userId)
                  ? `${getUserDisplay(record.userId)}（${getUserAccount(record.userId)}）`
                  : getUserDisplay(record.userId)
              "
            >
              <div class="user-cell">
                <span class="cell-ellipsis user-name">{{ getUserDisplay(record.userId) }}</span>
                <span v-if="getUserAccount(record.userId)" class="user-account cell-ellipsis">
                  {{ getUserAccount(record.userId) }}
                </span>
              </div>
            </a-tooltip>
          </template>

          <template v-else-if="column.key === 'questionId'">
            <a-tooltip :title="`题目 ID：${record.questionId}`">
              <a-button
                type="link"
                size="small"
                class="question-link cell-ellipsis"
                @click="router.push(`/question/${record.questionId}`)"
              >
                {{ formatQuestionLabel(record.questionId) }}
              </a-button>
            </a-tooltip>
          </template>

          <template v-else-if="column.key === 'code'">
            <a-space :size="4">
              <a-button type="link" size="small" @click="showCode(record)">代码</a-button>
              <a-button
                v-if="record.judgeInfo?.detail"
                type="link"
                size="small"
                @click="showDetail(record)"
              >
                详情
              </a-button>
            </a-space>
          </template>

          <template v-else-if="column.key === 'createTime'">
            {{ formatDate(record.createTime) }}
          </template>
        </template>
      </a-table>

      <div class="pagination-wrap">
        <a-pagination
          v-model:current="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :show-size-changer="true"
          :page-size-options="['10', '20', '50']"
          show-total
          @change="loadData"
          @show-size-change="loadData"
        />
      </div>
    </div>

    <a-modal
      v-model:open="codeModalVisible"
      title="提交代码"
      width="800px"
      :footer="null"
      class="code-modal"
    >
      <vue-monaco-editor
        :value="selectedCode"
        :language="selectedLang"
        theme="vs-dark"
        height="450px"
        :options="{ readOnly: true, minimap: { enabled: false }, scrollBeyondLastLine: false }"
      >
        <template #default>
          <div class="editor-loading">加载中...</div>
        </template>
      </vue-monaco-editor>
    </a-modal>

    <a-modal
      v-model:open="detailModalVisible"
      title="判题详情"
      width="640px"
      :footer="null"
      class="code-modal"
    >
      <div v-if="detailRecord" class="detail-panel-wrap">
        <JudgeResultPanel :result="detailRecord" />
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { listQuestionSubmitVoByPage } from '@/api/questionController'
import { getUserVoById, listUserVoByPage } from '@/api/userController'
import JudgeResultPanel from '@/components/JudgeResultPanel.vue'
import { getSubmitStatusText, getSubmitStatusColor } from '@/utils/judgeResult'
import type { TableColumnsType } from 'ant-design-vue'

const router = useRouter()

const loading = ref(false)
const submitList = ref<API.QuestionSubmitVO[]>([])

const filterForm = reactive({
  id: '' as string,
  questionId: '' as string,
  userId: '' as string,
  userAccount: '' as string,
  language: undefined as string | undefined,
  status: undefined as number | undefined,
})

const userInfoMap = ref<Record<string, { userName?: string; userAccount?: string }>>({})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

const codeModalVisible = ref(false)
const selectedCode = ref('')
const selectedLang = ref('java')

const detailModalVisible = ref(false)
const detailRecord = ref<API.QuestionSubmitVO | null>(null)

const languageOptions = [
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'python', label: 'Python3' },
  { value: 'go', label: 'Go' },
]

const columns: TableColumnsType = [
  { title: '提交 ID', dataIndex: 'id', key: 'id', width: 172, ellipsis: true },
  { title: '题目', key: 'questionId', width: 112, ellipsis: true },
  { title: '提交用户', key: 'userId', width: 132, ellipsis: true },
  { title: '语言', dataIndex: 'language', key: 'language', width: 76, align: 'center' },
  { title: '状态', key: 'status', width: 100, align: 'center' },
  { title: '执行信息', key: 'judgeInfo', width: 128, ellipsis: true },
  { title: '提交时间', key: 'createTime', width: 168, ellipsis: true },
  { title: '操作', key: 'code', width: 108, fixed: 'right', align: 'center' },
]

/** 长 ID 尾部展示，避免撑破列宽 */
function shortenId(id?: number | string, tailLen = 8): string {
  if (id === undefined || id === null) return '-'
  const s = String(id)
  if (s.length <= tailLen + 1) return s
  return `…${s.slice(-tailLen)}`
}

function formatQuestionLabel(questionId?: number | string): string {
  if (questionId === undefined || questionId === null) return '-'
  return `题目 ${shortenId(questionId)}`
}

function parseOptionalLong(val: string): number | undefined {
  const trimmed = val.trim()
  if (!trimmed) return undefined
  const num = Number(trimmed)
  if (!Number.isFinite(num) || num <= 0) return undefined
  return num
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

function showCode(record: API.QuestionSubmitVO) {
  selectedCode.value = record.code ?? ''
  selectedLang.value = record.language ?? 'java'
  codeModalVisible.value = true
}

function showDetail(record: API.QuestionSubmitVO) {
  detailRecord.value = record
  detailModalVisible.value = true
}

function getUserDisplay(userId?: number | string): string {
  if (userId === undefined || userId === null) return '-'
  const key = String(userId)
  return userInfoMap.value[key]?.userName ?? `ID ${key}`
}

function getUserAccount(userId?: number | string): string {
  if (userId === undefined || userId === null) return ''
  return userInfoMap.value[String(userId)]?.userAccount ?? ''
}

async function hydrateUserInfo(records: API.QuestionSubmitVO[]) {
  const ids = [...new Set(records.map((r) => r.userId).filter((id) => id != null))] as number[]
  const pending = ids.filter((id) => !userInfoMap.value[String(id)])
  if (pending.length === 0) return

  await Promise.all(
    pending.map(async (id) => {
      try {
        const res: any = await getUserVoById({ id })
        if (res.data.code === 0 && res.data.data) {
          userInfoMap.value[String(id)] = {
            userName: res.data.data.userName,
            userAccount: res.data.data.userAccount,
          }
        }
      } catch {
        // ignore single user fetch failure
      }
    }),
  )
}

async function resolveUserIdByAccount(): Promise<number | undefined> {
  const account = filterForm.userAccount.trim()
  if (!account) return undefined
  const res: any = await listUserVoByPage({
    current: 1,
    pageSize: 1,
    userAccount: account,
  })
  if (res.data.code === 0 && res.data.data?.records?.length) {
    return res.data.data.records[0].id
  }
  return undefined
}

async function buildQueryParams(): Promise<API.QuestionSubmitQueryRequest> {
  const params: API.QuestionSubmitQueryRequest = {
    current: pagination.current,
    pageSize: pagination.pageSize,
    sortField: 'createTime',
    sortOrder: 'descend',
  }
  const id = parseOptionalLong(filterForm.id)
  const questionId = parseOptionalLong(filterForm.questionId)
  let userId = parseOptionalLong(filterForm.userId)
  if (userId === undefined && filterForm.userAccount.trim()) {
    userId = await resolveUserIdByAccount()
    if (userId === undefined) {
      throw new Error('USER_NOT_FOUND')
    }
  }
  if (id !== undefined) params.id = id
  if (questionId !== undefined) params.questionId = questionId
  if (userId !== undefined) params.userId = userId
  if (filterForm.language) params.language = filterForm.language
  if (filterForm.status !== undefined) params.status = filterForm.status
  return params
}

async function loadData() {
  loading.value = true
  try {
    const params = await buildQueryParams()
    const res: any = await listQuestionSubmitVoByPage(params)
    if (res.data.code === 0 && res.data.data) {
      submitList.value = res.data.data.records ?? []
      pagination.total = res.data.data.total ?? 0
      await hydrateUserInfo(submitList.value)
    } else {
      message.error(res.data.message || '加载失败')
    }
  } catch (err) {
    if (err instanceof Error && err.message === 'USER_NOT_FOUND') {
      submitList.value = []
      pagination.total = 0
      message.warning('未找到该用户账号')
    } else {
      message.error('请求失败，请检查网络或后端服务是否启动')
    }
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.current = 1
  loadData()
}

function handleReset() {
  filterForm.id = ''
  filterForm.questionId = ''
  filterForm.userId = ''
  filterForm.userAccount = ''
  filterForm.language = undefined
  filterForm.status = undefined
  pagination.current = 1
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.manage-page {
  background: var(--oj-bg);
  min-height: 100%;
  padding: 40px 0 80px;
}

.manage-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  margin-bottom: 28px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: #e2e8f0;
  margin: 0 0 6px;
}

.page-desc {
  font-size: 14px;
  color: #475569;
  margin: 0;
}

.search-bar {
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(99, 102, 241, 0.12);
  border-radius: 12px;
  margin-bottom: 20px;
}

.filter-form {
  flex-wrap: wrap;
  gap: 4px 0;
}

.pagination-wrap {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.memory-text {
  color: #64748b;
}

.muted {
  color: #475569;
}

.cell-ellipsis {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.id-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  color: #94a3b8;
  letter-spacing: -0.02em;
}

.user-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
  min-width: 0;
  max-width: 100%;
}

.user-name {
  color: #e2e8f0;
}

.user-account {
  font-size: 12px;
  color: #64748b;
}

.question-link {
  padding: 0 !important;
  height: auto !important;
  max-width: 100%;
  line-height: 1.4;
  text-align: left;
}

.question-link :deep(span) {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.editor-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
}

.detail-panel-wrap :deep(.judge-result-panel) {
  margin: 0;
}
</style>

<style>
.submit-table .ant-table {
  background: rgba(255, 255, 255, 0.02) !important;
  border: 1px solid rgba(99, 102, 241, 0.12) !important;
  border-radius: 12px !important;
}

.submit-table .ant-table-thead > tr > th {
  background: rgba(99, 102, 241, 0.06) !important;
  border-bottom: 1px solid rgba(99, 102, 241, 0.15) !important;
  color: #64748b !important;
  font-size: 13px !important;
  font-weight: 600 !important;
}

.submit-table .ant-table table {
  table-layout: fixed !important;
}

.submit-table .ant-table-tbody > tr > td {
  border-bottom: 1px solid rgba(99, 102, 241, 0.06) !important;
  overflow: hidden;
}

.submit-table .ant-table-tbody > tr > td .ant-btn-link {
  max-width: 100%;
}

.submit-table .ant-table-tbody > tr:hover > td {
  background: rgba(99, 102, 241, 0.05) !important;
}

.code-modal .ant-modal-content {
  background: #0f1020 !important;
  border: 1px solid rgba(99, 102, 241, 0.2) !important;
  border-radius: 12px !important;
}

.code-modal .ant-modal-header {
  background: transparent !important;
  border-bottom: 1px solid rgba(99, 102, 241, 0.15) !important;
}

.code-modal .ant-modal-title {
  color: #e2e8f0 !important;
}
</style>
