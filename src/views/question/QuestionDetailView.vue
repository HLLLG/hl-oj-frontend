<template>
  <div class="detail-page">
    <div class="detail-layout">
      <!-- Left Panel: Problem Description -->
      <div class="left-panel">
        <div v-if="pageLoading" class="loading-state">
          <a-spin size="large" />
        </div>
        <template v-else-if="question">
          <!-- Problem Header -->
          <div class="problem-header">
            <router-link to="/problems" class="back-link">
              <ArrowLeftOutlined /> 返回题目列表
            </router-link>
            <h1 class="problem-title">{{ question.title }}</h1>
            <div class="problem-meta">
              <a-tag
                v-for="tag in question.tags"
                :key="tag"
                :color="getTagColor(tag)"
                class="meta-tag"
              >
                {{ tag }}
              </a-tag>
            </div>
            <a-descriptions title="判题条件">
              <a-descriptions-item label="时间限制">{{
                question.judgeConfig.timeLimit ?? 0
              }}</a-descriptions-item>
              <a-descriptions-item label="内存限制">{{
                question.judgeConfig.memoryLimit ?? 0
              }}</a-descriptions-item>
              <a-descriptions-item label="堆栈限制">{{
                question.judgeConfig.stackLimit ?? 0
              }}</a-descriptions-item>
            </a-descriptions>
            <div class="problem-stats">
              <span>提交：{{ question.submitNum ?? 0 }}</span>
              <span>通过：{{ question.acceptedNum ?? 0 }}</span>
              <span v-if="question.submitNum">
                通过率：{{ computeAcRate(question.submitNum, question.acceptedNum) }}%
              </span>
            </div>
          </div>

          <!-- Tabs -->
          <a-tabs v-model:active-key="activeTab" class="detail-tabs">
            <a-tab-pane key="description" tab="题目描述">
              <div class="md-content">
                <MdPreview
                  :model-value="question.content || '暂无题目内容'"
                  preview-theme="github"
                />
              </div>
            </a-tab-pane>

            <a-tab-pane key="submissions" tab="提交记录" @change="loadMySubmissions">
              <div class="submissions-panel">
                <a-table
                  :data-source="mySubmissions"
                  :columns="submissionColumns"
                  :loading="submissionsLoading"
                  :pagination="{ pageSize: 10, size: 'small' }"
                  row-key="id"
                  size="small"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'status'">
                      <a-tag :color="getSubmitStatusColor(record)">
                        {{ getSubmitStatusText(record) }}
                      </a-tag>
                    </template>
                    <template v-else-if="column.key === 'judgeInfo'">
                      <span v-if="record.judgeInfo?.time !== undefined"
                        >{{ record.judgeInfo.time }} ms</span
                      >
                      <span v-else>-</span>
                    </template>
                    <template v-else-if="column.key === 'createTime'">
                      {{ formatDate(record.createTime) }}
                    </template>
                  </template>
                </a-table>
              </div>
            </a-tab-pane>
          </a-tabs>
        </template>
        <a-result v-else status="404" title="题目不存在" sub-title="请检查题目 ID 是否正确">
          <template #extra>
            <a-button type="primary" @click="router.push('/problems')">返回题目列表</a-button>
          </template>
        </a-result>
      </div>

      <!-- Right Panel: Code Editor -->
      <div class="right-panel">
        <!-- Language Selector -->
        <div class="editor-toolbar">
          <a-select
            v-model:value="language"
            :options="languageOptions"
            class="lang-select"
            @change="handleLanguageChange"
          />
          <span class="toolbar-tip">按 Ctrl+/ 注释 · Ctrl+Z 撤销</span>
        </div>

        <!-- Monaco Editor -->
        <div class="editor-wrapper">
          <vue-monaco-editor
            v-model:value="code"
            :language="monacoLang"
            theme="vs-dark"
            height="100%"
            :options="monacoOptions"
          >
            <template #default>
              <div class="editor-loading">
                <a-spin />
                <span>编辑器加载中...</span>
              </div>
            </template>
          </vue-monaco-editor>
        </div>

        <!-- Submit -->
        <div class="submit-area">
          <a-button
            type="primary"
            size="large"
            :loading="submitting"
            class="submit-btn"
            @click="handleSubmit"
          >
            {{ submitting ? '判题中...' : '提交代码' }}
          </a-button>
        </div>

        <!-- Judge Result -->
        <transition name="fade">
          <div v-if="submitResult" class="judge-result" :class="getResultPanelClass(submitResult)">
            <div class="result-main">
              <span class="result-status-text">{{ getSubmitStatusText(submitResult) }}</span>
              <a-space v-if="submitResult.judgeInfo" :size="20" class="result-info">
                <span v-if="submitResult.judgeInfo.time !== undefined">
                  <ClockCircleOutlined /> {{ submitResult.judgeInfo.time }} ms
                </span>
                <span v-if="submitResult.judgeInfo.memory !== undefined">
                  <DatabaseOutlined /> {{ submitResult.judgeInfo.memory }} KB
                </span>
              </a-space>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined, ClockCircleOutlined, DatabaseOutlined } from '@ant-design/icons-vue'
