---
title: spring 知识1
date: 2024-05-02 22:57:03
type:  
    - java
    - spring
categories:
    - java
    - spring
description: 具体内容点击查看
---
## Spring

#### 1. spring IOC(控制反转) （将控制权转移到ApplicationContext）
    1. 控制反转（Inversion of Control)
       是面向对象编程中一个设计原则
       用来降低程序代码之间的耦合度
    2. 传统面向对象编程中，获取对象的方式通过
        new关键字主动床i教案一个对象，也就是说应用程序
        掌握着对象的控制权，
    3. IoC控制反转机制指的是对象有Ioc容器同意管理，
        单程序需要使用对象是，可以直接从ioc 容器中获取，
        这样对象的控制权就转移到了ioc容器
        它是借助ioc容器实现具有依赖关系对象
        之间的解耦，给个对象类封装之后
        通过ioc容器来关联这些对象类
#### 2. 依赖注入(dependency inject)
    1、  依赖注入的作用就是在使用Spring框架创建对象时
        动态的将其所依赖的对象注入到Bean组件中
        依赖注入通常有两种实现凡是   
        一种时构造方法注入
        另一种时属性setter方法注入
+   构造方法注入
  + 构造方法注入是指Spring容器条用钩爪方法注入被依赖的实例
  + 构造方法可以是有参或者是无参的
  + spring在读取配置信息后，会通过反射方式条用实例的钩爪方法
  + 如果是有参构造方法，可以在构造方法种装入所需要的参数指，最后创建类的对象

```xml

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
       http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!--   bean definition here -->
    <bean id="user1Spring" class="com.cleamy.User1">
        <!--
            确定参数的 (三选其一）
                name 属性：通过参数的名字来确定参数
                type 属性： 通过参数的类型来确定参数
                index属性： 通过参数的索引来确定参数
           给属性赋值的 （二选其一）
                value 属性： 用来给基本类型的复制
                ref ： 用来给引用类型进行复制
        -->
        <constructor-arg name="id"  value="11"></constructor-arg>
        <constructor-arg type="java.lang.String" value="root"></constructor-arg>
        <constructor-arg index="2" value="123456"></constructor-arg>    </bean>
</beans>
```
+   \<constructor-arg>元素 : 此 元素 需要类种有构造方法（构造器）
  + 一个constructor-arg 元素表示钩爪方法的一个参数，
  + 而且定义时不区分顺序，只需要通过 name 属性来指定 构造方法中 的 参数
  + constructor-arg 元素 还提供了 type 属性来 指定 参数的类型，避免字符串和基本数据类型混淆
  + value 为 提供 给name对应变量 的 值


+  属性 setter 方法 完成 依赖注入
  + 1.属性setter防止 注入是 Spring 最 主流 的注入方法
  + 这种方法简单直观，
  + 他是在被注入的类中声明一个setter方法，
  + 通过setter方法的参数注入对应的值
```xml
<bean id="user2Spring" class="com.cleamy.User2">
        
        <property name="id" value="1"></property>
        <property name="password" value="123456"></property>
        <property name="userName" value="root"></property>
    </bean>
```
+  \<property> 元素 使用setter方法 进行注入
  + name ：是 setter 方法去掉 set关键字后 得到名称
  + 例如：setProbably 的 name 是probably

#### 3. 了解Spring ioc 容器的原理
        * Bean 标签机器属性的使用
        * 熟悉Bean 的实例化
        * Bean 的作用域
        * bean的装配方式
        * bean 的生命周期
##### BeanFactory 与 applicationContext 的关系
+   * BeanFactory 是 spring 的早期接口，称为Bean工厂
+   * Application 是 后期更加高级接口，称为容器
+   * applicationContext 在BeanFactory的基础上对功能进行拓展，
  + 例如：监听功能、国际化功能等，BeanFactory的API 更偏向底层，ApplicationContext是对底层代码的封装
+   * Bean创建主要逻辑和功能都被分装在BeanFactory工厂中，ApplicationContext 不仅继承了BeanFactory，而且
  * ApplicationContext内部还维护着BeanFactory的引用，所以两者之间既有继承关系，又有融合关系
+   * Bean的初始化实际不同，元素BeanFactory 是在首次条用getBean之后才进行Bean创建，
  * ApplicationContext是在配置文件加载，容器一创建九江Bean都实例化并初始化

1. 基于xml方式Bean的配置
2. 基于注解方式Bean的配置

