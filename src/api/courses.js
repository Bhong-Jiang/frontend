import request from '@/utils/request'

// 用户查询课程成绩
export const searchCourses = (data) => {
  return request({
    url: '/api/courses/search',
    method: 'post',
    data
  })
}

// 获取所有课程成绩（管理员）
export const getAllCourses = () => {
  return request({
    url: '/api/courses/all',
    method: 'get'
  })
}

// 添加课程成绩（管理员）
export const addCourse = (data) => {
  return request({
    url: '/api/courses/add',
    method: 'post',
    data
  })
}

// 修改课程成绩（管理员）
export const updateCourse = (id, data) => {
  return request({
    url: `/api/courses/update/${id}`,
    method: 'put',
    data
  })
}

// 删除课程成绩（管理员）
export const deleteCourse = (id) => {
  return request({
    url: `/api/courses/delete/${id}`,
    method: 'delete'
  })
}

// 获取单个课程成绩（管理员）
export const getCourseById = (id) => {
  return request({
    url: `/api/courses/${id}`,
    method: 'get'
  })
}
