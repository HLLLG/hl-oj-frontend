<template>
  <div class="manage-page">
    <div class="manage-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">题目管理</h1>
          <p class="page-desc">管理所有题目，支持增删改查</p>
        </div>
        <a-space>
          <a-button @click="router.push('/admin/question-submit')">用户提交管理</a-button>
          <a-button type="primary" class="create-btn" @click="router.push('/admin/question/create')">
            <template #icon><PlusOutlined /></template>
            新建题目
          </a-button>
        </a-space>
      </div>

      <!-- Search -->
      <div class="search-bar">
        <a-input
          v-model:value="searchTitle"
          placeholder="搜索题目标题..."
          allow-clear
          class="search-input"
          @press-enter="handleSearch"
        >
          <template #prefix><SearchOutlined /></template>
        </a-input>
        <a-button type="primary" @click="handleSearch">搜索</a-button>
        <a-button @click="handleReset">重置</a-button>
      </div>

      <!-- Table -->
      <a-table
        :data-source="questionList"
        :columns="columns"
        :loading="loading"
        :pagination="false"
        row-key="id"
        class="question-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'tags'">
            <a-space :size="4" wrap>
              <a-tag
                v-for="tag in parseTags(record.tags)"
                :key="tag"
                :color="getTagColor(tag)"
              >
                {{ tag }}
              </a-tag>
            </a-space>
          </template>

          <template v-else-if="column.key === 'createTime'">
            {{ formatDate(record.createTime) }}
          </template>

          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record.id)">编辑</a-button>
              <a-popconfirm
                title="确定删除该题目吗？"
                ok-text="删除"
                cancel-text="取消"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" size="small" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
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
          :page-size-options="['10', '20', '50']"
          show-total
          @change="loadData"
          @show-size-change="loadData"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { listQuestionByPage, deleteQuestion } from '@/api/questionController'
import type { TableColumnsType } from 'ant-design-vue'

const router = useRouter()

const loading = ref(false)
const questionList = ref<any[]>([])
const searchTitle = ref('')

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

const columns: TableColumnsType = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
  { title: '标签', dataIndex: 'tags', key: 'tags', width: 200 },
  { title: '提交数', dataIndex: 'submitNum', key: 'submitNum', width: 90, align: 'center' },
  { title: '通过数', dataIndex: 'acceptedNum', key: 'acceptedNum', width: 90, align: 'center' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 140 },
  { title: '操作', key: 'actions', width: 120, fixed: 'right', align: 'center' },
]

function parseTags(tagsStr?: string): string[] {
  if (!tagsStr) return []
  try {
    return JSON.parse(tagsStr)
  } catch {
    return []
  }
}

function getTagColor(tag: string): string {
  if (tag === '简单') return 'green'
  if (tag === '中等') return 'orange'
  if (tag === '困难') return 'red'
  return 'blue'
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

async function loadData() {
  loading.value = true
  try {
    const res: any = await listQuestionByPage({
      current: pagination.current,
      pageSize: pagination.pageSize,
      title: searchTitle.value || undefined,
    })
    if (res.data.code === 0 && res.data.data) {
      questionList.value = res.data.data.records ?? []
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

function handleSearch() {
  pagination.current = 1
  loadData()
}

function handleReset() {
  searchTitle.value = ''
  pagination.current = 1
  loadData()
}

function handleEdit(id: number) {
  router.push(`/admin/question/edit/${id}`)
}

async function handleDelete(id: number) {
  try {
    const res: any = await deleteQuestion({ id })
    if (res.data.code === 0) {
      message.success('删除成功')
      loadData()
    } else {
      message.error(res.data.message || '删除失败')
    }
  } catch {
    message.error('请求失败')
  }
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
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 6px;
}

.page-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.create-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
  border: none !important;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.3);
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.search-input {
  width: 280px;
}

.pagination-wrap {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

<style>
.question-table .ant-table {
  background: #ffffff !important;
  border: 1px solid rgba(99, 102, 241, 0.12) !important;
  border-radius: 12px !important;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.06) !important;
}

.question-table .ant-table-thead > tr > th {
  background: rgba(99, 102, 241, 0.04) !important;
  border-bottom: 1px solid rgba(99, 102, 241, 0.1) !important;
  color: #64748b !important;
  font-size: 13px !important;
  font-weight: 600 !important;
}

.question-table .ant-table-tbody > tr > td {
  border-bottom: 1px solid rgba(99, 102, 241, 0.06) !important;
}

.question-table .ant-table-tbody > tr:hover > td {
  background: rgba(99, 102, 241, 0.04) !important;
}
</style>
