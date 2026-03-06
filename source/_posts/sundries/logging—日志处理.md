---
title: python[Logging 内置函数]
date: 2024-05-02 22:57:03
tags:  
    - python
    - logging
categories:
    - python
description: 具体内容点击查看
swiper_index: 2
---

# **logging—日志处理**

## logging 日志级别——默认级别时warning

| 级别     | 级别数值 | 使用时机                                     |
| :------- | :------- | :------------------------------------------- |
| DEBUG    | 10       | 详细信息，常用与调试                         |
| INFO     | 20       | 程序正常允许过程中产生的一些信息             |
| WARNING  | 30       | 警告用户，虽然程序还在允许，但是可能发生错误 |
| ERROR    | 40       | 由于更严重的问题，程序已经不能执行一些功能了 |
| CRITICAL | 50       | 严重错误，程序已经不能允许                   |

```python
# 使用 basicConfig() 来指定 日志 的 输出 格式
# filename 为 要将 日志保存 的 文件 
# filemode 为 写入 方式 默认是（默认是 追加方式） ‘w’ 是 先清空 后 写入
logging.basicConfig(filename="./demo.log",filemode="w",level=logging.DEBUG)
logging.debug("this is debug level")
logging.info("this is info level")
logging.warning("this is warning level")
logging.error("this. error level")
logging.critical("this critical level")

'''
控制台输出：
    DEBUG:root:this is debug level
    INFO:root:this is info level
    WARNING:root:this is warning level
    ERROR:root:this. error level
    CRITICAL:root:this critical level
'''
```

## logging 向日志输出变量

```python
# 向日志 输出变量
logging.basicConfig(level=logging.DEBUG)
name = "cleamy"
age = "20"
# 格式化
logging.debug("name: %s, age: %s " % (name, age))
logging.debug("name: {}, age: {} ".format(name, age))
logging.debug(f"name: {name}, age: {age} ")


'''
控制台输出
    DEBUG:root:name: cleamy, age: 20 
    DEBUG:root:name: cleamy, age: 20 
    DEBUG:root:name: cleamy, age: 20 
'''
```

### 

logging 自定义  输出格式

自定义logging的日志输出方式可以 通过 format 和 datefmt 参数 进行设置

以下是常见的日志格式意思

| 格式样式       | 翻译                                                |
| -------------- | --------------------------------------------------- |
| %(name)s       | 记录器(日志通道)的名称                              |
| %(levelno)s    | 日志级别编号(DEBUG, INFO, WARNING, ERROR, CRITICAL) |
| %(levelname)s  | 日志级别名称(DEBUG, INFO, WARNING, ERROR, CRITICAL) |
| %(pathname)s   | 日志调用的源文件的完整路径名(如果可用)              |
| %(filename)s   | 日志调用的源文件名称                                |
| %(module)s     | 日志调用的源文件所在的模块名称                      |
| %(lineno)d     | 日志调用的源文件中的代码所在的行数                  |
| %(funcName)s   | 方法名称                                            |
| %(created)f    | 创建日志记录的时间                                  |
| %(asctime)s    | 创建LogRecord时的文本时间                           |
| %(msecs)d      | 创建时间的毫秒部分                                  |
| %(thread)d     | Thread ID                                           |
| %(threadName)s | Thread name                                         |
| %(process)d    | Process ID                                          |
| %(message)s    | 日志的消息                                          |

```python
# 自定义 日志格式
format_log = "%(asctime)s %(levelname)s %(filename)s:%(lineno)s %(message)s"
# 自定义 日志 时间 格式
date_format = "%Y-%m-%d %H:%M:%S"
# 自定义 日志格式 输出
logging.basicConfig(format=format_log,datefmt=date_format,level=logging.DEBUG)
name = "cleamy"
age = "20"
logging.debug("name: %s, age: %s " % (name, age))
logging.debug(f"name: {name}, age: {age} ")



'''
控制台输出
2024-04-11 19:45:38 DEBUG test_logging_format.py:14 name: cleamy, age: 20 
2024-04-11 19:45:38 DEBUG test_logging_format.py:15 name: cleamy, age: 20 

'''

```

## logging 高级应用

