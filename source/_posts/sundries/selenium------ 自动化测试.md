---
title: 自动化测试
date: 2024-05-02 22:57:03
tags:  
    - python
    - 自动化测试
categories:
    - python
    - selenium
description: 具体内容点击查看
swiper_index: 3
---

# selenium------ 自动化测试

## selenium 简介

## 主流的web自动化测试工具

1、QTP：QTP是一个商业化的功能测试工具，支持web测试和，桌面自动化测试

2、selenium：是一个开源的自动化测试工具，主要是功能测试

3、Robot framework：是一个基于python可拓展关键字驱动的测试自动化框架

## 元素定位

​	元素：页面内的元素，代码和元素是一一对应的关系，通过属性 与 属性值（key=value）键值对，进行元素定位

### 元素定位方式

- id定位（id值 定位）
  - find_element(By.ID,'path')
- name定位（通过name属性定位）
  - find_element(By.NAME,'path')
- class_name定位（通过class_name定位）
  - find_element(By.Class_Name)
- tag_name（标签元素）（tag_name定位
- link_text 定位
- partical_link_text(超链接元素)
- XPath(页面元素中的连接路径)
- Css（）

##### Xpath 路径文件

+ 语法1：//标签名[@属性='属性值']
+ 语法2：//*[@属性='属性值']
  + 使用相对路径：
    + 以//开始，格式：//input 或 //*
  + 使用绝对路径：
    + 从/html根标签开始，使用/分隔开
    + 格式：/html/body/div/fiedset/p[1]/input
+ last()方法
  + 语法1：//标签名[last()]
  + 语法2：//span/ul/li[last()]
    + 获取倒数第1个元素
    + //标签名[last()-1]
    + //span/ul/li[last()-1]
+ and 方法
  + //标签名[@元素名称='元素值' and @ 元素名称='元素值' ]	
    + 实例：//input[@id='kw' and @class='s_ipt']
+ or 方法
  + //标签名[@元素名称='元素值' or @ 元素名称='元素值']
    + 实例//input[@id='kw' or @class='s_t']
+ 非查找控件
  + //标签名称[@元素名称 != '元素值']
    + 实例//input[@class != '1111']
+ not查找
  + //标签名[not(.='元素值')]
    + 实例：//year[not(.=2005)]
    + 实例：//div[not(@id='tab-AndroidVersions')]
      + year内容不为2005的内容、'.' 相当于是text()
+ 模糊匹配
  + //标签名[contains(text(),'内容')]
    + 实例：//div[contains(test(),'更新')]
+ 精确匹配
  + //标签名[text()='内容']
  + //div[text()='更新文案']
+ 使用大小写符号定位
  + //div[@class='cell' and text()>'1336']
  + //div[@class='cell' and text()<'1336']
+ 轴方式定位
  + parent::*  表示当前结点的父父结点元素
  + ancestor::* 表示当前结点的祖先节点元素
  + child::* 表示当前节点的子元素 /A/descendant::* 表示A的所有后代元素
  + self::*  表示当前节点的自身元素
  + ancestor-or-self::* 表示当前节点的它的祖先节点元素
  + following-sibling::* 表示当前的前面所有兄弟节点
  + descentdant-or-self::* 表示当前节点的及他们的后代元素
  + preceding-silibing::* 表示当前节点的所有兄弟节点元素
  + following::* 表示当前的后序所有元素
  + preceding::* 表示当前节点的所有元素
+ position位置定位
  + 定位下一个元素
    + //th[@class='c-id' and postion()=1]
    + 或者使用//th[@class='c-id' and postion()<2]

##### CSS策略

+ 通过id进行css定位
  + 实例：self.driver.find_element(By.CSS_SELLECT,'#id_value')
+ 通过class进行css定位
  + 使用classnameCSS样式进行定位
    + 实例：self.find_element(By.CSS_SELECT,'.class_value')
+ tag_name标签名了进行定位
  + 直接使用标签名进行元素定位
    + 实例：self.find_element(By.CSS_SELECT,'TAG_NAME')
  + 使用button标签名进行元素定位
    + 实例：self.find_element(By.CSS_SELECT,'button')
+ 使用属性选择器：根据元素的属性名和值来选择
  + 格式[attribut=value] element[attribute=value]
  + self.driver.find_element(By.CSS_SELECT,'[attribute=value]')
+ 层级选择器：根据元素的父子关系来选择
  + 格式：element1 >  element2
    + 通过element1 来定位 element2 ，并且element2必须是直接子元素
      + 实例：self.driver.find_element(By.CSS_SELECT,'p[id='p1'] >  input')
      + 解释：使用p1 的 直接 子元素
  + 格式：element1 element3
    + 通过element1 来定位element3
      + 实例：self.driver.find_element(By.CSS_SELECT,'p[id="p1"] input')
      + 解释：使用 p1 后代元素 input
    + 层级选择器 父级层级关系
      + 实例：self.driver.find_element(By.CSS_SELECT,'[id="id_value"] > [placeholder="请设置用户名"]')
    + 祖辈层级关系
      + self.driver.find_element(By.CSS_SELECT,'form [placeholder="请设置用户名"])
    + 父子层级关系，使用祖辈层级方式
      + 实例：self.driver.find_element(By.CSS_SELECT,'[id='id_value] [placeholder="请选择用户名"]')
  + 格式：层级关系定位
  + element,element : div,p  选择所有<div> 元素和所有<p> 元素
  + element element : div p 选择<div> 元素 内部的所有<p> 元素包括子代元素
  + element>element : div>p 选择父元素为<div> 元素的所有<p> 元素。只包括子代
  + element+element : div+p 选择父元素为<div> 元素之后的所有<p> 元素 ，同辈元素
+ css定位延伸
  + 含义
    + ^= : 开头含
    + $= : 结尾含
    + *= : 内容含
    + ~= : 由多个空格隔开，匹配其中一个子的方法
  + 案例
    + input[type^='p'] type 属性以p字母开头的元素
    + input[type$='d'] type 属性以d字母结束的元素
    + input[type*='w'] type 属性包含w字母的元素
    + input[class~='btn'] class 属性 包含多个空格值

