// 缓存序列化器实现

import { CacheSerializer } from '@/types/cache.ts'

// JSON序列化器
export class JSONSerializer<T = any> implements CacheSerializer<T> {
  serialize(value: T): string {
    try {
      return JSON.stringify(value)
    } catch (error) {
      throw new Error(`Serialization failed: ${error}`)
    }
  }

  deserialize(data: string): T {
    try {
      return JSON.parse(data)
    } catch (error) {
      throw new Error(`Deserialization failed: ${error}`)
    }
  }
}

// 二进制序列化器
export class BinarySerializer<T = any> implements CacheSerializer<T> {
  serialize(value: T): string {
    try {
      if (value instanceof ArrayBuffer) {
        return this.arrayBufferToString(value)
      } else if (value instanceof Uint8Array) {
        return this.uint8ArrayToString(value)
      } else {
        // 尝试转换为ArrayBuffer
        const jsonString = JSON.stringify(value)
        const encoder = new TextEncoder()
        const uint8Array = encoder.encode(jsonString)
        return this.uint8ArrayToString(uint8Array)
      }
    } catch (error) {
      throw new Error(`Binary serialization failed: ${error}`)
    }
  }

  deserialize(data: string): T {
    try {
      const uint8Array = this.stringToUint8Array(data)
      const decoder = new TextDecoder()
      const jsonString = decoder.decode(uint8Array)
      return JSON.parse(jsonString)
    } catch (error) {
      throw new Error(`Binary deserialization failed: ${error}`)
    }
  }

  private arrayBufferToString(buffer: ArrayBuffer): string {
    const uint8Array = new Uint8Array(buffer)
    return this.uint8ArrayToString(uint8Array)
  }

  private uint8ArrayToString(uint8Array: Uint8Array): string {
    return Array.from(uint8Array, byte => String.fromCharCode(byte)).join('')
  }

  private stringToUint8Array(str: string): Uint8Array {
    return new Uint8Array(Array.from(str, char => char.charCodeAt(0)))
  }
}

// Base64序列化器
export class Base64Serializer<T = any> implements CacheSerializer<T> {
  serialize(value: T): string {
    try {
      const jsonString = JSON.stringify(value)
      return btoa(jsonString)
    } catch (error) {
      throw new Error(`Base64 serialization failed: ${error}`)
    }
  }

  deserialize(data: string): T {
    try {
      const jsonString = atob(data)
      return JSON.parse(jsonString)
    } catch (error) {
      throw new Error(`Base64 deserialization failed: ${error}`)
    }
  }
}

// 压缩序列化器
export class CompressedSerializer<T = any> implements CacheSerializer<T> {
  private baseSerializer: CacheSerializer<T>

  constructor(baseSerializer: CacheSerializer<T> = new JSONSerializer<T>()) {
    this.baseSerializer = baseSerializer
  }

  async serialize(value: T): Promise<string> {
    try {
      const serialized = this.baseSerializer.serialize(value)
      const serializedStr = serialized instanceof Promise ? await serialized : serialized
      
      // 使用简单的压缩算法（实际项目中可以使用更高效的压缩库）
      const compressed = await this.compress(serializedStr)
      return compressed
    } catch (error) {
      throw new Error(`Compressed serialization failed: ${error}`)
    }
  }

  async deserialize(data: string): Promise<T> {
    try {
      const decompressed = await this.decompress(data)
      const result = this.baseSerializer.deserialize(decompressed)
      return result instanceof Promise ? await result : result
    } catch (error) {
      throw new Error(`Compressed deserialization failed: ${error}`)
    }
  }

  private async compress(data: string): Promise<string> {
    // 简单的压缩实现（实际项目中可以使用pako等压缩库）
    const encoder = new TextEncoder()
    const dataArray = encoder.encode(data)
    
    // 使用LZ-string风格的简单压缩
    return this.simpleCompress(dataArray)
  }

  private async decompress(data: string): Promise<string> {
    // 简单的解压缩实现
    const decompressed = this.simpleDecompress(data)
    const decoder = new TextDecoder()
    return decoder.decode(decompressed)
  }

  private simpleCompress(data: Uint8Array): string {
    // 简单的RLE压缩
    let compressed = ''
    let count = 1
    let current = data[0]

    for (let i = 1; i < data.length; i++) {
      if (data[i] === current && count < 255) {
        count++
      } else {
        compressed += String.fromCharCode(count) + String.fromCharCode(current)
        current = data[i]
        count = 1
      }
    }
    compressed += String.fromCharCode(count) + String.fromCharCode(current)

    return compressed
  }

  private simpleDecompress(data: string): Uint8Array {
    const result: number[] = []
    
    for (let i = 0; i < data.length; i += 2) {
      const count = data.charCodeAt(i)
      const value = data.charCodeAt(i + 1)
      
      for (let j = 0; j < count; j++) {
        result.push(value)
      }
    }

    return new Uint8Array(result)
  }
}

// 加密序列化器
export class EncryptedSerializer<T = any> implements CacheSerializer<T> {
  private baseSerializer: CacheSerializer<T>
  private key: string

  constructor(key: string, baseSerializer: CacheSerializer<T> = new JSONSerializer<T>()) {
    this.key = key
    this.baseSerializer = baseSerializer
  }

  async serialize(value: T): Promise<string> {
    try {
      const serialized = this.baseSerializer.serialize(value)
      const serializedStr = serialized instanceof Promise ? await serialized : serialized
      const encrypted = await this.encrypt(serializedStr)
      return encrypted
    } catch (error) {
      throw new Error(`Encrypted serialization failed: ${error}`)
    }
  }

  async deserialize(data: string): Promise<T> {
    try {
      const decrypted = await this.decrypt(data)
      const result = this.baseSerializer.deserialize(decrypted)
      return result instanceof Promise ? await result : result
    } catch (error) {
      throw new Error(`Encrypted deserialization failed: ${error}`)
    }
  }

  private async encrypt(data: string): Promise<string> {
    // 简单的XOR加密（实际项目中应该使用更安全的加密算法）
    const keyBytes = new TextEncoder().encode(this.key)
    const dataBytes = new TextEncoder().encode(data)
    const encrypted = new Uint8Array(dataBytes.length)

    for (let i = 0; i < dataBytes.length; i++) {
      encrypted[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length]
    }

    return btoa(String.fromCharCode(...encrypted))
  }

  private async decrypt(data: string): Promise<string> {
    // 简单的XOR解密
    const encrypted = new Uint8Array(atob(data).split('').map(char => char.charCodeAt(0)))
    const keyBytes = new TextEncoder().encode(this.key)
    const decrypted = new Uint8Array(encrypted.length)

    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ keyBytes[i % keyBytes.length]
    }

    return new TextDecoder().decode(decrypted)
  }
}

// 序列化器工厂
export class SerializerFactory {
  static createJSON<T = any>(): CacheSerializer<T> {
    return new JSONSerializer<T>()
  }

  static createBinary<T = any>(): CacheSerializer<T> {
    return new BinarySerializer<T>()
  }

  static createBase64<T = any>(): CacheSerializer<T> {
    return new Base64Serializer<T>()
  }

  static createCompressed<T = any>(baseSerializer?: CacheSerializer<T>): CacheSerializer<T> {
    return new CompressedSerializer<T>(baseSerializer)
  }

  static createEncrypted<T = any>(key: string, baseSerializer?: CacheSerializer<T>): CacheSerializer<T> {
    return new EncryptedSerializer<T>(key, baseSerializer)
  }
}

