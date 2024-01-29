/* 工具类 */
import axios from 'axios';
import mock from '@/api/mock/index.js';

var utils = (function (e) {
  const env = import.meta.env.MODE;
  const baseUrl = env == "development" ? '/api/' : import.meta.env.VITE_BASE_API;
  const ua = navigator.userAgent.toLowerCase();
  let platform = 'pc';
  try {
    if (ua.match('mobile')) {
      platform = 'mobile';
    } else {
      platform = 'pc';
    }
  } catch (e) {
    platform = 'pc';
  }

  const obj = {
    constant: {
      baseUrl: baseUrl,
      platform: platform,
      env: env
    },
    globalData: {
      ajaxRequest: {},
      userInfo: undefined,
      loading: undefined,
      uploadPolicy: undefined,
    },
    /**
     * ajax 请求
     * @param {object} args
     * @param {string} args.url - 请求URL
     * @param {object} [args.params] - 请求参数
     * @param {string} [args.method=get] - 请求类型，get、post、put...
     * @param {number} [args.timeout] - 请求超时
     * @param {object} [args.headers] - 请求头
     *  
     */
    ajax: function (args) {
      let ts = new Date().getTime();
      let ajaxRequestKey = this.isDefine(args.params) ? (args.url + JSON.stringify(args.params).substring(0, 300)) : args.url;
      let ajaxRequest = this.globalData.ajaxRequest[ajaxRequestKey];
      return new Promise((resolve, reject) => {
        if (env == 'mock') {
          console.log(args.url)
          return resolve(mock(args.url));
        }
        if (!this.isDefine(ajaxRequest) || (ts - ajaxRequest > 500)) {
          this.globalData.ajaxRequest[ajaxRequestKey] = ts;
          if (typeof (args.progress) == "string") {
            this.progress.show(args.progress);
          }
          let userInfo = this.getUser();
          let headers = {
            'Content-Encoding': 'gzip',
            'Content-Type': 'application/json',
            'token': userInfo.token ? userInfo.token : '',
            'appName': userInfo.appName ? userInfo.appName : '',
          };
          if (this.isDefine(args.headers)) {
            for (let key in args.headers) {
              headers[key] = args.headers[key];
            }
          }

          args['method'] = this.isDefine(args.method) ? args.method.toLowerCase() : 'get';
          if (args.method == 'post' || args.method == 'put' || args.method == 'delete') {
            if (!args.hasOwnProperty('data')) {
              if (headers['Content-Type'].indexOf('multipart/form-data') >= 0) {
                console.warn("请将表单数据放在data里");
                args.error && args.error(false);
                return reject(false);
              } else {
                args['data'] = this.isDefine(args.params) ? args.params : {};
                delete args.params;
              }
            }
          }
          // 创建axios实例
          let axios = e.axios.create({
            baseURL: baseUrl,
            timeout: args.timeout ? args.timeout : 10000, // 请求超时时间
            headers: headers,
            withCredentials: false
          });
          // request拦截器
          axios.interceptors.request.use(function (params) {
            return params;
          }, function (error) {
            console.log(error);
            args.error && args.error(error);
            return reject(error);
          });
          // 响应拦截器
          axios.interceptors.response.use(response => {
            if (typeof (args.progress) == "string") {
              this.progress.close();
            }
            if (response.status == 200) {
              args.success && args.success(response.data);
              return resolve(response.data);
            } else {
              console.log("error", response);
              args.error && args.error(response);
              return reject(response);
            }
          }, error => {
            console.log("error", error)
            if (typeof (args.progress) == "string") {
              this.progress.close();
            }
            args.error && args.error(error);
            return reject(error);
          });
          axios(args);
        } else {
          let error = {
            errorMsg: '请求过于频繁'
          };
          console.warn("------ajax【url:" + args.url + ', args:' + JSON.stringify(args) + "】请求过于频繁-------");
          args.error && args.error(error);
          return reject(error);
        }
      })
    },
    uploadFile: function (params, ac) { //文件上传
      var This = this;
      if (ac == 'init') {
        This.ajax({
          url: params.url
        }).then(res => {
          if (res.code == '0') {
            This.globalData.uploadPolicy = res.data;
          }
        }).catch(err => { });
      } else {
        return new Promise(async function (resolve, reject) {
          var file = params.file;
          if (file) {
            if (params.suffix) {
              var isType = params.suffix.indexOf(file.raw.type.split('/')[1]) >= 0 ? true : false;
              if (!isType) {
                var res = {
                  code: 1,
                  msg: '上传文件格式需为 ' + params.suffix
                }
                params.error && params.error(res);
                return reject(res);
              }
            }
            if (file.name.length > 50) {
              var res = {
                code: 1,
                msg: '文件名过长，请重新命下名吧!'
              }
              params.error && params.error(res);
              return reject(res);
            }
            if (params.maxSize > 0) {
              var isLtSize = file.size / 1024 / 1024 < params.maxSize;
              if (!isLtSize) {
                if (file.raw.type.indexOf('image') == 0) {
                  var newImg = await obj.compressImg(file.raw).catch(err => {
                    reject(err);
                  });
                  file.raw = newImg;
                } else {
                  var res = {
                    code: 1,
                    msg: '上传大小不能超过' + params.maxSize + 'MB!'
                  }
                  params.error && params.error(res);
                  return reject(res);
                }
              }
            }

            var random = This.randomNum(0, 999);
            var ts = new Date().getTime().toString().substring(0, 10);
            var policy = This.globalData.uploadPolicy;

            if (This.isDefine(policy) && Number(policy.expire) - Number(ts) > 5) {
              upload();
            } else {
              This.ajax({
                url: params.url,
                params: {
                  random: random
                }
              }).then(res => {
                if (res.code == '0') {
                  policy = res.data;
                  This.globalData.uploadPolicy = policy;
                  upload();
                } else {
                  return reject(res);
                }
              }).catch(err => {
                return reject(err);
              });
            }

            function upload() {
              var formData = new FormData();
              var fileName = file.name.split('.');
              fileName = new Date().getTime() + '.' + fileName[fileName.length - 1];
              formData.append('Content-Disposition', 'attachment;filename=' + encodeURIComponent(file.name));
              formData.append('OSSAccessKeyId', policy.accessid);
              formData.append('policy', policy.policy);
              formData.append('Signature', policy.signature);
              formData.append('key', policy.dir + fileName);
              formData.append('success_action_status', 200);
              formData.append('callback', policy.callback);
              formData.append('file', file.raw);
              This.ajax({
                url: policy.host,
                method: 'post',
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
                data: formData,
                params: {
                  random: random
                }
              }).then(uploadFileRes => {
                return resolve(uploadFileRes);
              }).catch(err => {
                console.log(err)
                return reject(err);
              });
            }
          } else {
            return reject({
              code: 1,
              msg: '请选择文件!'
            });
          }
        })
      }
    },
    compressImg: function (image) { //图片压缩
      return new Promise(function (resolve, reject) {
        try {
          var img = new Image();
          img.src = URL.createObjectURL(image);
          // 缩放图片需要的canvas
          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');

          // base64地址图片加载完毕后
          img.onload = function () {
            // 图片原始尺寸
            var originWidth = this.width;
            var originHeight = this.height;
            // 最大尺寸限制
            var maxWidth = 500,
              maxHeight = 1000;
            // 目标尺寸
            var targetWidth = originWidth,
              targetHeight = originHeight;
            // 图片尺寸超过500x1000的限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
              if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更宽，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(maxWidth * (originHeight / originWidth));
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(maxHeight * (originWidth / originHeight));
              }
            }
            // canvas对图片进行缩放
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            // canvas转为blob
            canvas.toBlob(function (blob) {
              var files = new File([blob], image.name, { type: image.type || 'image/png' });
              resolve(files);
            }, image.type || 'image/png', 0.8);
          }
        } catch (e) {
          return reject({
            code: 1,
            msg: '图片压缩出错了!'
          });
        }
      });
    },
    /**
     * 获取图片适当尺寸
     * @param {object} img 
     */
    imgFit: function (img) {
      let imgage = img;
      if (!img.width || !img.height) {
        imgage = new Image();
        imgage.src = img.url;
      }
      const width = imgage.width;
      const height = imgage.height;
      if (width > 0 && height > 0) {
        let w = width, h = height;
        if (width > 300) {
          w = 300;
          h = (300 * height) / width;
        } else if (width < 20) {
          w = 20;
          h = (20 * height) / width;
        } else if (height > 700) {
          h = 700;
          w = (700 * width) / height;
        } else if (height < 20) {
          h = 20;
          w = (20 * width) / height;
        }
        return {
          width: w,
          height: h
        }
      }
      return false;
    },
    filePreviewIcon: function (url) { //文件图标回显
      var fileType = this.fileType(url);
      if (fileType.type == 'img') {
        if (url.indexOf('http') == 0) {
          return url;
        } else {
          return '/images/img.png';
        }
      } else {
        if (fileType.suffix == 'doc' || fileType.suffix == 'docx') {
          return '/images/doc.png';
        } else if (fileType.suffix == 'xls' || fileType.suffix == 'xlsx') {
          return '/images/xls.png';
        } else if (fileType.suffix == 'ppt' || fileType.suffix == 'pptx') {
          return '/images/ppt.png';
        } else if (fileType.suffix == 'pdf') {
          return '/images/pdf.png';
        } else if (fileType.suffix == 'zip' || fileType.suffix == 'rar') {
          return '/images/zip.png';
        } else if (fileType.suffix == 'txt') {
          return '/images/txt.png';
        } else if (fileType.suffix == 'mp3' || fileType.suffix == 'wav' || fileType.suffix == 'wma') {
          return '/images/audio.png';
        } else if (fileType.suffix == 'mp4' || fileType.suffix == 'avi' || fileType.suffix == 'rmvb' || fileType.suffix == 'rm') {
          return '/images/video.png';
        } else if (fileType.suffix == 'apk') {
          return '/images/android.png';
        } else {
          return '/images/file.png';
        }
      }
    },
    fileType: function (url) { //验证文件类型
      var imgSuffix = ['bmp', 'jpg', 'jpeg', 'png', 'gif', 'psd', 'webp'];
      var docSuffix = ['doc', 'docx', 'xls', 'xlsx', 'pptx', 'ppt', 'pdf', 'zip', 'rar', 'txt'];
      var videoSuffix = ['mp4', 'flv', 'wav', 'webm', 'ogg', 'avi', 'mpg', 'mlv', 'mpeg', 'mpg', '3gp', 'mkv', 'rm', 'rmvb', 'mov'];
      var temp1 = url.split('.');
      var temp2 = url.replace("\\", "\/").split('/');
      var suffix = temp1.length > 1 ? temp1[temp1.length - 1] : temp1[0];
      var name = temp2[temp2.length - 1].replace('.' + suffix, '');
      var uuid = (new Date().getTime()) + '-' + this.randomNum(10000, 9999999);
      if (obj.isDefine(suffix)) {
        suffix = suffix.toLowerCase();
        if (imgSuffix.indexOf(suffix) >= 0) {
          return {
            type: 'img',
            name: name,
            suffix: suffix,
            uuid: uuid
          };
        } else if (docSuffix.indexOf(suffix) >= 0) {
          return {
            type: 'doc',
            name: name,
            suffix: suffix,
            uuid: uuid
          };
        } else if (videoSuffix.indexOf(suffix) >= 0) {
          return {
            type: 'video',
            name: name,
            suffix: suffix,
            uuid: uuid
          };
        } else {
          return {
            type: 'orther',
            name: name,
            suffix: suffix,
            uuid: uuid
          };
        }
      } else {
        return {
          type: 'orther',
          name: name,
          suffix: suffix,
          uuid: uuid
        };
      }
    },
    getUser: function () { //获取用户
      if (this.isDefine(this.globalData.userInfo)) {
        return this.globalData.userInfo;
      } else {
        var userInfo = this.localStorage.get("userInfo");
        if (this.isDefine(userInfo) && userInfo.id) {
          this.globalData.userInfo = userInfo;
          return userInfo;
        } else {
          return {};
        }
      }
    },
    setUser: function (user) {
      if (user) {
        this.localStorage.set('userInfo', user, 1000 * 60 * 60 * 24 * 7);
      } else {
        this.localStorage.del('userInfo');
        this.globalData.userInfo = {};
      }
    },
    getUrlParams: function (url) { //获取当前页面地址参数
      var url = this.isDefine(url) ? url : window.location.href;
      url = decodeURI(url);
      var params = {};
      var paramsArr = [];
      var paramsStr = url.split("?")[1];
      if (this.isDefine(paramsStr)) {
        paramsArr = paramsStr.split("&");
        for (var i = 0; i < paramsArr.length; i++) {
          var arr = paramsArr[i].split("=");
          if (i == paramsArr.length - 1) {
            params[arr[0]] = arr[1].split("#")[0];
          } else {
            params[arr[0]] = arr[1];
          }
        }
      }
      return params;
    },
    isDefine: function (value) { //判断是否是定义 定义返回true, 否则返回false
      if (typeof value == 'number') {
        return true;
      } else if (typeof value == 'boolean') {
        return true;
      } else if (value instanceof Date) {
        return true;
      } else if (value == null || value == "" || value == "undefined" || value == undefined || value == "null" || value == "(null)" || value == 'NULL' || value == 'false' || typeof (value) == 'undefined') {
        return false;
      } else if (typeof value == 'object' && this.getJsonLength(value) == 0) {
        return false;
      } else {
        value = value + "";
        value = value.replace(/\s/g, "");
        if (value == "") {
          return false;
        }
        return true;
      }
    },
    localStorage: { //localStorage 的增、删、查
      set: function (key, value, time) {
        /**
         * key 存储名
         * value 存储值
         * time 存储时间，单位毫秒
         */
        if (!obj.isDefine(value)) {
          console.log("储存内容不能为空");
          return;
        }
        var data = {
          data: value
        };
        if (time > 0) {
          data = {
            data: value,
            startTime: new Date().getTime(),
            timeStamp: time
          }
        }
        window.localStorage[key] = JSON.stringify(data);
      },
      get: function (key) {
        var data = window.localStorage[key];
        var result = '';
        if (obj.isDefine(data)) {
          try {
            data = JSON.parse(data);
            if (data.hasOwnProperty('timeStamp')) {
              var startTime = data.startTime;
              var timeStamp = data.timeStamp;
              var nowTime = new Date().getTime();
              if ((nowTime - startTime) <= timeStamp) {
                result = data.data;
              }
            } else {
              result = data.data;
            }
          } catch (e) {
            console.log('获取数据出错了');
          }
        }
        return result;
      },
      del: function (key) {
        // key 要清除的key值，可以为数组，可以为一个字符串，可以为空，为空则清除所有的缓存
        if (typeof (key) == "string") {
          window.localStorage.removeItem(key);
        } else if (typeof (key) == "object") {
          for (index in key) {
            window.localStorage.removeItem(key[index]);
          }
        } else {
          window.localStorage.clear();
        }
      }
    },
    sessionStorage: { //存、取、删sessionStorage
      set: function (key, value, time) {
        /**
         * key 存储名
         * value 存储值
         * time 存储时间，单位毫秒
         */
        if (!obj.isDefine(value)) {
          console.log("储存内容不能为空");
          return;
        }
        var data = {
          data: value
        };
        if (time > 0) {
          data = {
            data: value,
            startTime: new Date().getTime(),
            timeStamp: time
          }
        }
        window.sessionStorage[key] = JSON.stringify(data);
      },
      get: function (key) {
        var data = window.sessionStorage[key];
        var result = '';
        if (obj.isDefine(data)) {
          try {
            data = JSON.parse(data);
            if (data.hasOwnProperty('timeStamp')) {
              var startTime = data.startTime;
              var timeStamp = data.timeStamp;
              var nowTime = new Date().getTime();
              if ((nowTime - startTime) <= timeStamp) {
                result = data.data;
              }
            } else {
              result = data.data;
            }
          } catch (e) {
            console.log('获取数据出错了');
          }
        }
        return result;
      },
      del: function (key) {
        if (typeof (key) == "string") {
          window.sessionStorage.removeItem(key);
        } else if (typeof (key) == "object") {
          for (idx in key) {
            window.sessionStorage.removeItem(key[idx]);
          }
        } else {
          window.sessionStorage.clear();
        }
      }
    },
    parseDate: function (dateStr, type, separate) {
      /**
       *  日期格式转换，输出指定格式
       * @param dateStr 日期字符串 支持格式：
       *  2016-02-03 12:22:34
       *  2016/02/03 12:22:34
       *  2016年02月03日 12:22:34
       *  1472639579（时间戳）
       *  20160912
       *  20160912 09:12:34
       * @param type 转换类型 d：反回日、md:返回月日、ymd：返回年月日、hi：返回时分、his：返回时分秒
       * @param separate 分隔符。 分隔符为 ch时返回时间类型如：2016年08月09日
       */
      if (!this.isDefine(dateStr)) {
        return '';
      }

      if (!this.isDefine(separate)) {
        separate = "-";
      }
      if (typeof dateStr != 'object') {
        dateStr = this.trim(dateStr + '');
      }
      var date;

      if (typeof dateStr == 'object') {
        date = dateStr;
      } else if (dateStr.indexOf("年") > 0) {
        var str = dateStr.replace(/日/g, "")
        date = new Date(str.replace(/年|月/g, "/"));
      } else if (dateStr.indexOf("-") > 0 || dateStr.indexOf("/") > 0) {
        date = new Date(dateStr.replace(/-/g, "/"));
      } else if (dateStr.length == 10) { //秒时间戳
        date = new Date(dateStr * 1000);
      } else if (dateStr.length == 13) { //毫秒时间戳
        date = new Date(dateStr * 1);
      } else if (dateStr.length == 8 || dateStr.length == 17) {
        var str = dateStr.substring(0, 4) + "/" + dateStr.substring(4, 6) + "/" + dateStr.substring(6, 8) + " " +
          dateStr.substring(8);
        date = new Date(str);
      } else {
        date = new Date(dateStr);
      }
      //year
      var y = date.getFullYear();
      //month
      var m = date.getMonth() + 1;
      //day
      var d = date.getDate();
      //hour
      var h = date.getHours();
      //minute
      var i = date.getMinutes();
      //second
      var s = date.getSeconds();
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      h = h < 10 ? "0" + h : h;
      i = i < 10 ? "0" + i : i;
      s = s < 10 ? "0" + s : s;
      if (type == "y") {
        return y;
      } else if (type == "m") {
        return m;
      } else if (type == "d") {
        return d;
      } else if (type == "md") {
        if (separate == "ch") {
          return m + "月" + d + "日";
        } else {
          return m + separate + d;
        }
      } else if (type == "ymd") {
        if (separate == "ch") {
          return y + "年" + m + "月" + d + "日";
        } else {
          return y + separate + m + separate + d;
        }
      } else if (type == "ymdhi") {
        if (separate == "ch") {
          return y + "年" + m + "月" + d + "日" + h + "时" + i + "分";
        } else {
          return y + separate + m + separate + d + " " + h + ":" + i;
        }
      } else if (type == "ymdhis") {
        if (separate == "ch") {
          return y + "年" + m + "月" + d + "日" + h + "时" + i + "分" + s + "秒";
        } else {
          return y + separate + m + separate + d + " " + h + ":" + i + ":" + s;
        }
      } else if (type == "h") {
        if (separate == "ch") {
          return h + "时";
        } else {
          return h;
        }
      } else if (type == "i") {
        if (separate == "ch") {
          return i + "分";
        } else {
          return i;
        }
      } else if (type == "hi") {
        if (separate == "ch") {
          return h + "时" + i + "分";
        } else {
          return h + ":" + i;
        }
      } else if (type == "his") {
        if (separate == "ch") {
          return h + "时" + i + "分" + s + "秒";
        } else {
          return h + ":" + i + ":" + s;
        }
      } else if (type == "week") {
        return date.getDay();
      } else {
        if (separate == "ch") {
          return y + "年" + m + "月" + d + "日 " + h + "时" + i + "分" + s + "秒";
        } else {
          return y + separate + m + separate + d + " " + h + ":" + i + ":" + s;
        }
      }
    },
    /**
     * 比较两个日期时间差
     * time1和time2是2002-12-18 HH:II:SS格式
     **/
    diffDate: function (time1, time2) {
      let date1,
        date2,
        days,
        hours,
        minutes;
      time1 = this.parseDate(time1, 'ymdhis', '/');
      time2 = this.parseDate(time2, 'ymdhis', '/');
      date1 = new Date(time1);
      date2 = new Date(time2);
      //总小时数
      hours = parseInt((date1 - date2) / 1000 / 60 / 60);
      //相差天数
      days = parseInt(hours / 24);
      //分钟数
      minutes = parseInt((date1 - date2) / 1000 / 60);
      return {
        days: days,
        hours: hours,
        minutes: minutes
      }
    },
    convertDate: function (date) { //时间友好显示
      date = this.parseDate(date, 'ymdhis', '-');
      var nowDate = this.parseDate(new Date(), 'ymdhis', '-');
      var diffDate = this.diffDate(nowDate, date);
      var time = '';
      if (this.parseDate(date, 'y') == this.parseDate(nowDate, 'y')) {
        var days = diffDate.days;
        if (days == 0) {
          var hours = diffDate.hours;
          if (Math.abs(hours) < 1) {
            var minutes = diffDate.minutes;
            if (minutes >= 0 && minutes < 1) {
              time = '刚刚';
            } else if (minutes < 0 && minutes > -1) {
              time = '即将';
            } else if (minutes >= 1) {
              time = parseInt(diffDate.minutes) + '分钟前';
            } else if (minutes <= -1) {
              time = parseInt(-diffDate.minutes) + '分钟后';
            }
          } else {
            if (hours >= 1) {
              time = hours + '小时前';
            } else {
              time = -hours + '小时后';
            }
          }
        } else if (days == 1) {
          time = '昨天';
        } else if (days == -1) {
          time = '明天';
        } else if (days > 1) {
          time = diffDate.days + '天前';
        } else if (days < 1) {
          time = -diffDate.days + '天后';
        }
      } else {
        time = this.parseDate(date, 'ymd', '-');
      }
      return time;
    },
    /**
     * 将byte单位友好化转换
     */
    convertSize: function (size) {
      if (size > 0) {
        var unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        var i = Math.floor(Math.log(size) / Math.log(1024));
        return Math.round(size / Math.pow(1024, i), 2) + ' ' + unit[i];
      } else {
        return 0;
      }
    },
    /**
     * 去掉首尾指定字符，默认为空格
     * @param { string } str - 目标字符串
     * @param { string } target - 要去掉的字符
     */
    trim: function (str, target) {
      str = str.toString();
      var count = str.length;
      var start = 0;
      var end = count - 1;
      if (str == "") return str;
      while (start < count) {
        if (str.charAt(start) == (target ? target : " ")) start++;
        else break;
      }
      while (end > start) {
        if (str.charAt(end) == (target ? target : " ")) end--;
        else break;
      }
      return str.substring(start, end + 1);
    },
    trimAll: function (str) { //去掉所有空格
      return str.replace(/\s+/g, "");
    },
    escapeHtmlEntities: function (str) { //前端特殊字符处理
      var entry = {
        "'": "&apos;",
        '"': '&quot;',
        '<': '&lt;',
        '>': '&gt;'
      };
      str = str.replace(/(['")-><&\\\/\.])/g, function ($0) {
        return entry[$0] || $0;
      });
      return str;
    },
    getJsonLength: function (jsonData) { // 获取JOSN长度
      return Object.keys(jsonData).length;
    },
    sort: function (data, rev) {
      /**
       *JSON/数组排序
       * data JSON或数组
       * rev boolean类型 是否倒序
       */
      var This = this;
      var dataType = Object.prototype.toString.call(data);
      if (dataType == '[object Object]') {
        var keys = Object.getOwnPropertyNames(data);
        var temArr = keys.sort(charCompare);
        var temObj = {};
        temArr.forEach(function (item) {
          if (This.isDefine(data[item])) {
            temObj[item] = data[item];
          }
        });
        return temObj;
      } else if (dataType == '[object Array]') {
        var temArr = data.sort(charCompare);
        return temArr;
      } else {
        console.log('不是JSON或数组类型数据');
      }

      function charCompare(a, b) {
        a = a.toString().charCodeAt();
        b = b.toString().charCodeAt();
        if (rev) {
          return b - a;
        } else {
          return a - b;
        }
      }
    },
    /**
     * 给一棵树添加属性
     * tree 要加属性的树
     * attrKey 要加的属性key
     * attrVal 要加的属性val, 默认为''
     * childrenKey 树的子结点key, 默认为children
     * targetArrtKey 要加变属性的特定key值为targetAttrKey的数据
     * targetAttrVal 要加变属性的特定key值为targetAttrKey，value值为targetAttrVal的数据
     */
    setAttrToTree: function (tree, attrKey, attrVal, childrenKey, targetAttrKey, targetAttrVal) {
      if (!this.isDefine(tree) || !this.isDefine(attrKey)) {
        console.error("tree或attrKey参数不能为空");
      } else {
        attrVal = this.isDefine(attrVal) ? attrVal : '';
        childrenKey = this.isDefine(childrenKey) ? childrenKey : 'children';
        for (var i = 0; i < tree.length; i++) {
          if (this.isDefine(targetAttrKey) && this.isDefine(targetAttrVal)) {
            if (tree[i][targetAttrKey] == targetAttrVal) {
              tree[i][attrKey] = attrVal;
            }
          } else {
            tree[i][attrKey] = attrVal;
          }
          if (tree[i].children) {
            for (var j = 0; j < tree[i].children.length; j++) {
              this.setAttrToTree(tree[i].children, attrKey, attrVal, childrenKey, targetAttrKey, targetAttrVal);
              break;
            }
          }
        }
        return tree;
      }
    },
    /**
     * 生成[minNum,maxNum] 之间的随机数
     * @param {Number} minNum 
     * @param {Number} maxNum 
     * @returns Number
     */
    randomNum: function (minNum, maxNum) {
      return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    },
    randomTxt: function (length) {
      length = Number(length)
      // Limit length
      if (length < 4) {
        length = 4
      } else if (length > 64) {
        length = 64
      }
      let passwordArray = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890', '!@#$%&*()'];
      var password = [];
      let n = 0;
      for (let i = 0; i < length; i++) {
        // If password length less than 9, all value random
        if (password.length < (length - 4)) {
          // Get random passwordArray index
          let arrayRandom = Math.floor(Math.random() * 4);
          // Get password array value
          let passwordItem = passwordArray[arrayRandom];
          // Get password array value random index
          // Get random real value
          let item = passwordItem[Math.floor(Math.random() * passwordItem.length)];
          password.push(item);
        } else {
          // If password large then 9, lastest 4 password will push in according to the random password index
          // Get the array values sequentially
          let newItem = passwordArray[n];
          let lastItem = newItem[Math.floor(Math.random() * newItem.length)];
          // Get array splice index
          let spliceIndex = Math.floor(Math.random() * password.length);
          password.splice(spliceIndex, 0, lastItem);
          n++
        }
      }
      return password.join("");
    },
    clone: function (target, deep) {
      if (deep === true) {
        const map = new WeakMap()

        function isObject(target) {
          return (typeof target === 'object' && target) || typeof target === 'function'
        }

        function clone(data) {
          if (!isObject(data)) {
            return data
          }
          if ([Date, RegExp].includes(data.constructor)) {
            return new data.constructor(data)
          }
          if (typeof data === 'function') {
            return new Function('return ' + data.toString())()
          }
          const exist = map.get(data)
          if (exist) {
            return exist
          }
          if (data instanceof Map) {
            const result = new Map()
            map.set(data, result)
            data.forEach((val, key) => {
              if (isObject(val)) {
                result.set(key, clone(val))
              } else {
                result.set(key, val)
              }
            })
            return result
          }
          if (data instanceof Set) {
            const result = new Set()
            map.set(data, result)
            data.forEach(val => {
              if (isObject(val)) {
                result.add(clone(val))
              } else {
                result.add(val)
              }
            })
            return result
          }
          const keys = Reflect.ownKeys(data)
          const allDesc = Object.getOwnPropertyDescriptors(data)
          const result = Object.create(Object.getPrototypeOf(data), allDesc)
          map.set(data, result)
          keys.forEach(key => {
            const val = data[key]
            if (isObject(val)) {
              result[key] = clone(val)
            } else {
              result[key] = val
            }
          })
          return result
        }

        return clone(target)
      } else {
        return JSON.parse(JSON.stringify(target));
      }
    },
    typeof: function (val) { //判断类型
      var type = Object.prototype.toString.call(val);
      if (type === '[object Array]') {
        return 'array';
      } else if (type === '[object Number]') {
        return 'number';
      } else if (type === '[object Object]') {
        return 'object';
      } else if (type === '[object Function]') {
        return 'function';
      } else {
        return type;
      }
    },
    /*
        * 返回顶部
        * isAnim 是否有动画效果
        */
    scrollTop: function (el) {
      var dom = this.getDom(el);
      var x = dom.scrollTop;
      var timer = setInterval(function () {
        x = x - 100;
        if (x < 100) {
          x = 0;
          dom.scrollTo(x, x);
          clearInterval(timer);
        }
        dom.scrollTo(x, x);
      }, 10);
    },
    //根据id/class获取dom
    getDom: function (id) {
      var dom;
      if (typeof (id) == 'string') {
        if (id.indexOf("#") == 0) {
          id = id.split("#")[1];
          dom = document.getElementById(id);
        } else if (id.indexOf(".") == 0) {
          dom = document.querySelector(id);
        } else {
          dom = document.getElementById(id);
        }
      } else {
        dom = id;
      }
      if (!(dom && dom.nodeType == 1)) {
        console.warn('DOM不存在或不存在ID为“' + id + '”的DOM');
        return;
      } else {
        return dom;
      }
    },
    progress: {
      /**
       * progress 加载提示框
       */
      show: function (msg) {
        msg = msg ? msg : '请稍后...';
        var loading = ElLoading.service({
          lock: true,
          text: msg,
          spinner: 'el-icon-loading',
          customClass: 'uf-s2',
          background: 'rgba(0, 0, 0, 0.3)'
        });
        obj.globalData.loading = loading;
      },
      close: function () {
        obj.globalData.loading.close();
      }
    },
    forbidDebug: function () {
      try {
        if (
          window.outerHeight - window.innerHeight > 200 ||
          window.outerWidth - window.innerWidth > 200
        ) {
          document.body.innerHTML = '<div class="ub uf-s2 ub-ac ub-pc uabs animate__animated uinner animate__bounceInDown ">Hi，哥们，交个朋友！</div>';
        }
        setInterval(() => {
          (function () {
            return false;
          }
          ["constructor"]("debugger")
          ["call"]());
        }, 50);
      } catch (e) {

      }
    },
    init: function () {
      if (process.env.NODE_ENV == 'production') {
        //this.forbidDebug();
      }
    }
  };
  obj.init();
  return obj;
})({
  $: (typeof $ == "undefined") ? '' : $,
  axios: (typeof axios == "undefined") ? '' : axios,
});
export default utils;
