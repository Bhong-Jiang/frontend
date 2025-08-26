<template>
  <div class="home">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">查询系统</h1>
        <p class="page-subtitle">后端使用render部署，故长时间无调用时会休眠，首次使用请耐心等待</p>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="container">
      <!-- 查询表单 -->
      <el-card class="search-card">
        <template #header>
          <div class="card-header">
            <span><el-icon><Search /></el-icon> 课程查询</span>
          </div>
        </template>
        
        <el-form :model="searchForm" @submit.prevent="handleSearch">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-input
                v-model="searchForm.query"
                placeholder="请输入课程名称、课程代码、教学班、开课学院、学年或学期"
                size="large"
                clearable
                @keyup.enter="handleSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-select
                v-model="searchForm.academic_year"
                placeholder="选择学年"
                size="large"
                clearable
                style="width: 100%"
              >
                <el-option label="2025-2026" value="2025-2026" />
                <el-option label="2024-2025" value="2024-2025" />
                <el-option label="2023-2024" value="2023-2024" />
                <el-option label="2022-2023" value="2022-2023" />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select
                v-model="searchForm.semester"
                placeholder="选择学期"
                size="large"
                clearable
                style="width: 100%"
              >
                <el-option label="第一学期" :value="1" />
                <el-option label="第二学期" :value="2" />
              </el-select>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 15px">
            <el-col :span="24">
              <el-button
                type="primary"
                size="large"
                :loading="loading"
                @click="handleSearch"
                style="width: 100%"
              >
                <el-icon><Search /></el-icon>
                查询
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <!-- 查询结果 -->
      <el-card v-if="searchResult" class="result-card">
        <template #header>
          <div class="card-header">
            <span><el-icon><Document /></el-icon> 查询结果</span>
            <el-tag
              :type="searchResult.exists ? 'success' : 'info'"
              size="large"
            >
              {{ searchResult.exists ? '找到相关课程' : '未找到相关课程' }}
            </el-tag>
          </div>
        </template>

                 <div v-if="searchResult.exists && searchResult.results.length > 0">
           <el-table :data="searchResult.results" stripe>
             <el-table-column prop="course_name" label="课程名称" min-width="150" />
             <el-table-column prop="academic_year" label="学年" width="120" />
             <el-table-column prop="semester" label="学期" width="80">
               <template #default="{ row }">
                 {{ row.semester === 1 ? '第一学期' : '第二学期' }}
               </template>
             </el-table-column>
             <el-table-column prop="college" label="开课学院" min-width="120" />
             <el-table-column prop="course_code" label="课程代码" width="100" />
             <el-table-column prop="class_code" label="教学班" width="120" />
             <el-table-column prop="credit" label="学分" width="80" />
                           <el-table-column label="成绩信息" min-width="200">
                <template #default="{ row }">
                  <div v-if="row.grade_items && row.grade_items.length > 1">
                    <div v-for="item in row.grade_items" :key="item.grade_item" class="grade-item">
                      <el-tag 
                        size="small" 
                        :type="getTagType(item.grade_item)"
                        class="grade-tag"
                      >
                        {{ item.grade_item }}
                      </el-tag>
                      <span class="score-text">{{ item.score }}</span>
                    </div>
                  </div>
                  <div v-else>
                    <el-tag size="small" type="info">{{ row.grade_item }}</el-tag>
                    <span class="score-text">{{ row.score }}</span>
                  </div>
                </template>
              </el-table-column>
           </el-table>
           
           <div class="result-summary">
             <el-text type="success">
               共找到 {{ searchResult.results.length }} 门相关课程
             </el-text>
           </div>
         </div>

        <div v-else-if="!searchResult.exists" class="no-result">
          <el-empty description="未找到相关课程信息">
            <el-text type="info">
              请尝试使用其他关键词进行搜索
            </el-text>
          </el-empty>
        </div>
      </el-card>

      <!-- 管理员入口 -->
      <el-card class="admin-card">
        <template #header>
          <div class="card-header">
            <span><el-icon><Setting /></el-icon> 管理员功能</span>
          </div>
        </template>
        
        <div class="admin-actions">
          <el-button type="primary" @click="$router.push('/login')">
            <el-icon><User /></el-icon>
            管理员登录
          </el-button>
          <el-text type="info" size="small">
            管理员可以添加、修改、删除课程信息
          </el-text>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { searchCourses } from '@/api/courses'
import { ElMessage } from 'element-plus'

export default {
  name: 'Home',
  setup() {
    const loading = ref(false)
    const searchResult = ref(null)
    
    const searchForm = reactive({
      query: '',
      academic_year: '',
      semester: ''
    })

              const handleSearch = async () => {
       // 允许空查询，显示所有课程
       loading.value = true
      try {
        const searchData = {}
        if (searchForm.query.trim()) {
          searchData.query = searchForm.query.trim()
        }
        if (searchForm.academic_year) {
          searchData.academic_year = searchForm.academic_year
        }
        if (searchForm.semester) {
          searchData.semester = searchForm.semester
        }
        
        const response = await searchCourses(searchData)
        if (response.success) {
          searchResult.value = response.data
          if (response.data.exists) {
            ElMessage.success(`查询成功，找到 ${response.data.results.length} 条记录`)
          } else {
            ElMessage.info('未找到相关课程信息')
          }
        }
      } catch (error) {
        console.error('查询失败:', error)
      } finally {
        loading.value = false
      }
    }

         // 获取标签类型
     const getTagType = (gradeItem) => {
       if (gradeItem.includes('总评')) return 'success';
       if (gradeItem.includes('期末')) return 'warning';
       if (gradeItem.includes('期中')) return 'info';
       if (gradeItem.includes('实验')) return 'danger';
       if (gradeItem.includes('平时')) return 'primary';
       return 'info';
     };

            return {
         loading,
         searchForm,
         searchResult,
         handleSearch,
         getTagType
       }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  margin-bottom: 30px;
}

.page-title {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 10px;
}

.page-subtitle {
  text-align: center;
  color: #7f8c8d;
}

.search-card {
  margin-bottom: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.result-card {
  margin-bottom: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.result-summary {
  margin-top: 20px;
  text-align: center;
}

.no-result {
  text-align: center;
  padding: 40px 0;
}

.admin-card {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.admin-actions {
  text-align: center;
}

.admin-actions .el-button {
  margin-bottom: 15px;
}

 .admin-actions .el-text {
   display: block;
 }



 .grade-item {
   display: flex;
   align-items: center;
   gap: 8px;
   margin-bottom: 5px;
 }

 .grade-tag {
   min-width: 60px;
   text-align: center;
 }

 .score-text {
   font-weight: 500;
   color: #409EFF;
   min-width: 40px;
   text-align: right;
 }
</style>
