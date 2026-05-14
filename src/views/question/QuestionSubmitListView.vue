<template>
  <div class="submit-list-page">
    <div class="submit-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">提交记录</h1>
          <p class="page-desc">查看所有提交记录</p>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <a-form layout="inline" :model="filterForm">
          <a-form-item label="语言">
            <a-select
              v-model:value="filterForm.language"
              placeholder="全部语言"
              allow-clear
              style="width: 130px"
              @change="handleFilter"
            >
              <a-select-option v-for="opt in languageOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="状态">
            <a-select
              v-model:value="filterForm.status"
              placeholder="全部状态"
              allow-clear
              style="width: 130px"
              @change="handleFilter"
            >
              <a-select-option :value="0">等待中</a-select-option>
              <a-select-option :value="1">判题中</a-select-option>
              <a-select-option :value="2">通过</a-select-option>
              <a-select-option :value="3">失败</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="仅我的">
            <a-switch v-model:checked="filterForm.onlyMine" @change="handleFilter" />
          </a-form-item>

          <a-form-item>
            <a-button @click="handleReset">重置</a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- Table -->
      <a-table
        :data-source="submitList"
        :columns="columns"
        :loading="loading"
        :pagination="false"
        row-key="id"
        class="submit-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record)">{{ getStatusText(record) }}</a-tag>
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

          <template v-else-if="column.key === 'questionId'">
            <a-button type="link" size="small" @click="router.push(`/question/${record.questionId}`)">
              题目 #{{ record.questionId }}
            </a-button>
          </template>

          <template v-else-if="column.key === 'code'">
            <a-button type="link" size="small" @click="showCode(record)">查看代码</a-button>
          </template>

          <template v-else-if="column.key === 'createTime'">
            {{ formatDate(record.createTime) }}
          </template>
        </template>
      </a-table>

      <!-- Pagination -->
      <div class="pagination-wrap">
        <a-pagination
          v-model:current="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :show-size-changer="true"
          :page-size-options="['15', '30', '50']"
          show-total
          @change="loadData"
          @show-size-change="loadData"
        />
      </div>
    </div>

    <!-- Code Modal -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { listQuestionSubmitVoByPage } from '@/api/questionSubmitController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import type { TableColumnsType } from 'ant-design-vue'

const router = useRouter()
const loginUserStore = useLoginUserStore()

const loading = ref(false)
const submitList = ref<any[]>([])

const filterForm = reactive({
  language: undefined as string | undefined,
  status: undefined as number | undefined,
  onlyMine: false,
})

const pagination = reactive({
  current: 1,
  pageSize: 15,
  total: 0,
})

const codeModalVisible = ref(false)
const selectedCode = ref('')
const selectedLang = ref('java')

const languageOptions = [
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'python', label: 'Python3' },
  { value: 'go', label: 'Go' },
]

const columns: TableColumnsType = [
  { title: '编号', dataIndex: 'id', key: 'id', width: 80 },
  { title: '题目', key: 'questionId', width: 130 },
  { title: '语言', dataIndex: 'language', key: 'language', width: 90 },
  { title: '状态', key: 'status', width: 120 },
  { title: '执行信息', key: 'judgeInfo', width: 160 },
  { title: '代码', key: 'code', width: 90 },
  { title: '提交时间', key: 'createTime', width: 160 },
]

const judgeMessageMap: Record<string, string> = {
  Accepted: '通过',
  'Wrong Answer': '答案错误',
  'Time Limit Exceeded': '超时',
  'Memory Limit Exceeded': '内存超限',
  'Compile Error': '编译错误',
  'Runtime Error': '运行错误',
  'System Error': '系统错误',
}

function getStatusText(record: any): string {
  if (record.status === 0) return '等待中'
  if (record.status === 1) return '判题中'
  const msg = record.judgeInfo?.message as string | undefined
  const display = msg ? judgeMessageMap[msg] : undefined
  if (display) return display
  if (record.status === 2) return '通过'
  if (record.status === 3) return '失败'
  return '未知'
}

function getStatusColor(record: any): string {
  if (record.status === 0 || record.status === 1) return 'default'
  const msg = record.judgeInfo?.message
  if (msg === 'Accepted' || record.status === 2) return 'success'
  if (msg === 'Time Limit Exceeded' || msg === 'Memory Limit Exceeded') return 'warning'
  return 'error'
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

function showCode(record: any) {
  selectedCode.value = record.code ?? ''
  selectedLang.value = record.language ?? 'java'
  codeModalVisible.value = true
}

async function loadData() {
  loading.value = true
  try {
    const params: any = {
      current: pagination.current,
      pageSize: pagination.pageSize,
    }
    if (filterForm.language) params.language = filterForm.language
    if (filterForm.status !== undefined) params.status = filterForm.status
    if (filterForm.onlyMine && loginUserStore.loginUser?.id) {
      params.userId = loginUserStore.loginUser.id
    }

    const res: any = await listQuestionSubmitVoByPage(params)
    if (res.data.code === 0 && res.data.data) {
      submitList.value = res.data.data.records ?? []
      pagination.total = res.data.data.total ?? 0
    } else {
      message.error(res.data.message || '加载失败')
    }
  } catch {
    message.error('请求失败，请检查网络或后端服务是否启动')
  } finally {
    loading.value = false
  }
}

function handleFilter() {
  pagination.current = 1
  loadData()
}

function handleReset() {
  filterForm.language = undefined
  filterForm.status = undefined
  filterForm.onlyMine = false
  pagination.current = 1
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.submit-list-page {
  background: var(--oj-bg);
  min-height: 100%;
  padding: 40px 0 80px;
}

.submit-container {
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

.filter-bar {
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(99, 102, 241, 0.12);
  border-radius: 12px;
  margin-bottom: 20px;
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

.editor-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
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

.submit-table .ant-table-tbody > tr > td {
  border-bottom: 1px solid rgba(99, 102, 241, 0.06) !important;
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
