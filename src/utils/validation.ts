// 验证规则类型
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

// 验证结果类型
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

// 验证单个字段
export const validateField = (value: any, rules: ValidationRule, fieldName: string): string | null => {
  // 必填验证
  if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return `${fieldName}是必填项`
  }

  // 如果值为空且不是必填，跳过其他验证
  if (!value && !rules.required) {
    return null
  }

  // 最小长度验证
  if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
    return `${fieldName}至少需要${rules.minLength}个字符`
  }

  // 最大长度验证
  if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
    return `${fieldName}不能超过${rules.maxLength}个字符`
  }

  // 正则表达式验证
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return `${fieldName}格式不正确`
  }

  // 自定义验证
  if (rules.custom) {
    return rules.custom(value)
  }

  return null
}

// 验证表单
export const validateForm = (data: Record<string, any>, rules: Record<string, ValidationRule>): ValidationResult => {
  const errors: Record<string, string> = {}

  Object.keys(rules).forEach(fieldName => {
    const fieldRules = rules[fieldName]
    const fieldValue = data[fieldName]
    const error = validateField(fieldValue, fieldRules, fieldName)
    
    if (error) {
      errors[fieldName] = error
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// 常用验证规则
export const commonRules = {
  required: { required: true },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    required: true,
    pattern: /^1[3-9]\d{9}$/
  },
  password: {
    required: true,
    minLength: 6,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/
  },
  url: {
    pattern: /^https?:\/\/.+\..+/
  },
  number: {
    pattern: /^\d+$/
  },
  decimal: {
    pattern: /^\d+(\.\d+)?$/
  }
}

// 验证器类
export class Validator {
  private rules: Record<string, ValidationRule> = {}

  addRule(fieldName: string, rules: ValidationRule) {
    this.rules[fieldName] = rules
    return this
  }

  validate(data: Record<string, any>): ValidationResult {
    return validateForm(data, this.rules)
  }

  validateField(fieldName: string, value: any): string | null {
    const rules = this.rules[fieldName]
    if (!rules) return null
    return validateField(value, rules, fieldName)
  }
}
