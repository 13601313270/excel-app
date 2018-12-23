/**
 * Created by ptmind on 2018/3/27.
 */
export default function(config) {
    return new Promise(function(resolve, reject) {
        config = Object.assign({
            type: 'GET',
            data: {},
            url: '',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            callbackname: '',
            charset: 'utf-8',
            dataType: ''
        }, config);

        function buildParams(prefix, obj, add) {
            var name;
            if (Array.isArray(obj)) {
                obj.forEach(function(v, i) {
                    var rbracket = /\[\]$/;
                    if (rbracket.test(prefix)) {
                        // Treat each array item as a scalar.
                        add(prefix, v);
                    } else {
                        // Item is non-scalar (array or object), encode its numeric index.
                        buildParams(
                            prefix + '[' + (typeof v === 'object' && v != null ? i : '') + ']',
                            v,
                            add
                        );
                    }
                });
            } else if (typeof obj === 'object') {
                // Serialize object item.
                for (name in obj) {
                    buildParams(prefix + '[' + name + ']', obj[name], add);
                }
            } else {
                // Serialize scalar item.
                add(prefix, obj);
            }
        }

        function jsonToQuery(obj) {
            let prefix;
            let s = [];

            function add(key, value) {
                s[s.length] = encodeURIComponent(key) + '=' +
                    encodeURIComponent(value == null ? '' : value);
            };

            // If an array was passed in, assume that it is an array of form elements.
            if (Array.isArray(obj)) {
                // Serialize the form elements
                obj.forEach(function() {
                    add(this.name, this.value);
                });
            } else {
                for (prefix in obj) {
                    buildParams(prefix, obj[prefix], add);
                }
            }

            // Return the resulting serialization
            return s.join('&');
        }

        if (config.dataType === 'jsonp') {
            var callbackName = config.callbackname || (
                'video_ajax_callback_' + parseInt(Math.random() * 10000000));
            var script = document.createElement('script');
            var head = document.getElementsByTagName('head')[0] || document.body;
            window[callbackName] = function(data) {
                resolve(data);
                window[callbackName] = null;
            };
            // 删除节点写在onload事件而不是window[callbackName]内，那样会导致IE6刷新的时候崩溃，诡异
            script.onload = function() {
                script.parentNode.removeChild(script);
            };
            script.charset = config.charset;
            script.async = false;
            config.data.callback = callbackName;
            script.src = config.url + (config.url.indexOf('?') === -1 ? '?' : '&') + jsonToQuery(config.data);
            head.insertBefore(script, head.firstChild);
        } else {
            let xhr = new XMLHttpRequest();
            if (config.type === 'GET') {
                config.url += ((config.url.indexOf('?') === -1 ? '?' : '&') + jsonToQuery(config.data));
            }
            // if (config['Content-Type'] === undefined) {
            //     config['Content-Type'] = 'application/json;charset=UTF-8';
            // }
            xhr.open(config.type, config.url, true);
            xhr.withCredentials = true;
            // 必须设置这个头部，不然接受不到数据
            xhr.setRequestHeader('Content-Type', config['Content-Type']);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    try {
                        var res = JSON.parse(xhr.responseText);
                        resolve(res);
                    } catch (e) {
                        reject(e);
                    }
                }
            };
            xhr.onerror = function(e) {
                reject(e);
            };
            if(['POST', 'PUT', 'DELETE'].includes(config.type)) {
                // xhr.send(JSON.stringify(config.data));
                // console.log(jsonToQuery(config.data));
                xhr.send(jsonToQuery(config.data));
            } else {
                xhr.send();
            }
        }
    });
}
/*
ajax({
    type: 'POST',
    url: 'http://www.tablehub.cn/action/connection.html',
    data: {
        type: 'getConnections'
    }
}).then((data) => {
    this.connections = data.connection;
    this.$store.commit('setConnections', data.connection);
});
*/
