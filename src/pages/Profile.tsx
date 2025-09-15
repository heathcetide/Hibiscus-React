import { useState, useEffect } from 'react'
import { User, Mail, Calendar, Shield, Camera, Save, Edit3, X, Lock, Eye, EyeOff, Clock, Phone } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import Button from '../components/UI/Button'
import Input from '../components/UI/Input'
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/Card'
import FadeIn from '../components/Animations/FadeIn'
import { showAlert } from '../utils/notification'
import { getProfile, updateProfile, updatePreferences, changePassword, uploadAvatar } from '../api/profile'
import { motion } from 'framer-motion'

const Profile = () => {
  const { user, updateProfile: updateAuthStore } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    displayName: user?.displayName || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    locale: user?.locale || 'zh-CN',
    timezone: user?.timezone || 'Asia/Shanghai',
    gender: user?.gender || '',
    extra: user?.extra || '',
    avatar: user?.avatar || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // 页面加载时获取最新用户信息
  useEffect(() => {
    if (user) {
      setIsPageLoading(false); // 如果用户信息已存在，直接结束加载
      return; // 退出 useEffect，避免重复请求
    }

    const fetchUserProfile = async () => {
      try {
        setIsPageLoading(true)
        const response = await getProfile()
        if (response.code === 200 && response.data) {
          // 更新auth store中的用户信息
          updateAuthStore(response.data)
          // 更新表单数据
          setFormData({
            email: response.data.email || '',
            phone: response.data.phone || '',
            displayName: response.data.displayName || '',
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            locale: response.data.locale || 'zh-CN',
            timezone: response.data.timezone || 'Asia/Shanghai',
            gender: response.data.gender || '',
            extra: response.data.extra || '',
            avatar: response.data.avatar || '',
          })
          showAlert('用户信息已更新', 'success', '加载成功')
        } else {
          throw new Error(response.msg || '获取用户信息失败')
        }
      } catch (error: any) {
        showAlert(error?.msg || error?.message || '获取用户信息失败', 'error', '加载失败')
      } finally {
        setIsPageLoading(false)
      }
    }

    fetchUserProfile()
  }, [updateAuthStore])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await updateProfile(formData)
      if (response.code === 200) {
        updateAuthStore(response.data as any)
    setIsEditing(false)
        showAlert('个人资料已更新', 'success', '更新成功')
      } else {
        throw new Error(response.msg || '更新失败')
      }
    } catch (error: any) {
      showAlert(error?.msg || error?.message || '更新失败', 'error', '操作失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      email: user?.email || '',
      phone: user?.phone || '',
      displayName: user?.displayName || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      locale: user?.locale || 'zh-CN',
      timezone: user?.timezone || 'Asia/Shanghai',
      gender: user?.gender || '',
      extra: user?.extra || '',
      avatar: user?.avatar || '',
    })
    setIsEditing(false)
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showAlert('新密码和确认密码不匹配', 'error', '验证失败')
      return
    }

    setIsLoading(true)
    try {
      const response = await changePassword(passwordData)
      if (response.code === 200) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setIsChangingPassword(false)
        showAlert('密码修改成功', 'success', '操作成功')
      } else {
        throw new Error(response.msg || '密码修改失败')
      }
    } catch (error: any) {
      showAlert(error?.msg || error?.message || '密码修改失败', 'error', '操作失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      showAlert('头像文件大小不能超过5MB', 'error', '上传失败')
      return
    }

    setIsLoading(true)
    try {
      const response = await uploadAvatar(file)
      if (response.code === 200) {
        updateAuthStore({ avatar: response.data.avatar })
        showAlert('头像上传成功', 'success', '上传成功')
      } else {
        throw new Error(response.msg || '头像上传失败')
      }
    } catch (error: any) {
      showAlert(error?.msg || error?.message || '头像上传失败', 'error', '上传失败')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            请先登录
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            您需要登录才能访问个人资料页面
          </p>
        </div>
      </div>
    )
  }

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            加载中...
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            正在获取您的个人信息
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Profile Card */}
          <div className="xl:col-span-1">
            <FadeIn direction="left">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="text-center pb-6">
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-1">
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.displayName}&background=0ea5e9&color=fff&size=128`}
                        alt={user.displayName || 'User'}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <label className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-gray-200 dark:border-gray-600">
                      <Camera className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {user.displayName}
                  </CardTitle>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-200">
                    <Shield className="w-4 h-4 mr-1" />
                    {user.role === 'admin' ? '管理员' : '普通用户'}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">邮箱</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    
                    {user.phone && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">手机</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{user.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">加入时间</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '未知'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">最后登录</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('zh-CN') : '未知'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          {/* Profile Form */}
          <div className="xl:col-span-3 space-y-8">
            <FadeIn direction="right">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        基本信息
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                        更新您的个人信息和联系方式
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit3 className="w-4 h-4" />}
                        onClick={() => setIsEditing(true)}
                        disabled={isLoading}
                        className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        编辑
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<X className="w-4 h-4" />}
                          onClick={handleCancel}
                          disabled={isLoading}
                        >
                          取消
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<Save className="w-4 h-4" />}
                          onClick={handleSave}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                          {isLoading ? '保存中...' : '保存'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="显示名"
                      value={formData.displayName}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                      disabled={!isEditing}
                      leftIcon={<User className="w-5 h-5" />}
                      placeholder="请输入显示名"
                    />
                    
                    <Input
                      label="邮箱地址"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      leftIcon={<Mail className="w-5 h-5" />}
                      placeholder="请输入邮箱地址"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="名字"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                      leftIcon={<User className="w-5 h-5" />}
                      placeholder="请输入名字"
                    />
                    
                    <Input
                      label="姓氏"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                      leftIcon={<User className="w-5 h-5" />}
                      placeholder="请输入姓氏"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="手机号码"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      leftIcon={<Phone className="w-5 h-5" />}
                      placeholder="请输入手机号码"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        性别
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                      >
                        <option value="">请选择性别</option>
                        <option value="male">男</option>
                        <option value="female">女</option>
                        <option value="other">其他</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        时区
                      </label>
                      <select
                        value={formData.timezone}
                        onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                      >
                        <option value="Asia/Shanghai">Asia/Shanghai</option>
                        <option value="Asia/Tokyo">Asia/Tokyo</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        语言
                      </label>
                      <select
                        value={formData.locale}
                        onChange={(e) => setFormData(prev => ({ ...prev, locale: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                      >
                        <option value="zh-CN">简体中文</option>
                        <option value="zh-TW">繁體中文</option>
                        <option value="en-US">English</option>
                        <option value="ja-JP">日本語</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Input
                      label="额外信息"
                      value={formData.extra}
                      onChange={(e) => setFormData(prev => ({ ...prev, extra: e.target.value }))}
                      disabled={!isEditing}
                      leftIcon={<User className="w-5 h-5" />}
                      placeholder="请输入额外信息（可选）"
                      helperText="可以填写个人简介、兴趣爱好等"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        用户角色
                      </label>
                      <div className="flex items-center space-x-2 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">
                          {user.role === 'admin' ? '管理员' : '普通用户'}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        账户状态
                      </label>
                      <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">
                          活跃
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

            {/* User Preferences */}
            <FadeIn direction="right" delay={0.1}>
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    偏好设置
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                    管理您的通知偏好和其他设置
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            邮件通知
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            接收系统邮件通知和更新
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={user?.emailNotifications || false}
                          onChange={async (e) => {
                            const newValue = e.target.checked
                            // 先更新本地状态，提供即时反馈
                            updateAuthStore({ emailNotifications: newValue })
                            
                            try {
                              const response = await updatePreferences({
                                emailNotifications: newValue
                              })
                              if (response.code === 200) {
                                showAlert('偏好设置已更新', 'success', '更新成功')
                              } else {
                                throw new Error(response.msg || '更新失败')
                              }
                            } catch (error: any) {
                              // 如果更新失败，回滚本地状态
                              updateAuthStore({ emailNotifications: !newValue })
                              showAlert(error?.msg || error?.message || '更新失败', 'error', '操作失败')
                            }
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Security Settings */}
            <FadeIn direction="right" delay={0.2}>
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    安全设置
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                    管理您的密码和安全选项
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-200 dark:border-red-800">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              更改密码
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              定期更新密码以保护账户安全
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsChangingPassword(!isChangingPassword)}
                          disabled={isLoading}
                          className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          {isChangingPassword ? '取消' : '更改'}
                        </Button>
                      </div>
                    
                    {isChangingPassword && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <Input
                          label="当前密码"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          leftIcon={<Lock className="w-5 h-5" />}
                          rightIcon={
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                            >
                              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          }
                          placeholder="请输入当前密码"
                        />
                        
                        <Input
                          label="新密码"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          leftIcon={<Lock className="w-5 h-5" />}
                          rightIcon={
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                            >
                              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          }
                          placeholder="请输入新密码"
                        />
                        
                        <Input
                          label="确认新密码"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          leftIcon={<Lock className="w-5 h-5" />}
                          rightIcon={
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          }
                          placeholder="请再次输入新密码"
                        />
                        
                        <div className="flex space-x-3">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsChangingPassword(false)
                              setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                            }}
                            disabled={isLoading}
                            className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            取消
                          </Button>
                          <Button
                            variant="primary"
                            onClick={handlePasswordChange}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                          >
                            {isLoading ? '修改中...' : '确认修改'}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            两步验证
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            为您的账户添加额外的安全保护
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        启用
                      </Button>
                    </div>
                  
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