import { MdPreview } from 'md-editor-v3'
import { getQuestionVoById } from '@/api/questionController'
import {
  doQuestionSubmit,
  getQuestionSubmitVoById,
  listQuestionSubmitVoByPage,
} from '@/api/questionSubmitController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import type { TableColumnsType } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()
const loginUserStore = useLoginUserStore()
const questionId = route.params.id as string

const pageLoading = ref(true)
const question = ref<any>(null)

const activeTab = ref('description')

const language = ref('java')
const code = ref('')
const submitting = ref(false)
const submitResult = ref<any>(null)

const mySubmissions = ref<any[]>([])
const submissionsLoading = ref(false)

let pollTimer: ReturnType<typeof setInterval> | null = null

const languageOptions = [
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'python', label: 'Python3' },
  { value: 'go', label: 'Go' },
]

const monacoLangMap: Record<string, string> = {
  java: 'java',
  cpp: 'cpp',
  python: 'python',
  go: 'go',
}

const monacoLang = computed(() => monacoLangMap[language.value] ?? 'plaintext')

const codeTemplates: Record<string, string> = {
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
    }
}`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // Your code here

    return 0;
}`,
  python: `import sys
input = sys.stdin.readline

# Your code here
`,
  go: `package main

import (
    "bufio"
    "fmt"
    "os"
)

func main() {
    reader := bufio.NewReader(os.Stdin)
    writer := bufio.NewWriter(os.Stdout)
    defer writer.Flush()
    _ = reader

    // Your code here
    fmt.Fprintln(writer)
}
`,
}

const monacoOptions = {
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  fontSize: 14,
  tabSize: 4,
  automaticLayout: true,
  wordWrap: 'on' as const,
}

const submissionColumns: TableColumnsType = [
  { title: '状态', key: 'status', width: 120 },
  { title: '语言', dataIndex: 'language', key: 'language', width: 80 },
  { title: '用时', key: 'judgeInfo', width: 80 },
  { title: '提交时间', key: 'createTime', width: 150 },
]

function getTagColor(tag: string): string {
  if (tag === '简单') return 'green'
  if (tag === '中等') return 'orange'
  if (tag === '困难') return 'red'
  return 'blue'
}

function computeAcRate(submitNum?: number, acceptedNum?: number): string {
  if (!submitNum || submitNum === 0) return '0.0'
  return (((acceptedNum ?? 0) / submitNum) * 100).toFixed(1)
}

const judgeMessageMap: Record<string, string> = {
  Accepted: '通过',
  'Wrong Answer': '答案错误',
  'Time Limit Exceeded': '超时',
  'Memory Limit Exceeded': '内存超限',
  'Compile Error': '编译错误',
  'Runtime Error': '运行错误',
  'System Error': '系统错误',
}

function getSubmitStatusText(record: any): string {
  if (record.status === 0) return '等待中'
  if (record.status === 1) return '判题中'
  const msg = record.judgeInfo?.message as string | undefined
  const display = msg ? judgeMessageMap[msg] : undefined
  if (display) return display
  if (record.status === 2) return '通过'
  if (record.status === 3) return '失败'
  return '未知'
}

function getSubmitStatusColor(record: any): string {
  if (record.status === 0 || record.status === 1) return 'default'
  const msg = record.judgeInfo?.message
  if (msg === 'Accepted') return 'success'
  if (record.status === 2) return 'success'
  return 'error'
}

