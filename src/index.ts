// expire过期时间key permanent永不过期
import { StorageCls, Key, Expire, Data, Result } from "./type";
import { Dictionaries } from "./enum";
export class Storage implements StorageCls {
  set<T>(key: Key, value: T, expire: Expire = Dictionaries.permanent) {
    const data = {
      value,
      [Dictionaries.expire]: expire
    }
    localStorage.setItem(key, JSON.stringify(data))
  }
  get<T>(key: Key):Result<T | null> {
    const value = localStorage.getItem(key)
    if (value) {
      const data: Data<T> = JSON.parse(value)
      const now = Date.now()
      // 判断时间戳是否过期
      if (typeof data[Dictionaries.expire] === 'number' && data[Dictionaries.expire] < now) {
        // 过期删除key
        this.remove(key)
        return {
          message: `${key}已过期`,
          value: null
        }
      } else {
        return {
          message: 'success',
          value: data.value
        }
      }
    } else {
      return {
        message: 'error',
        value: null
      }
    }
  }
  remove(key: Key) {
    localStorage.removeItem(key)
  }
  clear() {
    localStorage.clear()
  }
}