### logging 模块 采用 了 模块化设计，主要包含四种组件

Loggers：记录器，提供应用程序代码能直接使用

Handlers：处理器，将就器产生的日志发发送至目的地

Filters：过滤器，提供更好的粒度控制，决定哪些日志会被输出

formatters：格式化器，设置日志内容的组成结构和消息字段

loggers 记录器

​	1.提供应用程序的调用接口

​		logger =  logging.getLogger(\__name__)

​	2、决定日志记录的级别

​		logger.setLevel()

​	3、将日志内容传递到相关的handles中

​		logger.addHandler() 和logger.removeHandler()

Handlers 处理器

它将日志分发到不同的目的地，可以是文件、标准输出、邮件、或者通过socke、http等协议发送的地方

​	Streamhandler

​		标准输出stdout(如显示器)分发器

​		创建方法: sh = loggin.StreamHandler(stream=None)

​	FileHandler

​		将日志保存到磁盘文件的处理器

​		创建方式：fh = logging.FileHandler(filename,mode='a',encoding='utf-8')

​		setFormatter()：设置当前handler对象使用的消息格式

RotatingFileHandler 多文件日志文件 

TimedRotatingFileHandler 按照时间进行多个日志文件

Formatter 格式

formatter对象用来最终设置日志信息的顺序、结构和内容

​	其构造方法为

​	ft = logging.formatter.\__init__(fmt=None,datafmt=None,style='%')

​	datefmt 默认是 %Y-%m-%d %H:%M:%S 样式

​	style 参数 默认为 百分符%, 这样表示%(\<dictionary key>)s 格式的 字符串

```python
# 使用便流程的方式
# 记录器 默认使用 root 作为记录器
logger = logging.getLogger("applog")
print(logger)
logger = logging.getLogger()
# 如果 logger没有设置debug 那么 默认是 warning
# 其 控制器的 日志 级别 小于warning的 化 将 会 不起 作用
# 所以 logger 需要 设置 最低 级别 debug
logger.setLevel(logging.DEBUG)
print(logger)

# 处理器handler
consoleHandler = logging.StreamHandler()
consoleHandler.setLevel(logging.INFO)
print(consoleHandler)

# 创建 文件handler 如果没有 指定 日志 输出 级别 则 默认是 logger 的 级别
filehandler = logging.FileHandler(filename='demo2.log',encoding='utf-8')
print(filehandler)

# formater 格式
formater = logging.Formatter("%(asctime)s %(filename)s %(lineno)s %(message)s")

# 给处理器 设置格式
consoleHandler.setFormatter(formater)
filehandler.setFormatter(formater)

# 记录器 添加 处理器
logger.addHandler(consoleHandler)
logger.addHandler(filehandler)

# 过滤器 过滤 logger 名字 是 以 cn.ccb 开头的
# 只有 是 cn.ccb  开头才会打印	
f = logger.Filter("ccb")
# 只有 logger 的 名师 ccb 开头 才会 向 文件写入日志
filehandler.Filter("ccb")

# 打印 日志 的 代码
logger.debug("this is logger of debug")
logger.info("this is logger of info")
logger.warning("this is logger of warning")
logger.error("this is logger of error")
logger.critical("this is logger of critical")


# 文件 的级别没有设置，默认 logger 当前级别
# 控制台 设置为了 infor 级别 只打印 info等以上级别的信息
'''
控制台 日志信息
	2024-04-11 20:49:50,389 loggingFor.py 33 this is logger of info
	2024-04-11 20:49:50,389 loggingFor.py 34 this is logger of warning
	2024-04-11 20:49:50,389 loggingFor.py 35 this is logger of error
	2024-04-11 20:49:50,389 loggingFor.py 36 this is logger of critical

'''
'''
文件夹中的 日志信息
	2024-04-11 20:49:50,389 loggingFor.py 32 this is logger of debug
	2024-04-11 20:49:50,389 loggingFor.py 33 this is logger of info
	2024-04-11 20:49:50,389 loggingFor.py 34 this is logger of warning
	2024-04-11 20:49:50,389 loggingFor.py 35 this is logger of error
	2024-04-11 20:49:50,389 loggingFor.py 36 this is logger of critical
'''
```







