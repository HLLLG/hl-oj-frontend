<template>
  <div class="problems-page">
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">题目列表</h1>
          <p class="page-desc">从入门到进阶，覆盖全算法知识体系</p>
        </div>
        <div class="header-actions">
          <a-input-search
            v-model:value="searchText"
            placeholder="搜索题目..."
            class="search-input"
            allow-clear
            @search="handleSearch"
          />
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="filter-group">
          <span class="filter-label">难度</span>
          <a-radio-group v-model:value="difficulty" button-style="solid" class="diff-radio" @change="handleFilter">
            <a-radio-button value="">全部</a-radio-button>
            <a-radio-button value="简单">简单</a-radio-button>
            <a-radio-button value="中等">中等</a-radio-button>
            <a-radio-button value="困难">困难</a-radio-button>
          </a-radio-group>
        </div>

        <div class="filter-group">
          <span class="filter-label">标签</span>
          <a-select
            v-model:value="selectedTag"
            placeholder="选择标签"
            class="tag-select"
            allow-clear
            @change="handleFilter"
          >
            <a-select-option v-for="tag in tags" :key="tag" :value="tag">{{ tag }}</a-select-option>
          </a-select>
        </div>

        <div class="filter-stats">
          共 <strong>{{ pagination.total }}</strong> 道题目
        </div>
      </div>

      <!-- Problem Table -->
      <a-table
        :data-source="problemList"
        :columns="columns"
        :loading="loading"
        :pagination="false"
        row-key="id"
        class="problem-table"
        :custom-row="customRow"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <MinusCircleOutlined class="status-unsolved" />
          </template>

          <template v-else-if="column.key === 'id'">
            <span class="col-id">{{ record.id }}</span>
          </template>

          <template v-else-if="column.key === 'title'">
            <span class="col-title">{{ record.title }}</span>
          </template>

          <template v-else-if="column.key === 'difficulty'">
            <a-tag
              v-if="getDifficulty(record.tags)"
              :color="difficultyColor(getDifficulty(record.tags))"
              class="difficulty-tag"
            >
              {{ getDifficulty(record.tags) }}
            </a-tag>
            <span v-else class="muted">-</span>
          </template>

          <template v-else-if="column.key === 'tags'">
            <div class="tag-list">
              <a-tag
                v-for="tag in getAlgoTags(record.tags)"
                :key="tag"
                class="algo-tag"
              >
                {{ tag }}
              </a-tag>
            </div>
          </template>

          <template v-else-if="column.key === 'acRate'">
            <div class="ac-rate">
              <a-progress
                :percent="computeAcRate(record.submitNum, record.acceptedNum)"
                :show-info="false"
                size="small"
                stroke-color="#6366f1"
                trail-color="rgba(99,102,241,0.1)"
                class="ac-progress"
              />
              <span class="ac-text">{{ computeAcRate(record.submitNum, record.acceptedNum).toFixed(1) }}%</span>
            </div>
          </template>
        </template>
      </a-table>

      <!-- Pagination -->
      <div class="pagination-wrap">
        <a-pagination
          v-model:current="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :show-size-changer="false"
          show-quick-jumper
          @change="loadData"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MinusCircleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import { listQuestionVoByPage } from '@/api/questionController'

const router = useRouter()

const loading = ref(false)
const problemList = ref<any[]>([])
const searchText = ref('')
const difficulty = ref('')
const selectedTag = ref<string | undefined>(undefined)

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
})

const tags = ['数组', '字符串', '动态规划', '树', '图', '贪心', '二分', '哈希表', '排序', '栈']

const difficultyTags = new Set(['简单', '中等', '困难'])

function getDifficulty(tagList?: string[]): string {
  if (!tagList) return ''
  return tagList.find((t) => difficultyTags.has(t)) ?? ''
}

function getAlgoTags(tagList?: string[]): string[] {
  if (!tagList) return []
  return tagList.filter((t) => !difficultyTags.has(t))
}

function computeAcRate(submitNum?: number, acceptedNum?: number): number {
  if (!submitNum || submitNum === 0) return 0
  return ((acceptedNum ?? 0) / submitNum) * 100
}

