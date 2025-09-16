// 缓存压缩器实现

import { CacheCompressor } from '@/types/cache.ts'

// 简单压缩器
export class SimpleCompressor implements CacheCompressor {
  compress(data: string): string {
    // 简单的RLE压缩
    let compressed = ''
    let count = 1
    let current = data[0]

    for (let i = 1; i < data.length; i++) {
      if (data[i] === current && count < 255) {
        count++
      } else {
        compressed += String.fromCharCode(count) + current
        current = data[i]
        count = 1
      }
    }
    compressed += String.fromCharCode(count) + current

    return compressed
  }

  decompress(data: string): string {
    let decompressed = ''
    
    for (let i = 0; i < data.length; i += 2) {
      const count = data.charCodeAt(i)
      const char = data[i + 1]
      
      for (let j = 0; j < count; j++) {
        decompressed += char
      }
    }

    return decompressed
  }
}

// LZ77压缩器
export class LZ77Compressor implements CacheCompressor {
  private windowSize: number
  private bufferSize: number

  constructor(windowSize: number = 4096, bufferSize: number = 18) {
    this.windowSize = windowSize
    this.bufferSize = bufferSize
  }

  compress(data: string): string {
    const result: string[] = []
    let pos = 0

    while (pos < data.length) {
      const match = this.findLongestMatch(data, pos)
      
      if (match.length > 2) {
        // 编码匹配
        result.push(String.fromCharCode(match.distance >> 8))
        result.push(String.fromCharCode(match.distance & 0xFF))
        result.push(String.fromCharCode(match.length))
        pos += match.length
      } else {
        // 编码字面量
        result.push('\x00')
        result.push(data[pos])
        pos++
      }
    }

    return result.join('')
  }

  decompress(data: string): string {
    const result: string[] = []
    let pos = 0

    while (pos < data.length) {
      const flag = data.charCodeAt(pos)
      
      if (flag === 0) {
        // 字面量
        result.push(data[pos + 1])
        pos += 2
      } else {
        // 匹配
        const distance = (data.charCodeAt(pos) << 8) | data.charCodeAt(pos + 1)
        const length = data.charCodeAt(pos + 2)
        
        const start = result.length - distance
        for (let i = 0; i < length; i++) {
          result.push(result[start + i])
        }
        
        pos += 3
      }
    }

    return result.join('')
  }

  private findLongestMatch(data: string, pos: number): { distance: number; length: number } {
    let bestMatch = { distance: 0, length: 0 }
    const searchStart = Math.max(0, pos - this.windowSize)

    for (let i = searchStart; i < pos; i++) {
      let matchLength = 0
      
      while (
        matchLength < this.bufferSize &&
        pos + matchLength < data.length &&
        data[i + matchLength] === data[pos + matchLength]
      ) {
        matchLength++
      }

      if (matchLength > bestMatch.length) {
        bestMatch = {
          distance: pos - i,
          length: matchLength
        }
      }
    }

    return bestMatch
  }
}

// GZIP压缩器（需要浏览器支持）
export class GZIPCompressor implements CacheCompressor {
  async compress(data: string): Promise<string> {
    if (!window.CompressionStream) {
      throw new Error('CompressionStream not supported')
    }

    const stream = new CompressionStream('gzip')
    const writer = stream.writable.getWriter()
    const reader = stream.readable.getReader()

    // 写入数据
    const encoder = new TextEncoder()
    const dataArray = encoder.encode(data)
    await writer.write(dataArray)
    await writer.close()

    // 读取压缩数据
    const chunks: Uint8Array[] = []
    let done = false

    while (!done) {
      const { value, done: readerDone } = await reader.read()
      done = readerDone
      if (value) {
        chunks.push(value)
      }
    }

    // 合并chunks
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0

    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }

    return btoa(String.fromCharCode(...result))
  }

  async decompress(data: string): Promise<string> {
    if (!window.DecompressionStream) {
      throw new Error('DecompressionStream not supported')
    }

    const compressed = new Uint8Array(atob(data).split('').map(char => char.charCodeAt(0)))
    const stream = new DecompressionStream('gzip')
    const writer = stream.writable.getWriter()
    const reader = stream.readable.getReader()

    // 写入压缩数据
    await writer.write(compressed)
    await writer.close()

    // 读取解压数据
    const chunks: Uint8Array[] = []
    let done = false

    while (!done) {
      const { value, done: readerDone } = await reader.read()
      done = readerDone
      if (value) {
        chunks.push(value)
      }
    }

    // 合并chunks
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0

    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }

    const decoder = new TextDecoder()
    return decoder.decode(result)
  }
}

// 压缩器工厂
export class CompressorFactory {
  static createSimple(): CacheCompressor {
    return new SimpleCompressor()
  }

  static createLZ77(windowSize?: number, bufferSize?: number): CacheCompressor {
    return new LZ77Compressor(windowSize, bufferSize)
  }

  static createGZIP(): CacheCompressor {
    return new GZIPCompressor()
  }

  static createBest(): CacheCompressor {
    // 根据浏览器支持情况选择最佳压缩器
    if (window.CompressionStream && window.DecompressionStream) {
      return new GZIPCompressor()
    } else {
      return new LZ77Compressor()
    }
  }
}

