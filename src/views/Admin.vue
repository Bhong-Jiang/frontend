<template>
  <div class="admin-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <div>
                    <h1 class="page-title">查询系统管理后台</h1>
        <p class="page-subtitle">课程成绩信息管理</p>
          </div>
          <div class="header-actions">
            <el-button type="primary" @click="showAddDialog = true">
              <el-icon><Plus /></el-icon>
              添加课程
            </el-button>
            <el-button @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="container">
      <!-- 统计信息 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="8">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-icon">
                <el-icon size="40" color="#409EFF"><Document /></el-icon>
              </div>
              <div class="stats-info">
                               <div class="stats-number">{{ uniqueCourseCount }}</div>
               <div class="stats-label">总课程数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-icon">
                <el-icon size="40" color="#67C23A"><Calendar /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ currentYear }}</div>
                <div class="stats-label">当前学年</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-icon">
                <el-icon size="40" color="#E6A23C"><School /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ uniqueColleges.length }}</div>
                <div class="stats-label">开课学院</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 课程列表 -->
      <el-card class="course-list-card">
        <template #header>
          <div class="card-header">
            <span><el-icon><List /></el-icon> 课程列表</span>
            <div class="header-controls">
              <el-input
                v-model="searchQuery"
                placeholder="搜索课程..."
                style="width: 300px; margin-right: 15px"
                clearable
                @input="handleSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-button @click="refreshList">
                <el-icon><Refresh /></el-icon>
                刷新
              </el-button>
            </div>
          </div>
        </template>

        <el-table
          :data="filteredCourseList"
          stripe
          v-loading="loading"
          style="width: 100%"
        >
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
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button
                type="primary"
                size="small"
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 添加/编辑课程对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingCourse ? '编辑课程' : '添加课程'"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="courseFormRef"
        :model="courseForm"
        :rules="courseRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="课程名称" prop="course_name">
              <el-input v-model="courseForm.course_name" placeholder="请输入课程名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学年" prop="academic_year">
              <el-input v-model="courseForm.academic_year" placeholder="如：2024-2025" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学期" prop="semester">
              <el-select v-model="courseForm.semester" placeholder="请选择学期" style="width: 100%">
                <el-option label="第一学期" :value="1" />
                <el-option label="第二学期" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开课学院" prop="college">
              <el-input v-model="courseForm.college" placeholder="请输入开课学院" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="课程代码" prop="course_code">
              <el-input v-model="courseForm.course_code" placeholder="请输入课程代码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教学班" prop="class_code">
              <el-input v-model="courseForm.class_code" placeholder="请输入教学班" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学分" prop="credit">
              <el-input-number
                v-model="courseForm.credit"
                :min="0"
                :precision="1"
                style="width: 100%"
                placeholder="请输入学分"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成绩" prop="score">
              <el-input v-model="courseForm.score" placeholder="请输入成绩" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="成绩分项" prop="grade_item">
          <el-input v-model="courseForm.grade_item" placeholder="请输入成绩分项" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ editingCourse ? '更新' : '添加' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getAllCourses, addCourse, updateCourse, deleteCourse } from '@/api/courses'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'Admin',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const courseFormRef = ref(null)
    const loading = ref(false)
    const submitting = ref(false)
    const showAddDialog = ref(false)
    const editingCourse = ref(null)
    const courseList = ref([])
    const searchQuery = ref('')

    const courseForm = reactive({
      course_name: '',
      academic_year: '',
      semester: 1,
      college: '',
      course_code: '',
      class_code: '',
      credit: 0,
      score: '',
      grade_item: ''
    })

    const courseRules = {
      course_name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
      academic_year: [{ required: true, message: '请输入学年', trigger: 'blur' }],
      semester: [{ required: true, message: '请选择学期', trigger: 'change' }],
      college: [{ required: true, message: '请输入开课学院', trigger: 'blur' }],
      course_code: [{ required: true, message: '请输入课程代码', trigger: 'blur' }],
      class_code: [{ required: true, message: '请输入教学班', trigger: 'blur' }],
      credit: [{ required: true, message: '请输入学分', trigger: 'blur' }],
      score: [{ required: true, message: '请输入成绩', trigger: 'blur' }],
      grade_item: [{ required: true, message: '请输入成绩分项', trigger: 'blur' }]
    }

    // 计算属性
    const filteredCourseList = computed(() => {
      if (!searchQuery.value) return courseList.value
      const query = searchQuery.value.toLowerCase()
      return courseList.value.filter(course => 
        course.course_name.toLowerCase().includes(query) ||
        course.course_code.toLowerCase().includes(query) ||
        course.college.toLowerCase().includes(query)
      )
    })

    const currentYear = computed(() => {
      const now = new Date()
      const year = now.getFullYear()
      return `${year}-${year + 1}`
    })

    const uniqueColleges = computed(() => {
      return [...new Set(courseList.value.map(course => course.college))]
    })

    // 计算唯一课程数量（基于课程名称、学期、开课学院、课程代码、教学班，不包括学年）
    const uniqueCourseCount = computed(() => {
      const uniqueCourses = new Set()
      courseList.value.forEach(course => {
        const key = `${course.course_name}-${course.semester}-${course.college}-${course.course_code}-${course.class_code}`
        uniqueCourses.add(key)
      })
      return uniqueCourses.size
    })

    // 方法
    const loadCourses = async () => {
      loading.value = true
      try {
        const response = await getAllCourses()
        if (response.success) {
          courseList.value = response.data
        }
      } catch (error) {
        console.error('加载课程失败:', error)
      } finally {
        loading.value = false
      }
    }

    const handleSearch = () => {
      // 搜索逻辑已在计算属性中处理
    }

    const refreshList = () => {
      loadCourses()
      searchQuery.value = ''
    }

    const resetForm = () => {
      editingCourse.value = null
      Object.assign(courseForm, {
        course_name: '',
        academic_year: '',
        semester: 1,
        college: '',
        course_code: '',
        class_code: '',
        credit: 0,
        score: '',
        grade_item: ''
      })
      if (courseFormRef.value) {
        courseFormRef.value.resetFields()
      }
    }

    const handleEdit = (course) => {
      editingCourse.value = course
      Object.assign(courseForm, { ...course })
      showAddDialog.value = true
    }

    const handleDelete = async (course) => {
      try {
        await ElMessageBox.confirm(
          `确定要删除课程"${course.course_name}"吗？`,
          '确认删除',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )

        const response = await deleteCourse(course.id)
        if (response.success) {
          ElMessage.success('删除成功')
          loadCourses()
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
        }
      }
    }

    const handleSubmit = async () => {
      if (!courseFormRef.value) return

      try {
        await courseFormRef.value.validate()
        submitting.value = true

        let response
        if (editingCourse.value) {
          response = await updateCourse(editingCourse.value.id, courseForm)
        } else {
          response = await addCourse(courseForm)
        }

        if (response.success) {
          ElMessage.success(editingCourse.value ? '更新成功' : '添加成功')
          showAddDialog.value = false
          loadCourses()
          resetForm()
        }
      } catch (error) {
        console.error('提交失败:', error)
      } finally {
        submitting.value = false
      }
    }

    const handleLogout = () => {
      authStore.logout()
      router.push('/')
      ElMessage.success('已退出登录')
    }

    // 生命周期
    onMounted(() => {
      loadCourses()
    })

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
         courseFormRef,
         loading,
         submitting,
         showAddDialog,
         editingCourse,
         courseList,
         searchQuery,
         courseForm,
         courseRules,
         filteredCourseList,
         currentYear,
         uniqueColleges,
         uniqueCourseCount,
         handleSearch,
         refreshList,
         resetForm,
         handleEdit,
         handleDelete,
         handleSubmit,
         handleLogout,
         getTagType
       }
  }
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background: #fff;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.stats-row {
  margin-bottom: 30px;
}

.stats-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.stats-content {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stats-icon {
  margin-right: 20px;
}

.stats-number {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 5px;
}

.stats-label {
  color: #909399;
  font-size: 14px;
}

.course-list-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-controls {
  display: flex;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .stats-row .el-col {
    margin-bottom: 20px;
  }
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
