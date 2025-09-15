import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Sparkles, 
  Wand2, 
  Lightbulb, 
  BookOpen, 
  PenTool, 
  Target,
  RefreshCw,
  Send,
  Copy,
  Check,
  X
} from 'lucide-react'
import Button from '../UI/Button'
import Card from '../UI/Card'
import { playSuccessSound, playMagicSound } from '@/utils/audioEffects.ts'

interface AIWritingAssistantProps {
  className?: string
}

interface AIResponse {
  id: string
  type: 'suggestion' | 'rewrite' | 'expand' | 'summarize' | 'analyze'
  content: string
  confidence: number
  timestamp: number
}

const AIWritingAssistant: React.FC<AIWritingAssistantProps> = ({ className = '' }) => {
  const [isActive, setIsActive] = useState(false)
  const [inputText, setInputText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [responses, setResponses] = useState<AIResponse[]>([])
  const [selectedType, setSelectedType] = useState<'suggestion' | 'rewrite' | 'expand' | 'summarize' | 'analyze'>('suggestion')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const aiTypes = [
    { 
      type: 'suggestion' as const, 
      label: '智能建议', 
      icon: <Lightbulb className="w-4 h-4" />, 
      color: 'from-yellow-400 to-orange-500',
      description: '提供写作建议和改进意见'
    },
    { 
      type: 'rewrite' as const, 
      label: '重写优化', 
      icon: <PenTool className="w-4 h-4" />, 
      color: 'from-blue-400 to-cyan-500',
      description: '重写文本，提升表达效果'
    },
    { 
      type: 'expand' as const, 
      label: '内容扩展', 
      icon: <BookOpen className="w-4 h-4" />, 
      color: 'from-green-400 to-emerald-500',
      description: '扩展内容，增加细节描述'
    },
    { 
      type: 'summarize' as const, 
      label: '智能总结', 
      icon: <Target className="w-4 h-4" />, 
      color: 'from-purple-400 to-pink-500',
      description: '提取关键信息，生成摘要'
    },
    { 
      type: 'analyze' as const, 
      label: '文本分析', 
      icon: <Brain className="w-4 h-4" />, 
      color: 'from-indigo-400 to-blue-500',
      description: '分析文本质量、情感、风格'
    }
  ]

  // 模拟AI处理
  const processWithAI = async (type: string) => {
    setIsProcessing(true)
    playMagicSound()
    
    // 模拟AI处理延迟
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
    
    const mockResponses = {
      suggestion: [
        "建议使用更生动的动词来增强表达力",
        "可以添加更多感官细节来丰富场景描述",
        "考虑调整句子结构，使节奏更加流畅",
        "建议增加对话来推进情节发展"
      ],
      rewrite: [
        "经过重写，这段文字更加简洁有力：",
        "优化后的版本更加生动：",
        "重写建议，提升表达效果：",
        "改进版本，增强可读性："
      ],
      expand: [
        "扩展后的内容更加丰富：",
        "添加了更多细节描述：",
        "扩展版本，增加深度：",
        "丰富后的内容："
      ],
      summarize: [
        "核心要点总结：",
        "关键信息提取：",
        "主要内容概括：",
        "精华摘要："
      ],
      analyze: [
        "文本质量分析：优秀，情感色彩丰富",
        "写作风格：描述性强，节奏适中",
        "可读性评分：8.5/10",
        "建议改进：可以增加更多对话元素"
      ]
    }
    
    const responseContent = mockResponses[type as keyof typeof mockResponses]?.[
      Math.floor(Math.random() * mockResponses[type as keyof typeof mockResponses].length)
    ] || "AI处理完成"
    
    const newResponse: AIResponse = {
      id: Date.now().toString(),
      type: type as any,
      content: responseContent,
      confidence: 0.85 + Math.random() * 0.15,
      timestamp: Date.now()
    }
    
    setResponses(prev => [newResponse, ...prev.slice(0, 9)])
    setIsProcessing(false)
    playSuccessSound()
  }

  const handleSubmit = () => {
    if (!inputText.trim()) return
    processWithAI(selectedType)
  }

  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
      playSuccessSound()
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const clearResponses = () => {
    setResponses([])
    playMagicSound()
  }

  return (
    <div className={`relative ${className}`}>
      {/* AI助手激活按钮 */}
      <motion.div
        className="fixed bottom-6 right-6 z-[9999]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={() => setIsActive(!isActive)}
          className={`relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
            isActive 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Brain className="w-8 h-8 text-white mx-auto" />
          </motion.div>
          
          {/* 脉冲效果 */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      </motion.div>

      {/* AI助手面板 */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 w-96 max-h-[80vh] z-[9998]"
          >
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-white/20 shadow-2xl">
              <div className="p-6">
                {/* 头部 */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI写作助手</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">智能写作，提升效率</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsActive(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* AI功能类型选择 */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">选择AI功能</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {aiTypes.map((type) => (
                      <motion.button
                        key={type.type}
                        onClick={() => setSelectedType(type.type)}
                        className={`p-3 rounded-lg text-left transition-all ${
                          selectedType === type.type
                            ? 'bg-gradient-to-r ' + type.color + ' text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {type.icon}
                          <span className="text-sm font-medium">{type.label}</span>
                        </div>
                        <p className="text-xs opacity-80">{type.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* 输入区域 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    输入文本
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="输入您想要处理的文本..."
                    className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2 mb-6">
                  <Button
                    onClick={handleSubmit}
                    disabled={!inputText.trim() || isProcessing}
                    className="flex-1"
                    variant="primary"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        处理中...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        开始处理
                      </>
                    )}
                  </Button>
                  {responses.length > 0 && (
                    <Button
                      onClick={clearResponses}
                      variant="outline"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* AI响应列表 */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <AnimatePresence>
                    {responses.map((response) => (
                      <motion.div
                        key={response.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <Sparkles className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {aiTypes.find(t => t.type === response.type)?.label}
                            </span>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                              <span className="text-xs text-green-600 dark:text-green-400">
                                {Math.round(response.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopy(response.id, response.content)}
                            className="p-1 hover:bg-white/50 dark:hover:bg-gray-700 rounded transition-colors"
                          >
                            {copiedId === response.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {response.content}
                        </p>
                        <div className="mt-2 text-xs text-gray-400">
                          {new Date(response.timestamp).toLocaleTimeString()}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {responses.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Wand2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>输入文本开始使用AI助手</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AIWritingAssistant