## 基于xml方式Bean的配置
#### 1. SpringBean的配置详情
+ 1. Bean 的基础配置
  + 例如UserDaoImpl 有spring 容器负责管理
    + <bean id ="userDao" class ="com.cleamy.dao.impl.UserDaoImpl"></bean>
  + 此时存储到spring容器（singleObjects单例池）中的Bean的beanName是UserDao，
  + 值是UserDaoImpl对象
  + 可以更具id获取Bean实例
    + applicationContext.getBean("UserBean");
  + 如果id值没有配置，泽spring会把当前Bean实例的全限定名作为beanName
    + applicationContext.getBean("com.cleamy.dao.impl.UserDaoImpl")
+ 2. Bean的别名设置
  + 可以为当前Bean指定多个别名，更具别名可以获得Bean实例
    + <bean id="userDao" name="aaa,bbb" class="com.cleamy.dao.impl.UserDaoImpl")

+ 3. spring 的 配置详解
   + 默认情况下，单纯的spring 环境Bean 的作用范围有两个;Singleton 和 Prototype
   + singleton ：单例，默认值
     + spring 容器创建的时候，就会进行Bean的实例化，并存储到容器内波，的单例池中
     + 每次getBean都是从单例池中获取相同的Bean的实例
   + prototype：原型，
     + spring容器初始化时不会创建bean 实例对象，
     + 而是当调用getBean的时候，才会实例化Bean对象
     + 每一次调用GetBean都会创建一个新的Bean实例
```xml
<bean id="userType" class="com.demo.service.impl.userServiceImpl" scop="prototype/singleton"></bean>

```
+ 4. spring bean 的 延迟加载
  + 当lazy-init 设置为true时 为 延迟加载，
  + 也就是单spring 容器创建的时候，不会立即创建Bean实例，等待用到时在创建Bean 实例并存储到单例池中，
  + 后续使用该bean时直接冲单例池获取，本质上该Bean还是单例的
```xml
<bean id="userDao" class="com.demo.dao.impl.UserDaoImpl" lazy-init="true"/>
```
+ 5. Bean 的初始化和销毁方法配置
  + Bean 在实例化后，可以执行指定的初始化方法完成一些初始化
  + Bean 在销毁之前，也可以执行指定的销毁方法完成一些操作，初始化方法名称和销毁方法名称通过
```xml
<bean id="userDao" class="com.demo.impl.userDaoImpl" init-method="init"
destroy-method="destroy"/>
```
- 拓展
  -除以上之外，我们还可以通过事项InitializingBean 接口，完成一些Bean的初始化操作
```java
public class UserDaoImpl implements UserDao,InitializingBean{
    public UserDaoIMpl (){}
    public void init(){}
    public void destroy(){}
    public void afterPrototype(){}
}
```
+ 6. bean 的实例化配置
  + spring的实例化方式主要如下两种：
    + 构造方式实例化：底层通过构造方法对bean进行实例化
    + 工厂方式实例化：底层通过调用自定义的工厂方法对bean进行实例化
  + 工厂方式实例化Bean：三种
  + 静态工厂方法实例化bean、
```xml
 <!-- 通过静态方法实现类的实例化
            返回存储的实例化类型是 factory-method 方法返回的 对象类型
    -->
    <bean id="userDao1" class="com.cleamy.factory.MyBeanFactory1"
          factory-method="userDao"></bean>
```
  + 实例工厂方法实例化Bean
```xml
<!--
        通过动态方法实现类的实例化
    -->
    <!-- 先实例化工厂对象 -->
    <bean id="myFactory2" class="com.cleamy.factory.MyBeanFactory2"></bean>
    <!-- 然后通过工厂实例化的对象调用工厂内的 实例化方法 ,同样 返回的实例化类型是，工厂内该方法返回的实例化对象-->
    <bean id="userDao2" factory-bean="myFactory2" factory-method="userDao"></bean>

```
  + 实现factoryBean规范延迟实例化Bean
  + 注意：只要是构造bean的方法，其参数都可以用 constructor-arg 元素进行传递值

+ 7. Bean 的依赖注入配置
  + bean 依赖注入有两种方式：
    + 通过Bean的set方式注入
      + - <property name="userDao" ref="userDao"/>
      + - <property name ="userDo" value= "haha"/>
    + 构造bean的方法进行注入
      + - <constructor-arg name="name" ref="userDao"/>
      + - <constructor-arg name="name" value="haha"/>
  + 依赖注入的数据类型如下三种：
    + 普通数据类型,例如：String、int、boolean、，通过value进行属性指定
    + 引用数据类型，例如： UserDaoImpl、DateSource ,等通过ref(references(关联))进行属性指定
    + 集合数据类型，列如：List、map 、properties等
  + 拓展：自动装配方式
    + 如果被注入的属性类型是Bean引用的话，
    + 那么可以在<bean> 标签中使用autowire 属性
    + 配置自动注入方式
    + 属性值有两个
      + byName：通过属性名自动装配，即去匹配setXxx与id=“XX”（name=“XX”)
      + byType：通过Bean的类型从容器中匹配，匹配出多个相同Bean类型时，报错
        + <bean id="userService" class="com.cleamy.service.impl.UserServiceImpl" autowire="byType"/>
  + 集合数据类型注入
