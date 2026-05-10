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
          <a-radio-group v-model:value="difficulty" button-style="solid" class="diff-radio">
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
          >
            <a-select-option v-for="tag in tags" :key="tag" :value="tag">{{ tag }}</a-select-option>
          </a-select>
        </div>

        <div class="filter-stats">
          共 <strong>{{ filteredProblems.length }}</strong> 道题目
        </div>
      </div>

      <!-- Problem Table -->
      <a-table
        :data-source="filteredProblems"
        :columns="columns"
        :pagination="pagination"
        row-key="id"
        class="problem-table"
        :custom-row="customRow"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <CheckCircleFilled v-if="record.solved" class="status-solved" />
            <MinusCircleOutlined v-else class="status-unsolved" />
          </template>

          <template v-else-if="column.key === 'id'">
            <span class="col-id">{{ record.id }}</span>
          </template>

          <template v-else-if="column.key === 'title'">
            <span class="col-title">{{ record.title }}</span>
          </template>

          <template v-else-if="column.key === 'difficulty'">
            <a-tag :color="difficultyColor(record.difficulty)" class="difficulty-tag">
              {{ record.difficulty }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'tags'">
            <div class="tag-list">
              <a-tag v-for="tag in record.tags" :key="tag" class="algo-tag">{{ tag }}</a-tag>
            </div>
          </template>

          <template v-else-if="column.key === 'acRate'">
            <div class="ac-rate">
              <a-progress
                :percent="parseFloat(record.acRate)"
                :show-info="false"
                size="small"
                stroke-color="#6366f1"
                trail-color="rgba(99,102,241,0.1)"
                class="ac-progress"
              />
              <span class="ac-text">{{ record.acRate }}%</span>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckCircleFilled, MinusCircleOutlined } from '@ant-design/icons-vue'
import type { TableColumnsType } from 'ant-design-vue'

const searchText = ref('')
const difficulty = ref('')
const selectedTag = ref<string | undefined>(undefined)

const tags = ['数组', '字符串', '动态规划', '树', '图', '贪心', '二分', '哈希表', '排序', '栈']

const columns: TableColumnsType = [
  { key: 'status', title: '', width: 40, align: 'center' },
  { key: 'id', title: '#', dataIndex: 'id', width: 80 },
  { key: 'title', title: '题目', dataIndex: 'title' },
  { key: 'difficulty', title: '难度', dataIndex: 'difficulty', width: 100 },
  { key: 'tags', title: '标签', dataIndex: 'tags', width: 220 },
  { key: 'acRate', title: '通过率', dataIndex: 'acRate', width: 160 },
]

interface Problem {
  id: number
  title: string
  difficulty: string
  tags: string[]
  acRate: string
  solved: boolean
}

const problems: Problem[] = [
  { id: 1, title: '两数之和', difficulty: '简单', tags: ['数组', '哈希表'], acRate: '78.3', solved: true },
  { id: 2, title: '最长回文子串', difficulty: '中等', tags: ['字符串', '动态规划'], acRate: '41.5', solved: false },
  { id: 3, title: '接雨水', difficulty: '困难', tags: ['数组', '栈', '双指针'], acRate: '25.8', solved: false },
  { id: 4, title: '二叉树的最大深度', difficulty: '简单', tags: ['树', '递归'], acRate: '82.1', solved: true },
  { id: 5, title: '最小生成树', difficulty: '中等', tags: ['图', '贪心'], acRate: '55.6', solved: false },
  { id: 6, title: '爬楼梯', difficulty: '简单', tags: ['动态规划'], acRate: '88.0', solved: true },
  { id: 7, title: '编辑距离', difficulty: '困难', tags: ['字符串', '动态规划'], acRate: '32.4', solved: false },
  { id: 8, title: '最长公共子序列', difficulty: '中等', tags: ['字符串', '动态规划'], acRate: '47.2', solved: false },
  { id: 9, title: '快速排序', difficulty: '中等', tags: ['排序', '分治'], acRate: '61.8', solved: true },
  { id: 10, title: 'N皇后', difficulty: '困难', tags: ['回溯'], acRate: '18.9', solved: false },
]

const filteredProblems = computed(() => {
  return problems.filter((p) => {
    const matchSearch =
      !searchText.value ||
      p.title.includes(searchText.value) ||
      String(p.id).includes(searchText.value)
    const matchDiff = !difficulty.value || p.difficulty === difficulty.value
    const matchTag = !selectedTag.value || p.tags.includes(selectedTag.value)
    return matchSearch && matchDiff && matchTag
  })
})

const pagination = {
  pageSize: 20,
  showSizeChanger: false,
  showQuickJumper: true,
}

function difficultyColor(d: string) {
  const map: Record<string, string> = { 简单: 'success', 中等: 'warning', 困难: 'error' }
  return map[d] ?? 'default'
}

function handleSearch() {}

function customRow(_record: Problem) {
  return { style: 'cursor:pointer;' }
}
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
  color: #e2e8f0;
  letter-spacing: -0.5px;
  margin: 0 0 6px;
}

.page-desc {
  font-size: 14px;
  color: #475569;
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
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(99, 102, 241, 0.12);
  border-radius: 12px;
  margin-bottom: 20px;
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
  color: #475569;
}

.filter-stats strong {
  color: #818cf8;
}

/* Table */
.col-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #475569;
}

.col-title {
  font-size: 15px;
  color: #cbd5e1;
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
  background: rgba(99, 102, 241, 0.1) !important;
  border-color: rgba(99, 102, 241, 0.25) !important;
  color: #818cf8 !important;
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
  color: #64748b;
  min-width: 40px;
}

.status-solved {
  color: #22c55e;
  font-size: 16px;
}

.status-unsolved {
  color: #374151;
  font-size: 16px;
}
</style>

<style>
/* Table dark theme overrides */
.problem-table .ant-table {
  background: rgba(255, 255, 255, 0.02) !important;
  border: 1px solid rgba(99, 102, 241, 0.12) !important;
  border-radius: 12px !important;
}

.problem-table .ant-table-thead > tr > th {
  background: rgba(99, 102, 241, 0.06) !important;
  border-bottom: 1px solid rgba(99, 102, 241, 0.15) !important;
  color: #64748b !important;
  font-size: 13px !important;
  font-weight: 600 !important;
}

.problem-table .ant-table-tbody > tr > td {
  border-bottom: 1px solid rgba(99, 102, 241, 0.06) !important;
}

.problem-table .ant-table-tbody > tr:hover > td {
  background: rgba(99, 102, 241, 0.05) !important;
}

.problem-table .ant-table-tbody > tr:hover .col-title {
  color: #a5b4fc !important;
}

.problem-table .ant-pagination {
  margin-top: 20px !important;
}

/* Search input dark style */
.search-input .ant-input-affix-wrapper {
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(99, 102, 241, 0.25) !important;
  border-radius: 10px !important;
}

.search-input .ant-input {
  background: transparent !important;
  color: #e2e8f0 !important;
}

/* RadioButton dark style */
.diff-radio .ant-radio-button-wrapper {
  background: transparent !important;
  border-color: rgba(99, 102, 241, 0.25) !important;
  color: #64748b !important;
  font-size: 13px !important;
}

.diff-radio .ant-radio-button-wrapper-checked {
  background: rgba(99, 102, 241, 0.2) !important;
  border-color: #6366f1 !important;
  color: #a5b4fc !important;
}
</style>
