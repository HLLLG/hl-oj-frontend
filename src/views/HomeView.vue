<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-bg">
        <div class="hero-glow glow-1" />
        <div class="hero-glow glow-2" />
        <div class="hero-grid" />
      </div>

      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot" />
          <span>在线评测系统 · 全新上线</span>
        </div>

        <h1 class="hero-title">
          <span class="title-line">在线编程</span>
          <span class="title-gradient">精进算法</span>
          <span class="title-line">挑战自我</span>
        </h1>

        <p class="hero-desc">
          覆盖数据结构、算法竞赛等 1000+ 精选题目 <br />
          实时判题 · 智能分析 · 让每一次提交都成为成长
        </p>

        <div class="hero-actions">
          <a-button type="primary" size="large" class="btn-primary-glow" @click="goToProblems">
            <template #icon><CodeOutlined /></template>
            开始刷题
          </a-button>
          <a-button size="large" class="btn-outline" @click="goToContests">
            <template #icon><TrophyOutlined /></template>
            参加竞赛
          </a-button>
        </div>

        <!-- Stats -->
        <div class="hero-stats">
          <div v-for="stat in stats" :key="stat.label" class="stat-item">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">为什么选择 <span class="gradient-text">HLOJ</span></h2>
          <p class="section-desc">专为竞赛选手和算法爱好者打造的高品质在线评测平台</p>
        </div>

        <div class="features-grid">
          <div v-for="feature in features" :key="feature.title" class="feature-card">
            <div class="feature-icon-wrap" :style="{ background: feature.bg }">
              <span class="feature-icon">{{ feature.icon }}</span>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Problems Section -->
    <section class="recent-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">热门题目</h2>
          <a-button type="link" class="view-all-btn" @click="goToProblems">查看全部 →</a-button>
        </div>

        <div class="problems-list">
          <div
            v-for="problem in recentProblems"
            :key="problem.id"
            class="problem-item"
            @click="() => {}"
          >
            <span class="problem-id">#{{ problem.id }}</span>
            <span class="problem-name">{{ problem.name }}</span>
            <a-tag :color="difficultyColor(problem.difficulty)" class="problem-tag">
              {{ problem.difficulty }}
            </a-tag>
            <span class="problem-ac">通过率 {{ problem.acRate }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { CodeOutlined, TrophyOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const goToProblems = () => router.push('/problems')
const goToContests = () => router.push('/contests')

const stats = [
  { value: '1,024+', label: '精选题目' },
  { value: '8,888+', label: '注册用户' },
  { value: '50W+', label: '代码提交' },
  { value: '99.9%', label: '系统在线率' },
]

const features = [
  {
    icon: '⚡',
    title: '毫秒级判题',
    desc: '高性能沙箱评测引擎，支持 C++/Java/Python 等主流语言，提交即评，结果即时可见',
    bg: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))',
  },
  {
    icon: '🏆',
    title: '在线竞赛',
    desc: '定期举办 ACM/OI 赛制竞赛，实时榜单，与全国选手同台竞技，检验真实水平',
    bg: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
  },
  {
    icon: '📊',
    title: '能力分析',
    desc: '多维度算法标签体系，智能分析薄弱点，个性化推题，高效精准提升',
    bg: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.05))',
  },
  {
    icon: '💡',
    title: '题解社区',
    desc: '海量高质量题解与思路分析，代码评论互动，知识共享，共同进步',
    bg: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))',
  },
]

const recentProblems = [
  { id: '001', name: '两数之和', difficulty: '简单', acRate: '78.3%' },
  { id: '002', name: '最长回文子串', difficulty: '中等', acRate: '41.5%' },
  { id: '003', name: '接雨水', difficulty: '困难', acRate: '25.8%' },
  { id: '004', name: '二叉树的最大深度', difficulty: '简单', acRate: '82.1%' },
  { id: '005', name: '最小生成树', difficulty: '中等', acRate: '55.6%' },
]