```xml
  <!-- 注入集合
        使用property的子标签 list标签进行注入集合中的每一项
            普通数据类型使用 value
            引用数据类型使用 ref
    -->
<bean id="userServiceList"  class="com.cleamy.service.impl.UserServiceImpl">
  <property name="stringList" >
    <list>
      <value>aaa</value>
      <value>bbb</value>
    </list>
  </property>
  <property name="userDaoList">
    <list>
      <!-- 可以直接通过bean 实例化列表中对应的对象，也可以关联外部的对象 -->
      <bean class="com.cleamy.service.impl.UserDaoImpl"></bean>
      <bean class="com.cleamy.service.impl.UserDaoImpl"></bean>
      <ref bean="userDao2"></ref>
    </list>
  </property>
  <property name="stringSet">
    <set>
      <value>aaa</value>
      <value>bbb</value>
    </set>
  </property>
  <property name="userDaoSet">
    <set>
      <bean class="com.cleamy.service.impl.UserDaoImpl"></bean>
      <bean class="com.cleamy.service.impl.UserDaoImpl"></bean>
      <ref bean="userDao2"></ref>
    </set>
  </property>
  <property name="map">
    <map>
      <!-- key \ key-ref \ value \ value-ref -->
      <entry key="a1" value-ref="userDao2"></entry>
      <entry key="b1" value-ref="userDao2"></entry>
    </map>
  </property>
  <property name="properties">
    <props>
      <prop key="p1">123</prop>
      <prop key="o1">mysql</prop>
    </props>
  </property>
</bean>
<bean id="userDao2"  class="com.cleamy.service.impl.UserServiceImpl"/>

```
  + import 标签
    + 用于导入其他配置文件，项目变大后，就会导致配置文件内容过多
    + 可以将配置文件根据业务模块进行拆分，最终通过<import> 标签导入一个著配置配置文件中
```xml
<import resource = "classpath:UserModuleApplicationContext.xml"/>
<import resource = "classpath:ProductModuleApplicationContext.xml"/>
```
  + alias 标签
    + 别名
    + <alias name= "BeanIdName" alisa= "AlisaName"/>


#### 配置非自定义Bean
  + 开发中的某些功能类不是自定义的，而是通过jar包中的，那么这些Bean要想然Spring进行管理啊
  + 需要对其进行配置
  + 配置非自定义的Bean需要考虑两个方面
    + 被配置的Bean的实例化方式时什么，无参构造、有参构造、静态工厂方法，还是实例工厂方式
    + bean中是否需要注入必要属性
  + 导入jar第三方
```xml
<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
  <version>5.1.46</version>
</dependency>
<!-- 配置 druid 数据源-->
<dependency>
<groupId>com.alibaba</groupId>
<artifactId>druid</artifactId>
<version>1.1.23</version>
</dependency>
        <!-- 配置非自定义类的bean-->
<bean id="dataSource" class ="com.alibaba.druid.pool.DruidDataSource">
<property name="driverClassName" value="com.mysql.cj.jdbc.Driver"></property>
<property name="username" value = "root" />
<property name="password" value = "123456" />
<property name="url" value = "jdbc:mysql://localhost:3306/mybatis?useSSL=
            &amp;&amp;serverTimezone=UTC&amp;characterEncoding=utf-8" />
</bean>
```
   + 配置connection 非自定义bean
```xml
<!--   通过静态工厂实例的方式进行 实例化对象 -->
<bean id="classF" class="java.lang.Class" factory-method="forName" >
        <constructor-arg name = "className" value="com.mysql.cj.jdbc.Driver"></constructor-arg>
    </bean>
    <bean id="ConnectionSql" class="java.sql.DriverManager" factory-method="getConnection" scope="prototype">
        <constructor-arg name="url" value="jdbc:mysql://localhost:3306/mybatis?useSSL=False
                                            &amp;&amp;serverTimezone=UTC&amp;characterEncoding=utf-8"></constructor-arg>
        <constructor-arg name="user" value="root"></constructor-arg>
        <constructor-arg name="password" value="123456"></constructor-arg>
    </bean>
```
   + 配置日期对象      
```xml
  <!-- 配置日期对象-->
    <bean id="format" class="java.text.SimpleDateFormat">
        <constructor-arg name="pattern" value="yyyy-MM-dd HH:mm:ss"></constructor-arg>
    </bean>
    <bean id="date" factory-bean="format" factory-method="parse">

        <constructor-arg name="source" value="2023-8-24 12:00:00"/>
    </bean>
```
   + 配置mybatis 的 sqlSessionFactory 交由spring管理