function getResultPanelClass(record: any): string {
  const msg = record.judgeInfo?.message
  if (msg === 'Accepted' || record.status === 2) return 'result-ac'
  if (record.status === 0 || record.status === 1) return 'result-pending'
  return 'result-fail'
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

function handleLanguageChange(val: string) {
  code.value = codeTemplates[val] ?? ''
}

async function loadQuestion() {
  pageLoading.value = true
  try {
    const res: any = await getQuestionVoById({ id: questionId as any })
    if (res.data.code === 0 && res.data.data) {
      question.value = res.data.data
    }
  } catch {
    message.error('加载题目失败')
  } finally {
    pageLoading.value = false
  }
}

async function loadMySubmissions() {
  if (!loginUserStore.loginUser?.id) return
  submissionsLoading.value = true
  try {
    const res: any = await listQuestionSubmitVoByPage({
      questionId: questionId as any,
      userId: loginUserStore.loginUser.id,
      current: 1,
      pageSize: 20,
    })
    if (res.data.code === 0) {
      mySubmissions.value = res.data.data?.records ?? []
    }
  } finally {
    submissionsLoading.value = false
  }
}

async function handleSubmit() {
  if (!loginUserStore.loginUser?.id) {
    message.warning('请先登录后再提交代码')
    router.push(`/user/login?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }
  if (!code.value.trim()) {
    message.warning('请先编写代码')
    return
  }

  submitting.value = true
  submitResult.value = null

  try {
    const res: any = await doQuestionSubmit({
      language: language.value,
      code: code.value,
      questionId: questionId as any,
    })
    if (res.data.code !== 0) {
      message.error(res.data.message || '提交失败')
      submitting.value = false
      return
    }
    const submitId = res.data.data
    startPolling(submitId)
  } catch {
    message.error('提交失败，请检查网络')
    submitting.value = false
  }
}

function startPolling(submitId: number) {
  if (pollTimer) clearInterval(pollTimer)
  let attempts = 0
  pollTimer = setInterval(async () => {
    attempts++
    if (attempts > 40) {
      clearInterval(pollTimer!)
      pollTimer = null
      submitting.value = false
      message.warning('判题超时，请稍后在提交记录中查看结果')
      return
    }
    try {
      const res: any = await getQuestionSubmitVoById({ id: submitId })
      if (res.data.code === 0 && res.data.data) {
        const status = res.data.data.status
        if (status >= 2) {
          clearInterval(pollTimer!)
          pollTimer = null
          submitResult.value = res.data.data
          submitting.value = false
          if (activeTab.value === 'submissions') {
            loadMySubmissions()
          }
        }
      }
    } catch {
      clearInterval(pollTimer!)
      pollTimer = null
      submitting.value = false
    }
  }, 1500)
}

watch(activeTab, (val) => {
  if (val === 'submissions') loadMySubmissions()
})

onMounted(() => {
  code.value = codeTemplates[language.value] ?? ''
  loadQuestion()
})

onBeforeUnmount(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<style scoped>
.detail-page {
  background: var(--oj-bg);
  height: calc(100vh - 64px);
  overflow: hidden;
}

.detail-layout {
  display: flex;
  height: 100%;
}

/* Left Panel */
.left-panel {
  width: 48%;
  min-width: 380px;
  max-width: 700px;
  overflow-y: auto;
  border-right: 1px solid rgba(99, 102, 241, 0.12);
  padding: 24px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 13px;
  text-decoration: none;
  margin-bottom: 16px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #6366f1;
}

.problem-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px;
  line-height: 1.4;
}

.problem-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.meta-tag {
  border-radius: 6px;
  font-size: 12px;
}

.problem-stats {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.detail-tabs {
  flex: 1;
}

.md-content {
  padding-bottom: 40px;
}

.submissions-panel {
  padding: 8px 0;
}

/* Right Panel */
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #1e1e1e;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: #252526;
}

.lang-select {
  width: 120px;
}

.toolbar-tip {
  font-size: 12px;
  color: #6b7280;
}

.editor-wrapper {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.editor-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
  color: #6b7280;
  font-size: 14px;
}

.submit-area {
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  gap: 12px;
  background: #252526;
}

.submit-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
  border: none !important;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.35);
}

/* Judge Result */
.judge-result {
  margin: 0 16px 16px;
  padding: 16px 20px;
  border-radius: 10px;
  border: 1px solid;
}

.result-ac {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.35);
}

.result-fail {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.35);
}

.result-pending {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.35);
}

.result-main {
  display: flex;
  align-items: center;
  gap: 24px;
}

.result-status-text {
  font-size: 16px;
  font-weight: 700;
  color: #e2e8f0;
}

.result-info {
  font-size: 13px;
  color: #94a3b8;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

<style>
.detail-tabs .ant-tabs-nav {
  padding: 0 !important;
  margin-bottom: 16px !important;
}
</style>
