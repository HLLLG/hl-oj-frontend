<template>
  <div v-if="result" class="judge-result-panel" :class="panelClass">
    <div class="panel-header" @click="expanded = !expanded">
      <div class="header-main">
        <span class="result-status-text">{{ statusText }}</span>
        <a-space v-if="result.judgeInfo" :size="16" class="result-metrics">
          <span v-if="result.judgeInfo.time !== undefined">
            <ClockCircleOutlined /> {{ result.judgeInfo.time }} ms
          </span>
          <span v-if="result.judgeInfo.memory !== undefined">
            <DatabaseOutlined /> {{ result.judgeInfo.memory }} KB
          </span>
        </a-space>
      </div>
      <DownOutlined v-if="showBody" class="collapse-icon" :class="{ expanded }" />
    </div>

    <div v-if="showBody && expanded" class="panel-body">
      <template v-if="wrongAnswerDetail">
        <div class="detail-section">
          <div class="detail-label">失败测例 #{{ wrongAnswerDetail.caseIndex ?? 1 }}</div>
          <div v-if="wrongAnswerDetail.input !== undefined" class="detail-block">
            <span class="block-title">输入</span>
            <pre class="block-content">{{ wrongAnswerDetail.input || '(空)' }}</pre>
          </div>
          <div v-if="wrongAnswerDetail.expectedOutput !== undefined" class="detail-block">
            <span class="block-title">期望输出</span>
            <pre class="block-content">{{ wrongAnswerDetail.expectedOutput || '(空)' }}</pre>
          </div>
          <div v-if="wrongAnswerDetail.actualOutput !== undefined" class="detail-block">
            <span class="block-title">你的输出</span>
            <pre class="block-content actual-output">{{ wrongAnswerDetail.actualOutput || '(空)' }}</pre>
          </div>
        </div>
      </template>
      <template v-else-if="textDetail">
        <div class="detail-section">
          <div class="detail-label">{{ detailTitle }}</div>
          <pre class="block-content error-text">{{ textDetail }}</pre>
        </div>
      </template>
      <template v-else-if="accepted">
        <div class="detail-hint success-hint">恭喜通过！可以尝试优化时间或内存。</div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ClockCircleOutlined, DatabaseOutlined, DownOutlined } from '@ant-design/icons-vue'
import {
  getSubmitStatusText,
  getResultPanelClass,
  parseWrongAnswerDetail,
  isAccepted,
  hasJudgeDetail,
} from '@/utils/judgeResult'

const props = defineProps<{
  result: API.QuestionSubmitVO | null
}>()

const expanded = ref(true)

const statusText = computed(() => (props.result ? getSubmitStatusText(props.result) : ''))
const panelClass = computed(() => (props.result ? getResultPanelClass(props.result) : ''))
const accepted = computed(() => (props.result ? isAccepted(props.result) : false))
const wrongAnswerDetail = computed(() => {
  if (props.result?.judgeInfo?.message !== 'Wrong Answer') return null
  return parseWrongAnswerDetail(props.result.judgeInfo?.detail)
})
const textDetail = computed(() => {
  const detail = props.result?.judgeInfo?.detail?.trim()
  if (!detail || wrongAnswerDetail.value) return ''
  return detail
})
const detailTitle = computed(() => {
  const msg = props.result?.judgeInfo?.message
  if (msg === 'Compile Error') return '编译错误信息'
  if (msg === 'Runtime Error') return '运行错误信息'
  return '详细信息'
})
const showBody = computed(() => {
  if (!props.result) return false
  return accepted.value || hasJudgeDetail(props.result) || Boolean(textDetail.value)
})

watch(
  () => props.result,
  (val) => {
    if (!val) return
    expanded.value = !isAccepted(val) && hasJudgeDetail(val)
  },
  { immediate: true },
)
</script>

<style scoped>
.judge-result-panel {
  margin: 0 16px 16px;
  border-radius: 10px;
  border: 1px solid;
  overflow: hidden;
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

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  cursor: pointer;
  user-select: none;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.result-status-text {
  font-size: 16px;
  font-weight: 700;
  color: #e2e8f0;
}

.result-metrics {
  font-size: 13px;
  color: #94a3b8;
}

.collapse-icon {
  color: #94a3b8;
  font-size: 12px;
  transition: transform 0.2s;
}

.collapse-icon.expanded {
  transform: rotate(180deg);
}

.panel-body {
  padding: 0 18px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.detail-section {
  padding-top: 12px;
}

.detail-label {
  font-size: 13px;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 10px;
}

.detail-block {
  margin-bottom: 10px;
}

.block-title {
  display: block;
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.block-content {
  margin: 0;
  padding: 10px 12px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.25);
  color: #e2e8f0;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 160px;
  overflow-y: auto;
}

.actual-output {
  border: 1px solid rgba(239, 68, 68, 0.35);
}

.error-text {
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.detail-hint {
  padding-top: 12px;
  font-size: 13px;
}

.success-hint {
  color: #86efac;
}
</style>