```xml
 <!-- 配置mybatis连接-->
    <bean id="mybatisStream" class="org.apache.ibatis.io.Resources" factory-method="getResourceAsStream">
        <constructor-arg name="resource" value="mybatis-config.xml"></constructor-arg>
    </bean>
    <bean id="sessionFactoryBuild" class="org.apache.ibatis.session.SqlSessionFactoryBuilder"></bean>
    <bean id="builder" factory-bean="sessionFactoryBuild" factory-method="build">
        <constructor-arg name="inputStream" ref="mybatisStream"></constructor-arg>
    </bean>
```

### Bean 实例化的基本流程
+ 
  + 加载xml文件，解析获取配置中的每个bean信息，封装成为一个BeanDefinition对象
  + 将BeanDefinition存储在一个名为BeanDefinitionMap的Map《String，BeanDefinition》集合中
  + ApplicationContext 底层遍历beandefinitionMap，创建Bean实例对象
  + 创建好的Bean实例对象，存储到一个名为singletonObject的map《String，Object》对象中
    + 执行当前applicationContext.getBean()时，从singletonObject（单例池）去匹配Bean实例返回

### spring的后置处理器(后期多回顾，理论底层知识，暂时不总结)

### spring的生命周期(后期多回顾，理论底层知识，暂时不总结，重点知识，面试考题)

+ spring Bean 的生命周期
  + spring bean的生命周期是从Bean实例话之后，即通过反射创建对象之后，
  + 到bean成为一个完整对象，最终存储到单例池中，这个过程被称为spring bean 的生命周期，
  + spring bean 的生命周期大体分为三种
    + bean的实例化阶段：spring框架会去除beanDefinition中的信息
      + 判断当前Bean的范围
      + 是否是singleton的，
      + 是否不是延迟加载的，
      + 是否是FactoryBean等
      + 最终将一个普通的singleton的bean通过反射进行实例化
    + bean的初始化阶段：bean拆功能键之后不仅仅是个”半成品“，还需要对bean实例的属性进行填充，
      + 执行一些aware接口方法 ，执行Post Processor方法，执行InitializingBean接口初始化方法，
      + 执行自定义inti方法等，该阶段是spring最具技术含量和复杂度的阶段，app增强功能，
      + 后面要学习的spring注解功能等、
      + spring的面试提，bean的循环引用问题都是在这个阶段体现
    + Bean的完成阶段：经过初始化阶段，bean成为一个完整的spring bean ，
      + 该存储到单例池singletonObject（这是Bean实例的map集合）中去，
      + 即完成了springBean的整个生命周期
    + 
### spring xml 方式整合第三方框架
  - mybatis提供了mybatis-spring.jsr 专门用于两大框架的整合
  - spring 整合mybatis的步骤如下：
    - 导入mybatis整合spring的相关做白哦
    - 编写mapper和mapper.xml
    - 配置sqlSessionFactoryBean 和MapperScannerConfigure
    - 编写测试代码
  + spring 整合mybatis原理
    + 整合包中提供了一个SqlSessionFactoryBean 和一个扫描Mapper的配置对象（MapperScannerConfigure)
    + SqlSessionFactoryBean 一旦被实例化，就开始扫描Mapper 并通过动态代理产生Mapper的实现类，存储到spring容器中，
    + 相关的有如下四个类
      + SqlSessionFactoryBean：需要进行配置，用于提供SqlSessionFactory
      + MapperScannerConfigurer：进行配置，用于烧苗指定mapper包中的mapper接口，并且注册BeanDefinition
      + MapperFactoryBean：Mapper的FactoryBean ，获得指定Mapper是条哟个getObject方法。获得实例
      + ClassPathMapperScanner：definition.setAutowireMode(2) 修改了自动自如状态，所以
        + MapperFactoryBean中的SqlSessionFactory会自动注入
  + 使用properties 文件
    + 通过spring的context 来进行配置properties 定义
      + 需要添加命名空间
        + 添加依赖
```xml
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xmlns:context="http://www.springframework.org/schema/context"
         xmlns:mvc="http://www.springframework.org/schema/mvc"
         xsi:schemaLocation="
       http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/mvc
       http://www.springframework.org/schema/mvc/spring-mvc.xsd">
```
   + 添加配置文件
     + <context:property-placeholder location="classpath:jdbc.properties"/>
   + 使用${} 条用context中的值
+ 自定义命名空间


### 基于注解的spring应用

####  Bean基于注解开发
+ 基本Bean 注解，主要使用注解的方式代替原有的xml<bean> 标签
+ 使用component 注解代替bean 标签
+ 





























