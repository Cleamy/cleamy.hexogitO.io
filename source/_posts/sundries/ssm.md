---
title: 关于ssm框架学习
date: 2024-05-02 22:57:03
tags:  
    - java
    - 框架
categories:
    - java
    - spring
description: 具体内容点击查看
swiper_index: 5
---

# 1、Mybatis环境部署
1、创建maven工程mybatis  
2、配置相关依赖  
3、添加  



2、MyBatis工作原理  






3.1 动态sql中的元素  
元素
<if> : 判断 语句，用于条件判断
<choose>(<when><otherwise>): 相当于 java 中switch
<where> ： 简化sql 语句中 where 判断
<trim>： 可以灵活去除多余的关键字
<set> : 用于sql语句的动态更新
<foreach> ：循环语句，常用于in 语句 等列举条件

### mybatis 的 关联映射
+   关联映射
    <font color="pink">
    - 了解数据表之间的三种关系
    - 了解对象之间的三种关系
    - 熟悉关联关系中的嵌套查询和嵌套结果
    - 掌握一对一关联映射
    - 多对多关联映射
    - 熟悉mybatis的缓存机制  
    </font>
    
通过关联映射可以很好的处理表与表之间、对象与对象之间的关系的关联映射关系

##### 1.一对一关系
    * 就是在类中定义与之关联的类的对象作为属性
    * 例如：A类中定义B类 对象b 作为 属性
    * B类中定义A 类 对象a 作为属性
<font size="3" color="pink">伪代码：</font>
``` java
public class StudentA{ // 学生
    StudentCarB b;// 学生卡
}
public class StudentCardB{ // 学生卡
    StudentA a;// 学生
}
```
- 查询方法
    - 1. 嵌套查询方法
        - 该方法需要执行多条sql查询语句<br>并将sql查询语句进行关联
    - 2. 嵌套结果集查询方法
        - 该方法需要先写出sql语句的联合查询语句，<br>将多个表进行组合查询，<br>并将查询后的结果集的值 进行 一对一 映射
        - 更加推荐直接使用嵌套结果集的方式
    - 3. 在mybatis 中 使用\<association>元素进行 多表之间的查询结果映射，<br>使用结果映射（resultMap）的方法

##### 2.一对多关系
    * 就是一个A类对象对应多个B类对象的情况
    * 列如，定义在A类中，定义一个B类对象的 集合 作为A类的属性
    * 在B类中，定义A类对象a 作为B类的属性
<font size="3" color="pink">伪代码：</font>
```java
public class ClassesA{ // 班级
    List<StudentB> b;// 班级学生集合
}
public class StudentB{ // 学生
    ClassesA a; // 所属班级
}
```
- 查询方法
    - 1. 嵌套查询方法
        - 该方法需要执行多条sql查询语句<br>并将sql查询语句进行关联
    - 2. 嵌套结果集查询方法
        - 该方法需要先写出sql语句的联合查询语句，<br>将多个表进行组合查询，<br>并将查询后的结果集的值 进行 一对一 映射
        - 更加推荐直接使用嵌套结果集的方式
    - 3. 在mybatis 中 使用\<collection>元素进行 多表之间的查询结果映射，<br>使用结果映射（resultMap）的方法
        - 其中ofType属性可以看作是集合的泛型类型

##### 3.多对多关系 
    * 在两个相互关联的类中，都可以定义多个与之关联的类的对象
    *例如：在 A类中定义 B类对象的集合作为属性
    *在B类中定义，A类对象的集合作为属性
```java
public class Orders{ // 订单
    List<Commondity> b;// 多种购物商品
}
public class Commodity{ // 商品
    List<Orders> a;// 多个订单 购物 该商品
}
```
##### mybatis缓存机制
1. <font color="pink">mybatis 的一级缓存</font>

#### mybatis 注解开发
1. 掌握基于注解的单表增删改查
2. 熟悉基于注解的一对一关联查询
3. 熟悉基于注解的一对多关联查询
4. 熟悉基于注解的多对多关联查询