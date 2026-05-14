<template>
  <div class="create-page">
    <div class="create-container">
      <div class="page-header">
        <a-button class="back-btn" @click="router.push('/admin/question')">
          <template #icon><ArrowLeftOutlined /></template>
          返回管理列表
        </a-button>
        <h1 class="page-title">新建题目</h1>
      </div>

      <a-form
        :model="formState"
        layout="vertical"
        class="question-form"
        @finish="handleSubmit"
      >
        <!-- Title -->
        <a-form-item label="题目标题" name="title" :rules="[{ required: true, message: '请输入题目标题' }]">
          <a-input v-model:value="formState.title" placeholder="请输入题目标题" size="large" />
        </a-form-item>

        <!-- Tags -->
        <a-form-item label="标签（含难度）" name="tags">
          <a-select
            v-model:value="formState.tags"
            mode="tags"
            placeholder="输入标签后回车，难度标签：简单 / 中等 / 困难"
            :token-separators="[',']"
            class="tag-select"
          >
            <a-select-option v-for="t in tagSuggestions" :key="t" :value="t">{{ t }}</a-select-option>
          </a-select>
        </a-form-item>

        <!-- Content -->
        <a-form-item label="题目内容（Markdown）" name="content" :rules="[{ required: true, message: '请填写题目内容' }]">
          <MdEditor v-model="formState.content" preview-theme="github" :height="380" />
        </a-form-item>

        <!-- Answer -->
        <a-form-item label="参考答案（Markdown，仅管理员可见）" name="answer">
          <MdEditor v-model="formState.answer" preview-theme="github" :height="280" />
        </a-form-item>

        <!-- Judge Cases -->
        <a-form-item label="测试用例">
          <div class="judge-cases">
            <div v-for="(item, idx) in formState.judgeCase" :key="idx" class="case-row">
              <span class="case-num">用例 {{ idx + 1 }}</span>
              <a-textarea
                v-model:value="item.input"
                placeholder="输入"
                :rows="2"
                class="case-input"
              />
              <span class="case-arrow">→</span>
              <a-textarea
                v-model:value="item.output"
                placeholder="输出"
                :rows="2"
                class="case-input"
              />
              <a-button
                type="text"
                danger
                :disabled="formState.judgeCase.length <= 1"
                @click="removeCase(idx)"
              >
                <template #icon><DeleteOutlined /></template>
              </a-button>
            </div>
            <a-button type="dashed" block class="add-case-btn" @click="addCase">
              <template #icon><PlusOutlined /></template>
              添加测试用例
            </a-button>
          </div>
        </a-form-item>

        <!-- Judge Config -->
        <a-form-item label="评判配置">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="时间限制（ms）" class="sub-form-item">
                <a-input-number
                  v-model:value="formState.judgeConfig.timeLimit"
                  :min="0"
                  :max="60000"
                  placeholder="1000"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="内存限制（KB）" class="sub-form-item">
                <a-input-number
                  v-model:value="formState.judgeConfig.memoryLimit"
                  :min="0"
                  :max="524288"
                  placeholder="262144"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="堆栈限制（KB）" class="sub-form-item">
                <a-input-number
                  v-model:value="formState.judgeConfig.stackLimit"
                  :min="0"
                  :max="524288"
                  placeholder="262144"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>

        <!-- Actions -->
        <a-form-item>
          <a-space>
            <a-button
              type="primary"
              html-type="submit"
              :loading="submitting"
              size="large"
              class="submit-btn"
            >
              发布题目
            </a-button>
            <a-button size="large" @click="router.push('/admin/question')">取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { MdEditor } from 'md-editor-v3'
import { addQuestion } from '@/api/questionController'

const router = useRouter()
const submitting = ref(false)

const tagSuggestions = [
  '简单', '中等', '困难',
  '数组', '字符串', '哈希表', '链表', '树', '图',
  '动态规划', '贪心', '二分', '排序', '栈', '队列', '递归', '回溯',
]

const formState = reactive({
  title: '',
  tags: [] as string[],
  content: '',
  answer: '',
  judgeCase: [{ input: '', output: '' }] as Array<{ input: string; output: string }>,
  judgeConfig: {
    timeLimit: 1000,
    memoryLimit: 262144,
    stackLimit: 262144,
  },
})

function addCase() {
  formState.judgeCase.push({ input: '', output: '' })
}

function removeCase(idx: number) {
  formState.judgeCase.splice(idx, 1)
}

async function handleSubmit() {
  submitting.value = true
  try {
    const res: any = await addQuestion({
      title: formState.title,
      tags: formState.tags,
      content: formState.content,
      answer: formState.answer,
      judgeCase: formState.judgeCase,
      judgeConfig: formState.judgeConfig,
    })
    if (res.data.code === 0) {
      message.success('题目创建成功！')
      router.push('/admin/question')
    } else {
      message.error(res.data.message || '创建失败')
    }
  } catch {
    message.error('请求失败，请检查网络')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.create-page {
  background: var(--oj-bg);
  min-height: 100%;
  padding: 40px 0 80px;
}

.create-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.back-btn {
  background: #ffffff;
  border: 1px solid rgba(99, 102, 241, 0.25);
  color: #64748b !important;
  border-radius: 8px;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.question-form {
  background: #ffffff;
  border: 1px solid rgba(99, 102, 241, 0.12);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.07);
}

.tag-select {
  width: 100%;
}

.judge-cases {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.case-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.case-num {
  font-size: 13px;
  color: #94a3b8;
  white-space: nowrap;
  padding-top: 6px;
  min-width: 44px;
}

.case-arrow {
  color: #94a3b8;
  padding-top: 6px;
}

.case-input {
  flex: 1;
}

.add-case-btn {
  margin-top: 4px;
  border-color: rgba(99, 102, 241, 0.25) !important;
  color: #6366f1 !important;
  border-radius: 8px !important;
}

.sub-form-item {
  margin-bottom: 0;
}

.submit-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
  border: none !important;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(99, 102, 241, 0.3);
}
</style>