const columns: TableColumnsType = [
  { key: 'status', title: '', width: 40, align: 'center' },
  { key: 'id', title: '题号', dataIndex: 'id', width: 80 },
  { key: 'title', title: '题目', dataIndex: 'title' },
  { key: 'difficulty', title: '难度', width: 100 },
  { key: 'tags', title: '标签', width: 220 },
  { key: 'acRate', title: '通过率', width: 160 },
]

function difficultyColor(d: string) {
  const map: Record<string, string> = { 简单: 'success', 中等: 'warning', 困难: 'error' }
  return map[d] ?? 'default'
}

function handleSearch() {
  pagination.current = 1
  loadData()
}

function handleFilter() {
  pagination.current = 1
  loadData()
}

function customRow(record: any) {
  return {
    style: 'cursor:pointer;',
    onClick: () => router.push(`/question/${record.id}`),
  }
}

async function loadData() {
  loading.value = true
  try {
    const tagFilter: string[] = []
    if (difficulty.value) tagFilter.push(difficulty.value)
    if (selectedTag.value) tagFilter.push(selectedTag.value)

    const res: any = await listQuestionVoByPage({
      current: pagination.current,
      pageSize: pagination.pageSize,
      title: searchText.value || undefined,
      tags: tagFilter.length > 0 ? tagFilter : undefined,
    })
    if (res.data.code === 0 && res.data.data) {
      problemList.value = res.data.data.records ?? []
      pagination.total = res.data.data.total ?? 0
    } else {
      message.error(res.data.message || '加载失败')
    }
  } catch {
    message.error('请求失败，请检查后端服务是否启动')
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.problems-page {
  background: var(--oj-bg);
  min-height: 100%;
  padding: 40px 0 80px;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
  margin: 0 0 6px;
}

.page-desc {
  font-size: 14px;
  color: #64748b;
}

.search-input {
  width: 280px;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 16px 20px;
  background: #ffffff;
  border: 1px solid rgba(99, 102, 241, 0.12);
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.05);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  font-size: 13px;
  color: #64748b;
  white-space: nowrap;
}

.tag-select {
  min-width: 140px;
}

.filter-stats {
  margin-left: auto;
  font-size: 13px;
  color: #94a3b8;
}

.filter-stats strong {
  color: #6366f1;
}

.pagination-wrap {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* Table */
.col-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #94a3b8;
}

.col-title {
  font-size: 15px;
  color: #334155;
  font-weight: 500;
  transition: color 0.2s;
}

.difficulty-tag {
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.algo-tag {
  border-radius: 6px;
  font-size: 12px;
  background: rgba(99, 102, 241, 0.08) !important;
  border-color: rgba(99, 102, 241, 0.2) !important;
  color: #6366f1 !important;
}

.ac-rate {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ac-progress {
  flex: 1;
  max-width: 80px;
}

.ac-text {
  font-size: 13px;
  color: #94a3b8;
  min-width: 40px;
}

.status-unsolved {
  color: #cbd5e1;
  font-size: 16px;
}

.muted {
  color: #94a3b8;
}
</style>

<style>
.problem-table .ant-table {
  background: #ffffff !important;
  border: 1px solid rgba(99, 102, 241, 0.12) !important;
  border-radius: 12px !important;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.06) !important;
}

.problem-table .ant-table-thead > tr > th {
  background: rgba(99, 102, 241, 0.04) !important;
  border-bottom: 1px solid rgba(99, 102, 241, 0.1) !important;
  color: #64748b !important;
  font-size: 13px !important;
  font-weight: 600 !important;
}

.problem-table .ant-table-tbody > tr > td {
  border-bottom: 1px solid rgba(99, 102, 241, 0.06) !important;
}

.problem-table .ant-table-tbody > tr:hover > td {
  background: rgba(99, 102, 241, 0.04) !important;
}

.problem-table .ant-table-tbody > tr:hover .col-title {
  color: #6366f1 !important;
}

/* RadioButton light style */
.diff-radio .ant-radio-button-wrapper {
  background: #ffffff !important;
  border-color: rgba(99, 102, 241, 0.2) !important;
  color: #64748b !important;
  font-size: 13px !important;
}

.diff-radio .ant-radio-button-wrapper-checked {
  background: #6366f1 !important;
  border-color: #6366f1 !important;
  color: #ffffff !important;
}
</style>
