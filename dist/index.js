// 字典 Dictionaries  expire过期时间key permanent永不过期
var Dictionaries;
(function (Dictionaries) {
    Dictionaries["permanent"] = "permanent";
    Dictionaries["expire"] = "__expire__";
})(Dictionaries || (Dictionaries = {}));

class Storage {
    set(key, value, expire = Dictionaries.permanent) {
        const data = {
            value,
            [Dictionaries.expire]: expire
        };
        localStorage.setItem(key, JSON.stringify(data));
    }
    get(key) {
        const value = localStorage.getItem(key);
        if (value) {
            const data = JSON.parse(value);
            const now = Date.now();
            // 判断时间戳是否过期
            if (typeof data[Dictionaries.expire] === 'number' && data[Dictionaries.expire] < now) {
                // 过期删除key
                this.remove(key);
                return {
                    message: `${key}已过期`,
                    value: null
                };
            }
            else {
                return {
                    message: 'success',
                    value: data.value
                };
            }
        }
        else {
            return {
                message: 'error',
                value: null
            };
        }
    }
    remove(key) {
        localStorage.removeItem(key);
    }
    clear() {
        localStorage.clear();
    }
}

export { Storage };