function difficultyColor(difficulty: string) {
  const map: Record<string, string> = {
    简单: 'success',
    中等: 'warning',
    困难: 'error',
  }
  return map[difficulty] ?? 'default'
}
</script>

<style scoped>
.home-page {
  background: var(--oj-bg);
}

/* ===== Hero ===== */
.hero-section {
  position: relative;
  min-height: 680px;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 80px 24px 60px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.35;
}

.glow-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #6366f1, transparent);
  top: -200px;
  left: -100px;
}

.glow-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #8b5cf6, transparent);
  bottom: -150px;
  right: -50px;
  opacity: 0.2;
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(99, 102, 241, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.06) 1px, transparent 1px);
  background-size: 60px 60px;
}

.hero-content {
  position: relative;
  max-width: 780px;
  margin: 0 auto;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 100px;
  font-size: 13px;
  color: #a5b4fc;
  margin-bottom: 32px;
  font-weight: 500;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6366f1;
  box-shadow: 0 0 8px #6366f1;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.hero-title {
  font-size: 64px;
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -2px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-line {
  color: #e2e8f0;
}

.title-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 17px;
  color: #64748b;
  line-height: 1.8;
  margin-bottom: 40px;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 56px;
}

.btn-primary-glow {
  height: 48px;
  padding: 0 28px;
  font-size: 15px;
  font-weight: 600;
  background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
  border: none !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 30px rgba(99, 102, 241, 0.5);
  transition: all 0.25s !important;
}

.btn-primary-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 40px rgba(99, 102, 241, 0.65) !important;
}

.btn-outline {
  height: 48px;
  padding: 0 28px;
  font-size: 15px;
  font-weight: 600;
  background: transparent !important;
  border: 1px solid rgba(99, 102, 241, 0.35) !important;
  border-radius: 12px !important;
  color: #a5b4fc !important;
  transition: all 0.25s !important;
}

.btn-outline:hover {
  border-color: #6366f1 !important;
  background: rgba(99, 102, 241, 0.08) !important;
  transform: translateY(-2px);
}

/* Stats */
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
  padding: 24px 0;
  border-top: 1px solid rgba(99, 102, 241, 0.12);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 26px;
  font-weight: 800;
  background: linear-gradient(135deg, #e2e8f0, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: #475569;
  margin-top: 4px;
}

/* ===== Sections ===== */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
}

.section-title {
  font-size: 32px;
  font-weight: 800;
  color: #e2e8f0;
  letter-spacing: -0.5px;
}

.gradient-text {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-desc {
  font-size: 16px;
  color: #475569;
  margin-top: 8px;
}

/* ===== Features ===== */
.features-section {
  padding: 80px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.feature-card {
  padding: 28px 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 16px;
  transition: all 0.3s;
  cursor: default;
}

.feature-card:hover {
  border-color: rgba(99, 102, 241, 0.4);
  background: rgba(99, 102, 241, 0.05);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.12);
}

.feature-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.feature-icon {
  font-size: 22px;
}

.feature-title {
  font-size: 17px;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 10px;
}

.feature-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
}

/* ===== Recent Problems ===== */
.recent-section {
  padding: 60px 0 100px;
}

.view-all-btn {
  color: #6366f1 !important;
  font-size: 14px;
  font-weight: 500;
}

.view-all-btn:hover {
  color: #818cf8 !important;
}

.problems-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.problem-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(99, 102, 241, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.problem-item:hover {
  border-color: rgba(99, 102, 241, 0.35);
  background: rgba(99, 102, 241, 0.05);
}

.problem-id {
  font-size: 13px;
  color: #475569;
  font-family: 'JetBrains Mono', monospace;
  min-width: 40px;
}

.problem-name {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: #cbd5e1;
  transition: color 0.2s;
}

.problem-item:hover .problem-name {
  color: #a5b4fc;
}

.problem-tag {
  border-radius: 6px;
  font-size: 12px;
}

.problem-ac {
  font-size: 13px;
  color: #475569;
  min-width: 90px;
  text-align: right;
}
</style>
